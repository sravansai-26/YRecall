import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer, JSON, Float, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from ...core.database import Base

class AutomationWorkflow(Base):
    __tablename__ = "automation_workflows"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    triggers = relationship("AutomationTrigger", back_populates="workflow", cascade="all, delete-orphan")
    actions = relationship("AutomationAction", back_populates="workflow", cascade="all, delete-orphan")
    conditions = relationship("WorkflowCondition", back_populates="workflow", cascade="all, delete-orphan")
    executions = relationship("AutomationExecution", back_populates="workflow", cascade="all, delete-orphan")

class AutomationTrigger(Base):
    __tablename__ = "automation_triggers"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("automation_workflows.id"), nullable=False)
    trigger_type = Column(String, nullable=False) # e.g., "capture_created", "schedule", "intent_detected"
    configuration = Column(JSONB, default=dict) # e.g., {"schedule": "0 9 * * *"}
    created_at = Column(DateTime, default=datetime.utcnow)
    
    workflow = relationship("AutomationWorkflow", back_populates="triggers")

class WorkflowCondition(Base):
    __tablename__ = "automation_conditions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("automation_workflows.id"), nullable=False)
    condition_type = Column(String, nullable=False) # e.g., "contains_text", "is_high_priority"
    configuration = Column(JSONB, default=dict)
    
    workflow = relationship("AutomationWorkflow", back_populates="conditions")

class AutomationAction(Base):
    __tablename__ = "automation_actions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("automation_workflows.id"), nullable=False)
    action_type = Column(String, nullable=False) # e.g., "create_reminder", "send_notification", "http_webhook"
    configuration = Column(JSONB, default=dict) # e.g., {"priority": "high", "title": "Buy milk"}
    order = Column(Integer, default=0)
    
    workflow = relationship("AutomationWorkflow", back_populates="actions")

class AutomationExecution(Base):
    __tablename__ = "automation_executions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("automation_workflows.id"), nullable=False)
    status = Column(String, nullable=False, default="running") # "success", "failed", "running"
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    
    workflow = relationship("AutomationWorkflow", back_populates="executions")
    logs = relationship("WorkflowLog", back_populates="execution", cascade="all, delete-orphan")

class WorkflowLog(Base):
    __tablename__ = "automation_workflow_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    execution_id = Column(UUID(as_uuid=True), ForeignKey("automation_executions.id"), nullable=False)
    message = Column(Text, nullable=False)
    level = Column(String, default="info") # info, error, warning
    created_at = Column(DateTime, default=datetime.utcnow)
    
    execution = relationship("AutomationExecution", back_populates="logs")

class Reminder(Base):
    __tablename__ = "automation_reminders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String, default="medium") # low, medium, high
    status = Column(String, default="pending") # pending, completed, archived, deleted
    due_date = Column(DateTime, nullable=True)
    source_capture_id = Column(UUID(as_uuid=True), ForeignKey("captures.id"), nullable=True)
    created_by_automation = Column(Boolean, default=False)
    confidence_score = Column(Float, nullable=True)
    ai_reasoning = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ScheduledTask(Base):
    __tablename__ = "automation_scheduled_tasks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    task_type = Column(String, nullable=False) # e.g., "send_reminder", "run_workflow"
    payload = Column(JSONB, default=dict)
    run_at = Column(DateTime, nullable=False)
    status = Column(String, default="pending") # pending, executed, cancelled, failed
    created_at = Column(DateTime, default=datetime.utcnow)

class AutomationSuggestion(Base):
    __tablename__ = "automation_suggestions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    source_capture_id = Column(UUID(as_uuid=True), ForeignKey("captures.id"), nullable=True)
    suggestion_type = Column(String, nullable=False) # e.g., "create_workflow", "create_reminder"
    proposed_configuration = Column(JSONB, nullable=False)
    reasoning = Column(Text, nullable=True)
    status = Column(String, default="pending") # pending, accepted, dismissed
    created_at = Column(DateTime, default=datetime.utcnow)
