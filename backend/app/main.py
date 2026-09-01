import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import snapshots, routes, changes, ingest
from .scheduler import start_scheduler

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Flight Route Change Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(snapshots.router)
app.include_router(routes.router)
app.include_router(changes.router)
app.include_router(ingest.router)


@app.on_event("startup")
def on_startup():
    if os.environ.get("ENABLE_SCHEDULER", "false").lower() == "true":
        start_scheduler(interval_hours=24)


@app.get("/health")
def health():
    return {"status": "ok"}
