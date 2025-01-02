import redis

from config import REDIS_HOST, REDIS_PORT


redis_client = redis.StrictRedis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=0,
)


def get_redis_connection():
    return redis_client
