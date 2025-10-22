```tsx
'use client';
import { useState, useEffect } from 'react';
import type { WorkType } from '@/utils/workTypes';
import { supabase } from '@/lib/supabase';

interface Props {
  name: string;
  baseDate: string; // YYMMDD
  workType: WorkType;
}

export default function WorkCard({ name, baseDate, workType }: Props) {
  const [today, setToday] = useState('');
  const [tomorrow, setTomorrow] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .eq('name', name)
      .eq('base_date', baseDate)
      .eq('work_type', workType)
      .maybeSingle();

    if (!error && data) {
      setToday(data.today_content ?? '');
      setTomorrow(data.tomorrow_content ?? '');
      setSavedAt(data.updated_at ?? null);
    } else {
      setToday('');
      setTomorrow('');
      setSavedAt(null);
    }
    setLoading(false);
  }

  async function save() {
    setLoading(true);
    const { data, error } = await supabase
      .from('memos')
      .upsert(
        {
          name,
          base_date: baseDate,
          work_type: workType,
          today_content: today,
          tomorrow_content: tomorrow,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'name,base_date,work_type' }
      )
      .select()
      .maybeSingle();

    if (!error && data) {
      setSavedAt(data.updated_at ?? new Date().toISOString());
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, baseDate, workType]);

  return (
    <div className="rounded-2xl shadow p-4 bg-white border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{workType}</h3>
        {savedAt && (
          <span className="text-xs text-gray-500">최근 저장: {new Date(savedAt).toLocaleString()}</span>
        )}
      </div>

      <div className="grid gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">오늘</label>
          <textarea
            value={today}
            onChange={(e) => setToday(e.target.value)}
            placeholder="오늘 업무 메모"
            className="w-full min-h-[80px] p-2 border rounded-xl focus:outline-none focus:ring"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">내일</label>
          <textarea
            value={tomorrow}
            onChange={(e) => setTomorrow(e.target.value)}
            placeholder="내일 업무 메모"
            className="w-full min-h-[80px] p-2 border rounded-xl focus:outline-none focus:ring"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={load}
            disabled={loading}
            className="px-3 py-2 rounded-xl border bg-gray-50 hover:bg-gray-100"
          >
            새로고침
          </button>
          <button
            onClick={save}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
```
