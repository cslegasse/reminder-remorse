from services import redis_service
r = redis_service.redis_manager.redis

def create_transaction(transaction_data):
    transaction_id = int(r.get("transaction_id"))
    r.incr("transaction_id")
    user_id = transaction_data['user_id'] if 'user_id' in transaction_data else None
    org_id = transaction_data['org_id'] if 'org_id' in transaction_data else None
    amt = transaction_data['amt']
    if user_id:
        r.hset(f"t{transaction_id}", "user_id", user_id)
    elif org_id:
        r.hset(f"t{transaction_id}", "org_id", org_id)
    else:
        raise ValueError("Must specify either user_id or org_id")
    r.hset(f"t{transaction_id}", "amt", amt)
    return {"id": transaction_id}

