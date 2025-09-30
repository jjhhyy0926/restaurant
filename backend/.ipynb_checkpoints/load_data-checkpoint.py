# backend/load_data.py

import sqlite3
import pandas as pd

# 1) CSV 파일 읽기
csv_file = "categorized_restaurants.csv"   # 같은 폴더에 있다고 가정
df = pd.read_csv(csv_file)

print("📂 CSV 미리보기:")
print(df.head())

# 2) DB 연결
conn = sqlite3.connect("restaurant.db")
cursor = conn.cursor()

# 3) restaurants 테이블에 데이터 삽입
for _, row in df.iterrows():
    cursor.execute("""
        INSERT INTO restaurants (name, category, lat, lng)
        VALUES (?, ?, ?, ?)
    """, (row['name'], row['category'], float(row['lat']), float(row['lng'])))

conn.commit()
conn.close()

print("✅ CSV 데이터를 restaurant.db > restaurants 테이블에 저장 완료")
