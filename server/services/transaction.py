from services import redis_service
r = redis_service.redis_manager.redis

def create_transaction(transaction_data):
    transaction_id = int(r.get("transaction_id"))
    user_id = transaction_data['user_id']
    user_id = transaction_data['friend_id'] if 'friend_id' in transaction_data else None
    org_id = transaction_data['org_id'] if 'org_id' in transaction_data else None
    amt = transaction_data['amt']
    if user_id is not None:
        r.hset(f"t{transaction_id}", "friend_id", user_id)
    elif org_id is not None:
        r.hset(f"t{transaction_id}", "org_id", org_id)
    else:
        raise ValueError("Transaction must specify either friend_id or org_id")
    r.hset(f"t{transaction_id}", "amt", amt)
    r.incr("transaction_id")
    return {"id": transaction_id}

