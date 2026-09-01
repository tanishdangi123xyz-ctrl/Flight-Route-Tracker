from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..change_detector import detect_changes
from ..schemas import ChangeOut

router = APIRouter(prefix="/api/changes", tags=["changes"])


@router.get("", response_model=list[ChangeOut])
def get_changes(from_id: int, to_id: int, db: Session = Depends(get_db)):
    if not from_id or not to_id:
        raise HTTPException(400, "from_id and to_id are required")
    return detect_changes(db, from_id, to_id, persist=True)
