import bisect
from collections import defaultdict, deque
from blockchain import Blockchain
import random

from block import Block

class Miner:
    
    def __init__(self, blockchain: Blockchain, good_miners: [int] = None, bad_miners: [int] = None) -> None:
        self.blockchain = blockchain
        self.stop_thread = False
        self.init_settings(good_miners=good_miners, bad_miners=bad_miners)
        
    def init_settings(self, good_miners: [int] = None, bad_miners: [int] = None):
        if good_miners == None and bad_miners == None:
            self.selfish = False
        else:
            self.selfish = True
            # assume they sum to 1
            breakpoints = []
            tot = 0
            self.mappings = {}
            if good_miners:
                for i in range(len(good_miners)):
                    tot += good_miners[i]
                    breakpoints.append(tot)
                    self.mappings[i] = f"Honest{str(i+1)}"
            self.good_mining_power = tot
            self.bad_queue = defaultdict(deque) # map of miner name : queue of withheld blocks
            if bad_miners:
                for i in range(len(bad_miners)):
                    tot += bad_miners[i]
                    breakpoints.append(tot)
                    self.mappings[i+len(good_miners)] = f"Adversary{str(i+1)}"
            self.breakpoints = breakpoints
            # print(breakpoints)
            # print(self.mappings)
    
    def map_from_mining_power_to_miner(self, power):
        return self.mappings[bisect.bisect_left(self.breakpoints, power)]
        
    def mine(self):
        parent = self.blockchain.tip
        id = ""
        if not self.selfish:
            id = "Honest"
            block = Block(parent=parent, id=id)
            if block.get_hash() <= self.blockchain.difficulty:
                self.blockchain.insert_block(block)
        else:
            rand = random.random()
            id = self.map_from_mining_power_to_miner(rand)
            if rand > self.good_mining_power: # Adversary miner
                # don't add to blockchain
                if len(self.bad_queue[id]) > 0:
                    parent = self.bad_queue[id][-1].get_hash()
                block = Block(parent=parent, id=id)
                if block.get_hash() <= self.blockchain.difficulty:
                    self.bad_queue[id].append(block)
                return
            else:
                block = Block(parent=parent, id=id)
                if block.get_hash() <= self.blockchain.difficulty:
                    found = False
                    for key in sorted(self.bad_queue.keys()):
                        dq = self.bad_queue[key]
                        if len(dq) > 0:
                            found = True
                            blk = dq.popleft()
                            self.blockchain.insert_block(blk)
                        if len(dq) == 0:
                            del self.bad_queue[key]
                    if not found:
                        self.blockchain.insert_block(block)
                        
    def get_bad_blocks(self):
        mp = {}
        for key in self.bad_queue.keys():
            dq = self.bad_queue[key]
            for item in dq:
                mp[item.get_hash()] = item
        return mp
    
    def start_mining(self):
        while True:
            if self.stop_thread:
                break
            self.mine()
            
    def stop(self):
        self.stop_thread = True