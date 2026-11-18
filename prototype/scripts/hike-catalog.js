const hikes = [
  { id: 'bukhansan', mountain: '북한산', regions: ['수도권'], course: '북한산성코스', km: 6, minutes: 180, difficulty: '보통' },
  { id: 'odaesan', mountain: '오대산', regions: ['강원'], course: '오대산 선재길(월정사 전나무 숲길)', km: 10.7, minutes: 240, difficulty: '보통' },
  { id: 'jeju', mountain: '제주 오름', regions: ['제주'], course: '제주올레길 21코스(하도–종달 올레)', km: 11, minutes: 210, difficulty: '쉬움' },
  { id: 'seoraksan', mountain: '설악산', regions: ['강원'], course: '설악누리길', km: 6, minutes: 90, difficulty: '쉬움' },
  { id: 'sobaeksan', mountain: '소백산', regions: ['충청', '경상'], course: '소백산자락길 1자락', km: 12.6, minutes: 270, difficulty: '어려움' },
];

const durunubi = 'https://www.durunubi.kr/course-detail-view.do?crs_idx=T_CRS_MNG';
const legacyDurunubi = 'https://www.durunubi.kr/4-2-1-1-walk-mobility-view-detail.do?brd_div=DNWW&crs_idx=T_CRS_MNG';
const publishedGuides = {
  sobaeksan: { source: durunubi + '0000002208', area: '경북 영주시', stops: ['선비촌', '초암사', '삼가주차장'],
    guide: '순흥향교와 죽계구곡을 지나 초암사로 향해요. 달밭골과 비로사를 거쳐 삼가주차장까지 걸어요.' },
  'sobaek-11': { source: legacyDurunubi + '0000000957', area: '경북 영주시', stops: ['부석사', '단산저수지', '좌석사거리'],
    guide: '부석사에서 소백산예술촌을 거쳐 과수원길로 들어서요. 모산을 지나면 저수지를 따라 걷는 수변길이 이어져요.' },
  'buk-pine': { source: durunubi + '0000000770', area: '서울 강북구', stops: ['우이령길 입구', '만고강산 약수터', '솔밭근린공원'],
    guide: '북한산우이역 인근에서 출발해 우이계곡을 따라 걸어요. 약수터를 지나 솔밭근린공원으로 향해요.' },
  'buk-cloud': { source: durunubi + '0000003568', area: '서울 강북구', stops: ['이준열사묘역 입구', '구름전망대', '북한산생태숲'],
    guide: '묘역 입구에서 생태숲을 향해 걸어요. 구름전망대에서 북한산과 서울 시내를 함께 바라볼 수 있어요.' },
  odaesan: { source: legacyDurunubi + '0000003954', area: '강원 평창군', stops: ['월정사 매표소', '월정사', '상원사'],
    guide: '월정사 일주문을 지나 전나무 숲길을 걸어요. 월정사에서 선재길로 들어가 오대천을 따라 상원사까지 올라가요.' },
  jeju: { source: legacyDurunubi + '0000001276', area: '제주 제주시', stops: ['제주해녀박물관', '지미봉', '종달바당'],
    guide: '하도 해안을 지나 지미봉으로 향해요. 봉우리를 오른 뒤 종달바당에 닿는 코스로, 지미봉 둘레로 우회하는 길도 있어요.' },
  seoraksan: { source: 'https://www.korea.kr/news/policyNewsView.do?newsId=148853188', sourceLabel: '정책브리핑 · 두루누비 추천길', area: '강원 속초시',
    stops: ['척산족욕공원', '설악자생식물원', '척산족욕공원'], guide: '설악산 자락의 순환 산책로예요. 자생식물원에서 바람꽃마을과 종합운동장을 지나 출발지로 돌아와요.' },
};

const courses = [
  ...hikes.map(hike => ({ ...hike, mountainId: hike.id })),
  { id: 'buk-pine', mountainId: 'bukhansan', course: '북한산둘레길 1코스 소나무숲길', km: 3.1, minutes: 90, difficulty: '쉬움' },
  { id: 'buk-cloud', mountainId: 'bukhansan', course: '북한산둘레길 3코스 흰구름길', km: 4.1, minutes: 120, difficulty: '보통' },
  { id: 'sobaek-11', mountainId: 'sobaeksan', course: '소백산자락길 11코스', km: 13.8, minutes: 240, difficulty: '보통' },
  { id: 'sobaek-valley', mountainId: 'sobaeksan', course: '희방폭포 계곡 산책', km: 2.6, minutes: 70, difficulty: '쉬움' },
  { id: 'sobaek-ridge', mountainId: 'sobaeksan', course: '비로봉 능선 걷기', km: 7.2, minutes: 210, difficulty: '보통' },
  { id: 'buk-valley', mountainId: 'bukhansan', course: '대남문코스', km: 3, minutes: 80, difficulty: '쉬움' },
  { id: 'buk-peak', mountainId: 'bukhansan', course: '백운대코스', km: 7.4, minutes: 250, difficulty: '어려움' },
  { id: 'odae-forest', mountainId: 'odaesan', course: '월정사 전나무 숲 산책', km: 2, minutes: 50, difficulty: '쉬움' },
  { id: 'odae-ridge', mountainId: 'odaesan', course: '비로봉 능선 오르기', km: 7, minutes: 220, difficulty: '보통' },
  { id: 'jeju-crater', mountainId: 'jeju', course: '분화구 둘레 걷기', km: 3, minutes: 90, difficulty: '보통' },
  { id: 'jeju-forest', mountainId: 'jeju', course: '오름 자락 숲 산책', km: 1.8, minutes: 45, difficulty: '쉬움' },
  { id: 'seorak-valley', mountainId: 'seoraksan', course: '비선대 계곡 걷기', km: 6, minutes: 150, difficulty: '보통' },
  { id: 'seorak-rock', mountainId: 'seoraksan', course: '울산바위 전망 산행', km: 7.6, minutes: 260, difficulty: '어려움' },
].map(course => ({ ...course, ...publishedGuides[course.id], mountain: hikes.find(hike => hike.id === course.mountainId).mountain })).sort((a, b) => Number(Boolean(b.source)) - Number(Boolean(a.source)));

function bookmarkTime(type, id) {
  const saved = localStorage.getItem(`chabak.${type}-bookmark.${id}`);
  if (saved === null) return null;
  return saved === 'true' ? 0 : Number(saved);
}
