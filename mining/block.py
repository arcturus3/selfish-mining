import hashlib
import os


class Block:
    def __init__(self, parent = None, type = "Honest") -> None:
        self.parent = parent # hash of the parent
        random_bytes = os.urandom(64)
        self.hash = hashlib.sha256(random_bytes).hexdigest()
        self.type = type
    
    def get_hash(self):
        return self.hash

    def get_type(self):
        return self.type
    
    def get_parent(self):
        return self.parent
    
    def __repr__(self) -> str:
        return str((self.parent, self.type))