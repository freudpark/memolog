'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { WORK_TYPES, type WorkType, MEETING_TYPE } from '@/utils/workTypes';

interface Props {
  name: string;
  baseDate: string; // YYMMDD
}

type RowState = {
  [key in WorkType]: { today: string; tomorrow: string; savedAt?: string | null };
};

export default function DailyTable({ name, baseDate }: Props) {
  const [rows, setRows] = useState<RowState>(() => {
    const init: any = {};
    WORK_TYPES.forEach((w) => (init[w] = { today: '', tomorrow: '' }));
    return init as RowState;
  });
  const [meeting, setMeeting] = useState<{ today: string; tomorrow: string; savedAt?: string | null }>({ today: '', tomorrow: '' });
  const [loading, setLoading] = useState(false);

  async function loadAll() {
    setLoading(true);

    // 업무영역 데이터
    const { data: data1 } = await supabase
      .from('memos')
      .select('*')
      .eq('name', name)
      .eq('base_date', baseDate);

    const nextRows: any = {};
    WORK_TYPES.forEach((w) => (nextRows[w] = { today: '', tomorrow: '' }));

    data1?.forEach((row) => {
      if (WORK_TYPES.includes(row.work_type)) {
        nextRows[row.work_type] = {
          today: row.today_content || '',
          tomorrow: row.tomorrow_content || '',
          savedAt: row.updated_at || null,
        };
      }
    });

    setRows(nextRows as RowState);

    // 회의/협의 일정 (별도 1행)
    const { data: meetRow } = await supabase
      .from('memos')
      .select('*')
      .eq('name', name)
      .eq('base_date', baseDate)
      .eq('work_type', MEETING_TYPE)
      .maybeSingle();

    setMeeting({
      today: meetRow?.today_content || '',
      tomorrow: meetRow?.tomorrow_content || '',
      savedAt: meetRow?.updated_at || null,
    });

    setLoading(false);
  }

  async function saveRow(workType: WorkType) {
    const r = rows[workType];
    const { data } = await supabase
      .from('memos')
      .upsert(
        {
          name,
          base_date: baseDate,
          work_type: workType,
          today_content: r.today,
          tomorrow_content: r.tomorrow,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'name,base_date,work_type' }
      )
      .select()
      .maybeSingle();

    setRows((prev) => ({
      ...prev,
      [workType]: {
        ...prev[workType],
        savedAt: data?.updated_at || new Date().toISOString(),
      },
    }));
  }

  async function saveMeeting() {
    const { data } = await supabase
      .from('memos')
      .upsert(
        {
          name,
          base_date: baseDate,
          work_type: MEETING_TYPE,
          today_content: meeting.today,
          tomorrow_content: meeting.tomorrow,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'name,base_date,work_type' }
      )
      .select()
      .maybeSingle();

    setMeeting((prev) => ({ ...prev, savedAt: data?.updated_at || new Date().toISOString() }));
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                value={rows[w].today}
                onChange={(e) => setRows((prev) => ({ ...prev, [w]: { ...prev[w], today: e.target.value } }))}
                className="ta"
                placeholder="오늘 업무 메모"
              />
            </div>
            <div className="c-day">
              <textarea
                value={rows[w].tomorrow}
                onChange={(e) => setRows((prev) => ({ ...prev, [w]: { ...prev[w], tomorrow: e.target.value } }))}
                className="ta"
                placeholder="내일 업무 메모"
              />
            </div>
            <div className="c-actions">
              <button className="btn" onClick={() => saveRow(w)} disabled={loading}>저장</button>
              {rows[w].savedAt && <div className="stamp">저장: {new Date(rows[w].savedAt!).toLocaleString()}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="meeting">
        <div className="meeting-head">회의/협의 일정</div>
        <div className="meeting-grid">
          <div>
            <label className="lb">오늘</label>
            <textarea className="ta" value={meeting.today} onChange={(e) => setMeeting((p) => ({ ...p, today: e.target.value }))} placeholder="회의/협의(오늘)" />
          </div>
          <div>
            <label className="lb">내일</label>
            <textarea className="ta" value={meeting.tomorrow} onChange={(e) => setMeeting((p) => ({ ...p, tomorrow: e.target.value }))} placeholder="회의/협의(내일)" />
          </div>
          <div className="c-actions">
            <button className="btn" onClick={saveMeeting} disabled={loading}>회의/협의 저장</button>
            {meeting.savedAt && <div className="stamp">저장: {new Date(meeting.savedAt!).toLocaleString()}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
