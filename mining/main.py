import asyncio
from blockchain import Blockchain
from miner import Miner
import websockets
import socket

# Function to get the primary local IP address
def get_local_ip():
    try:
        # Create a socket to connect to an internet host.
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            # This is a dummy connection, no data is sent.
            s.connect(("8.8.8.8", 80))  # Google's DNS server
            # Get the socket's own address.
            return s.getsockname()[0]
    except Exception as e:
        print(f"Could not obtain IP: {e}")
        return "localhost"

local_ip = get_local_ip()
print(f"This server's local IP: {local_ip}")

async def echo(websocket, path, blockchain: Blockchain):
    async for message in websocket:
        print(f"Received a message from client: {message}")
        # Echo the message back to the client
        await websocket.send(blockchain)

async def main(miner, blockchain):
    task = asyncio.create_task(miner.continuous_mining())
    async with websockets.serve(lambda ws, path: echo(ws, path, blockchain), local_ip, 6000):
        await asyncio.Future()  # Run forever

blockchain = Blockchain()
miner = Miner(blockchain)
asyncio.run(main(miner, blockchain))