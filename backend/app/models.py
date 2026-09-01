from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base


class Snapshot(Base):
    __tablename__ = "snapshots"
    id = Column(Integer, primary_key=True)
    source = Column(String, nullable=False)
    scraped_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    route_count = Column(Integer, default=0)

    routes = relationship("Route", back_populates="snapshot", cascade="all, delete-orphan")


class Route(Base):
    __tablename__ = "routes"
    id = Column(Integer, primary_key=True)
    snapshot_id = Column(Integer, ForeignKey("snapshots.id"), nullable=False)
    route_key = Column(String, index=True)  # airline|origin|destination
    airline = Column(String)
    origin = Column(String)
    destination = Column(String)
    frequency_per_week = Column(Float, nullable=True)
    aircraft = Column(String, nullable=True)
    effective_date = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    source = Column(String)

    snapshot = relationship("Snapshot", back_populates="routes")


class ChangeEvent(Base):
    __tablename__ = "change_events"
    id = Column(Integer, primary_key=True)
    from_snapshot_id = Column(Integer, ForeignKey("snapshots.id"))
    to_snapshot_id = Column(Integer, ForeignKey("snapshots.id"))
    change_type = Column(String)
    route_key = Column(String)
    airline = Column(String)
    origin = Column(String)
    destination = Column(String)
    field_changed = Column(String, nullable=True)
    old_value = Column(String, nullable=True)
    new_value = Column(String, nullable=True)
    detected_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Airport(Base):
    __tablename__ = "airports"
    iata = Column(String, primary_key=True)
    icao = Column(String, index=True, nullable=True)
    name = Column(String)
    city = Column(String)
    country = Column(String)
    lat = Column(Float)
    lon = Column(Float)
