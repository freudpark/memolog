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

function shiftYYMMDD(yyMMdd: string, deltaDays: number) {
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

  const currentDateLabel = useMemo(() => {
    const dt = new Date(
      Number('20' + currentDate.slice(0, 2)),
      Number(currentDate.slice(2, 4)) - 1,
      Number(currentDate.slice(4, 6))
    );
    return dt.getFullYear() + '.' + (dt.getMonth() + 1) + '.' + dt.getDate();
  }, [currentDate]);

  async function loadAll(targetDate: string) {
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .eq('name', name)
      .eq('base_date', targetDate);

    const nextRows: any = {};
    WORK_TYPES.forEach((w) => (nextRows[w] = { today: '', tomorrow: '' }));

    if (!error && data) {
      data.forEach((row) => {
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
    }
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

  useEffect(() => {
    setCurrentDate(baseDate);
  }, [baseDate]);

  useEffect(() => {
    loadAll(currentDate);
  }, [name, currentDate]);

  return (
    <>
      {/* 상단 로고 (3배 확대, 중앙정렬) */}
      <div className="logo-wrap">
        <img src="/goe.png" className="goe-main-logo" alt="경기도교육청 로고" />
      </div>

      {/* 제목 */}
      <h1 className="title-center">정보자원통합 일일현황</h1>

      {/* 날짜 (중앙 정렬, 2배, bold) */}
      <div className="date-strong">오늘날짜 : {currentDateLabel}</div>

      {/* 테이블 */}
      <div className="sheet">
        <div className="sheet-header">
          <div className="c-area">업무분야</div>
          <div className="c-day">오늘</div>
          <div className="c-day">내일</div>
        </div>

        {WORK_TYPES.map((w) => (
          <div className="sheet-row" key={w}>
            <div className="c-area"><strong>{w}</strong></div>

            <div className="c-day">
              <div className="cell-label">오늘</div>
              <textarea
                className="ta"
                value={rows[w].today}
                onChange={(e) =>
                  setRows((p) => ({ ...p, [w]: { ...p[w], today: e.target.value } }))
                }
              />
            </div>

            <div className="c-day">
              <div className="cell-label">내일</div>
              <textarea
                className="ta"
                value={rows[w].tomorrow}
                onChange={(e) =>
                  setRows((p) => ({ ...p, [w]: { ...p[w], tomorrow: e.target.value } }))
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* 회의/협의 */}
      <div className="meeting">
        <div className="meeting-head">회의/협의 일정</div>
        <div className="meeting-grid">
          <div>
            <label className="lb">오늘</label>
            <textarea
              className="ta"
              value={meeting.today}
              onChange={(e) => setMeeting((p) => ({ ...p, today: e.target.value }))}
            />
          </div>
          <div>
            <label className="lb">내일</label>
            <textarea
              className="ta"
              value={meeting.tomorrow}
              onChange={(e) => setMeeting((p) => ({ ...p, tomorrow: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* 날짜 이동 버튼 */}
      <div className="nav-wrap">
        <button
          className="nav-btn prev"
          onClick={() => setCurrentDate((d) => shiftYYMMDD(d, -1))}
        >
          ◀ 이전
        </button>
        <button
          className="nav-btn next"
          onClick={() => setCurrentDate((d) => shiftYYMMDD(d, +1))}
        >
          다음 ▶
        </button>
      </div>

      {/* 저장 버튼 (크기 1/2로 축소) */}
      <div className="save-wrap">
        <button className="save-btn-small" onClick={saveAll}>저장</button>
      </div>

      <div className="viewer">조회자 : {name}</div>
    </>
  );
}
