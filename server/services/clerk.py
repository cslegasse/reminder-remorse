import time
from config import settings
from services import user
from svix.webhooks import Webhook, WebhookVerificationError


def sync_user(headers, payload):
    # print("headers ", headers)
    # print("payload ", payload)
    # print(type(payload))
    try:
        wh = Webhook(settings.webhook_secret)
        evt = wh.verify(payload, headers)
    except WebhookVerificationError:
        raise Exception("Invalid webhook signature")
    data = evt["data"]
    # print(data)
    external_id = data["user_id"] if "user_id" in data else data["id"]
    # print(data['user_id'])

    prev_u = user.user_by_clerk_id(external_id)
    if prev_u is None:
        user.create_user({
            'fname': 'Random',
            'lname': 'Person',
            'username': 'random_person' + str(external_id[:5]),
            'clerk_id': external_id,
            'clerk_json': str(data),
            'created_at': int(data['created_at']/1000),
            'last_login': int(time.time()),
        })
    if evt["type"] in {"user.created", "user.updated"}:
        attributes = {key: value for key, value in data.items() if key != "id"}
        return
    elif evt["type"] == "user.deleted":
        uid = user.user_by_clerk_id(external_id)['id']
        user.delete_user(uid)
        return
