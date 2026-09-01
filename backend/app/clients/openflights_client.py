import pandas as pd
import requests
from io import StringIO

ROUTES_URL = "https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat"

COLUMNS = [
    "airline", "airline_id", "source_airport", "source_airport_id",
    "dest_airport", "dest_airport_id", "codeshare", "stops", "equipment"
]


def fetch_routes_df(airline_codes: list[str]) -> pd.DataFrame:
    resp = requests.get(ROUTES_URL, timeout=60)
    resp.raise_for_status()
    df = pd.read_csv(StringIO(resp.text), names=COLUMNS, na_values="\\N")
    df = df[df["airline"].isin(airline_codes)]
    df = df[df["source_airport"].notna() & df["dest_airport"].notna()]
    df["aircraft"] = df["equipment"].astype(str).str.split().str[0]
    df["route_key"] = df["airline"] + "|" + df["source_airport"] + "|" + df["dest_airport"]
    df = df.drop_duplicates(subset=["route_key"])
    return df.rename(columns={"source_airport": "origin", "dest_airport": "destination"})[
        ["airline", "origin", "destination", "aircraft", "codeshare", "route_key"]
    ]