from datetime import datetime
from typing import Optional
from sqlmodel import Field
from sqlalchemy import func
from sqlalchemy.types import TIMESTAMP


class TimestampMixin:
    created_at: Optional[datetime] = Field(
        default=None,
        sa_type=TIMESTAMP(timezone=True),
        sa_column_kwargs={"server_default": func.CURRENT_TIMESTAMP()},
    )
    updated_at: Optional[datetime] = Field(
        default=None,
        sa_type=TIMESTAMP(timezone=True),
        sa_column_kwargs={
            "server_default": func.CURRENT_TIMESTAMP(),
            "onupdate": func.CURRENT_TIMESTAMP(),
        },
    )
