import json
from flask import Flask, request, jsonify, Response
from blockchain import Blockchain
from json import JSONEncoder

from threading import Thread
from miner import Miner
from block import Block

class CustomEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Block):
            return obj.toJSON()
        return JSONEncoder.default(self, obj)
    
blockchain = Blockchain()
# Use equal hash power
miner = Miner(blockchain)
app = Flask(__name__)
app.json_encoder = CustomEncoder

    
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
            if "difficulty" in data:
                blockchain.set_difficulty(data["difficulty"])
            
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

@app.route('/restart')
def restart():
    global blockchain
    global miner
    if "miner" in app.config:
        miner.stop()
        del app.config["miner"]
    blockchain = Blockchain()
    miner = Miner(blockchain)
    return "Restarted!"

@app.route('/blockchain')
def get_blockchain():
    out = {
        "published": blockchain.get_blockchain(),
        "unpublished": miner.get_bad_blocks()
    }
    return Response(json.dumps(out, cls=CustomEncoder), mimetype='application/json')

@app.route('/longest-chain')
def get_longest_chain():
    return jsonify(blockchain.get_longest_chain())

@app.route('/chain-quality')
def get_quality():
    return blockchain.get_chain_quality()

if __name__ == '__main__':
    app.run(debug=True, port=8765)