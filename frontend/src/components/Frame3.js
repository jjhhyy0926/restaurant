// src/components/Frame3.js
import React from 'react';
import './Frame3.css';
  
import homeIcon  from '../assets/home.png';
import userIcon  from '../assets/user.png';
import plateIcon from '../assets/plate.png';
import pinIcon   from '../assets/pin.png';
  
export default function Frame3({ onRecommend, onMap }) {
  return (
    <div className="frame3">
      {/* 상단 홈/유저 아이콘 */}
      <img
        src={homeIcon}
        alt="home"
        className="frame3__icon frame3__icon--home"
        onClick={onRecommend}
      />
      <img
        src={userIcon}
        alt="user"
        className="frame3__icon frame3__icon--user"
      />
  
      {/* 식당 추천 받기 버튼 */}
      <button
        className="frame3__btn frame3__btn--recommend"
        onClick={onRecommend}
      >
        <img src={plateIcon} alt="recommend" className="frame3__btn-icon" />
        <span className="frame3__btn-label">식당 추천 받기</span>
      </button>
  
      {/* 지도 보기 버튼 */}
      <button
        className="frame3__btn frame3__btn--map"
        onClick={onMap}
      >
        <img src={pinIcon} alt="map" className="frame3__btn-icon" />
        <span className="frame3__btn-label">지도 보기</span>
      </button>
    </div>
  );
}