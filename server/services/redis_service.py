import redis

from dotenv import load_dotenv
import os

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = os.getenv("REDIS_PORT")
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")


class RedisManager(object):
    def __init__(self, useCloud=True):
        if useCloud:
            self.redis = redis.Redis(
                host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD
            )
        else:
            self.redis = redis.Redis(
                host='localhost', port=6379, db=0
            )


redis_manager = RedisManager(useCloud=False)
