from typing import Any, Dict, Optional, Union

from sqlmodel import Session, select
from app.core.security import get_password_hash, verify_password
from app.crud.v1.base import CRUDBase
from app.models.v1.user import User
from app.schemas.v1.user import UserCreate, UserUpdate
from sqlalchemy import func


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.exec(
            select(User).where(func.lower(User.email) == email.lower())
        ).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            **obj_in.model_dump(exclude={"password"}),
            hashed_password=get_password_hash(obj_in.password),
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def create_admin(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            **obj_in.model_dump(exclude={"password", "is_admin"}),
            hashed_password=get_password_hash(obj_in.password),
            is_admin=True,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)

        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_disabled(self, user: User) -> bool:
        return user.is_disabled

    def is_admin(self, user: User) -> bool:
        return user.is_admin


user = CRUDUser(User)
