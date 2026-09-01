from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models import Route, Airport, Snapshot
from ..schemas import RouteOut

router = APIRouter(prefix="/api/routes", tags=["routes"])


@router.get("", response_model=list[RouteOut])
def list_routes(
    snapshot_id: Optional[int] = None,
    airline: Optional[str] = None,
    airport: Optional[str] = None,
    db: Session = Depends(get_db),
):
    if not snapshot_id:
        latest = db.query(Snapshot).order_by(Snapshot.scraped_at.desc()).first()
        snapshot_id = latest.id if latest else None

    q = db.query(Route).filter(Route.snapshot_id == snapshot_id)
    if airline:
        q = q.filter(Route.airline == airline)
    if airport:
        q = q.filter((Route.origin == airport) | (Route.destination == airport))

    routes = q.all()
    airports = {a.iata: a for a in db.query(Airport).all()}

    out = []
    for r in routes:
        o, d = airports.get(r.origin), airports.get(r.destination)
        out.append(RouteOut(
            airline=r.airline, origin=r.origin, destination=r.destination,
            origin_lat=o.lat if o else None, origin_lon=o.lon if o else None,
            dest_lat=d.lat if d else None, dest_lon=d.lon if d else None,
            frequency_per_week=r.frequency_per_week, aircraft=r.aircraft,
            effective_date=r.effective_date, notes=r.notes, source=r.source,
        ))
    return out
