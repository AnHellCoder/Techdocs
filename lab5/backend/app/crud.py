from sqlalchemy.orm import Session
from sqlalchemy import select

from . import models, schemas


def create_page_with_kpi(db: Session, page: schemas.PageCreate) -> models.Page:
    db_page = models.Page(name=page.name)
    db.add(db_page)
    db.flush()  # получить id до commit

    db_kpi = models.KPI(page_id=db_page.id, visits=0, time_spent=0.0)
    db.add(db_kpi)

    db.commit()
    db.refresh(db_page)
    return db_page


def get_page(db: Session, page_id: int) -> models.Page | None:
    stmt = select(models.Page).where(models.Page.id == page_id)
    return db.execute(stmt).scalar_one_or_none()


def add_time_to_page(db: Session, page_id: int, time_spent: float) -> models.KPI | None:
    stmt = select(models.KPI).where(models.KPI.page_id == page_id)
    kpi = db.execute(stmt).scalar_one_or_none()
    if kpi is None:
        return None

    kpi.time_spent += time_spent
    db.commit()
    db.refresh(kpi)
    return kpi

def add_visits(db: Session, page_id: int) -> models.KPI | None:
    stmt = select(models.KPI).where(models.KPI.page_id == page_id)
    kpi = db.execute(stmt).scalar_one_or_none()
    if kpi is None:
        return None

    kpi.visits += 1
    db.commit()
    db.refresh(kpi)
    return kpi


def get_all_kpi(db: Session):
    stmt = select(models.KPI)
    return db.execute(stmt).scalars().all()