from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import Snapshot, Route, Airport
from .clients.ourairports_client import sync_airports
from .clients.openflights_client import fetch_routes_df
from .clients.opensky_client import compute_frequencies

AIRLINE_CODES = ["6E", "AI", "SG"]  # IndiGo, Air India, SpiceJet


def run_ingest():
    db: Session = SessionLocal()
    try:
        airports_synced = sync_airports(db)
        print(f"Synced {airports_synced} new airports from OurAirports")

        routes_df = fetch_routes_df(AIRLINE_CODES)

        iata_to_icao = {a.iata: a.icao for a in db.query(Airport).all() if a.icao}
        icao_pairs = [
            (row.airline, iata_to_icao.get(row.origin), iata_to_icao.get(row.destination))
            for row in routes_df.itertuples()
            if iata_to_icao.get(row.origin) and iata_to_icao.get(row.destination)
        ]
        freq_map = compute_frequencies(icao_pairs) if icao_pairs else {}

        snapshot = Snapshot(source="openflights+opensky", route_count=len(routes_df))
        db.add(snapshot)
        db.flush()

        for row in routes_df.itertuples():
            freq_info = freq_map.get(row.route_key, {})
            db.add(Route(
                snapshot_id=snapshot.id,
                route_key=row.route_key,
                airline=row.airline,
                origin=row.origin,
                destination=row.destination,
                frequency_per_week=freq_info.get("frequency_per_week"),
                aircraft=row.aircraft if row.aircraft != "nan" else None,
                notes="codeshare" if row.codeshare == "Y" else None,
                source="openflights+opensky",
            ))
        db.commit()
        print(f"Saved snapshot {snapshot.id} with {len(routes_df)} routes")
        return {"snapshot_id": snapshot.id, "route_count": len(routes_df)}
    finally:
        db.close()


if __name__ == "__main__":
    run_ingest()
