import React from 'react';
import './Frame1.css';
import checkIcon from '../assets/check.png';
  
export default function Frame1({ sdkReady, onLogin }) {
  return (
    <div className="frame1">
      <img src={checkIcon} alt="check" className="frame1__check" />
  
      <h1 className="frame1__title">
        오늘의<br />Choice!
      </h1>
  
      <p className="frame1__subtext">
        가입하고 식당 추천 받기
      </p>
  
      <div className="frame1__line frame1__line--left" />
      <div className="frame1__line frame1__line--right" />
  
      <button
        className="frame1__btn"
        disabled={!sdkReady}
        onClick={() => {
          console.log('▶ button onClick fired, sdkReady=', sdkReady);
          onLogin();
        }}
      >
        카카오톡으로 로그인
      </button>
    </div>
  );
}