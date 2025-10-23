'use client';
import { useEffect, useMemo, useState } from 'react';
import DailyTable from '@/components/DailyTable';

function yyyymmdd(date: Date) {
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export default function Page() {
  const [name, setName] = useState('');
  const [baseDate, setBaseDate] = useState(''); // YYMMDD
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const n = localStorage.getItem('memolog:name');
    const d = localStorage.getItem('memolog:baseDate');
    if (n) setName(n);
    if (d) setBaseDate(d);
    if (n && d) setLoggedIn(true);
  }, []);

  const fullDate = useMemo(() => {
    if (!/^\d{6}$/.test(baseDate)) return '';
    const dt = new Date(Number('20' + baseDate.slice(0, 2)), Number(baseDate.slice(2, 4)) - 1, Number(baseDate.slice(4, 6)));
    return dt.toLocaleDateString();
  }, [baseDate]);

  function handleLogin() {
    if (!name.trim()) return alert('이름을 입력하세요');
    if (!/^\d{6}$/.test(baseDate)) return alert('날짜는 YYMMDD 형식입니다. 예: ' + yyyymmdd(new Date()));
    localStorage.setItem('memolog:name', name.trim());
    localStorage.setItem('memolog:baseDate', baseDate);
    setLoggedIn(true);
  }
  function handleLogout() { setLoggedIn(false); }

  return (
    <div className="container">
      {!loggedIn ? (
        <div className="login-wrap">
          <div className="card">
            <h2>정보자원통합 · 일일 업무보고</h2>
            <div className="row">
              <div style={{ flex: 1 }}>
                <div className="lb">조회자 성명</div>
                <input className="input" placeholder="성명입력" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="lb">기준일자 (YYMMDD)</div>
                <input className="input" placeholder={yyyymmdd(new Date())} value={baseDate} onChange={(e) => setBaseDate(e.target.value)} />
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:12 }}>
              <button className="btn" onClick={handleLogin}>로그인 / 조회</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 옵션 B: 상단 Summary 박스 */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="row">
              <div style={{ flex:1 }}>
                <div className="lb">사용자</div>
                <div style={{ fontWeight:700 }}>{name}</div>
              </div>
              <div style={{ flex:1 }}>
                <div className="lb">기준일</div>
                <div style={{ fontWeight:700 }}>{fullDate} (YYMMDD: {baseDate})</div>
              </div>
              <div>
                <button className="btn" onClick={handleLogout}>로그아웃</button>
              </div>
            </div>
          </div>

          {/* 하이브리드 모던 테이블 */}
          <DailyTable name={name} baseDate={baseDate} />

          <div className="footer">© 일일 업무 보고 — Vercel + Supabase</div>
        </>
      )}
    </div>
  );
}
