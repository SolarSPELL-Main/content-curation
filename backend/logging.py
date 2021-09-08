import logging
import os

# Creates logging directory on initialization
class FileHandler(logging.FileHandler):
    def __init__(self, filename, **kwargs):
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        super(FileHandler, self).__init__(filename, **kwargs)
