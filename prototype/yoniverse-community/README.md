# 차박차박 커뮤니티 HTML 복사본

`index.html`을 브라우저에서 열면 커뮤니티부터 시작합니다. HTML/CSS/JavaScript만 사용하며 빌드나 API 연결은 필요하지 않습니다.

## 복사·색상 변경

- 이 폴더 전체를 복사합니다. `index.html`, `styles.css`, `theme.css`, `app.js`, `assets/`를 함께 유지하세요.
- `theme.css`의 `--color-brand-main`과 `--color-brand-pressed`를 원하는 색상으로 바꿉니다. 현재 차박차박 흑백 시안에 맞춰 두었습니다.
- 기존 페이지에서는 `<a href="yoniverse-community/index.html">커뮤니티</a>`로 연결합니다.
- 다른 HTML 안에 넣을 때는 `<iframe src="yoniverse-community/index.html" title="커뮤니티" style="width:100%;height:860px;border:0"></iframe>`을 사용하면 기존 스타일·스크립트와 충돌하지 않습니다.
- 하단 홈 버튼은 상위 폴더의 `home.html`로 연결됩니다. 다른 위치에 복사하면 `app.js` 마지막 홈 경로를 수정하세요.

## 포함 범위

요니버스 기존 HTML 시안의 카테고리 필터, 목록 더 보기, 상세, 글 작성/수정/삭제, 댓글 작성/수정/삭제, 좋아요, 검색, 신고/차단, 로그인 시연 및 연관 보조 화면을 보존했습니다. 원본의 레이아웃과 예시 콘텐츠를 유지했습니다. 연애 카테고리·문구를 바꾸려면 `app.js`의 `categories`와 `posts`를 수정하세요.

실제 Flutter 앱의 최신 구현을 변환한 결과는 아닙니다. 원본 HTML에 없는 투표·대댓글 등은 포함하지 않습니다. 기존 차박차박 `community.html`의 사진 첨부 기능도 이 복사본과 합치지 않았습니다.

로그인·글·댓글·신고는 화면 시연이며 실제 서비스로 전송되지 않습니다. 글/댓글 변경은 새로고침하면 초기화됩니다. 로그인 시연 선택만 별도의 브라우저 저장 키를 사용합니다. 기존 차박차박 커뮤니티의 저장 데이터와 파일을 변경하지 않습니다. 기본 폰트는 원본과 동일한 CDN Pretendard이며 오프라인에서는 시스템 폰트로 표시됩니다.
