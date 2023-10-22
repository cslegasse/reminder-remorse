from os import environ
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.


class Settings:
    webhook_secret = environ.get("WEBHOOK_SECRET")
