from pydantic import BaseModel


class PageCreate(BaseModel):
    name: str


class PageOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True  # вместо orm_mode в pydantic v2


class KPIData(BaseModel):
    page_id: int
    time_spent: float


class KPIOut(BaseModel):
    page_id: int
    visits: int
    time_spent: float

    class Config:
        from_attributes = True
