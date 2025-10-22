```tsx
'use client';
import { useEffect, useMemo, useState } from 'react';
import { WORK_TYPES, WorkType } from '@/utils/workTypes';
import WorkCard from '@/components/WorkCard';

function yyyymmddToYYMMDD(date: Date) {
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export default function Page() {
  const [name, setName] = useState('');
  const [baseDate, setBaseDate] = useState(''); // YYMMDD 문자열 입력
  const [loggedIn, setLoggedIn] = useState(false);

  // 최초 접속 시 로컬 저장값 불러오기
  useEffect(() => {
    const n = localStorage.getItem('memolog:name');
    const d = localStorage.getItem('memolog:baseDate');
    if (n) setName(n);
    if (d) setBaseDate(d);
    if (n && d) setLoggedIn(true);
  }, []);

  const todayHuman = useMemo(() => {
    if (!baseDate || baseDate.length !== 6) return '';
    const fullYear = Number('20' + baseDate.slice(0, 2));
    const month = Number(baseDate.slice(2, 4)) - 1;
    const day = Number(baseDate.slice(4, 6));
    const dt = new Date(fullYear, month, day);
    return dt.toLocaleDateString();
  }, [baseDate]);

  function handleLogin() {
    if (!name.trim()) {
      alert('이름을 입력하세요');
      return;
    }
    if (!/^\d{6}$/.test(baseDate)) {
      alert('날짜는 YYMMDD 형식으로 입력하세요 (예: ' + yyyymmddToYYMMDD(new Date()) + ')');
      return;
    }
    localStorage.setItem('memolog:name', name.trim());
    localStorage.setItem('memolog:baseDate', baseDate);
    setLoggedIn(true);
  }

  function handleLogout() {
    setLoggedIn(false);
  }

  return (
    <div className="container">
      <div className="header">
        <h1>오늘/내일 메모 보고</h1>
        {loggedIn && (
          <div className="badge">기준일: {todayHuman} (YYMMDD: {baseDate})</div>
        )}
      </div>

      {!loggedIn ? (
        <div className="rounded-2xl bg-white border p-4">
          <div className="grid gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">이름</label>
              <input className="input" placeholder="예: 홍길동" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">날짜 (YYMMDD)</label>
              <input className="input" placeholder="예: 251022" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} />
            </div>
            <div className="row" style={{ justifyContent: 'flex-end' }}>
              <button onClick={handleLogin} className="px-4 py-2 rounded-xl bg-black text-white">로그인</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-2xl bg-white border p-3 mb-3">
            <div className="row">
              <div className="flex-1">
                <div className="text-sm text-gray-600">사용자</div>
                <div className="font-semibold">{name}</div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">기준일(YYMMDD)</div>
                <div className="font-semibold">{baseDate}</div>
              </div>
              <div>
                <button onClick={handleLogout} className="px-3 py-2 rounded-xl border">로그아웃</button>
              </div>
            </div>
          </div>

          <div className="card-grid">
            {WORK_TYPES.map((w) => (
              <WorkCard key={w} name={name} baseDate={baseDate} workType={w as WorkType} />
            ))}
          </div>

          <div className="footer">© 오늘/내일 메모 보고 — Vercel + Supabase</div>
        </>
      )}
    </div>
  );
}
```
