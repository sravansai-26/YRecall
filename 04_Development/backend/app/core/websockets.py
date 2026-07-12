from fastapi import WebSocket
from typing import List, Dict
import json

class ConnectionManager:
    def __init__(self):
        # Maps workspace_id (str) to a list of active WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, workspace_id: str):
        await websocket.accept()
        if workspace_id not in self.active_connections:
            self.active_connections[workspace_id] = []
        self.active_connections[workspace_id].append(websocket)

    def disconnect(self, websocket: WebSocket, workspace_id: str):
        if workspace_id in self.active_connections:
            try:
                self.active_connections[workspace_id].remove(websocket)
                if not self.active_connections[workspace_id]:
                    del self.active_connections[workspace_id]
            except ValueError:
                pass

    async def broadcast_to_workspace(self, workspace_id: str, message: dict):
        if workspace_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[workspace_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    disconnected.append(connection)
            
            # Cleanup dead connections
            for d in disconnected:
                self.disconnect(d, workspace_id)

manager = ConnectionManager()
