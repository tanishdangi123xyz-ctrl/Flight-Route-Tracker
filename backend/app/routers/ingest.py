from fastapi import APIRouter
from ..run_ingest import run_ingest

router = APIRouter(prefix="/api/ingest", tags=["ingest"])


@router.post("")
def trigger_ingest():
    return run_ingest()
