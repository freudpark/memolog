'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { WORK_TYPES, type WorkType, MEETING_TYPE } from '@/utils/workTypes';

interface Props {
  name: string;
  baseDate: string;
}

type RowState = {
  [key in WorkType]: { today: string; tomorrow: string };
};

function shift(yyMMdd: string, deltaDays: number) {
  const y = Number('20' + yyMMdd.slice(0, 2));
  const m = Number(yyMMdd.slice(2, 4)) - 1;
  const d = Number(yyMMdd.slice(4, 6));
  const dt = new Date(y, m, d);
  dt.setDate(dt.getDate() + deltaDays);
  const yy = dt.getFullYear().toString().slice(-2);
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

export default function DailyTable({ name, baseDate }: Props) {
  const [currentDate, setCurrentDate] = useState(baseDate);
  const [rows, setRows] = useState<RowState>(() => {
    const init: any = {};
    WORK_TYPES.forEach((w) => (init[w] = { today: '', tomorrow: '' }));
    return init as RowState;
  });
  const [meeting, setMeeting] = useState({ today: '', tomorrow: '' });

  const label = useMemo(() => {
    const dt = new Date(
      Number('20' + currentDate.slice(0, 2)),
      Number(currentDate.slice(2, 4)) - 1,
      Number(currentDate.slice(4, 6))
    );
    return `${dt.getFullYear()}.${dt.getMonth() + 1}.${dt.getDate()}`;
  }, [currentDate]);

  async function loadAll(date: string) {
    const { data } = await supabase.from('memos').select('*').eq('name', name).eq('base_date', date);

    const nextRows: any = {};
    WORK_TYPES.forEach((w) => (nextRows[w] = { today: '', tomorrow: '' }));

    data?.forEach((row) => {
      if (WORK_TYPES.includes(row.work_type)) {
        nextRows[row.work_type] = {
          today: row.today_content || '',
          tomorrow: row.tomorrow_content || '',
        };
      }
      if (row.work_type === MEETING_TYPE) {
        setMeeting({
          today: row.today_content || '',
          tomorrow: row.tomorrow_content || '',
        });
      }
    });

    setRows(nextRows);
  }

  async function saveAll() {
    await Promise.all([
      ...WORK_TYPES.map((w) =>
        supabase.from('memos').upsert({
          name,
          base_date: currentDate,
          work_type: w,
          today_content: rows[w].today,
          tomorrow_content: rows[w].tomorrow,
        })
      ),
      supabase.from('memos').upsert({
        name,
        base_date: currentDate,
        work_type: MEETING_TYPE,
        today_content: meeting.today,
        tomorrow_content: meeting.tomorrow,
      }),
    ]);
    alert('✅ 저장되었습니다');
  }

  useEffect(() => { loadAll(currentDate); }, [currentDate]);

  return (
    <>
      <h1 className="main-title">정보자원통합 일일현황</h1>
      <div className="date-label-main">오늘 날짜 : {label}</div>

      <div className="sheet">
        <div className="sheet-header">
          <div>업무분야</div>
          <div>오늘</div>
          <div>내일</div>
        </div>

        {WORK_TYPES.map((w) => (
          <div className="sheet-row" key={w}>
            <div className="c-area">{w}</div>
            <textarea
              className="ta"
              value={rows[w].today}
              onChange={(e) =>
                setRows((p) => ({ ...p, [w]: { ...p[w], today: e.target.value } }))
              }
            />
            <textarea
              className="ta"
              value={rows[w].tomorrow}
              onChange={(e) =>
                setRows((p) => ({ ...p, [w]: { ...p[w], tomorrow: e.target.value } }))
              }
            />
          </div>
        ))}
      </div>

      <div className="meeting">
        <div className="meeting-head">회의/협의 일정</div>
        <div className="meeting-grid">
          <textarea
            className="ta"
            value={meeting.today}
            onChange={(e) => setMeeting((p) => ({ ...p, today: e.target.value }))}
          />
          <textarea
            className="ta"
            value={meeting.tomorrow}
            onChange={(e) => setMeeting((p) => ({ ...p, tomorrow: e.target.value }))}
          />
        </div>
      </div>

      <div className="nav-wrap">
        <button className="nav-btn" onClick={() => setCurrentDate((d) => shift(d, -1))}>◀ 이전</button>
        <button className="nav-btn" onClick={() => setCurrentDate((d) => shift(d, +1))}>다음 ▶</button>
      </div>

      <div className="save-wrap">
        <button className="save-btn-small" onClick={saveAll}>저장</button>
      </div>

      <div className="viewer">조회자 : {name}</div>
    </>
  );
}
