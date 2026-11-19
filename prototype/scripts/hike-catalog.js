// Curated snapshots of the linked documents. Numeric units are km, minutes and metres.
const forestBook = 'https://www.forest.go.kr/images/data/fonDown/100_mountain_ebook.pdf';
const forestTrip = (area, seq) => 'https://www.foresttrip.go.kr/pot/cc/hm/selectHndfmsmtnMngmeDtl.do?fmmntArcd=' + area + '&fmmntSeq=' + seq;
const summitStationSource = 'https://apihub.kma.go.kr/getAttachFile.do?fileName=%28250305%29%EC%82%B0%EC%95%85%EC%98%88%EB%B3%B4+API+%EC%84%9C%EB%B9%84%EC%8A%A4+%ED%99%9C%EC%9A%A9%EA%B0%80%EC%9D%B4%EB%93%9C_f.pdf';
const hikes = [
  { id: 'bukhansan', mountain: '북한산', profileSource: forestTrip('01', 71990), latitude: 37.6587, longitude: 126.978, regions: ['수도권'], location: '서울 강북·성북·종로·은평구, 경기 고양·양주시', heightM: 835.6, traits: ['100대 명산', '국립공원'], description: '백운대를 중심으로 인수봉과 만경대가 솟아 있고, 북한산성과 여러 계곡이 이어져요.' },
  { id: 'odaesan', mountain: '오대산', profileSource: forestTrip('02', 72002), latitude: 37.7941, longitude: 128.5431, regions: ['강원'], location: '강원 평창군·홍천군·강릉시', heightM: 1565.4, traits: ['100대 명산', '국립공원'], description: '비로봉을 중심으로 상왕봉·호령봉·두로봉·동대산이 솟아 있어요. 산 안에는 월정사와 상원사가 있어요.' },
  { id: 'jeju', mountain: '제주 오름', regions: ['제주'], location: '제주특별자치도', heightM: null, traits: ['오름'], description: '제주 여러 오름의 코스를 함께 소개해요. 올레 21코스에서는 지미봉을 지나 종달바당으로 향해요.' },
  { id: 'seoraksan', mountain: '설악산', profileSource: forestTrip('02', 71995), latitude: 38.119169, longitude: 128.465222, regions: ['강원'], location: '강원 속초시·인제군·양양군', heightM: 1708.1, traits: ['100대 명산', '국립공원'], description: '한계령과 마등령 등 여러 고개를 따라 산줄기가 이어져요. 계곡 곳곳에는 백담사와 토왕성폭포 같은 명소가 있어요.' },
  { id: 'sobaeksan', mountain: '소백산', profileSource: forestTrip('03', 71997), latitude: 36.9574, longitude: 128.4844, regions: ['충청','경상'], location: '경북 영주시·충북 단양군', heightM: 1439.7, traits: ['100대 명산', '국립공원'], description: '비로봉에서 연화봉으로 능선이 이어지고, 높은 지대에는 초원과 주목 군락이 펼쳐져요.' }
];
const dnb = id => 'https://www.durunubi.kr/4-2-1-1-walk-mobility-view-detail.do?brd_div=DNWW&crs_idx=T_CRS_MNG' + id;
const archive = id => 'https://archive.knps.or.kr/archive/s/site/item/' + id;
const park = (id, route) => 'https://www.knps.or.kr/front/portal/visit/visitCourseGuide.do?parkId=' + id + '&vcursId=' + id + 'V' + route;
const tourism = id => 'https://korean.visitkorea.or.kr/detail/rem_detail.do?cotid=' + id;
const parkMap = id => 'https://www.knps.or.kr/front/portal/visit/parkMap.do?parkId=' + id;
const bukEntrance = {
  transport:'구파발역에서 버스를 타고 북한산성입구 하차 후 탐방지원센터까지 도보 약 10분',
  parking:'북한산성 주차장 · 서울 은평구 대서문길 24',
  extraSources:[['국립공원공단 · 북한산성 찾아가는 길','https://reservation.knps.or.kr/contents/G/serviceGuide.do?parkId=B141&prdId=GB141XXX00372']]
};
const darangEntrance = {
  parking:'다랑쉬오름 탐방로 입구 주차장', toilets:'탐방로 입구 주차장 앞 탐방안내소 쪽',
  extraSources:[['비짓제주 · 다랑쉬오름','https://www.visitjeju.net/kr/detail/view?contentsid=CONT_000000000500118']]
};
const seorakBus = ['속초시 · 시내버스 운행 정보','https://bis.sokcho.go.kr/realtime/search'];
const seorakToilets = ['속초시 · 공중화장실','https://www.sokcho.go.kr/sc/fields/environment/sewage/public_toilet'];
const sobaekMap = ['국립공원공단 · 소백산 탐방안내도',parkMap('121600')];
const courses = [
  { id:'bukhansan', ...bukEntrance, mountainId:'bukhansan', course:'북한산성코스', source:archive(3937), km:3.4, minutes:165, difficulty:'보통', stops:['북한산성탐방지원센터','대서문','보리사','백운대'] },
  { id:'buk-valley', ...bukEntrance, mountainId:'bukhansan', course:'대남문코스', source:archive(3938), km:5.8, minutes:180, difficulty:'쉬움', stops:['북한산성탐방지원센터','대서문','중성문','대남문'] },
  { id:'buk-peak', transport:'도선사광장 주차장에서 백운대탐방지원센터로 이동', toilets:'산행 시작 전 도선광장 화장실 이용', extraSources:[['국립공원공단 · 북한산 탐방안내도',parkMap('121500')]], mountainId:'bukhansan', course:'백운대코스', source:archive(3944), km:1.9, minutes:90, difficulty:'보통', stops:['백운대탐방지원센터','하루재','백운대피소','백운대'] },
  { id:'buk-pine', transport:'북한산우이역에서 우이령길 입구까지 도보 이동', extraSources:[['국립공원공단 · 북한산 탐방안내도',parkMap('121500')]], mountainId:'bukhansan', course:'북한산둘레길 1코스 소나무숲길', source:dnb('0000000770'), km:3, minutes:90, difficulty:'쉬움', area:'서울 강북구', stops:['우이령길 입구','우이분소','만고강산약수터','솔밭근린공원 입구','솔밭근린공원 상단'], shops:'마을 통과 구간의 매점', water:'만고강산약수터' },
  { id:'buk-cloud', mountainId:'bukhansan', course:'북한산둘레길 3코스 흰구름길', source:dnb('0000003568'), km:4.1, minutes:120, difficulty:'보통', area:'서울 강북구', stops:['이준열사묘역 입구','화계사 갈림길','구름전망대','빨래골공원지킴터','북한산생태숲 앞'], shops:'중간 마을에서 구입', transport:'수유역에서 마을버스로 통일교육원까지 이동', toilets:'코스 곳곳에 위치', water:'생태체험장 가는 길' },
  { id:'odaesan', toilets:'월정사 화장실 · 상원사 화장실', extraSources:[['공중화장실 표준자료 · 월정사','https://fpt.purpleo.co.kr/view/23365'],['공중화장실 표준자료 · 상원사','https://fpt.purpleo.co.kr/view/23367']], mountainId:'odaesan', course:'오대산 선재길(월정사 전나무 숲길)', source:dnb('0000003954'), km:10.7, minutes:240, difficulty:'보통', area:'강원 평창군', stops:['월정사 매표소','월정사 일주문','월정사','선재길 입구 회사거리','오대산장','상원사'], transport:'진부시외버스터미널 인근 정류장에서 동산리 방면 버스 이용', water:'월정사·상원사', shops:'월정사·상원사' },
  { id:'odae-forest', sectionGrade:'일주문~월정사 주차장 매우 쉬움', transport:'진부시외버스터미널에서 월정사행 버스 이용', minutes:30, timeOrigin:'전나무숲 왕복 약 2km', area:'강원 평창군', toilets:'월정사주차장 화장실', extraSources:[['전나무숲 무장애 탐방로 · 구간 난이도','https://www.everytrail.co.kr/forests/pyeongchang-woljeongsa-fir'],['오대산순례길 · 월정사 교통편','https://www.odaesan.kr/page/contact.php'],['한국관광공사 · 전나무숲 왕복 도보시간',tourism('27d723fd-07c3-4238-bc29-c57913e0caf5')]], mountainId:'odaesan', course:'월정사 전나무 숲 산책', source:'https://access.visitkorea.or.kr/cos/detail.do?cotId=2170118c-a62c-4c6d-81bc-adbbdca246bf', km:2, stops:['월정사 주차장','금강교','일주문','해탈교','월정사 주차장'], guide:'월정사 주차장에서 시작해 일주문을 거쳐 돌아오는 약 2km 산책 구간이에요.' },
  { id:'odae-ridge', transport:'상원사 주차장에서 상원사 방면 탐방로로 진입', sectionGrade:'적멸보궁~비로봉 어려움~매우어려움', area:'강원 평창군', toilets:'상원사 화장실', extraSources:[['국립공원공단 · 오대산 탐방안내도',parkMap('120900')],['공중화장실 표준자료 · 상원사','https://fpt.purpleo.co.kr/view/23367']], mountainId:'odaesan', course:'오대산 비로봉코스', source:park('120900','005'), km:6.8, minutes:190, maxMinutes:210, stops:['상원사','적멸보궁','비로봉','적멸보궁','상원사'], guide:'상원사에서 비로봉까지 오른 뒤 돌아오는 왕복 기준이에요.' },
  { id:'jeju', mountainId:'jeju', course:'제주올레길 21코스(하도–종달 올레)', source:dnb('0000001276'), km:11.3, minutes:210, difficulty:'쉬움', area:'제주 제주시', stops:['제주해녀박물관','낯물밭길','별방진','석다원','토끼섬','하도해수욕장','지미봉 정상','종달바당'], transport:'세화 환승정류장에서 제주해녀박물관까지 도보 약 950m', water:'해녀박물관 뒤 하도 운동장 음수대 외 1곳', shops:'없음' },
  { id:'jeju-crater', ...darangEntrance, transport:'다랑쉬오름 주차장에서 정상까지 오른 뒤 분화구 둘레길로 진입', mountainId:'jeju', course:'분화구 둘레 걷기', stops:['분화구 둘레길 진입점','화구 능선 최고 지점','분화구 둘레길 진입점'], minutes:30, timeOrigin:'화구륜 한 바퀴', area:'제주 제주시', source:'https://gonggam.korea.kr/newsContentView.es?news_id=EBC6D400FD2F4203E0540021F662AC5F&mid=a12602000000', guide:'다랑쉬오름 정상의 분화구 가장자리를 한 바퀴 걷는 구간이에요. 주차장에서 정상까지 오르내리는 시간은 별도예요.' },
  { id:'jeju-forest', ...darangEntrance, transport:'다랑쉬오름 주차장에서 기슭 둘레길로 진입', mountainId:'jeju', course:'오름 자락 숲 산책', km:3.4, area:'제주 제주시', source:'https://www.trueagency.co.kr/news/detail/63', guide:'다랑쉬오름 기슭의 둘레길을 걸어요. 정상 분화구를 도는 길과 다른 코스예요.' },
  { id:'seoraksan', transport:'척산족욕공원 주차장에서 출발해 공원으로 돌아오는 순환 코스', amenities:'척산족욕공원 내 휴게시설·물품보관함', extraSources:[['속초시 · 척산족욕공원','https://www.sokcho.go.kr/sc/fields/culture/park/foot_bath']], mountainId:'seoraksan', course:'설악누리길', source:'https://www.korea.kr/news/policyNewsView.do?newsId=148853188', km:6, minutes:90, difficulty:'쉬움', area:'강원 속초시', stops:['척산족욕공원','설악자생식물원','바람꽃마을','종합운동장','척산족욕공원'] },
  { id:'seorak-valley', transport:'속초 시내버스 7번으로 설악산소공원 하차 후 신흥사까지 도보 이동', toilets:'신흥사로 가기 전 소공원 주차장 화장실 이용', extraSources:[seorakBus,seorakToilets], mountainId:'seoraksan', course:'비선대 계곡 걷기', source:park('120400','007'), km:3, minutes:80, difficulty:'쉬움', rawGrade:'매우쉬움', stops:['신흥사','비선대'], guide:'양폭코스 가운데 신흥사에서 비선대까지의 편도 구간이에요.' },
  { id:'seorak-rock', difficulty:'보통', rawGrade:'중', transport:'속초 시내버스 7번으로 설악산소공원 하차', sectionGrade:'흔들바위~울산바위 어려움', area:'강원 속초시', toilets:'소공원(가동) 화장실', extraSources:[seorakBus,seorakToilets,['울산바위코스 · 전체 난이도','https://mountain.allseason.co.kr/mt/seoraksan/ulsanbawi/']], mountainId:'seoraksan', course:'울산바위 전망 산행', source:park('120400','003'), km:3.8, minutes:120, stops:['소공원','신흥사','내원암','흔들바위','울산바위'], guide:'편도 기준이에요. 흔들바위에서 울산바위까지 마지막 1km의 구간 난이도는 어려움이에요.' },
  { id:'sobaeksan', transport:'차량 이용 시 소수서원 주차장에서 출발해요. 도착지는 삼가주차장이에요.', difficulty:'어려움', toilets:'소수서원 주차장 화장실', extraSources:[['중앙일보 · 소백산자락길 1자락 난이도','https://www.joongang.co.kr/article/21187181'],['영주시의회 · 소수서원 주차장 화장실','https://council.yeongju.go.kr/Conference/Files/FileAppendix/a9/A010951.pdf']], mountainId:'sobaeksan', course:'소백산자락길 1자락', source:tourism('aa7e8e73-df63-4d5b-883c-5fd7925d36f1'), km:12.6, minutes:70 + 50 + 150, timeOrigin:'선비길·구곡길·달밭길 합계', area:'경북 영주시', stops:['소수서원','배점분교','초암사','달밭골','비로사','삼가주차장'] },
  { id:'sobaek-11', mountainId:'sobaeksan', course:'소백산자락길 11코스', source:dnb('0000000957'), km:13.8, minutes:240, difficulty:'보통', area:'경북 영주시', stops:['부석사','속두들','소백산예술촌','임곡1리 노인회관','소천5리 마을회관','노곡2리 마을회관','단산저수지','좌석'], transport:'영주종합터미널에서 부석사 방향 버스 이용', water:'부석사 주차장', shops:'부석사 주차장·단산면 소재지' },
  { id:'sobaek-valley', transport:'희방사 제2주차장에서 희방폭포까지 도보 이동', parking:'희방사 제2주차장', extraSources:[sobaekMap], mountainId:'sobaeksan', course:'희방폭포 계곡 산책', minutes:15, area:'경북 영주시', source:'https://www.yeongju.go.kr/ipage.do?art_uid=17079&cmd=2&mnu_uid=10026&srchCode=110', stops:['희방사 아래 주차장','희방폭포'], guide:'희방사 아래 주차장에서 폭포까지 올라가는 편도 구간이에요.' },
  { id:'sobaek-ridge', transport:'죽령휴게소에서 탐방로를 따라 연화봉까지 오른 뒤 능선 구간을 시작해요.', parking:'접근로 입구의 죽령휴게소 주차장', extraSources:[sobaekMap], mountainId:'sobaeksan', course:'비로봉 능선 걷기', km:4.3, minutes:100, difficulty:'쉬움', rawGrade:'하', source:archive(3976), stops:['연화봉','소백산 천문대','제1연화봉','비로봉'], guide:'연화봉에서 비로봉까지 능선을 따르는 편도 구간이에요. 연화봉까지 오르는 시간은 별도예요.' }
].map(course => ({ ...course, mountain: hikes.find(h => h.id === course.mountainId).mountain }));
const featuredCourse = courses.find(course => course.id === 'sobaeksan');
function bookmarkTime(type, id) {
  const saved = localStorage.getItem('chabak.' + type + '-bookmark.' + id);
  return saved === null ? null : saved === 'true' ? 0 : Number(saved);
}
