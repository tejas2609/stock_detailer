from collections import defaultdict
from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):
        self.connections = defaultdict(list)

    async def connect(self, websocket: WebSocket):
        await websocket.accept()

    def subscribe(self, symbol: str, websocket: WebSocket):
        self.connections[symbol].append(websocket)

    def unsubscribe(self, symbol: str, websocket: WebSocket):
        if websocket in self.connections[symbol]:
            self.connections[symbol].remove(websocket)

    async def broadcast(self, symbol: str, data: dict):
        for connection in self.connections[symbol]:
            await connection.send_json(data)


manager = ConnectionManager()