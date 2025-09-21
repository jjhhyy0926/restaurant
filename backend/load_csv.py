# backend/load_csv.py
import csv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Restaurant
import os
from dotenv import load_dotenv

load_dotenv()

# DB 연결
DB_URL = os.getenv("DATABASE_URL")
engine = create_engine(DB_URL)
Session = sessionmaker(bind=engine)
session = Session()

# 기존 데이터 삭제 (원할 경우만)
session.query(Restaurant).delete()

# CSV 파일 경로
CSV_PATH = "data/restaurants.csv"  # 파일명과 경로 확인
with open(CSV_PATH, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        restaurant = Restaurant(
            name=row["name"],
            address=row["address"],
            category=row["category"],
            lat=float(row["lat"]),
            lng=float(row["lng"])
        )
        session.add(restaurant)

session.commit()
print("✅ 데이터 삽입 완료!")
