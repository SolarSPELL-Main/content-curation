import hashlib


## yet to find the use
def sha256(bytestream):
    hash_sha256 = hashlib.sha256()
    for chunk in iter(lambda: bytestream.read(4096), b""):
        hash_sha256.update(chunk)
    return hash_sha256.hexdigest()