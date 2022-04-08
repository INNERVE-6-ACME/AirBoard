from .consumers import BoardConsumer
from django.urls import path

ws_url_pattern = [
    path("ws/board/<int:session_id>", BoardConsumer.as_asgi(), name="board_consumer"),
]
