from pydantic import BaseModel


class JobRoleCreate(BaseModel):
    title: str
    description: str | None = None


class JobRoleResponse(BaseModel):
    id: int
    title: str
    description: str | None = None

    class Config:
        from_attributes = True