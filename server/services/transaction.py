from services import redis_service
r = redis_service.redis_manager.redis

def create_transaction(transaction_data):
    transaction_id = int(r.get("transaction_id"))
    user_id = transaction_data['user_id']
    friend_id = transaction_data['friend_id'] if 'friend_id' in transaction_data else None
    org_id = transaction_data['org_id'] if 'org_id' in transaction_data else None
    amt = transaction_data['amt']
    if friend_id is not None:
        r.hset(f"t{transaction_id}", "friend_id", friend_id)
    elif org_id is not None:
        r.hset(f"t{transaction_id}", "org_id", org_id)
    else:
        raise ValueError("Transaction must specify either friend_id or org_id")
    r.hset(f"t{transaction_id}", "user_id", user_id)
    r.hset(f"t{transaction_id}", "amt", amt)
    r.incr("transaction_id")
    return {"id": transaction_id}

def get_transaction(transaction_id):
    transaction_data = {}
    for key in map(lambda k: k.decode('utf-8'), r.hkeys(f"t{transaction_id}")):
        transaction_data[key] = r.hget(f"t{transaction_id}", key).decode('utf-8')
    for key in ['amt']:
        transaction_data[key] = float(transaction_data[key])
    for key in ['friend_id', 'org_id']:
        if key in transaction_data:
            transaction_data[key] = int(transaction_data[key])
    transaction_data['id'] = transaction_id
    return transaction_data

def get_transactions(user_id):
    transactions = []
    print("going")
    for i in range(int(r.get("transaction_id"))):
        uid = int(r.hget(f"t{i}", "user_id").decode('utf-8'))
        fid = r.hget(f"t{i}", "friend_id")
        if fid is not None:
            fid = int(fid.decode('utf-8'))
        if user_id == uid or user_id == fid:
            transactions.append(get_transaction(i))
    return transactions