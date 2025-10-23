'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

function yyyymmdd(date: Date) {
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export default function Page() {
  const [name, setName] = useState('');
  const today = new Date();
  const todayLabel = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;
  const loginDate = yyyymmdd(today);

  async function handleLogin() {
    if (!name.trim()) return alert('이름을 입력하세요.');

    await supabase.from('login_users').insert({
      name,
      login_date: loginDate,
    });

    localStorage.setItem('name', name);
    localStorage.setItem('baseDate', loginDate);
    window.location.reload();
  }

  return (
    <div className="login-wrap">

      {/* 상단 로고 */}
      <img src="/goe.png" alt="경기도교육청" className="login-top-logo" />

      {/* 제목 */}
      <h1 className="login-title">일일업무 로그인</h1>

      {/* 오늘 날짜 */}
      <div className="login-date">오늘 날짜 : {todayLabel}</div>

      {/* 입력창 */}
      <input
        className="login-input"
        placeholder="이름을 입력하세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
      />

      {/* 버튼 */}
      <button className="login-btn" onClick={handleLogin}>로그인</button>

      {/* 하단 로고 */}
      <img src="/itcen.png" alt="ITCEN" className="login-bottom-logo" />
    </div>
  );
}
