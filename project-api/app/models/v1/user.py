from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base


class User(Base):
    __tablename__ = "users"

    # primaries
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    hashed_password: Mapped[str]

    first_name: Mapped[str]
    last_name: Mapped[str]

    # account checks
    is_admin: Mapped[bool] = mapped_column(default=False)
    is_disabled: Mapped[bool] = mapped_column(default=False)
