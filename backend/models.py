# backend/models.py

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Table, ForeignKey
from sqlalchemy.orm import relationship

# 1) Base 선언 (이게 빠지면 ImportError 발생합니다)
Base = declarative_base()

# 2) 사용자⇄선호음식 다대다 매핑 테이블
user_pref = Table(
    'user_pref', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('pref_id', Integer, ForeignKey('prefs.id'), primary_key=True)
)

# 3) User 모델
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    kakao_id = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=True)
    # 다대다 관계 설정
    prefs = relationship('Pref', secondary=user_pref, back_populates='users')

# 4) Pref 모델
class Pref(Base):
    __tablename__ = 'prefs'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    users = relationship('User', secondary=user_pref, back_populates='prefs')

# 5) Restaurant 모델
class Restaurant(Base):
    __tablename__ = 'restaurants'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # e.g. 한식, 일식
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    # 추가로 필요하다면 feature 칼럼들 추가 가능
