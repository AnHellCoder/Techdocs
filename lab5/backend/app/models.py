from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


class Page(Base):
    __tablename__ = "pages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    kpi = relationship("KPI", uselist=False, back_populates="page")


class KPI(Base):
    __tablename__ = "kpi"

    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("pages.id"), unique=True, nullable=False)
    visits = Column(Integer, default=0, nullable=False)
    time_spent = Column(Float, default=0.0, nullable=False)

    page = relationship("Page", back_populates="kpi")
