from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

DB_USER = 'postgres'
DB_PASSWORD = 'Saa40022'
DB_HOST = '185.209.21.97'
DB_NAME =  'brand'
DB_PORT = '5432'

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class PageView(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Visit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=db.func.current_timestamp())
    user_id = db.Column(db.String(100), nullable=True)  
    day_of_week = db.Column(db.Integer)  
    hour = db.Column(db.Integer)  

    def __repr__(self):
        return f"Visit('{self.date}', '{self.user_id}')"

@app.route('/tracking/track', methods=['POST'])
def track_pageview():
    data = request.json
    new_view = PageView(path=data['path'])
    db.session.add(new_view)
    db.session.commit()
    return jsonify({'message': 'View tracked'}), 201

@app.route('/tracking/stats', methods=['GET'])
def get_stats():
    stats = db.session.query(
        PageView.path,
        db.func.count(PageView.id)
    ).group_by(PageView.path).all()
    
    return jsonify([
        {'path': path, 'views': count} 
        for path, count in stats
    ])

@app.route('/tracking/top6', methods=['GET'])
def get_top6():
    path_mapping = {
        '/': 'Главная',
        '/catalog': 'Каталог',
        '/login': 'Вход',
        '/registration': 'Регистрация',
        '/help': 'Помощь',
        '/work': 'Работа',
        '/shop/:id': 'Магазин с ID: {id}',
        '/profile/:id': 'Профиль',
        '/games': 'Игры',
        '/sales': 'Акции',
        '/case/free': 'Бесплатный кейс',
        '/case/general': 'Обычный кейс',
        '/case/legendary': 'Легендарный кейс',
        '/case/rare': 'Редкий кейс',
        '/roulette': 'Рулетка',
        '/miner': 'Минер',
        '/statistic': 'Статистика'
    }

    stats = db.session.query(
        PageView.path,
        db.func.count(PageView.id)
    ).group_by(PageView.path).order_by(
        db.func.count(PageView.id).desc()
    ).limit(6).all()
    
    if not stats:
        return jsonify([]), 200
    
    max_views = stats[0][1]
    result = []
    
    for path, views in stats:
        display_name = path_mapping.get(path, path)
        
        if '/shop/:id' in display_name:
            display_name = display_name.replace('{id}', path.split('/')[-1])
        if '/profile/:id' in display_name:
            display_name = display_name.replace('{id}', path.split('/')[-1])
        
        percent = (views / max_views) * 100 if max_views != 0 else 0
        result.append({
            'name': display_name,
            'views': views,
            'percent': round(percent, 2)
        })
    
    return jsonify(result)

@app.route('/tracking/register_visit', methods=['POST'])
def register_visit():
    data = request.json
    user_id = data.get('user_id')  
    
    existing_visit = Visit.query.filter_by(user_id=user_id, date=datetime.now().date()).first()
    
    if not existing_visit:
        new_visit = Visit(user_id=user_id, day_of_week=datetime.now().weekday(), hour=datetime.now().hour)
        db.session.add(new_visit)
        db.session.commit()
        return jsonify({'message': 'Visit registered successfully'}), 200
    else:
        return jsonify({'message': 'Visit already registered for today'}), 400

@app.route('/tracking/get_visits_stats', methods=['GET'])
def get_visits_stats():
    total_visits = Visit.query.count()
    unique_visits = len(set([v.user_id for v in Visit.query.all()]))
    
    visits_by_day_of_week = {}
    for i in range(7):
        visits_by_day_of_week[i] = Visit.query.filter_by(day_of_week=i).count()
        
    visits_by_hour = {}
    for i in range(24):
        visits_by_hour[i] = Visit.query.filter_by(hour=i).count()
        
    return jsonify({
        'total_visits': total_visits,
        'unique_visits': unique_visits,
        'visits_by_day_of_week': visits_by_day_of_week,
        'visits_by_hour': visits_by_hour
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=3002, debug=True)
