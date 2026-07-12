from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from ...core.database import get_db
from ...core.security import get_current_user
from ..users.models import User
from .schemas import (
    UserPersonaUpdate, UserGoalCreate, UserGoalUpdate, 
    UserPreferencesUpdate, PersonaProfileOut
)
from .models import UserPersona, UserGoal, UserPreferences, UserBehavior

router = APIRouter()

@router.get("/profile", response_model=PersonaProfileOut)
def get_full_persona_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    persona = db.query(UserPersona).filter(UserPersona.user_id == current_user.id).first()
    prefs = db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()
    behavior = db.query(UserBehavior).filter(UserBehavior.user_id == current_user.id).first()
    goals = db.query(UserGoal).filter(UserGoal.user_id == current_user.id).all()
    
    return {
        "persona": persona,
        "preferences": prefs,
        "behavior": behavior,
        "goals": goals
    }

@router.put("/persona")
def update_persona(
    data: UserPersonaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    persona = db.query(UserPersona).filter(UserPersona.user_id == current_user.id).first()
    if not persona:
        persona = UserPersona(user_id=current_user.id)
        db.add(persona)
        
    for key, value in data.dict(exclude_unset=True).items():
        setattr(persona, key, value)
        
    db.commit()
    db.refresh(persona)
    return {"success": True, "persona": persona}

@router.post("/goals")
def create_goal(
    data: UserGoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = UserGoal(user_id=current_user.id, **data.dict())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return {"success": True, "goal": goal}

@router.put("/goals/{goal_id}")
def update_goal(
    goal_id: UUID,
    data: UserGoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = db.query(UserGoal).filter(UserGoal.id == goal_id, UserGoal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    for key, value in data.dict(exclude_unset=True).items():
        setattr(goal, key, value)
        
    db.commit()
    db.refresh(goal)
    return {"success": True, "goal": goal}

@router.delete("/goals/{goal_id}")
def delete_goal(
    goal_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = db.query(UserGoal).filter(UserGoal.id == goal_id, UserGoal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    db.delete(goal)
    db.commit()
    return {"success": True}

@router.post("/reset-learning")
def reset_behavior_learning(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    behavior = db.query(UserBehavior).filter(UserBehavior.user_id == current_user.id).first()
    if behavior:
        behavior.data = {}
        db.commit()
    return {"success": True, "message": "AI learning reset"}
