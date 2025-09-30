# backend/load_data.py
import sqlite3
import pandas as pd
from models import Base, Restaurant
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 1. CSV 불러오기
df = pd.read_csv("../frontend/public/categorized_restaurants.csv")  # 경로 확인 필요

# 2. DB 연결
engine = create_engine("sqlite:///restaurant.db")
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# 3. 기존 데이터 삭제 (중복 방지)
session.query(Restaurant).delete()

# 4. CSV → DB 저장
for _, row in df.iterrows():
    r = Restaurant(
        name=row["name"],
        category=row["category"],
        lat=row["lat"],
        lng=row["lng"]
    )
    session.add(r)

session.commit()
session.close()

print("✅ CSV 데이터를 restaurant.db에 저장 완료!")
