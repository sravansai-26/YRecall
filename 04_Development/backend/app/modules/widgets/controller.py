from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.core.database import get_db
from app.modules.users.models import User
from app.modules.auth.dependencies import get_current_user
from .models import WidgetInstance, WidgetPreference
from .schemas import WidgetInstanceCreate, WidgetInstanceUpdate, WidgetInstanceResponse, WidgetPreferenceUpdate, WidgetPreferenceResponse

router = APIRouter(prefix="/widgets", tags=["Widgets"])

# --- Widget Instances ---

@router.get("/instances", response_model=List[WidgetInstanceResponse])
def get_widget_instances(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(WidgetInstance).filter(WidgetInstance.user_id == current_user.id).all()

@router.post("/instances", response_model=WidgetInstanceResponse, status_code=status.HTTP_201_CREATED)
def create_widget_instance(
    data: WidgetInstanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Upsert logic based on instance_id
    existing = db.query(WidgetInstance).filter(
        WidgetInstance.user_id == current_user.id,
        WidgetInstance.instance_id == data.instance_id
    ).first()

    if existing:
        existing.config = data.config
        existing.is_active = data.is_active
        db.commit()
        db.refresh(existing)
        return existing

    new_instance = WidgetInstance(
        user_id=current_user.id,
        **data.model_dump()
    )
    db.add(new_instance)
    db.commit()
    db.refresh(new_instance)
    return new_instance

@router.put("/instances/{instance_id}", response_model=WidgetInstanceResponse)
def update_widget_instance(
    instance_id: str,
    data: WidgetInstanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    instance = db.query(WidgetInstance).filter(
        WidgetInstance.user_id == current_user.id,
        WidgetInstance.instance_id == instance_id
    ).first()
    
    if not instance:
        raise HTTPException(status_code=404, detail="Widget instance not found")

    if data.config is not None:
        instance.config = data.config
    if data.is_active is not None:
        instance.is_active = data.is_active

    db.commit()
    db.refresh(instance)
    return instance

@router.delete("/instances/{instance_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_widget_instance(
    instance_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    instance = db.query(WidgetInstance).filter(
        WidgetInstance.user_id == current_user.id,
        WidgetInstance.instance_id == instance_id
    ).first()

    if not instance:
        raise HTTPException(status_code=404, detail="Widget instance not found")

    db.delete(instance)
    db.commit()
    return None

# --- Widget Preferences ---

@router.get("/preferences", response_model=WidgetPreferenceResponse)
def get_widget_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pref = db.query(WidgetPreference).filter(WidgetPreference.user_id == current_user.id).first()
    if not pref:
        pref = WidgetPreference(user_id=current_user.id)
        db.add(pref)
        db.commit()
        db.refresh(pref)
    return pref

@router.put("/preferences", response_model=WidgetPreferenceResponse)
def update_widget_preferences(
    data: WidgetPreferenceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pref = db.query(WidgetPreference).filter(WidgetPreference.user_id == current_user.id).first()
    if not pref:
        pref = WidgetPreference(user_id=current_user.id, global_config=data.global_config or {})
        db.add(pref)
    else:
        if data.global_config is not None:
            pref.global_config = data.global_config
            
    db.commit()
    db.refresh(pref)
    return pref
