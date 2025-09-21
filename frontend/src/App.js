// src/App.js
import React, { useState, useEffect } from 'react';
import Frame1 from './components/Frame1';
import Frame2 from './components/Frame2';
import Frame3 from './components/Frame3'; 
import Frame4 from './components/Frame4';  

import axios from 'axios';
console.log('▶ Frame3 is →', Frame3);
export default function App() {
  const [page, setPage] = useState('frame1');
  const [sdkReady, setSdkReady] = useState(false);
  const [user, setUser] = useState(null);

  // 1) 카카오 SDK 로드
  useEffect(() => {
    if (!window.Kakao) {
      const script = document.createElement('script');
      script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
      script.onload = () => {
        window.Kakao.init(process.env.REACT_APP_KAKAO_JS_KEY);
        setSdkReady(true);
      };
      document.head.appendChild(script);
    } else {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.REACT_APP_KAKAO_JS_KEY);
      }
      setSdkReady(true);
    }
  }, []);

  // 2) 로그인
  const handleLogin = () => {
    window.Kakao.Auth.login({
      scope: 'profile_nickname,account_email',
      success: ({ access_token }) => {
        axios
          .post('http://localhost:5000/auth/kakao', { access_token })
          .then(res => {
            setUser(res.data);
            setPage('frame2');
          });
      },
      fail: console.error
    });
  };

  // 3) 선호 저장
  const handleSelectPrefs = (prefsArray) => {
    axios
      .post('http://localhost:5000/signup/preferences', {
        user_id: user.user_id,
        prefs: prefsArray
      })
      .then(() => {
        setPage('frame3');
      });
  };

  // 4) Frame3 버튼
  const handleRecommend = () => setPage('frame4');
  const handleMap       = () => setPage('frame6');

  // 5) 화면 분기
  if (!sdkReady) return <div>잠시만요…</div>;

  switch (page) {
    case 'frame1':
      return <Frame1 sdkReady={sdkReady} onLogin={handleLogin} />;
    case 'frame2':
      return <Frame2 userId={user.user_id} onSelect={handleSelectPrefs} />;
    case 'frame3':
      return <Frame3 onRecommend={handleRecommend} onMap={handleMap} />;
    case 'frame4':
      return <Frame4 userId={user.user_id} />;
    case 'frame6':
      return <div>🗺️ Frame6: 지도 보기 구현 예정</div>;
    default:
      return null;
  }
}
