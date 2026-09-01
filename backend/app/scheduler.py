from apscheduler.schedulers.background import BackgroundScheduler
from .run_ingest import run_ingest
import atexit

scheduler = BackgroundScheduler()


def start_scheduler(interval_hours: int = 24):
    scheduler.add_job(run_ingest, "interval", hours=interval_hours, id="ingest_job", replace_existing=True)
    scheduler.start()
    atexit.register(lambda: scheduler.shutdown())
    print(f"Scheduler started: ingest every {interval_hours}h")
