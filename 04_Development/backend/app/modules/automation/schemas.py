from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

# Existing schemas...
class ReminderBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    due_date: Optional[datetime] = None

class ReminderCreate(ReminderBase):
    source_capture_id: Optional[UUID] = None

class ReminderUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None

class ReminderResponse(ReminderBase):
    id: UUID
    user_id: UUID
    status: str
    source_capture_id: Optional[UUID] = None
    created_by_automation: bool
    confidence_score: Optional[float] = None
    ai_reasoning: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AutomationSuggestionResponse(BaseModel):
    id: UUID
    user_id: UUID
    source_capture_id: Optional[UUID]
    suggestion_type: str
    proposed_configuration: Dict[str, Any]
    reasoning: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# New schemas for Automation Center...

class WorkflowAction(BaseModel):
    action_type: str
    configuration: Dict[str, Any]

class WorkflowTrigger(BaseModel):
    trigger_type: str
    configuration: Dict[str, Any]

class WorkflowCondition(BaseModel):
    condition_type: str
    configuration: Dict[str, Any]

class AutomationWorkflowCreate(BaseModel):
    name: str
    description: Optional[str] = None
    triggers: List[WorkflowTrigger]
    actions: List[WorkflowAction]
    conditions: Optional[List[WorkflowCondition]] = []

class AutomationWorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class AutomationWorkflowResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime
    triggers: List[Dict[str, Any]]
    actions: List[Dict[str, Any]]
    conditions: List[Dict[str, Any]]

    class Config:
        from_attributes = True

class ExecutionLogResponse(BaseModel):
    message: str
    level: str
    created_at: datetime

    class Config:
        from_attributes = True

class AutomationExecutionResponse(BaseModel):
    id: UUID
    workflow_id: UUID
    workflow_name: Optional[str] = None
    status: str
    started_at: datetime
    completed_at: Optional[datetime]
    error_message: Optional[str]
    logs: Optional[List[ExecutionLogResponse]] = []

    class Config:
        from_attributes = True

class AutomationStatsResponse(BaseModel):
    running_automations: int
    scheduled: int
    paused: int
    completed_today: int
    completed_this_week: int
    failed_executions: int
    pending_approvals: int
    queued_jobs: int
    success_rate: float
