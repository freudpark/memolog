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

  async function login() {
    const userName = name.trim();
    if (!userName) return alert('이름을 입력하세요');

    // DB 화이트리스트 검증
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('name', userName)
      .single();

    if (error || !data) {
      alert('등록된 사용자만 로그인 가능합니다.');
      return;
    }

    localStorage.setItem('name', userName);
    setLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem('name');
    setLoggedIn(false);
  }

  if (!loggedIn) {
    return (
      <div className="login-wrap">
        <img src="/goe.png" className="login-logo" alt="경기도교육청 로고" />
        <div className="login-box">
          <h2>일일업무 로그인</h2>
          <input
            className="login-input"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="login-btn" onClick={login}>로그인</button>
        </div>
        <img src="/itcen.png" className="login-footer-logo" alt="아이티센 로고" />
      </div>
    );
  }

  // 기준일: 오늘 (이동 버튼은 테이블 하단에서 제어)
  const baseDate = yyyymmdd(new Date());

  return (
    <div className="wrap">
      <DailyTable name={name} baseDate={baseDate} />
      <div className="logout-box" style={{ textAlign: 'right', marginTop: 12 }}>
        <button onClick={logout}>로그아웃</button>
      </div>
    </div>
  );
}
