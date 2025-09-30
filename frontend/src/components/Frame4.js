import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Frame4({ userId }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // ✅ 로그 위치 여기!
    console.log("🌟 Frame4 진입됨");
    console.log("📦 전달된 userId:", userId);

    if (!userId) {
      console.warn("❌ userId 없음 → 추천 요청 안 함");
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setLocationError('이 브라우저에서는 위치 정보를 지원하지 않아요.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("📍 현재 위치:", latitude, longitude);

        try {
          const res = await axios.get('http://localhost:5000/recommend', {
            params: {
              user_id: userId,
              lat: latitude,
              lng: longitude
            }
          });
          console.log("📥 추천 결과:", res.data);
          setRestaurants(res.data);
        } catch (err) {
          console.error('❌ 추천 요청 실패:', err);
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
        <p>추천된 식당이 없어요</p>
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
