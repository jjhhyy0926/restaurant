// src/components/Frame4.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Frame4({ userId }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // 1. 위치 정보 요청
    if (!navigator.geolocation) {
      setLocationError('이 브라우저에서는 위치 정보를 지원하지 않아요.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // 2. 백엔드 추천 API 요청
          const res = await axios.get('http://localhost:5000/recommend', {
            params: {
              user_id: userId,
              lat: latitude,
              lng: longitude
            }
          });
          setRestaurants(res.data);
        } catch (err) {
          setLocationError('추천 요청에 실패했어요.');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLocationError('위치 정보를 가져오지 못했어요.');
        setLoading(false);
      }
    );
  }, [userId]);

  if (loading) return <div>📡 식당을 추천 중이에요...</div>;
  if (locationError) return <div>🚫 오류: {locationError}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>🍽️ 추천 식당 리스트</h2>
      {restaurants.length === 0 ? (
        <p>추천된 식당이 없어요 😥</p>
      ) : (
        <ul>
          {restaurants.map((r, i) => (
            <li key={i}>
              <strong>{r.name}</strong> - {r.category}
              <br />
              📍 위치: ({r.lat.toFixed(5)}, {r.lng.toFixed(5)})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
