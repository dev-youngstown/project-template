from sqlmodel import SQLModel, Field
from app.models.mixin import TimestampMixin


class User(SQLModel, TimestampMixin, table=True):
    __tablename__ = "users"

    # primaries
    id: int = Field(primary_key=True, index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str

    first_name: str
    last_name: str

    # account checks
    is_admin: bool = Field(default=False)
    is_disabled: bool = Field(default=False)
