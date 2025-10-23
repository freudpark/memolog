'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DailyTable from '@/components/DailyTable';

function yyyymmdd(date: Date) {
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export default function Page() {
  const today = new Date();
  const todayLabel = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;
  const todayYYMMDD = yyyymmdd(today);

  const [name, setName] = useState('');
  const [baseDate, setBaseDate] = useState(todayYYMMDD);
  const [logged, setLogged] = useState(false);

  async function login() {
    if (!name.trim()) return alert('이름을 입력하세요.');

    // 로그인 기록 저장
    await supabase.from('login_users').insert({ name, login_date: todayYYMMDD });

    localStorage.setItem('name', name);
    localStorage.setItem('baseDate', todayYYMMDD);
    setLogged(true);
  }

  useEffect(() => {
    const n = localStorage.getItem('name');
    const d = localStorage.getItem('baseDate');
    if (n && d) {
      setName(n);
      setBaseDate(d);
      setLogged(true);
    }
  }, []);

  function logout() {
    localStorage.clear();
    setLogged(false);
  }

  if (!logged) {
    return (
      <div className="login-wrap">
        <img src="/goe.png" className="login-top-logo" />
        <h1 className="login-title">일일 업무 로그인</h1>
        <div className="login-date">오늘 날짜 : {todayLabel}</div>

        <input
          className="login-input"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()}
        />
        <button className="login-btn" onClick={login}>로그인</button>

        <img src="/itcen.png" className="login-bottom-logo" />
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="topbar">
        <button className="logout-btn" onClick={logout}>로그아웃</button>
      </div>

      <DailyTable name={name} baseDate={baseDate} />
    </div>
  );
}
