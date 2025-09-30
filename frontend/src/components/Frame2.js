// src/components/Frame2.js
import React, { useState } from 'react';
import './Frame2.css';
  
import homeIcon  from '../assets/home.png';
import userIcon  from '../assets/user.png';
import checkIcon from '../assets/check.png';
  
import hansik   from '../assets/hansik.png';
import yangsik  from '../assets/yangsik.png';
import ilsik    from '../assets/ilsik.png';
import jungsik  from '../assets/jungsik.png';
import bunsik   from '../assets/bunsik.png';
import fastfood from '../assets/fastfood.png';
  
const OPTIONS = [
  { name: '한식',      icon: hansik },
  { name: '양식',      icon: yangsik },
  { name: '일식',      icon: ilsik },
  { name: '중식',      icon: jungsik },
  { name: '분식',      icon: bunsik },
  { name: '패스트푸드', icon: fastfood },
];
  
export default function Frame2({ userId, onSelect }) {
  
  const [selected, setSelected] = useState(null);
  
  const handleClick = (opt) => {
    setSelected(opt.name);
    onSelect([opt.name]);
  };
  
  return (
    <div className="frame2">
      {/* 상단 홈/유저 아이콘 */}
      <img src={homeIcon}  alt="home"  className="frame2__icon frame2__icon--home"/>
      <img src={userIcon}  alt="user"  className="frame2__icon frame2__icon--user"/>
  
      {/* 중앙 체크 아이콘 */}
      <img src={checkIcon} alt="check" className="frame2__check" />
  
      {/* 질문 텍스트 */}
      <h2 className="frame2__title">어떤 음식을 선호하나요?</h2>
  
      {/* 2×3 카드 그리드 */}
      <div className="frame2__grid">
        {OPTIONS.map(opt => (
          <div
            key={opt.name}
            className={`frame2__card ${selected === opt.name ? 'selected' : ''}`}
            onClick={() => handleClick(opt)}
          >
            <img src={opt.icon} alt={opt.name} className="frame2__card-icon"/>
            <span className="frame2__card-label">{opt.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}