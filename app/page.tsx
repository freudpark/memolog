'use client';
import { useState } from 'react';
import DailyTable from '@/components/DailyTable';

function yyyymmdd(date: Date) {
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export default function Page() {
  const [name, setName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const today = new Date();
  const baseDate = yyyymmdd(today);
  const fullDate = today.toLocaleDateString();

  // ✅ 인증 없이 로그인
  function login(e?: React.FormEvent) {
    if (e) e.preventDefault();

    const userName = name.trim();
    if (!userName) {
      alert('이름을 입력하세요');
      return;
    }

    localStorage.setItem('name', userName);
    setLoggedIn(true);
  }

  // ✅ 로그아웃
  function logout() {
    localStorage.removeItem('name');
    setLoggedIn(false);
  }

  // ✅ 로그인 화면
  if (!loggedIn) {
    return (
      <div className="login-wrap">
        <img src="/goe.png" className="login-logo" alt="경기도교육청 로고" />
        <div className="login-box">
          <h2>일일업무 로그인</h2>
          <div style={{ fontSize: '13px', color: '#555', marginBottom: '8px' }}>
            기준일자 : {fullDate} (YYMMDD: {baseDate})
          </div>

          <form onSubmit={login}>
            <input
              className="login-input"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="login-btn">
              로그인
            </button>
          </form>
        </div>
        <img src="/itcen.png" className="login-footer-logo" alt="아이티센 로고" />
      </div>
    );
  }

  // ✅ 메인 화면
  return (
    <div className="wrap">
      <DailyTable name={name} baseDate={baseDate} />
      <div style={{ textAlign: 'right', marginTop: 12 }}>
        <button onClick={logout}>로그아웃</button>
      </div>
    </div>
  );
}
