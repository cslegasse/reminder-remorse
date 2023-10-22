from config import settings
from services import user
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
    print(data)
    external_id = data["id"]

    if evt["type"] in {"user.created", "user.updated"}:
        attributes = {key: value for key, value in data.items() if key != "id"}
        prev_uid = user.user_by_clerk_id(data['user_id'])
        if prev_uid is None:
            user.create_user({
                'fname': 'Random',
                'lname': 'Person',
                'clerk_id': external_id,
                'clerk_json': str(attributes),
                'created_at': int(data['created_at']/1000),
                'last_login': int(data['last_active_at']/1000),
            })
        return
    elif evt["type"] == "user.deleted":
        uid = user.user_by_clerk_id(data['user_id'])
        user.delete_user(uid)
        return
