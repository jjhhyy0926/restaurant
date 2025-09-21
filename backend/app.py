from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User, Restaurant, Pref
from kakao import get_kakao_user
import os

app = Flask(__name__)
CORS(app)

# 데이터베이스 연결
engine = create_engine("sqlite:///restaurant.db")
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)

@app.route("/")
def home():
    return "Hello, Restaurant App!"

@app.route("/auth/kakao", methods=["POST"])
def kakao_auth():
    access_token = request.json.get("access_token")
    if not access_token:
        return jsonify({"error": "No access token"}), 400

    kakao_user_info = get_kakao_user(access_token)
    if not kakao_user_info:
        return jsonify({"error": "Failed to get user info from Kakao"}), 401

    kakao_id = str(kakao_user_info.get("id"))
    name = kakao_user_info.get("properties", {}).get("nickname")

    session = Session()
    user = session.query(User).filter_by(kakao_id=kakao_id).first()

    if not user:
        new_user = User(kakao_id=kakao_id, name=name)
        session.add(new_user)
        session.commit()
        user = new_user

    return jsonify({
        "user_id": user.id,
        "name": user.name
    })

@app.route("/signup/preferences", methods=["POST"])
def save_preferences():
    user_id = request.json.get("user_id")
    prefs_names = request.json.get("prefs")

    session = Session()
    user = session.query(User).get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.prefs.clear()

    for pref_name in prefs_names:
        pref = session.query(Pref).filter_by(name=pref_name).first()
        if not pref:
            pref = Pref(name=pref_name)
            session.add(pref)
            session.commit()
        user.prefs.append(pref)

    session.commit()
    return jsonify({"message": "Preferences saved successfully"}), 200

@app.route("/recommend", methods=["GET"])
def recommend():
    user_id = int(request.args.get("user_id", 0))
    lat = float(request.args.get("lat", 0))
    lng = float(request.args.get("lng", 0))

    session = Session()
    user = session.query(User).get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    preferred_categories = [p.name for p in user.prefs]

    qs = session.query(Restaurant).filter(
        Restaurant.category.in_(preferred_categories)
    )

    restaurants = [
        (((r.lat - lat) ** 2 + (r.lng - lng) ** 2) ** 0.5, r)
        for r in qs
    ]
    restaurants.sort(key=lambda x: x[0])

    result = [
        {"name": r.name, "category": r.category, "lat": r.lat, "lng": r.lng}
        for _, r in restaurants[:10]
    ]

    return jsonify(result)

@app.route("/user/<int:user_id>")
def get_user(user_id):
    session = Session()
    user = session.query(User).get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "prefs": [p.name for p in user.prefs]
    })

if __name__ == "__main__":
    app.run(debug=True)