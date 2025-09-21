from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User, Restaurant, Preference

app = Flask(__name__)
CORS(app)  # CORS 설정: 프론트엔드에서 요청 받을 수 있도록 허용

# 데이터베이스 연결
engine = create_engine("sqlite:///restaurant.db")
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)


# ✔️ 헬로 월드 (테스트용)
@app.route("/")
def home():
    return "Hello, Restaurant App!"


# ✔️ 추천 API
@app.route("/recommend", methods=["GET"])
def recommend():
    user_id = int(request.args.get("user_id", 0))
    lat = float(request.args.get("lat", 0))
    lng = float(request.args.get("lng", 0))

    session = Session()

    user = session.query(User).get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # 유저 선호 카테고리 목록 (['한식', '일식'] 등)
    preferred_categories = [p.name for p in user.prefs]

    # 해당 선호 카테고리에 속한 식당만 필터링
    qs = session.query(Restaurant).filter(
        Restaurant.category.in_(preferred_categories)
    )

    # 거리 기준으로 가까운 순 정렬
    restaurants = [
        (((r.lat - lat) ** 2 + (r.lng - lng) ** 2) ** 0.5, r)
        for r in qs
    ]
    restaurants.sort(key=lambda x: x[0])  # 거리 순 정렬

    # 상위 10개 식당 반환
    result = [
        {"name": r.name, "category": r.category, "lat": r.lat, "lng": r.lng}
        for _, r in restaurants[:10]
    ]

    return jsonify(result)


# ✔️ 유저 확인용 API (디버깅용)
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


# ✔️ 앱 실행
if __name__ == "__main__":
    app.run(debug=True)
