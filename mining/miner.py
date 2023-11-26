from blockchain import Blockchain
import random

from block import Block

class Miner:
    
    def __init__(self, blockchain: Blockchain) -> None:
        self.blockchain = blockchain
        self.mining_powers = [0.5, 0.5] # 50/50 mining power for now
        self.stop_thread = False
        
    def mine(self):
        parent = self.blockchain.tip
        type = ""
        # TODO: Simulate using self.mining_powers
        rand = random.random()
        if rand < self.mining_powers[0]:
            # Honest
            type = "Honest"
        else:
            # Adversary
            type = "Adversary"
        block = Block(parent=parent, type=type)
        if block.get_hash() <= self.blockchain.difficulty:
            self.blockchain.insert_block(block)
            
    def continuous_mining(self):
        while True:
            if self.stop_thread:
                break
            # print(self.blockchain)
            self.mine()
    def stop(self):
        self.stop_thread = True