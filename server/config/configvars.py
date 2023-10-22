from os import environ

class Settings:
    webhook_secret = environ.get("WEBHOOK_SECRET")