from typing import Any, Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.crud import v1 as crud
from app.models import v1 as models
from app.schemas import v1 as schemas
from app.api.v1 import deps

from fastapi.templating import Jinja2Templates


router = APIRouter()
templates = Jinja2Templates(directory="app/templates")
db_dep = Annotated[Session, Depends(deps.get_db)]
current_user_dep = Annotated[models.User, Depends(deps.get_current_active_user)]


# get current user
@router.get("", response_model=schemas.User)
def read_user_me(
    current_user: current_user_dep,
) -> Any:
    return current_user


# update current user
@router.put("", response_model=schemas.User)
def update_user_me(
    *,
    db: db_dep,
    user_in: schemas.UserUpdate,
    current_user: current_user_dep,
) -> Any:
    if user_in.email:
        user_in.email = user_in.email.lower()

    if user_in.email and crud.user.get_by_email(db, email=user_in.email):
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    user = crud.user.update(db, db_obj=current_user, obj_in=user_in)
    db.add(user)
    db.commit()

    return user


# delete user by id
@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    *,
    db: db_dep,
    current_user: current_user_dep,
):
    crud.user.remove(db, id=current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
