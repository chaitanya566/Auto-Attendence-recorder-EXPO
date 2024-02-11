import asyncio
import websockets
import json

async def handle_client(websocket, path):
    try:
        # Receive JSON data from the client
        json_data = await websocket.recv()

        # Parse JSON data back to object
        data = json.loads(json_data)

        # Print the received data
        print("Received data from client {}: {}".format(websocket.remote_address, data))

        # You can process the data received from the client here

    finally:
        # Close the connection
        await websocket.close()

start_server = websockets.serve(handle_client, 'localhost', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
