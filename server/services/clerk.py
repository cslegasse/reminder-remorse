from config import settings
from svix.webhooks import Webhook, WebhookVerificationError


def sync_user(headers, payload):
    print("headers ", headers)
    print("payload ", payload)
    print(type(payload))
    try:
        wh = Webhook(settings.webhook_secret)
        evt = wh.verify(payload, headers)
    except WebhookVerificationError:
        raise Exception("Invalid webhook signature")
    data = evt["data"]
    external_id = data["id"]

    if evt["type"] in {"user.created", "user.updated"}:
        attributes = {key: value for key, value in data.items() if key != "id"}
        return
    elif evt["type"] == "user.deleted":
        return
