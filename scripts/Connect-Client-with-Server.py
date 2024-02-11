import asyncio
import websockets
import json

async def send_data():
    uri = "ws://localhost:8765"
    
    async with websockets.connect(uri) as websocket:
        # Sample object data
        data = {'key': 'value', 'number': 123, 'list': [1, 2, 3]}
        
        # Convert the object to JSON
        json_data = json.dumps(data)
        
        # Send the JSON data to the server
        await websocket.send(json_data)
asyncio.get_event_loop().run_until_complete(send_data())
