import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Frame1.css";

const Frame1 = () => {
  const navigate = useNavigate();

  const kakaoLogin = () => {
    const { Kakao } = window;
    if (!Kakao.isInitialized()) {
      Kakao.init("YOUR_KAKAO_JAVASCRIPT_KEY"); // 실제 JS 키로 변경 필요
    }

    Kakao.Auth.login({
      success: function (authObj) {
        const access_token = authObj.access_token;

        // 🔽 절대 경로로 변경하여 Network Error 방지
        axios.post("http://localhost:5000/auth/kakao", { access_token })
          .then((res) => {
            const { user_id, name } = res.data;
            localStorage.setItem("user_id", user_id);
            localStorage.setItem("name", name);
            navigate("/frame2");
          })
          .catch((err) => {
            console.error("카카오 로그인 실패", err);
            alert("카카오 로그인 실패");
          });
      },
      fail: function (err) {
        console.error("카카오 로그인 에러", err);
        alert("카카오 로그인 실패");
      },
    });
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="frame1">
      <h1>오늘의 식당 추천!</h1>
      <button className="kakao-login-btn" onClick={kakaoLogin}>
        카카오로 로그인
      </button>
    </div>
  );
};

export default Frame1;
