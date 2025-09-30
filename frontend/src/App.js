// src/App.js
import React, { useState, useEffect } from 'react';
import Frame1 from './components/Frame1';
import Frame2 from './components/Frame2';
import Frame3 from './components/Frame3';
import Frame4 from './components/Frame4';
import Frame6 from './components/Frame6';
import axios from 'axios';

export default function App() {
  const [page, setPage] = useState('frame1');
  const [sdkReady, setSdkReady] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Kakao SDK 로드
  useEffect(() => {
    const KAKAO_JS_KEY = process.env.REACT_APP_KAKAO_JS_KEY;

    if (!window.Kakao) {
      const script = document.createElement('script');
      script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
      script.onload = () => {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_JS_KEY);
        }
        setSdkReady(true);
      };
      document.head.appendChild(script);
    } else {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JS_KEY);
      }
      setSdkReady(true);
    }
  }, []);

  // ✅ 로그인
  const handleLogin = () => {
    window.Kakao.Auth.login({
      scope: 'profile_nickname,account_email',
      success: ({ access_token }) => {
        axios
          .post('http://localhost:5000/auth/kakao', { access_token })
          .then(res => {
            console.log("✅ 로그인 성공, 유저 정보:", res.data);
            setUser(res.data);
            setPage('frame2');
          })
          .catch(err => {
            console.error("❌ 카카오 로그인 실패", err);
            alert("카카오 로그인 실패");
          });
      },
      fail: console.error,
    });
  };

  // ✅ 선호 저장
  const handleSelectPrefs = (prefsArray) => {
    if (!user || !user.user_id) {
      console.error("❌ 유저 정보 없음, 선호 저장 불가");
      return;
    }

    axios
      .post('http://localhost:5000/signup/preferences', {
        user_id: user.user_id,
        prefs: prefsArray,
      })
      .then(() => {
        setPage('frame3');
      });
  };

  // ✅ 버튼 핸들러
  const handleRecommend = () => {
    console.log("👉 추천 버튼 클릭됨, frame4로 이동");
    setPage('frame4');
  };
  const handleMap = () => {
    setPage('frame6');
  };

  // ✅ 화면 분기
  switch (page) {
    case 'frame1':
      return <Frame1 sdkReady={sdkReady} onLogin={handleLogin} />;
    case 'frame2':
      return <Frame2 userId={user?.user_id} onSelect={handleSelectPrefs} />;
    case 'frame3':
      return <Frame3 onRecommend={handleRecommend} onMap={handleMap} />;
    case 'frame4':
      return <Frame4 userId={user?.user_id} />;
    case 'frame6':
      return <Frame6 />;
    default:
      return null;
  }
}
