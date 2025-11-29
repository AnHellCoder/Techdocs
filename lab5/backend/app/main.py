from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas, crud
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# @app.post("/pages/", response_model=schemas.PageOut)
# def create_page(page: schemas.PageCreate, db: Session = Depends(get_db)):
#     return crud.create_page_with_kpi(db=db, page=page)

@app.post("/pages/", response_model=List[schemas.PageOut])
def create_pages(
    pages: List[schemas.PageCreate], db: Session = Depends(get_db)
):
    created_pages = []
    for page in pages:
        created = crud.create_page_with_kpi(db=db, page=page)
        created_pages.append(created)
    return created_pages


@app.get("/pages/{page_id}", response_model=schemas.PageOut)
def get_page(page_id: int, db: Session = Depends(get_db)):
    page = crud.get_page(db=db, page_id=page_id)
    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@app.post("/kpi/visit/{page_id}", response_model=schemas.KPIOut)
def update_visits(page_id: int, db: Session = Depends(get_db)):
    kpi = crud.add_visits(db=db, page_id=page_id)
    if kpi is None:
        raise HTTPException(status_code=404, detail="KPI not found")
    return kpi


@app.post("/kpi/time/", response_model=schemas.KPIOut)
def update_time(data: schemas.KPIData, db: Session = Depends(get_db)):
    kpi = crud.add_time_to_page(db=db, page_id=data.page_id, time_spent=data.time_spent)
    if kpi is None:
        raise HTTPException(status_code=404, detail="KPI not found")
    return kpi


@app.get("/kpi/", response_model=List[schemas.KPIOut])
def get_all_kpi(db: Session = Depends(get_db)):
    return crud.get_all_kpi(db)