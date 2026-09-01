from sqlalchemy.orm import Session
from .models import Route, ChangeEvent
from datetime import datetime, timezone

COMPARABLE_FIELDS = ["frequency_per_week", "aircraft", "effective_date"]


def _routes_dict(db: Session, snapshot_id: int):
    routes = db.query(Route).filter(Route.snapshot_id == snapshot_id).all()
    return {r.route_key: r for r in routes}


def detect_changes(db: Session, from_id: int, to_id: int, persist: bool = True):
    old_routes = _routes_dict(db, from_id)
    new_routes = _routes_dict(db, to_id)

    old_keys, new_keys = set(old_routes), set(new_routes)
    events = []

    for k in new_keys - old_keys:
        events.append(_event(from_id, to_id, "added", new_routes[k]))

    for k in old_keys - new_keys:
        events.append(_event(from_id, to_id, "removed", old_routes[k]))

    for k in old_keys & new_keys:
        old_r, new_r = old_routes[k], new_routes[k]
        for field in COMPARABLE_FIELDS:
            old_val, new_val = getattr(old_r, field), getattr(new_r, field)
            if old_val != new_val and (old_val is not None or new_val is not None):
                ctype = "frequency_change" if field == "frequency_per_week" else "modified"
                events.append(_event(from_id, to_id, ctype, new_r, field, old_val, new_val))

    if persist:
        db.add_all(events)
        db.commit()

    return [
        {
            "change_type": e.change_type, "airline": e.airline,
            "origin": e.origin, "destination": e.destination,
            "field_changed": e.field_changed,
            "old_value": e.old_value, "new_value": e.new_value,
        } for e in events
    ]


def _event(from_id, to_id, ctype, r, field=None, old=None, new=None):
    return ChangeEvent(
        from_snapshot_id=from_id, to_snapshot_id=to_id, change_type=ctype,
        route_key=r.route_key, airline=r.airline, origin=r.origin, destination=r.destination,
        field_changed=field,
        old_value=str(old) if old is not None else None,
        new_value=str(new) if new is not None else None,
        detected_at=datetime.now(timezone.utc),
    )
