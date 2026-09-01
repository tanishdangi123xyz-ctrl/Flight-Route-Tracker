from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SnapshotOut(BaseModel):
    id: int
    source: str
    scraped_at: datetime
    route_count: int
    class Config:
        from_attributes = True


class RouteOut(BaseModel):
    airline: str
    origin: str
    destination: str
    origin_lat: Optional[float] = None
    origin_lon: Optional[float] = None
    dest_lat: Optional[float] = None
    dest_lon: Optional[float] = None
    frequency_per_week: Optional[float] = None
    aircraft: Optional[str] = None
    effective_date: Optional[str] = None
    notes: Optional[str] = None
    source: str


class ChangeOut(BaseModel):
    change_type: str
    airline: str
    origin: str
    destination: str
    field_changed: Optional[str] = None
    old_value: Optional[str] = None
    new_value: Optional[str] = None
