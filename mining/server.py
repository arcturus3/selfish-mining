from flask import Flask
from blockchain import Blockchain

from threading import Thread
from miner import Miner

blockchain = Blockchain()
# Use equal hash power
miner = Miner(blockchain, [0.5], [0.5])
app = Flask(__name__)

@app.route('/start')
def start():
    if "miner" not in app.config:
        thread = Thread(target=miner.continuous_mining)
        app.config["miner"] = thread
        thread.daemon = True  # Set as a daemon so it will be killed once the main thread is dead.
        thread.start()
        return "Started!"
    else:
        return "Already Running!"

@app.route('/')
def root():
    return "Miner Backend"
    
@app.route('/stop')
def stop():
    if "miner" in app.config:
        miner.stop()
        del app.config["miner"]
        return "Stopped!"
    else:
        return "Never started or Already Stopped!"

@app.route('/blockchain')
def get_blockchain():
    return str(blockchain)

@app.route('/longest-chain')
def get_longest_chain():
    return str(blockchain.get_longest_chain())

@app.route('/chain-quality')
def get_quality():
    return blockchain.get_chain_quality()

if __name__ == '__main__':
    app.run(debug=True, port=8765)