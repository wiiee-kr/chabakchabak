# 디자인 프로토타입

차박차박·수길따라의 HTML/CSS 프로토타입과 FE 전달 자료를 관리합니다.

- 작업 브랜치: `design/prototype`
- 앱 공통 폰트: Wanted Sans (`styles/fonts.css`, 로컬 폰트 파일 사용)
- 기본 기술: 시맨틱 HTML, 재사용 CSS, 필요한 최소 Vanilla JS
- 차박차박을 우선 구현하고 공통 화면을 재사용합니다.
- 검증되지 않은 콘텐츠는 `예시` 또는 `확인 예정`으로 표시합니다.
- React 구현 및 앱 빌드 코드는 이 경로에서 작성하지 않습니다.

## 화면

- `/`: 기존 스플래시
- `/home.html`: 로고 자리와 사진 썸네일 MY 버튼을 배치한 홈 (본문 비움, MY → 마이페이지)
- `/mypage.html`: 프로필과 닉네임 수정, 내 활동·준비물·차단 관리 바로가기. 닉네임은 `chabak-profile-v1`에 저장되며 커뮤니티 글·댓글에도 같은 공개 닉네임을 표시합니다.
- `/community.html`: 최신 요니버스 앱 UI 기반 커뮤니티 프로토타입

## 실행

저장소 루트에서 `python3 scripts/preview.py` 실행 후
`http://localhost:5500/community.html`을 엽니다.

## 커뮤니티 구현 범위

`community.html`은 현재 요니버스 앱 코드를 기준으로 옮긴 HTML UI를 사용합니다. 재사용 소스는 `community-ui/`이며 상세 사용법은 [커뮤니티 UI](community-ui/README.md)를 참고하세요.

- 두 줄 카테고리, 목록, 글쓰기·상세, 투표 작성·참여·결과
- 댓글·대댓글·좋아요, 더 보기·접기, 공개 닉네임, 임시 글 저장
- 검색, 내 활동, 숨기기·신고·차단 시연
- 강조색은 `community-ui/theme.css`에서 변경

브라우저 저장 키는 `chabak-community-latest-v2`입니다. 기존 `chabak-community-v1`의 데이터는 첫 진입 시 복사해서 읽으며 원본은 보존합니다. 실제 서비스 API는 연결하지 않습니다. 이전 사진은 읽어오지만 최신 요니버스 UI에는 사진 첨부 버튼이 없어 새 글 사진 첨부는 제공하지 않습니다.

기존 `styles/community.css`, `scripts/community.js`와 이전 HTML 복사본 `yoniverse-community/`는 보존하며, 현재 진입점에서는 사용하지 않습니다.

## 준비물 와이어프레임

`http://localhost:5500/packing.html`에서 실행합니다.

- 준비물 홈, 기본 준비물 편집, 새 체크리스트, 저장된 체크리스트
- 카테고리 전체/일부 선택, 항목·카테고리 추가/수정/삭제
- 항목 이동 메뉴와 드래그앤드랍, 길게 누르기와 메뉴 버튼
- 기본 목록은 이후 생성 목록에만 반영, 저장된 목록에서 선택적으로 기본 목록에 추가
- 산행 목록 복사 및 챙김 체크 초기화, 홈·상세 진행률
- 브라우저 저장소 `chabak-packing-wf-v1` 사용. 서버나 기기간 동기화는 없습니다.

## 아이콘 스타일 기준

- 사용자 지정 참고: [Untitled UI Icons — Line icons](https://www.figma.com/design/vgzafDvxKV1bnebBFVWi9a?node-id=181-128951).
- 기본 UI 아이콘은 해당 라이브러리의 간결한 윤곽, 둥근 선 끝과 모서리, 일관된 시각적 두께를 참고합니다. 확인한 `message-chat-circle`의 기본 크기는 24px입니다.
- 아이콘을 추가·교체할 때 해당 Figma 원본을 확인하고 화면의 지정 크기에 맞춥니다.
- 하단 내비게이션은 사용자 지정 솔리드 스타일과 두 봉우리·아치형 문 홈 아이콘을 유지합니다.
- 색상은 차박차박 디자인 시스템 토큰을 사용합니다.
