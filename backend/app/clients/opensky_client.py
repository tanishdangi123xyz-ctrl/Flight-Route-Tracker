import time
import requests
from collections import defaultdict

OPENSKY_BASE = "https://opensky-network.org/api"


def _get_flights_for_airport(icao: str, begin: int, end: int, direction: str):
    endpoint = "departure" if direction == "departure" else "arrival"
    url = f"{OPENSKY_BASE}/flights/{endpoint}"
    resp = requests.get(url, params={"airport": icao, "begin": begin, "end": end}, timeout=30)
    if resp.status_code == 404:
        return []
    resp.raise_for_status()
    return resp.json()


def compute_frequencies(icao_pairs: list[tuple[str, str, str]], lookback_days: int = 7):
    """
    icao_pairs: list of (airline_code, origin_icao, dest_icao) to check.
    Returns dict route_key -> {frequency_per_week, aircraft}
    OpenSky callsigns start with the ICAO airline code, we map airline_code
    loosely by checking if callsign starts with it.
    """
    end = int(time.time())
    begin = end - lookback_days * 86400
    result = {}
    origin_cache = {}

    for airline, origin, dest in icao_pairs:
        if origin not in origin_cache:
            try:
                origin_cache[origin] = _get_flights_for_airport(origin, begin, end, "departure")
            except requests.RequestException:
                origin_cache[origin] = []
            time.sleep(1)  # be polite to the anonymous rate limit

        flights = origin_cache[origin]
        matches = [
            f for f in flights
            if f.get("estArrivalAirport") == dest
            and f.get("callsign", "").strip().startswith(airline)
        ]
        freq_per_week = round(len(matches) / lookback_days * 7, 1)
        result[f"{airline}|{origin}|{dest}"] = {
            "frequency_per_week": freq_per_week,
            "sample_size": len(matches),
        }
    return result
