from flask import Flask
import asyncio
import functools
from blockchain import Blockchain
from miner import Miner

blockchain = Blockchain()
miner = Miner(blockchain)
app = Flask(__name__)

@app.route('/start')
def start():
    if "miner" not in app.config:
        app.config["miner"] = asyncio.create_task(miner.continuous_mining())
        return "Started!"
    else:
        return "Already Running!"

@app.route('/stop')
def stop():
    if "miner" in app.config:
        mining_task = app.config["miner"]
        mining_task.cancel()
        del app.config["miner"]
        return "Stopped!"
    else:
        return "Never started"

@app.route('/blockchain')
def stop():
    return str(blockchain)

if __name__ == '__main__':
    app.run(debug=True, port=6000)