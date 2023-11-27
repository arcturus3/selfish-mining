from flask import Flask
from flask import request
from blockchain import Blockchain

from threading import Thread
from miner import Miner

blockchain = Blockchain()
# Use equal hash power
miner = Miner(blockchain)
app = Flask(__name__)

@app.route('/start', methods=['GET', 'POST'])
def start():
    if request.method == 'POST':
        if "miner" not in app.config:
            data = request.json
            good_hash = data["honest_power"]
            bad_hash = data["adversarial_power"]
            if sum(good_hash) + sum(bad_hash) != 1:
                return "Hash power does not sum to 1", 400
            miner.init_settings(good_miners=good_hash, bad_miners=bad_hash)
            
    if "miner" not in app.config:
        thread = Thread(target=miner.start_mining)
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