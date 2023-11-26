from blockchain import Blockchain
import asyncio

from block import Block

class Miner:
    
    def __init__(self, blockchain: Blockchain) -> None:
        self.blockchain = blockchain
        self.mining_powers = []
        
    async def mine(self):
        parent = self.blockchain.tip
        type = "Honest"
        # TODO: Simulate using self.mining_powers
        block = Block(parent=parent, type=type)
        if block.get_hash() <= self.blockchain.difficulty:
            self.blockchain.insert_block(block)
            
    async def continuous_mining(self):
        while True:
            # print(self.blockchain)
            await self.mine()
        