# 차박차박 커뮤니티 UI

요니버스 Flutter 앱의 현재 커뮤니티 위젯을 HTML/CSS/JavaScript로 옮긴 로컬 프로토타입입니다. 구 HTML 시안을 기반으로 하지 않습니다.

## 사용

`index.html`을 열거나, 차박차박의 기존 `community.html`로 진입하세요. 폴더 전체를 복사하면 다른 HTML 프로젝트에서도 사용할 수 있습니다. HTML 안에 삽입할 때는 스타일/스크립트 충돌을 피하도록 iframe으로 연결합니다.

```html
<iframe src="community-ui/index.html" title="커뮤니티" style="width:100%;height:860px;border:0"></iframe>
```

`theme.css`의 `--brand`, `--brand-pressed`만 변경하면 강조색을 바꿀 수 있습니다. CTA는 Product/Primary 토큰(`--ds-product-primary`, 기본값 `#2454D6`)을 사용하며, 비활성 상태는 회색으로 표시합니다. 홈·마이페이지 링크 기준 경로는 HTML body의 `data-host-prefix`에서 지정합니다.

## 화면과 동작

- 두 줄 카테고리, 게시글 목록, 투표 미리보기, 검색, 상세, 원형 글쓰기 버튼
- 투표 선택/확정/결과, 재참여 방지, 새로고침 후 투표 유지
- 투표 작성: 2~10개 선택지, 100자 제한, 중복 검사, 선택지 추가/삭제
- 댓글·대댓글 작성/수정/삭제·좋아요, 부모 댓글별 4개씩 더 보기/접기, 수신자 표시
- 공개 닉네임, 글 작성 중 임시 저장, 제목 40자/본문 2000자/댓글 500자
- 글 메뉴, 숨기기, 신고·차단 시연, 작성자 고마워요(댓글 길게 누르기)
- 기존 마이페이지의 내 글·내 댓글·좋아요·차단관리 링크 유지

현재 코드는 로그인한 ‘나’를 기준으로 동작합니다. 콘텐츠는 예시이며 API·실제 로그인·푸시·운영자 신고 전송·경험치 적립은 연결하지 않습니다. 알림센터는 빈 상태입니다. 실서비스 장애/전송 중 상태나 회원가입 화면은 재현 범위가 아닙니다.

새 데이터는 `chabak-community-latest-v2`, 임시 글은 `chabak-community-latest-v2-draft`에 보관합니다. 새 버전 첫 진입 시 기존 `chabak-community-v1`의 글·댓글·사진·차단·신고를 복사해 읽습니다. 원래 저장 키는 변경하지 않습니다. 같은 브라우저·같은 주소에서만 저장 내용을 공유합니다. 기존 사진은 상세에서 계속 표시하며, 최신 요니버스 글쓰기 UI에 없는 사진 첨부 버튼은 추가하지 않았습니다.

## 기준 코드

2026-11-16 로컬 체크아웃 `84b608d1670ec12ed79106cd752587126821da9b`:

- `lib/features/community/presentation/community_tab.dart`
- `lib/features/community/presentation/widgets/community_post_card.dart`
- `lib/features/community/presentation/widgets/post_poll.dart`
- `lib/features/community/presentation/widgets/comment_replies.dart`
- `lib/features/community/presentation/widgets/random_nickname_toggle.dart`
- `lib/features/community/presentation/write_post_screen.dart`
- `lib/features/community/presentation/post_detail_screen.dart`
- `lib/app/theme/app_theme.dart`, `lib/core/ui/app_icons.dart`

카테고리·문구·레이아웃 수치·아이콘은 앱 코드를 참조했습니다. 글/댓글 및 투표 집계는 예시 데이터입니다. 기본 폰트는 앱과 같은 Pretendard이며 CDN을 사용할 수 없으면 시스템 폰트를 사용합니다. HTML과 Flutter의 렌더링 차이가 있어 픽셀 단위 동일성을 보증하지 않습니다.
