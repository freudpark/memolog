'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { WORK_TYPES, type WorkType, MEETING_TYPE } from '@/utils/workTypes';

interface Props {
  name: string;
  baseDate: string;
}

type RowState = {
  [key in WorkType]: { today: string; tomorrow: string };
};

export default function DailyTable({ name, baseDate }: Props) {
  const [rows, setRows] = useState<RowState>(() => {
    const init: any = {};
    WORK_TYPES.forEach((w) => (init[w] = { today: '', tomorrow: '' }));
    return init as RowState;
  });

  const [meeting, setMeeting] = useState({ today: '', tomorrow: '' });

  async function loadAll() {
    const { data } = await supabase
      .from('memos')
      .select('*')
      .eq('name', name)
      .eq('base_date', baseDate);

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
        setMeeting({ today: row.today_content || '', tomorrow: row.tomorrow_content || '' });
      }
    });

    setRows(nextRows);
  }

  async function saveAll() {
    await Promise.all([
      ...WORK_TYPES.map((w) =>
        supabase.from('memos').upsert({
          name,
          base_date: baseDate,
          work_type: w,
          today_content: rows[w].today,
          tomorrow_content: rows[w].tomorrow,
        })
      ),
      supabase.from('memos').upsert({
        name,
        base_date: baseDate,
        work_type: MEETING_TYPE,
        today_content: meeting.today,
        tomorrow_content: meeting.tomorrow,
      }),
    ]);
    alert('✅ 전체 저장 완료');
  }

  useEffect(() => {
    loadAll();
  }, [name, baseDate]);

  return (
    <>
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
              <textarea
                className="ta"
                value={rows[w].today}
                onChange={(e) => setRows((p) => ({ ...p, [w]: { ...p[w], today: e.target.value } }))}
              />
            </div>
            <div className="c-day">
              <textarea
                className="ta"
                value={rows[w].tomorrow}
                onChange={(e) => setRows((p) => ({ ...p, [w]: { ...p[w], tomorrow: e.target.value } }))}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 회의/협의 (M1) */}
      <div className="meeting">
        <div className="meeting-head">회의/협의 일정</div>
        <div className="meeting-grid">
          <div>
            <label className="lb">오늘</label>
            <textarea className="ta" value={meeting.today} onChange={(e) => setMeeting((p) => ({ ...p, today: e.target.value }))} />
          </div>
          <div>
            <label className="lb">내일</label>
            <textarea className="ta" value={meeting.tomorrow} onChange={(e) => setMeeting((p) => ({ ...p, tomorrow: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* 전체 저장 버튼 */}
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <button className="btn" onClick={saveAll}>전체 저장</button>
      </div>
    </>
  );
}
