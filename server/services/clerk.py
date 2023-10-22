from app.config import settings
from svix.webhooks import Webhook, WebhookVerificationError


def sync_user(headers, payload):
    # 1. Verify the request is coming from Clerk
    # 2. Verify the request is for the correct user
    # 3. Update the user's data
    # 4. Return the updated user data
    print(headers)
    print(payload)
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
