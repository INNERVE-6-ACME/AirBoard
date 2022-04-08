from tokenize import Token
from channels.consumer import AsyncConsumer, SyncConsumer
from channels.exceptions import StopConsumer
from asgiref.sync import async_to_sync
from api.models import Team, Chat
from rest_framework.authtoken.models import Token
import json

class BoardConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        self.group_name = str(self.scope['url_route']['kwargs']['session_id'])
        await self.channel_layer.group_add(
            self.group_name, 
            self.channel_name
        )
        await self.send({
            'type': 'websocket.accept'
        })
    

    async def websocket_receive(self, event):
        # data = json.loads(event['text']) # use if we need to store in db
        await self.channel_layer.group_send(self.group_name, {
            'type': 'board.coordinates',
            'message': event['text'],
            'sender_channel_name': self.channel_name
        })
    

    async def board_coordinates(self, event):
        if self.channel_name != event['sender_channel_name']:
            await self.send({
                "type": "websocket.send",
                'text': event['message']
            })


    async def websocket_disconnect(self, event):
        await (self.channel_layer.group_discard)(
            self.group_name, 
            self.channel_name
        )
        raise StopConsumer()



class ChatConsumer(SyncConsumer):
    def websocket_connect(self, event):
        self.group_name = str(self.scope['url_route']['kwargs']['team_id'])
        async_to_sync(self.channel_layer.group_add)(
            self.group_name, 
            self.channel_name
        )
        self.send({
            'type': 'websocket.accept'
        })
    

    def websocket_receive(self, event):
        data = json.loads(event['text']) # use if we need to store in db
        team = Team.objects.get(id = self.group_name)
        user = Token.objects.get(key = data['token']).user
        chat = Chat(message=data['message'], team=team, user=user)
        chat.save()
        data = json.loads(event['text'])
        data['user'] = user.username
        del data['token']
        async_to_sync(self.channel_layer.group_send)(self.group_name, {
            'type': 'chat.message',
            'message': json.dumps(data),
            'sender_channel_name': self.channel_name
        })


    def chat_message(self, event):
        if self.channel_name != event['sender_channel_name']:
            self.send({
                "type": "websocket.send",
                'text': event['message']
            })


    def websocket_disconnect(self, event):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name, 
            self.channel_name
        )
        raise StopConsumer()
