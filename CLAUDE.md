# 쇼피 크로스보더 마진 계산기

## 프로젝트 배경

쇼피(Shopee) 크로스보더 셀러가 국가별 마진을 빠르게 계산하기 위한 도구.
현재 판매 국가: 싱가폴, 대만, 태국, 말레이시아 (추후 확대 예정).
PC와 모바일 브라우저를 거의 50:50으로 사용하므로 반응형 필수.

---

## 계산 구조 — 투트랙

### Track 1: 예측 모드
판매 전 예상 마진 계산. 수수료율을 직접 입력해서 정산 전에 수익성 판단.

```
판매금액(KRW) = 판매가(현지화폐) × 환율
매입원가       = 정가(KRW) × 매입률(%)
부가세         = 매입원가 × 부가세율(%)
총원가         = 매입원가 + 부가세
수수료         = 판매금액(KRW) × 총수수료율(%)
예상정산금액   = 판매금액(KRW) - 수수료
예상마진       = 예상정산금액 - 총원가
예상마진율     = 예상마진 / 예상정산금액 × 100
```

### Track 2: 정산 모드
실제 쇼피 정산금액을 입력해 실제 마진 확인. 수수료 세부항목 몰라도 됨.

```
실제마진   = 실제정산금액(KRW) - 총원가
실제마진율 = 실제마진 / 실제정산금액 × 100
```

**정가/매입률 개념**: 한국 정가(예: 10,000원) 기준으로 몇 %에 매입하는지 (예: 70% → 7,000원 매입). 쇼피 셀러들이 보통 쓰는 방식.

---

## 설정 (⚙️ 버튼)

국가별로 저장되는 기본값들:
- **환율**: 1 외화 = N원. 실시간 조회 버튼 (open.er-api.com, 무료 API, 키 불필요)으로 갱신 가능. 수동 수정도 가능.
- **총 수수료율**: 플랫폼 수수료 + 결제 수수료 합산 %. 기본값 12%.
- **부가세율**: 기본값 10%.

모든 설정은 localStorage에 저장됨. 계산기 입력값도 국가별로 localStorage 저장 (탭 전환해도 유지).

---

## 기술 스택

- **React + TypeScript + Vite**
- **Tailwind CSS v3** — 모바일 퍼스트
- **localStorage** — 설정 및 국가별 입력값 영구 저장
- **open.er-api.com** — 실시간 환율 (무료, API 키 없음)
- **배포**: Vercel (무료), `vercel.json` 이미 설정됨

---

## 파일 구조

```
src/
├── types.ts                  # CountryCode, CalcMode, Settings, CalcInputs, CalcResult
├── constants.ts              # COUNTRIES 배열, COUNTRY_MAP, DEFAULT_SETTINGS
├── utils/
│   ├── calc.ts               # calculate() 순수 함수 — 모든 마진 계산
│   └── format.ts             # krw(), pct(), num() 포맷 유틸
├── hooks/
│   ├── useSettings.ts        # 환율/수수료/부가세 설정 (localStorage)
│   ├── useExchangeRates.ts   # 실시간 환율 fetch
│   └── useCalcInputs.ts      # 국가별 계산기 입력값 (localStorage)
└── components/
    ├── CountryTabs.tsx       # 상단 국가 탭 (SG/TW/TH/MY)
    ├── ModeToggle.tsx        # 예측/정산 모드 토글
    ├── NumberInput.tsx       # 라벨+입력+힌트 재사용 컴포넌트
    ├── Calculator.tsx        # 입력 폼 전체 + 결과 조합
    └── ResultCard.tsx        # 마진 결과 카드 (양수=초록, 음수=빨강)
    └── SettingsModal.tsx     # 하단 시트 형태 설정 모달
```

---

## 빌드 / 배포

```bash
npm run dev      # 로컬 개발
npm run build    # 프로덕션 빌드 (dist/)
```

Vercel 배포: GitHub에 push → Vercel에서 repo 연결 → 자동 배포.

---

## 향후 추가 가능한 것들

- 국가 추가 (현재 4개국, 추후 확대 예정) — `constants.ts`의 `COUNTRIES` 배열에만 추가하면 됨
- 상품명/메모 필드 (어떤 상품인지 기록용)
- 계산 이력 저장 (여러 상품 비교)
- 엑셀/CSV 내보내기
