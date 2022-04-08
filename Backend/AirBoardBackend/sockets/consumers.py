from channels.consumer import AsyncConsumer
from channels.exceptions import StopConsumer

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



class ChatConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        self.group_name = str(self.scope['url_route']['kwargs']['team_id'])
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
            'type': 'chat.message',
            'message': event['text'],
            'sender_channel_name': self.channel_name
        })
    

    async def chat_message(self, event):
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
