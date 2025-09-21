import React, { useState } from 'react';
import axios from 'axios';

const CATEGORIES = ['한식', '양식', '중식', '일식'];

const Preferences = ({ user, onDone }) => {
  const [selects, setSelects] = useState([]);

  const toggle = cat =>
    setSelects(prev =>
      prev.includes(cat) ? prev.filter(x => x !== cat) : [...prev, cat]
    );

  const submit = () => {
    axios
      .post('http://localhost:5000/signup/preferences', {
        user_id: user.user_id,
        prefs: selects
      })
      .then(() => onDone())
      .catch(err => {
        console.error(err);
        alert('선호도 저장 중 오류가 발생했습니다.');
      });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>선호하는 음식 카테고리를 선택하세요</h2>
      {CATEGORIES.map(cat => (
        <label key={cat} style={{ display: 'block', margin: '0.5rem 0' }}>
          <input
            type="checkbox"
            checked={selects.includes(cat)}
            onChange={() => toggle(cat)}
          />{' '}
          {cat}
        </label>
      ))}
      <button
        onClick={submit}
        disabled={selects.length === 0}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          cursor: selects.length === 0 ? 'not-allowed' : 'pointer'
        }}
      >
        저장 후 다음
      </button>
    </div>
  );
};

export default Preferences;
