# 차박차박 산·코스 데이터 대조표

2026-11-19 프로토타입 기준. 괄호 안의 영문은 앱에서 읽는 변수이고, 함께 표기한 한글은 원문 항목 또는 계산 근거다. 값은 공식 문서에서 확인해 저장한 스냅샷이다.

## 산 상세

| 이름 (mountain.mountain) | 소재지 (mountain.location) | 높이 (mountain.heightM) | 정상 예보 지점 (mountain.latitude, mountain.longitude) | 코스 기반 난이도 (level) | 자료 |
|---|---|---|---|---|---|
| 북한산 | 서울 강북·성북·종로·은평구, 경기 고양·양주시 | 835.6m | 37.6587, 126.978 | 보통 (5개 코스) | [산림청](https://www.forest.go.kr/images/data/fonDown/100_mountain_ebook.pdf) · [숲나들e](https://www.foresttrip.go.kr/pot/cc/hm/selectHndfmsmtnMngmeDtl.do?fmmntArcd=01&fmmntSeq=71990) · [기상청 정상 지점](https://apihub.kma.go.kr/getAttachFile.do?fileName=%28250305%29%EC%82%B0%EC%95%85%EC%98%88%EB%B3%B4+API+%EC%84%9C%EB%B9%84%EC%8A%A4+%ED%99%9C%EC%9A%A9%EA%B0%80%EC%9D%B4%EB%93%9C_f.pdf) |
| 오대산 | 강원 평창군·홍천군·강릉시 | 1565.4m | 37.7941, 128.5431 | 보통 (1개 코스) | [산림청](https://www.forest.go.kr/images/data/fonDown/100_mountain_ebook.pdf) · [숲나들e](https://www.foresttrip.go.kr/pot/cc/hm/selectHndfmsmtnMngmeDtl.do?fmmntArcd=02&fmmntSeq=72002) · [기상청 정상 지점](https://apihub.kma.go.kr/getAttachFile.do?fileName=%28250305%29%EC%82%B0%EC%95%85%EC%98%88%EB%B3%B4+API+%EC%84%9C%EB%B9%84%EC%8A%A4+%ED%99%9C%EC%9A%A9%EA%B0%80%EC%9D%B4%EB%93%9C_f.pdf) |
| 제주 오름 | 제주특별자치도 | 오름별 상이 | 해당 없음 | 쉬움 (1개 코스) | 차박차박 지역 묶음 |
| 설악산 | 강원 속초시·인제군·양양군 | 1708.1m | 38.119169, 128.465222 | 쉬움 (2개 코스) | [산림청](https://www.forest.go.kr/images/data/fonDown/100_mountain_ebook.pdf) · [숲나들e](https://www.foresttrip.go.kr/pot/cc/hm/selectHndfmsmtnMngmeDtl.do?fmmntArcd=02&fmmntSeq=71995) · [기상청 정상 지점](https://apihub.kma.go.kr/getAttachFile.do?fileName=%28250305%29%EC%82%B0%EC%95%85%EC%98%88%EB%B3%B4+API+%EC%84%9C%EB%B9%84%EC%8A%A4+%ED%99%9C%EC%9A%A9%EA%B0%80%EC%9D%B4%EB%93%9C_f.pdf) |
| 소백산 | 경북 영주시·충북 단양군 | 1439.7m | 36.9574, 128.4844 | 보통 (3개 코스) | [산림청](https://www.forest.go.kr/images/data/fonDown/100_mountain_ebook.pdf) · [숲나들e](https://www.foresttrip.go.kr/pot/cc/hm/selectHndfmsmtnMngmeDtl.do?fmmntArcd=03&fmmntSeq=71997) · [기상청 정상 지점](https://apihub.kma.go.kr/getAttachFile.do?fileName=%28250305%29%EC%82%B0%EC%95%85%EC%98%88%EB%B3%B4+API+%EC%84%9C%EB%B9%84%EC%8A%A4+%ED%99%9C%EC%9A%A9%EA%B0%80%EC%9D%B4%EB%93%9C_f.pdf) |

## 코스 데이터

| 코스 | 거리 | 시간 | 난이도 | 주요 지점 (course.stops) | 원문 |
|---|---|---|---|---|---|
| 북한산성코스 (course.course) | 3.4km (course.km · 코스거리) | 2시간 45분 (course.minutes · 코스소요시간) | 보통 (course.difficulty · 코스난이도) | 북한산성탐방지원센터 → 대서문 → 보리사 → 백운대 | [국립공원공단](https://archive.knps.or.kr/archive/s/site/item/3937) |
| 대남문코스 (course.course) | 5.8km (course.km · 코스거리) | 3시간 (course.minutes · 코스소요시간) | 쉬움 (course.difficulty · 코스난이도) | 북한산성탐방지원센터 → 대서문 → 중성문 → 대남문 | [국립공원공단](https://archive.knps.or.kr/archive/s/site/item/3938) |
| 백운대코스 (course.course) | 1.9km (course.km · 코스거리) | 1시간 30분 (course.minutes · 코스소요시간) | 보통 (course.difficulty · 코스난이도) | 백운대탐방지원센터 → 하루재 → 백운대피소 → 백운대 | [국립공원공단](https://archive.knps.or.kr/archive/s/site/item/3944) |
| 북한산둘레길 1코스 소나무숲길 (course.course) | 3km (course.km · 길이) | 1시간 30분 (course.minutes · 소요시간) | 쉬움 (course.difficulty · 난이도) | 우이령길 입구 → 우이분소 → 만고강산약수터 → 솔밭근린공원 입구 → 솔밭근린공원 상단 | [한국관광공사 두루누비](https://www.durunubi.kr/4-2-1-1-walk-mobility-view-detail.do?brd_div=DNWW&crs_idx=T_CRS_MNG0000000770) |
| 북한산둘레길 3코스 흰구름길 (course.course) | 4.1km (course.km · 길이) | 2시간 (course.minutes · 소요시간) | 보통 (course.difficulty · 난이도) | 이준열사묘역 입구 → 화계사 갈림길 → 구름전망대 → 빨래골공원지킴터 → 북한산생태숲 앞 | [한국관광공사 두루누비](https://www.durunubi.kr/4-2-1-1-walk-mobility-view-detail.do?brd_div=DNWW&crs_idx=T_CRS_MNG0000003568) |
| 오대산 선재길(월정사 전나무 숲길) (course.course) | 10.7km (course.km · 길이) | 4시간 (course.minutes · 소요시간) | 보통 (course.difficulty · 난이도) | 월정사 매표소 → 월정사 일주문 → 월정사 → 선재길 입구 회사거리 → 오대산장 → 상원사 | [한국관광공사 두루누비](https://www.durunubi.kr/4-2-1-1-walk-mobility-view-detail.do?brd_div=DNWW&crs_idx=T_CRS_MNG0000003954) · [공중화장실 표준자료 · 월정사](https://fpt.purpleo.co.kr/view/23365) · [공중화장실 표준자료 · 상원사](https://fpt.purpleo.co.kr/view/23367) |
| 월정사 전나무 숲 산책 (course.course) | 2km (course.km) | 30분 (course.minutes) | 미확인 | 월정사 주차장 → 금강교 → 일주문 → 해탈교 → 월정사 주차장 | [한국관광공사 대한민국 구석구석](https://access.visitkorea.or.kr/cos/detail.do?cotId=2170118c-a62c-4c6d-81bc-adbbdca246bf) · [한국관광공사 · 전나무숲 왕복 도보시간](https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=27d723fd-07c3-4238-bc29-c57913e0caf5) |
| 오대산 비로봉코스 (course.course) | 6.8km (course.km) | 3시간 10분 ~ 3시간 30분 (course.minutes, course.maxMinutes) | 적멸보궁~비로봉 어려움~매우어려움 (course.sectionGrade) | 상원사 → 적멸보궁 → 비로봉 → 적멸보궁 → 상원사 | [국립공원공단](https://www.knps.or.kr/front/portal/visit/visitCourseGuide.do?parkId=120900&vcursId=120900V005) · [공중화장실 표준자료 · 상원사](https://fpt.purpleo.co.kr/view/23367) |
| 제주올레길 21코스(하도–종달 올레) (course.course) | 11.3km (course.km · 길이) | 3시간 30분 (course.minutes · 소요시간) | 쉬움 (course.difficulty · 난이도) | 제주해녀박물관 → 낯물밭길 → 별방진 → 석다원 → 토끼섬 → 하도해수욕장 → 지미봉 정상 → 종달바당 | [한국관광공사 두루누비](https://www.durunubi.kr/4-2-1-1-walk-mobility-view-detail.do?brd_div=DNWW&crs_idx=T_CRS_MNG0000001276) |
| 분화구 둘레 걷기 (course.course) | 미확인 | 30분 (course.minutes) | 미확인 | 미확인 | [구간 원문](https://gonggam.korea.kr/newsContentView.es?news_id=EBC6D400FD2F4203E0540021F662AC5F&mid=a12602000000) |
| 오름 자락 숲 산책 (course.course) | 3.4km (course.km) | 미확인 | 미확인 | 미확인 | [구간 원문](https://www.trueagency.co.kr/news/detail/63) |
| 설악누리길 (course.course) | 6km (course.km) | 1시간 30분 (course.minutes) | 쉬움 (course.difficulty) | 척산족욕공원 → 설악자생식물원 → 바람꽃마을 → 종합운동장 → 척산족욕공원 | [대한민국 정책브리핑](https://www.korea.kr/news/policyNewsView.do?newsId=148853188) |
| 비선대 계곡 걷기 (course.course) | 3km (course.km) | 1시간 20분 (course.minutes) | 쉬움 (course.difficulty · 원문 매우쉬움) | 신흥사 → 비선대 | [국립공원공단](https://www.knps.or.kr/front/portal/visit/visitCourseGuide.do?parkId=120400&vcursId=120400V007) |
| 울산바위 전망 산행 (course.course) | 3.8km (course.km) | 2시간 (course.minutes) | 흔들바위~울산바위 어려움 (course.sectionGrade) | 소공원 → 신흥사 → 내원암 → 흔들바위 → 울산바위 | [국립공원공단](https://www.knps.or.kr/front/portal/visit/visitCourseGuide.do?parkId=120400&vcursId=120400V003) · [속초시 · 소공원 화장실](https://www.sokcho.go.kr/sc/fields/environment/sewage/public_toilet) |
| 소백산자락길 1자락 (course.course) | 12.6km (course.km) | 4시간 30분 (course.minutes · 선비길·구곡길·달밭길 합계) | 어려움 (course.difficulty) | 소수서원 → 배점분교 → 초암사 → 달밭골 → 비로사 → 삼가주차장 | [한국관광공사 대한민국 구석구석](https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=aa7e8e73-df63-4d5b-883c-5fd7925d36f1) · [중앙일보 · 소백산자락길 1자락 난이도](https://www.joongang.co.kr/article/21187181) · [영주시의회 · 소수서원 주차장 화장실](https://council.yeongju.go.kr/Conference/Files/FileAppendix/a9/A010951.pdf) |
| 소백산자락길 11코스 (course.course) | 13.8km (course.km · 길이) | 4시간 (course.minutes · 소요시간) | 보통 (course.difficulty · 난이도) | 부석사 → 속두들 → 소백산예술촌 → 임곡1리 노인회관 → 소천5리 마을회관 → 노곡2리 마을회관 → 단산저수지 → 좌석 | [한국관광공사 두루누비](https://www.durunubi.kr/4-2-1-1-walk-mobility-view-detail.do?brd_div=DNWW&crs_idx=T_CRS_MNG0000000957) |
| 희방폭포 계곡 산책 (course.course) | 미확인 | 15분 (course.minutes) | 미확인 | 희방사 아래 주차장 → 희방폭포 | [구간 원문](https://www.yeongju.go.kr/ipage.do?art_uid=17079&cmd=2&mnu_uid=10026&srchCode=110) |
| 비로봉 능선 걷기 (course.course) | 4.3km (course.km) | 100분 (course.minutes) | 쉬움 (course.difficulty) | 연화봉 → 소백산 천문대 → 제1연화봉 → 비로봉 | [구간 원문](https://archive.knps.or.kr/archive/s/site/item/3976) |

## 코스별 편의시설·교통

| 코스 | 원문 식수 안내 (course.water) | 매점 (course.shops) | 화장실 (course.toilets) | 교통 (course.transport) |
|---|---|---|---|---|
| 북한산둘레길 1코스 소나무숲길 | 만고강산약수터 | 마을 통과 구간의 매점 | 미확인 | 미확인 |
| 북한산둘레길 3코스 흰구름길 | 생태체험장 가는 길 | 중간 마을에서 구입 | 코스 곳곳에 위치 | 수유역에서 마을버스로 통일교육원까지 이동 |
| 오대산 선재길(월정사 전나무 숲길) | 월정사·상원사 | 월정사·상원사 | 미확인 | 진부시외버스터미널 인근 정류장에서 동산리 방면 버스 이용 |
| 제주올레길 21코스(하도–종달 올레) | 해녀박물관 뒤 하도 운동장 음수대 외 1곳 | 없음 | 미확인 | 세화 환승정류장에서 제주해녀박물관까지 도보 약 950m |
| 소백산자락길 11코스 | 부석사 주차장 | 부석사 주차장·단산면 소재지 | 미확인 | 영주종합터미널에서 부석사 방향 버스 이용 |

두루누비 5개 코스의 GPX는 코스별 원문의 다운로드 메뉴에서 확인할 수 있다. 앱에는 원문 링크와 지점 순서를 연결했다. 식수 항목은 자료가 안내하는 위치이며 현재 수질이나 운영 상태는 별도 확인이 필요하다.

산 사진은 기존 일러스트를 사용한다. 차박차박 방문 영상은 북한산에 등록되어 있다. 제주 오름은 여러 장소를 묶은 카드라 단일 정상 좌표와 높이를 두지 않는다.
