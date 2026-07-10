from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime
import uuid
from ..captures.schemas import CaptureResponse

class TimelineResponse(BaseModel):
    success: bool
    message: str
    data: List[CaptureResponse]
    meta: dict
