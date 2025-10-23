'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
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
  const baseDate = yyyymmdd(new Date());

  async function login() {
    if (!name.trim()) return alert('이름을 입력하세요');

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('name', name.trim())
      .single();

    if (!data) {
      alert('등록된 사용자만 로그인 가능합니다.');
      return;
    }

    localStorage.setItem('name', name.trim());
    setLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem('name');
    setLoggedIn(false);
  }

  if (!loggedIn) {
    return (
      <div className="login-wrap">
        <div className="login-box">
          <h2>업무일지 로그인</h2>
          <input
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={login}>로그인</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <DailyTable name={name} baseDate={baseDate} />
      <div className="logout-box">
        <button onClick={logout}>로그아웃</button>
      </div>
    </div>
  );
}
