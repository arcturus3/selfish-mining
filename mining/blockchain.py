from block import Block

class Blockchain:
    
    def __init__(self) -> None:
        self.genesis = Block(id="Genesis")
        self.difficulty = "0000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"    
        self.blockchain = {self.genesis.get_hash(): self.genesis} # Map of string hash : Block
        self.tip = self.genesis.get_hash() # hash
        self.longest_chain_length = 1
        self.block_lengths = {self.genesis.get_hash(): 1} # Map of string hash : chain length from block to genesis
        
    def insert_block(self, block: Block) -> None:
        parent_len = self.block_lengths[block.get_parent()]
        hash = block.get_hash()
        if parent_len >= self.longest_chain_length:
            self.tip = hash
            self.longest_chain_length = parent_len + 1
        self.block_lengths[hash] = parent_len + 1
        self.blockchain[hash] = block
        
    def get_tip(self) -> str:
        return self.tip

    def get_longest_chain(self) -> [str]:
        chain = []
        current = self.tip
        for _ in range(self.longest_chain_length):
            chain.append(current)
            current = self.blockchain[current].get_parent()
        return chain[::-1]
    
    def get_chain_quality(self) -> str:
        tot = -1 # don't count genesis
        num_good = 0
        current = self.tip
        for _ in range(self.longest_chain_length):
            tot += 1
            if "Honest" in self.blockchain[current].get_id():
                num_good += 1
            current = self.blockchain[current].get_parent()
        return str((num_good) / tot)
    
    def get_blockchain(self):
        return self.blockchain
    
    def set_difficulty(self, difficulty):
        self.difficulty = difficulty
    
    
    def __repr__(self):
        return str(self.blockchain)