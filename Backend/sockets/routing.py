from .consumers import BoardConsumer, ChatConsumer
from django.urls import path

ws_url_pattern = [
    path("ws/board/<int:session_id>", BoardConsumer.as_asgi(), name="board_consumer"),
    path("ws/chat/<int:team_id>", ChatConsumer.as_asgi(), name="board_consumer"),
]
