```md
# ✅ 오늘/내일 메모 웹 설치 방법 (완전 쉬운 버전)

## 준비물 (이미 완료 ✅)
- Supabase 프로젝트
- Vercel 계정

---
## 1단계) Supabase에서 테이블 만들기
1) Supabase 열기 → **SQL Editor** 클릭
2) 제공된 SQL을 그대로 붙여넣기
3) **Run** 버튼 클릭 (테이블 생성 완료)

---
## 2단계) Vercel 환경변수 넣기
1) Vercel 접속 → 프로젝트 선택
2) 상단 메뉴에서 **Settings** → **Environment Variables** 진입
3) 아래 2개를 추가하고 저장
```
NEXT_PUBLIC_SUPABASE_URL=Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Supabase anon key
```
4) 저장 후 **Redeploy** 버튼 클릭

---
## 3단계) 코드 배포
1) 프로젝트 폴더를 GitHub에 업로드
2) Vercel → `New Project` → GitHub 레포 선택 → `Deploy`
3) URL이 생성되면 설치 완료 🎉

---
## 4단계) 사용 방법
1) 배포된 웹페이지 접속
2) **이름 입력** + **날짜 입력(YYMMDD)**
3) 로그인 → 5개 업무 입력 → 저장

---
## 끝! 바로 사용 가능 ✅
```
