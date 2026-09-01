import pandas as pd
import requests
from io import StringIO
from sqlalchemy.orm import Session
from ..models import Airport

OURAIRPORTS_URL = "https://davidmegginson.github.io/ourairports-data/airports.csv"


def fetch_airports_df() -> pd.DataFrame:
    resp = requests.get(OURAIRPORTS_URL, timeout=60)
    resp.raise_for_status()
    df = pd.read_csv(StringIO(resp.text), low_memory=False)
    df = df[df["iata_code"].notna() & (df["iata_code"].str.len() == 3)]
    df = df[["iata_code", "gps_code", "name", "municipality", "iso_country",
             "latitude_deg", "longitude_deg"]]
    df.columns = ["iata", "icao", "name", "city", "country", "lat", "lon"]
    df = df.drop_duplicates(subset=["iata"])
    return df


def sync_airports(db: Session) -> int:
    df = fetch_airports_df()
    count = 0
    for _, row in df.iterrows():
        existing = db.get(Airport, row["iata"])
        if existing:
            continue
        db.add(Airport(
            iata=row["iata"],
            icao=row["icao"] if pd.notna(row["icao"]) else None,
            name=row["name"],
            city=row["city"] if pd.notna(row["city"]) else None,
            country=row["country"],
            lat=float(row["lat"]),
            lon=float(row["lon"]),
        ))
        count += 1
    db.commit()
    return count
