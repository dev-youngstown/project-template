from typing import Any, List, Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Response, Path
from sqlalchemy.orm import Session

from app.crud import v1 as crud
from app.models import v1 as models
from app.schemas import v1 as schemas
from app.api.v1 import deps

router = APIRouter()

# give type alias to current_user type
current_user_dep = Annotated[models.User, Depends(deps.get_current_active_superuser)]

# give type alias to db type
db_dep = Annotated[Session, Depends(deps.get_db)]


# get all users
@router.get("/users", response_model=List[schemas.User])
def read_users(
        current_user: current_user_dep,
        db: db_dep,
        skip: int = 0,
        limit: int = 100,

) -> Any:
    users = crud.user.get_multi(db, skip=skip, limit=limit)
    return users


# update user by id
@router.put("/users/{id}", response_model=schemas.User)
def update_user(
        current_user: current_user_dep,
        id: Annotated[int, Path(description="The ID of the user to update", ge=1)],  # ge = greater than or equal to
        user_in: schemas.UserUpdateAdmin,
        db: db_dep,
) -> Any:
    user = crud.user.get(db, id=id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    user = crud.user.update(db, db_obj=user, obj_in=user_in)
    return user


# delete user by id
@router.delete("/users/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
        current_user: current_user_dep,
        id: Annotated[int, Path(description="The ID of the user to delete", ge=1)],
        db: db_dep,
):
    user = crud.user.get(db, id=id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )

    crud.user.remove(db, id=id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# get users by id
@router.get("/users/{id}", response_model=schemas.User)
def read_user_by_id(
        current_user: current_user_dep,
        id: Annotated[int, Path(description="The ID of the user to get", ge=1)],
        db: db_dep,
) -> Any:
    user = crud.user.get(db, id=id)
    if user == current_user:
        return user
    if not crud.user.is_admin(current_user):
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return user
