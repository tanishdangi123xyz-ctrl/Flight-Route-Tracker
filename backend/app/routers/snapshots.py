from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..database import get_db
from ..models import Snapshot
from ..schemas import SnapshotOut

router = APIRouter(prefix="/api/snapshots", tags=["snapshots"])


@router.get("", response_model=list[SnapshotOut])
def list_snapshots(db: Session = Depends(get_db)):
    return db.query(Snapshot).order_by(desc(Snapshot.scraped_at)).all()
