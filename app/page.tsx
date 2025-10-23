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

  async function login(e?: React.FormEvent) {
    if (e) e.preventDefault(); // 엔터 시 리프레시 방지

    const userName = name.trim();
    if (!userName) {
      alert('이름을 입력하세요');
      return;
    }

    // DB에서 사용자 존재 여부 확인
    const { data, error } = await supabase
      .from('users')
      .select('name')
      .eq('name', userName)
      .maybeSingle(); // 값 없으면 null 반환

    if (!data || error) {
      alert('사용자가 등록되지 않았습니다.');
      return;
    }

    // 로그인 성공
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

          <form onSubmit={login}>
            <input
              className="login-input"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="login-btn">로그인</button>
          </form>
        </div>
        <img src="/itcen.png" className="login-footer-logo" alt="아이티센 로고" />
      </div>
    );
  }

  // 기준일: 오늘 (테이블 내부에서 이동 제어)
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
