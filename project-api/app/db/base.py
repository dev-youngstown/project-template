# Import all the models, so that Base has them before being
# imported by Alembic
from app.models.v1.user import User  # noqa
from sqlmodel import SQLModel

Base = SQLModel
