from flask import Flask, request, jsonify
from datetime import datetime, timedelta, timezone
import pytz
import psycopg2
import random
import string
import os
import json
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

DB_CONFIG = {
    "host": '185.209.21.97',
    "port": 5432,
    "user": 'postgres',
    "password": 'Saa40022',
    "dbname": 'brand'
}

TIME_TRACK_FILE = "user_last_request.json"

if not os.path.exists(TIME_TRACK_FILE):
    with open(TIME_TRACK_FILE, 'w') as f:
        json.dump({}, f)

def load_user_times():
    try:
        with open(TIME_TRACK_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {}

def save_user_times(data):
    with open(TIME_TRACK_FILE, 'w') as f:
        json.dump(data, f)



last_special_bonus_time = None
special_bonus_given = False

FREE_SPECIAL_BONUS_PROBABILITY = 1/1000

ALL_SPECIAL_BONUS_PROBABILITY = 1/2500

@app.route('/bonus/get_cooldown', methods=['POST'])
def get_cooldown():
    data = request.get_json()
    userid = str(data.get('ID'))
    user_times = load_user_times()

    current_time = datetime.now(pytz.UTC).timestamp()
    cooldown_period = 12 * 3600

    if userid in user_times:
        last_request_time = user_times[userid]
        time_since_last_request = current_time - last_request_time

        if time_since_last_request < cooldown_period:
            remaining_time = int(cooldown_period - time_since_last_request)
            hours = remaining_time // 3600
            minutes = (remaining_time % 3600) // 60

            return jsonify({
                "remaining_time": f"{hours} ч. {minutes} мин."
            }), 200
    
    return jsonify({
        "remaining_time": "0"
    }), 200
# --------------------------------------------------------------FREE CASE---------------------------------------------------------------------

FREE_BONUS_OPTIONS = [
    {"bonus": "50 tokens", "probability": 1/5, "amount": 50},
    {"bonus": "80 tokens", "probability": 1/8, "amount": 80},
    {"bonus": "100 tokens", "probability": 1/11, "amount": 100},
    {"bonus": "150 tokens", "probability": 1/13, "amount": 150},
    {"bonus": "200 tokens", "probability": 1/25, "amount": 200},
    {"bonus": "250 tokens", "probability": 1/30, "amount": 250},
    {"bonus": "300 tokens", "probability": 1/35, "amount": 300},
    {"bonus": "5%", "probability": 1/50000, "amount": 0},
    {"bonus": "10%", "probability": 1/75000, "amount": 0},
    {"bonus": "1G SORT", "probability": 1/10000000, "amount": 0},
    {"bonus": "1G MEOW", "probability": 1/10000000, "amount": 0}
]

@app.route('/bonus/get_bonus/free', methods=['POST'])
def get_free_bonus():
    data = request.get_json()
    userid = str(data.get('ID'))
    if userid is None:
        return jsonify({"error": "ID is required"}), 400

    bonus_option = get_free_random_bonus(userid)
    if bonus_option is None:
        return jsonify({"ID": userid, "BONUS": "No bonus available", "PROMOCODE": "lose"}), 200

    bonus = bonus_option["bonus"]
    bonus_amount = bonus_option["amount"]
    promocode = None
    astana_time = datetime.now(pytz.timezone('Asia/Almaty'))

    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    user_times = load_user_times()
    current_time = datetime.now(pytz.UTC).timestamp()


    try:
        if "tokens" in bonus:
            cur.execute('''
                UPDATE "user"
                SET balance = COALESCE(balance, 0) + %s
                WHERE id = %s
            ''', (bonus_amount, userid))

            if cur.rowcount == 0:
                return jsonify({"error": f"No user found with ID {userid}"}), 404

            cur.execute('SELECT balance FROM "user" WHERE id = %s', (userid,))
            updated_balance = cur.fetchone()[0]
            conn.commit()
            
            transfer_data = {
                "id_user": userid,
                "price": f"+{bonus_amount}",
                "date": astana_time.isoformat(),
                "key": "Бесплатный кейс",
            }
            
            response = requests.post(
                "http://localhost:3001/api/transfers", json=transfer_data
            )

            return jsonify({
                "ID": userid,
                "BONUS": bonus,
                "DATETIME": astana_time.isoformat(),
                "PROMOCODE": "win"
            })

        else:
            promocode = generate_promo_code()
            cur.execute('''
                INSERT INTO promocode (userid, bonus, promocode, status, datetime)
                VALUES (%s, %s, %s, %s, %s)
            ''', (userid, bonus, promocode, True, astana_time))
            conn.commit()
            
            transfer_data = {
                "id_user": userid,
                "price": f"+{bonus_amount}",
                "date": astana_time.isoformat(),
                "key": "Бесплатный кейс",
            }
            
            response = requests.post(
                "http://localhost:3001/api/transfers", json=transfer_data
            )

            return jsonify({
                "ID": userid,
                "BONUS": bonus,
                "DATETIME": astana_time.isoformat(),
                "PROMOCODE": promocode
            })

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        user_times[userid] = current_time
        save_user_times(user_times)
        cur.close()
        conn.close()
        

def get_free_random_bonus(user_id):
    global last_special_bonus_time, special_bonus_given
    current_time = datetime.now(pytz.UTC)
    
    if last_special_bonus_time is None or current_time - last_special_bonus_time >= timedelta(hours=24):
        special_bonus_given = False
        last_special_bonus_time = current_time
    
    bonus_options = FREE_BONUS_OPTIONS.copy()
    
    if not special_bonus_given:
        for option in bonus_options:
            if option["bonus"] in ["1G SORT", "1G MEOW"]:
                option["probability"] = FREE_SPECIAL_BONUS_PROBABILITY

    total_probability = sum(item["probability"] for item in bonus_options)
    r = random.uniform(0, total_probability)
    cumulative_probability = 0
    for option in bonus_options:
        cumulative_probability += option["probability"]
        if r < cumulative_probability:
            if option["bonus"] in ["1G SORT", "1G MEOW"] and not special_bonus_given:
                special_bonus_given = True 
                last_special_bonus_time = current_time
                for opt in FREE_BONUS_OPTIONS:
                    if opt["bonus"] in ["1G SORT", "1G MEOW"]:
                        opt["probability"] = 1/10000000
            return option
    return None

# -----------------------------------------------------------------------------------------------------------------------------------






# --------------------------------------------------------------RARE CASE---------------------------------------------------------------------

RARE_BONUS_OPTIONS = [
    {"bonus": "75 tokens", "probability": 1/20, "amount": 75},
    {"bonus": "120 tokens", "probability": 1/80, "amount": 120},
    {"bonus": "150 tokens", "probability": 1/150, "amount": 150},
    {"bonus": "225 tokens", "probability": 1/180, "amount": 225},
    {"bonus": "300 tokens", "probability": 1/260, "amount": 300},
    {"bonus": "375 tokens", "probability": 1/300, "amount": 375},
    {"bonus": "450 tokens", "probability": 1/400, "amount": 450},
    {"bonus": "10%", "probability": 1/50000, "amount": 0},
    {"bonus": "20%", "probability": 1/75000, "amount": 0},
    {"bonus": "1G SORT", "probability": 1/1000000, "amount": 0},
    {"bonus": "1G MEOW", "probability": 1/1000000, "amount": 0}
]

@app.route('/bonus/get_bonus/rare', methods=['POST'])
def get_rare_bonus():
    astana_time = datetime.now(pytz.timezone('Asia/Almaty'))
    data = request.get_json()
    userid = str(data.get('ID'))
    if userid is None:
        return jsonify({"error": "ID is required"}), 400

    bonus_option = get_rare_random_bonus(userid)
    
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    # ------------------------------------------------- Снимаем сумму за кейс с баланса --------------------------------------------------------------
    
    cur.execute('SELECT COALESCE(balance, 0) FROM "user" WHERE id = %s', (userid,))
    current_balance = cur.fetchone()

    if current_balance is None:
        return jsonify({"error": f"No user found with ID {userid}"}), 404

    current_balance = current_balance[0]

    if current_balance < 500:
        return jsonify({"error": "Insufficient balance"}), 400

    cur.execute('''
        UPDATE "user"
        SET balance = COALESCE(balance, 0) - %s
        WHERE id = %s
    ''', (500, userid))
    
    transfer_data = {
        "id_user": userid,
        "price": f"-500",
        "date": astana_time.isoformat(),
        "key": "Редкий кейс",
    }
    response = requests.post(
        "http://localhost:3001/api/transfers", json=transfer_data
    )

    conn.commit()
    
    # --------------------------------------------------------------------------------------------------------------------------------------------------
    
    if bonus_option is None:
        return jsonify({"ID": userid, "BONUS": "No bonus available", "PROMOCODE": "lose"}), 200

    bonus = bonus_option["bonus"]
    bonus_amount = bonus_option["amount"]
    promocode = None

    try:
        if "tokens" in bonus:
            cur.execute('''
                UPDATE "user"
                SET balance = COALESCE(balance, 0) + %s
                WHERE id = %s
            ''', (bonus_amount, userid))

            if cur.rowcount == 0:
                return jsonify({"error": f"No user found with ID {userid}"}), 404

            cur.execute('SELECT balance FROM "user" WHERE id = %s', (userid,))
            updated_balance = cur.fetchone()[0]
            conn.commit()

            transfer_data = {
                "id_user": userid,
                "price": f"+{bonus_amount}",
                "date": astana_time.isoformat(),
                "key": "Редкий кейс",
            }
            response = requests.post(
                "http://localhost:3001/api/transfers", json=transfer_data
            )

            return jsonify({
                "ID": userid,
                "BONUS": bonus,
                "DATETIME": astana_time.isoformat(),
                "PROMOCODE": "win"
            })

        else:
            promocode = generate_promo_code()
            cur.execute('''
                INSERT INTO promocode (userid, bonus, promocode, status, datetime)
                VALUES (%s, %s, %s, %s, %s)
            ''', (userid, bonus, promocode, True, astana_time))
            conn.commit()

            return jsonify({
                "ID": userid,
                "BONUS": bonus,
                "DATETIME": astana_time.isoformat(),
                "PROMOCODE": promocode
            })

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

def get_rare_random_bonus(user_id):
    global last_special_bonus_time, special_bonus_given
    current_time = datetime.now(pytz.UTC)
    
    if last_special_bonus_time is None or current_time - last_special_bonus_time >= timedelta(hours=24):
        special_bonus_given = False
        last_special_bonus_time = current_time
    
    bonus_options = RARE_BONUS_OPTIONS.copy()
    
    if not special_bonus_given:
        for option in bonus_options:
            if option["bonus"] in ["1G SORT", "1G MEOW"]:
                option["probability"] = ALL_SPECIAL_BONUS_PROBABILITY

    total_probability = sum(item["probability"] for item in bonus_options)
    r = random.uniform(0, total_probability)
    cumulative_probability = 0
    for option in bonus_options:
        cumulative_probability += option["probability"]
        if r < cumulative_probability:
            if option["bonus"] in ["1G SORT", "1G MEOW"] and not special_bonus_given:
                special_bonus_given = True 
                last_special_bonus_time = current_time
                for opt in RARE_BONUS_OPTIONS:
                    if opt["bonus"] in ["1G SORT", "1G MEOW"]:
                        opt["probability"] = 1/10000000
            return option
    return None

# -----------------------------------------------------------------------------------------------------------------------------------




# -------------------------------------------------------------- GENERAL CASE---------------------------------------------------------------------

GENERAL_BONUS_OPTIONS = [
    {"bonus": "60 tokens", "probability": 1/5, "amount": 60},
    {"bonus": "96 tokens", "probability": 1/30, "amount": 96},
    {"bonus": "120 tokens", "probability": 1/60, "amount": 120},
    {"bonus": "180 tokens", "probability": 1/130, "amount": 180},
    {"bonus": "240 tokens", "probability": 1/250, "amount": 240},
    {"bonus": "300 tokens", "probability": 1/300, "amount": 300},
    {"bonus": "360 tokens", "probability": 1/350, "amount": 360},
    {"bonus": "10%", "probability": 1/50000, "amount": 0},
    {"bonus": "20%", "probability": 1/75000, "amount": 0},
    {"bonus": "1G SORT", "probability": 1/10000000, "amount": 0},
    {"bonus": "1G MEOW", "probability": 1/10000000, "amount": 0}
]

@app.route('/bonus/get_bonus/general', methods=['POST'])
def get_general_bonus():
    astana_time = datetime.now(pytz.timezone('Asia/Almaty'))
    data = request.get_json()
    userid = str(data.get('ID'))
    if userid is None:
        return jsonify({"error": "ID is required"}), 400

    bonus_option = get_general_random_bonus(userid)
    
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    # ------------------------------------------------- Снимаем сумму за кейс с баланса --------------------------------------------------------------
    
    cur.execute('SELECT COALESCE(balance, 0) FROM "user" WHERE id = %s', (userid,))
    current_balance = cur.fetchone()

    if current_balance is None:
        return jsonify({"error": f"No user found with ID {userid}"}), 404

    current_balance = current_balance[0]

    if current_balance < 250:
        return jsonify({"error": "Insufficient balance"}), 400

    cur.execute('''
        UPDATE "user"
        SET balance = COALESCE(balance, 0) - %s
        WHERE id = %s
    ''', (250, userid))

    conn.commit()
    
    transfer_data = {
        "id_user": userid,
        "price": f"-250",
        "date": astana_time.isoformat(),
        "key": "Обычный кейс",
    }
    response = requests.post(
        "http://localhost:3001/api/transfers", json=transfer_data
    )
    
    # --------------------------------------------------------------------------------------------------------------------------------------------------
    
    if bonus_option is None:
        return jsonify({"ID": userid, "BONUS": "No bonus available", "PROMOCODE": "lose"}), 200

    bonus = bonus_option["bonus"]
    bonus_amount = bonus_option["amount"]
    promocode = None
    astana_time = datetime.now(pytz.timezone('Asia/Almaty'))

    try:
        if "tokens" in bonus:
            cur.execute('''
                UPDATE "user"
                SET balance = COALESCE(balance, 0) + %s
                WHERE id = %s
            ''', (bonus_amount, userid))

            if cur.rowcount == 0:
                return jsonify({"error": f"No user found with ID {userid}"}), 404

            cur.execute('SELECT balance FROM "user" WHERE id = %s', (userid,))
            updated_balance = cur.fetchone()[0]
            conn.commit()

            transfer_data = {
                "id_user": userid,
                "price": f"+{bonus_amount}",
                "date": astana_time.isoformat(),
                "key": "Обычный кейс",
            }
            response = requests.post(
                "http://localhost:3001/api/transfers", json=transfer_data
            )

            return jsonify({
                "ID": userid,
                "BONUS": bonus,
                "DATETIME": astana_time.isoformat(),
                "PROMOCODE": "win"
            })

        else:
            promocode = generate_promo_code()
            cur.execute('''
                INSERT INTO promocode (userid, bonus, promocode, status, datetime)
                VALUES (%s, %s, %s, %s, %s)
            ''', (userid, bonus, promocode, True, astana_time))
            conn.commit()

            return jsonify({
                "ID": userid,
                "BONUS": bonus,
                "DATETIME": astana_time.isoformat(),
                "PROMOCODE": promocode
            })

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

def get_general_random_bonus(user_id):
    global last_special_bonus_time, special_bonus_given
    current_time = datetime.now(pytz.UTC)
    
    if last_special_bonus_time is None or current_time - last_special_bonus_time >= timedelta(hours=24):
        special_bonus_given = False
        last_special_bonus_time = current_time
    
    bonus_options = GENERAL_BONUS_OPTIONS.copy()
    
    if not special_bonus_given:
        for option in bonus_options:
            if option["bonus"] in ["1G SORT", "1G MEOW"]:
                option["probability"] = ALL_SPECIAL_BONUS_PROBABILITY

    total_probability = sum(item["probability"] for item in bonus_options)
    r = random.uniform(0, total_probability)
    cumulative_probability = 0
    for option in bonus_options:
        cumulative_probability += option["probability"]
        if r < cumulative_probability:
            if option["bonus"] in ["1G SORT", "1G MEOW"] and not special_bonus_given:
                special_bonus_given = True 
                last_special_bonus_time = current_time
                for opt in GENERAL_BONUS_OPTIONS:
                    if opt["bonus"] in ["1G SORT", "1G MEOW"]:
                        opt["probability"] = 1/10000000
            return option
    return None

# -----------------------------------------------------------------------------------------------------------------------------------




# -------------------------------------------------------------- LEGENDARY CASE---------------------------------------------------------------------

LEGENDARY_BONUS_OPTIONS = [
    {"bonus": "100 tokens", "probability": 1/5, "amount": 100},
    {"bonus": "160 tokens", "probability": 1/20, "amount": 160},
    {"bonus": "200 tokens", "probability": 1/30, "amount": 200},
    {"bonus": "300 tokens", "probability": 1/50, "amount": 300},
    {"bonus": "400 tokens", "probability": 1/70, "amount": 400},
    {"bonus": "500 tokens", "probability": 1/100, "amount": 500},
    {"bonus": "600 tokens", "probability": 1/150, "amount": 600},
    {"bonus": "10%", "probability": 1/50000, "amount": 0},
    {"bonus": "20%", "probability": 1/75000, "amount": 0},
    {"bonus": "2G SORT", "probability": 1/10000000, "amount": 0},
    {"bonus": "2G MEOW", "probability": 1/10000000, "amount": 0}
]

@app.route('/bonus/get_bonus/legendary', methods=['POST'])
def get_legendary_bonus():
    astana_time = datetime.now(pytz.timezone('Asia/Almaty'))
    data = request.get_json()
    userid = str(data.get('ID'))
    if userid is None:
        return jsonify({"error": "ID is required"}), 400

    bonus_option = get_legendary_random_bonus(userid)
    
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    # ------------------------------------------------- Снимаем сумму за кейс с баланса --------------------------------------------------------------
    
    cur.execute('SELECT COALESCE(balance, 0) FROM "user" WHERE id = %s', (userid,))
    current_balance = cur.fetchone()

    if current_balance is None:
        return jsonify({"error": f"No user found with ID {userid}"}), 404

    current_balance = current_balance[0]

    if current_balance < 1000:
        return jsonify({"error": "Insufficient balance"}), 400

    cur.execute('''
        UPDATE "user"
        SET balance = COALESCE(balance, 0) - %s
        WHERE id = %s
    ''', (1000, userid))

    conn.commit()
    
    transfer_data = {
        "id_user": userid,
        "price": f"-1000",
        "date": astana_time.isoformat(),
        "key": "Легендарный кейс",
    }
    response = requests.post(
        "http://localhost:3001/api/transfers", json=transfer_data
    )
    
    # --------------------------------------------------------------------------------------------------------------------------------------------------
    
    if bonus_option is None:
        return jsonify({"ID": userid, "BONUS": "No bonus available", "PROMOCODE": "lose"}), 200

    bonus = bonus_option["bonus"]
    bonus_amount = bonus_option["amount"]
    promocode = None
    astana_time = datetime.now(pytz.timezone('Asia/Almaty'))

    try:
        if "tokens" in bonus:
            cur.execute('''
                UPDATE "user"
                SET balance = COALESCE(balance, 0) + %s
                WHERE id = %s
            ''', (bonus_amount, userid))

            if cur.rowcount == 0:
                return jsonify({"error": f"No user found with ID {userid}"}), 404

            cur.execute('SELECT balance FROM "user" WHERE id = %s', (userid,))
            updated_balance = cur.fetchone()[0]
            conn.commit()

            transfer_data = {
                "id_user": userid,
                "price": f"+{bonus_amount}",
                "date": astana_time.isoformat(),
                "key": "Легендарный кейс",
            }
            response = requests.post(
                "http://localhost:3001/api/transfers", json=transfer_data
            )

            return jsonify({
                "ID": userid,
                "BONUS": bonus,
                "DATETIME": astana_time.isoformat(),
                "PROMOCODE": "win"
            })

        else:
            promocode = generate_promo_code()
            cur.execute('''
                INSERT INTO promocode (userid, bonus, promocode, status, datetime)
                VALUES (%s, %s, %s, %s, %s)
            ''', (userid, bonus, promocode, True, astana_time))
            conn.commit()

            return jsonify({
                "ID": userid,
                "BONUS": bonus,
                "DATETIME": astana_time.isoformat(),
                "PROMOCODE": promocode
            })

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

def get_legendary_random_bonus(user_id):
    global last_special_bonus_time, special_bonus_given
    current_time = datetime.now(pytz.UTC)
    
    if last_special_bonus_time is None or current_time - last_special_bonus_time >= timedelta(hours=24):
        special_bonus_given = False
        last_special_bonus_time = current_time
    
    bonus_options = LEGENDARY_BONUS_OPTIONS.copy()
    
    if not special_bonus_given:
        for option in bonus_options:
            if option["bonus"] in ["1G SORT", "1G MEOW"]:
                option["probability"] = ALL_SPECIAL_BONUS_PROBABILITY

    total_probability = sum(item["probability"] for item in bonus_options)
    r = random.uniform(0, total_probability)
    cumulative_probability = 0
    for option in bonus_options:
        cumulative_probability += option["probability"]
        if r < cumulative_probability:
            if option["bonus"] in ["1G SORT", "1G MEOW"] and not special_bonus_given:
                special_bonus_given = True 
                last_special_bonus_time = current_time
                for opt in LEGENDARY_BONUS_OPTIONS:
                    if opt["bonus"] in ["1G SORT", "1G MEOW"]:
                        opt["probability"] = 1/10000000
            return option
    return None

# -----------------------------------------------------------------------------------------------------------------------------------


# -------------------------------------------------------------- EVENT CASE---------------------------------------------------------------------

EVENT_BONUS_OPTIONS = [
    {"bonus": "2000 tokens", "probability": 1/5, "amount": 2000},
    {"bonus": "2500 tokens", "probability": 1/5, "amount": 2500},
    {"bonus": "3000 tokens", "probability": 1/4, "amount": 3000},
    {"bonus": "3500 tokens", "probability": 1/5, "amount": 3500},
    {"bonus": "4000 tokens", "probability": 1/6, "amount": 4000},
    {"bonus": "4500 tokens", "probability": 1/7, "amount": 4500},
    {"bonus": "5000 tokens", "probability": 1/8, "amount": 5000},
    {"bonus": "20% Da Vinci", "probability": 1/10, "amount": 0},
    {"bonus": "10% Borderline", "probability": 1/2, "amount": 0},
    {"bonus": "Bingo", "probability": 1/15, "amount": 0},
    {"bonus": "50$", "probability": 1/25, "amount": 0},
    {"bonus": "1G Lee", "probability": 1/35, "amount": 0},
    {"bonus": "1G Skitty", "probability": 1/35, "amount": 0},
    {"bonus": "1G Garage", "probability": 1/35, "amount": 0}
]

@app.route('/bonus/get_bonus/event', methods=['POST'])
def get_event_bonus():
    astana_time = datetime.now(pytz.timezone('Asia/Almaty'))
    data = request.get_json()
    userid = str(data.get('ID'))
    if userid is None:
        return jsonify({"error": "ID is required"}), 400

    bonus_option = get_event_random_bonus(userid)
    
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    if bonus_option is None:
        return jsonify({"ID": userid, "BONUS": "No bonus available", "PROMOCODE": "lose"}), 200

    bonus = bonus_option["bonus"]
    bonus_amount = bonus_option["amount"]
    promocode = None
    astana_time = datetime.now(pytz.timezone('Asia/Almaty'))

    try:
        if "tokens" in bonus:
            cur.execute('''
                UPDATE "user"
                SET balance = COALESCE(balance, 0) + %s
                WHERE id = %s
            ''', (bonus_amount, userid))

            if cur.rowcount == 0:
                return jsonify({"error": f"No user found with ID {userid}"}), 404

            cur.execute('SELECT balance FROM "user" WHERE id = %s', (userid,))
            updated_balance = cur.fetchone()[0]
            conn.commit()

            cur.execute('''
                UPDATE event
                SET prize = %s
                WHERE user_id = %s
            ''', (bonus, userid))
            conn.commit()

            return jsonify({
                "ID": userid,
                "BONUS": bonus,
                "DATETIME": astana_time.isoformat(),
                "PROMOCODE": "win"
            })
            
        if "1G" in bonus:
            
            cur.execute('''
                UPDATE event
                SET prize = %s
                WHERE user_id = %s
            ''', (bonus, userid))
            conn.commit()

            return jsonify({
                "ID": userid,
                "BONUS": bonus,
                "DATETIME": astana_time.isoformat(),
                "PROMOCODE": "win"
            })
            
        if "50$" in bonus:
        
            cur.execute('''
                UPDATE event
                SET prize = %s
                WHERE user_id = %s
            ''', (bonus, userid))
            conn.commit()

            return jsonify({
                "ID": userid,
                "BONUS": bonus,
                "DATETIME": astana_time.isoformat(),
                "PROMOCODE": "win"
            })        

        if "20%" in bonus:
        
            cur.execute('''
                UPDATE event
                SET prize = %s
                WHERE user_id = %s
            ''', (bonus, userid))
            conn.commit()

            return jsonify({
                "ID": userid,
                "BONUS": bonus,
                "DATETIME": astana_time.isoformat(),
                "PROMOCODE": "win"
            })        
            
            
        if "10%" in bonus:
        
            cur.execute('''
                UPDATE event
                SET prize = %s
                WHERE user_id = %s
            ''', (bonus, userid))
            conn.commit()

            return jsonify({
                "ID": userid,
                "BONUS": bonus,
                "DATETIME": astana_time.isoformat(),
                "PROMOCODE": "win"
            })       

        else:
            promocode = generate_promo_code()
            cur.execute('''
                INSERT INTO promocode (userid, bonus, promocode, status, datetime)
                VALUES (%s, %s, %s, %s, %s)
            ''', (userid, bonus, promocode, True, astana_time))
            conn.commit()

            cur.execute('''
                UPDATE event
                SET prize = %s
                WHERE user_id = %s
            ''', (bonus, userid))
            conn.commit()

            return jsonify({
                "ID": userid,
                "BONUS": bonus,
                "DATETIME": astana_time.isoformat(),
                "PROMOCODE": promocode
            })

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

def get_event_random_bonus(userid):
    bonus_options = EVENT_BONUS_OPTIONS.copy()

    total_probability = sum(item["probability"] for item in bonus_options)
    
    r = random.uniform(0, total_probability)
    cumulative_probability = 0

    for option in bonus_options:
        cumulative_probability += option["probability"]
        if r < cumulative_probability:
            return option  

    return None  

# -----------------------------------------------------------------------------------------------------------------------------------    



def create_promocode_table():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS promocode (
            id SERIAL PRIMARY KEY,
            userid INT NOT NULL,
            bonus TEXT NOT NULL,
            promocode TEXT,
            status BOOLEAN NOT NULL DEFAULT true,
            datetime TIMESTAMP NOT NULL
        )
    ''')
    conn.commit()
    cur.close()
    conn.close()

def generate_promo_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


@app.route('/bonus/get_balance', methods=['POST'])
def get_balance():
    data = request.get_json()
    user_id = data.get('ID')
    if user_id is None:
        return jsonify({"error": "ID is required"}), 400

    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    try:
        cur.execute('SELECT balance FROM "user" WHERE id = %s', (user_id,))
        result = cur.fetchone()
    except Exception as e:
        print(f"Error executing SELECT query: {e}")
        return jsonify({"error": "Database query failed"}), 500
    finally:
        cur.close()
        conn.close()

    if result is None:
        return jsonify({"error": "User not found"}), 404

    balance = result[0]

    return jsonify({
        "ID": user_id,
        "balance": balance
    })


@app.route('/bonus/get_user_promocodes', methods=['POST'])
def get_user_promocodes():
    data = request.get_json()
    user_id = data.get('ID')
    if user_id is None:
        return jsonify({"error": "ID is required"}), 400

    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute('''
        SELECT id, userid, bonus, status, datetime 
        FROM promocode 
        WHERE UserId = %s
    ''', (user_id,))
    result = cur.fetchall()
    cur.close()
    conn.close()

    if not result:
        return jsonify({"error": "No promocodes found for the user"}), 404

    promocodes = []
    for row in result:
        promocodes.append({
            "id": row[0],
            "userid": row[1],
            "bonus": row[2],
            "status": row[3],
            "datetime": row[4].isoformat()
        })

    return jsonify({
        "ID": user_id,
        "promocodes": promocodes
    })


if __name__ == '__main__':
    create_promocode_table()
    app.run(debug=True, host='0.0.0.0', port=5000)