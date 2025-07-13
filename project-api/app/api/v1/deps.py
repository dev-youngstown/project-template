import os
from typing import Generator, Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlmodel import Session, select
from app.crud import v1 as crud
from app.models import v1 as models
from app.schemas import v1 as schemas
from app.core import security
from app.core.config import settings
from app.db.session import engine

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"{settings.API_STR}/v1/docs/login")


def get_db() -> Generator:
    with Session(engine) as db:
        try:
            yield db
        finally:
            db.close()


db_dep = Annotated[Session, Depends(get_db)]


def get_development_user(db: db_dep) -> models.User:
    return db.exec(select(models.User)).first()


def get_current_user(
    db: db_dep, token: Annotated[str, Depends(reusable_oauth2)]
) -> models.User:
    if os.getenv("DEV_MODE"):
        return get_development_user(db)
    else:
        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
            )
            token_data = schemas.TokenPayload(**payload)
        except (JWTError, ValidationError):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not validate credentials",
            )
        user = crud.user.get(db, id=token_data.sub)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user


current_user_dep = Annotated[models.User, Depends(get_current_user)]


def get_current_active_user(
    current_user: current_user_dep,
) -> models.User:
    if crud.user.is_disabled(current_user):
        raise HTTPException(status_code=400, detail="User has been disabled")
    return current_user


def get_current_active_superuser(
    current_user: current_user_dep,
) -> models.User:
    if not crud.user.is_admin(current_user):
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return current_user
