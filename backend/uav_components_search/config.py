import os
from dotenv import load_dotenv


load_dotenv()

# App configurations
APP_PORT = os.environ["APP_PORT"]
SECRET_KEY = os.getenv("SECRET_KEY")

# PostgreSQL configurations
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv('DB_HOST')

# Redis configurations
REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = os.getenv("REDIS_PORT")
