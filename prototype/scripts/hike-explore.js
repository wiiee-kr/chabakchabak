// 산 ID별로 차박차박의 실제 방문 영상만 [{ youtubeId, title }] 형식으로 등록한다.
const mountainVisitVideos = {
  bukhansan: [{ youtubeId: 'Rxdx86RJ02c', title: '서울 한복판에 가을냄새 한가득, 이렇게 아름다웠나 북한산' }],
  odaesan: [
    { youtubeId: 'BWqWyIJ9Jpw', title: '1년을 기다린 가을풍경, 온 산이 붉게 물드는 오대산' },
    { youtubeId: 'eXEEpeKt4yo', title: '이번에 놓치면 100% 후회하는 단풍산책 천년의 숲길' }
  ],
  jeju: [{ youtubeId: 'c657fKHZxY0', title: '바람이 이끄는 대로 제주도 오름여행 4박5일' }],
  seoraksan: [
    { youtubeId: 'iWVZMW01Emo', title: '비 오는 7월 여름, 설악산 1450m 대피소에서 하룻밤' },
    { youtubeId: 'EmCKi4kFczE', title: '설악산 깊은 온천마을 면역증진 48시간 《제1부 남설악》' },
    { youtubeId: 'olAkILqYiho', title: '설악산의 심장을 걷는 장엄한 4암자 순례길 《제2부 내설악》' },
    { youtubeId: '-uuuF_1yyk8', title: '백두대간 가장 깊숙한 설악산 오지 고갯길 《제3부 북설악》' },
    { youtubeId: 'nHdCxpcgG-0', title: '외국인이 무조건 찾는다는 No.1 한국 풍경 《제4부 외설악》' },
    { youtubeId: '1DnqBoVlPsI', title: '공룡능선을 지나 1500m 대피소에서 하룻밤 《제5부 대청봉》' }
  ],
  sobaeksan: [
    { youtubeId: 'YVn_IMj3QMs', title: '4일 동안 가을로망 143km 소백산 자락길의 발자취 (풀버전)' },
    { youtubeId: 'n--CXzkyg44', title: '한여름 소백산, 700고지 달밭골에서 보낸 특별한 하룻밤' },
    { youtubeId: 'Lf34kZh5R84', title: '가을로망 143km 소백산 자락길을 스미듯 걷는다 (상편)' },
    { youtubeId: 's-_VANKxqwQ', title: '가을로망 143km 소백산 자락길이 선물한 풍경들 (하편)' }
  ]
};

async function syncVideoTitle(label, videoUrl) {
  try {
    const query = new URLSearchParams({ url: videoUrl, format: 'json' });
    const response = await fetch('https://www.youtube.com/oembed?' + query);
    if (!response.ok) return;
    const { title } = await response.json();
    if (typeof title === 'string' && title.trim()) label.textContent = field(title, 'title');
  } catch {
    // 오프라인에서는 등록된 제목을 그대로 표시한다.
  }
}

function renderMountainVideos(mountainId) {
  const videos = mountainVisitVideos[mountainId] || [];
  const links = videos.map(({ youtubeId, title }) => {
    const link = document.createElement('a');
    link.href = 'https://www.youtube.com/watch?v=' + encodeURIComponent(youtubeId);
    const thumbnail = document.createElement('img');
    thumbnail.src = 'https://i.ytimg.com/vi/' + encodeURIComponent(youtubeId) + '/hqdefault.jpg';
    thumbnail.alt = '';
    thumbnail.loading = 'lazy';
    const label = document.createElement('span');
    label.textContent = title;
    link.append(thumbnail, label);
    syncVideoTitle(label, link.href);
    return link;
  });
  byId('mountain-video-list').replaceChildren(...links);
  byId('mountain-videos').hidden = links.length === 0;
}

const byId = id => document.getElementById(id);
const tabs = [...document.querySelectorAll('.hike-tabs [role="tab"]')];
const regionButtons = [...document.querySelectorAll('[data-region]')];
const difficultyFilter = byId('course-difficulty');
const durationFilter = byId('course-duration');
let region = '';

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  return [hours && `${hours}시간`, minutes % 60 && `${minutes % 60}분`].filter(Boolean).join(' ');
}

function sourceName(source) {
  if (!source) return '';
  const host = new URL(source).hostname;
  if (host === 'access.visitkorea.or.kr') return '한국관광공사 열린관광 모두의 여행';
  if (host.endsWith('durunubi.kr')) return '한국관광공사 두루누비';
  if (host.endsWith('knps.or.kr')) return '국립공원공단';
  if (host === 'gonggam.korea.kr') return '대한민국 정책주간지 K-공감';
  if (host.endsWith('yeongju.go.kr')) return '영주시';
  if (host.endsWith('trueagency.co.kr')) return '세화마을협동조합';
  if (host.endsWith('korea.kr')) return '대한민국 정책브리핑';
  return '한국관광공사 대한민국 구석구석';
}

// 화면 주석은 ‘화면 변수별 출처’ 시트의 1순위 API 응답 필드명을 표시한다.
function field(value, responseField) {
  if (value == null) return '';
  return responseField ? value + ' (' + responseField + ')' : String(value);
}

function mountainField(hike, value, responseField) {
  // 제주 오름은 개별 산 레코드가 아닌 운영 묶음이다.
  return field(value, (hike.mountainId || hike.id) === 'jeju' ? null : responseField);
}

const metricFields = { km: 'stretLt', minutes: 'reqreTime', difficulty: '숲길구간난이도' };
const facilityFields = {
  transport: '교통편설명',
  toilets: 'RSTRM_NM',
  water: 'plcTypeCd, plcNm, explnCn',
  shops: 'plcTypeCd, plcNm, explnCn'
};

function metric(course, key) {
  let value = course[key];
  if (key === 'difficulty' && !value) value = course.sectionGrade;
  if (value == null) return '';
  if (key === 'km') value += 'km';
  if (key === 'minutes') {
    value = formatDuration(value);
    if (course.maxMinutes) value += ' ~ ' + formatDuration(course.maxMinutes);
  }
  return field(value, metricFields[key]);
}

const mountainTraits = new Map();
const categoryLabels = new Map([
  ['분류:대한민국의 국립공원', '국립공원'],
  ['분류:백두대간', '백두대간'],
  ['분류:한북정맥', '한북정맥'],
  ['분류:서울특별시의 명승', '서울특별시 명승'],
  ['분류:강원특별자치도의 명승', '강원특별자치도 명승'],
]);

function coursesForMountain(id) {
  return courses.filter(course => course.mountainId === id);
}

function renderMountainTraits(container, mountain) {
  const labels = mountainTraits.get(mountain) || [];
  container.replaceChildren(...labels.map(label => {
    const chip = document.createElement('span');
    chip.textContent = field(label, 'query.pages[].categories[].title');
    chip.title = '한국어 위키백과 · ' + mountain;
    return chip;
  }));
  if (container.dataset.mountainId) {
    const countChip = document.createElement('span');
    countChip.textContent = coursesForMountain(container.dataset.mountainId).length + '코스';
    container.append(countChip);
  }
}

async function loadMountainTraits() {
  const params = new URLSearchParams({
    action: 'query', format: 'json', formatversion: '2', origin: '*',
    prop: 'categories', cllimit: 'max', clcategories: [...categoryLabels.keys()].join('|'),
    titles: hikes.filter(hike => hike.id !== 'jeju').map(hike => hike.mountain).join('|'),
  });
  try {
    const response = await fetch('https://ko.wikipedia.org/w/api.php?' + params);
    if (!response.ok) return;
    const data = await response.json();
    for (const page of data.query?.pages || []) {
      const labels = (page.categories || []).map(category => categoryLabels.get(category.title)).filter(Boolean);
      mountainTraits.set(page.title, labels);
    }
    document.querySelectorAll('[data-traits-for]').forEach(container => {
      renderMountainTraits(container, container.dataset.traitsFor);
    });
  } catch {
    // 조회할 수 없는 특징은 표시하지 않는다.
  }
}

function renderList(id, items, type, fromMountain = false, searchSuffix = null) {
  byId(id).innerHTML = items.map(hike => {
    const isMountain = type === 'mountain';
    const name = isMountain ? hike.mountain : hike.course;
    if (id === 'mountain-list') {
      return `<li><a class="hike-row" href="#mountain/${hike.id}">
        ${hikeThumbnail(hike)}
        <span><span class="hike-row__region">${mountainField(hike, hike.regions.join(' · '), 'ctpvNm')}</span><strong>${mountainField(hike, name, 'frtrlNm')}</strong><span class="hike-row__chips" data-traits-for="${name}" data-mountain-id="${hike.id}"></span></span>
      </a></li>`;
    }
    let meta;
    if (isMountain) {
      meta = mountainField(hike, hike.regions.join(' · '), 'ctpvNm');
    } else {
      const grade = metric(hike, 'difficulty');
      const difficulty = grade && `<span data-level="${hike.difficulty || ''}">${grade}</span>`;
      const distance = metric(hike, 'km');
      const duration = metric(hike, 'minutes');
      const parts = fromMountain ? [difficulty, distance, duration] : [mountainField(hike, hike.mountain, 'frtrlNm'), distance, duration, difficulty];
      meta = parts.filter(Boolean).join(' · ');
    }
    const bookmark = fromMountain ? `<button type="button" class="course-bookmark" data-course-id="${hike.id}"
      aria-label="${name} 북마크" aria-pressed="${bookmarkTime('course', hike.id) !== null}">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v15l-7-4z"/></svg>
    </button>` : '';
    const from = searchSuffix ?? (isMountain ? '' : fromMountain ? '/mountain' : '/courses');
    return `<li><a class="hike-row" href="#${type}/${hike.id}${from}">
      ${hikeThumbnail(hike)}
      <span><strong>${isMountain ? mountainField(hike, name, 'frtrlNm') : field(name, 'stretNm')}</strong><span class="hike-row__meta">${meta}</span></span>
    </a>${bookmark}</li>`;
  }).join('');
  if (id === 'mountain-list') {
    byId(id).querySelectorAll('[data-traits-for]').forEach(container => {
      renderMountainTraits(container, container.dataset.traitsFor);
    });
  }
}

function filterMountains() {
  const matches = hikes.filter(hike => !region || hike.regions.includes(region));
  renderList('mountain-list', matches, 'mountain');
  byId('mountain-empty').hidden = matches.length > 0;
}

function filterCourses() {
  const matches = courses.filter(hike => {
    const timeBand = hike.minutes == null ? null : hike.minutes <= 120 ? 'short' : hike.minutes <= 240 ? 'medium' : 'long';
    return (!difficultyFilter.value || hike.difficulty === difficultyFilter.value)
      && (!durationFilter.value || timeBand === durationFilter.value);
  });
  renderList('course-list', matches, 'course');
  byId('course-empty').hidden = matches.length > 0;
}

function selectTab(selected) {
  for (const tab of tabs) {
    const active = tab === selected;
    tab.setAttribute('aria-selected', active);
    tab.tabIndex = active ? 0 : -1;
    byId(tab.getAttribute('aria-controls')).hidden = !active;
  }
}


function updateMountainTitle() {
  if (!byId('hike-detail').hidden) {
    byId('hike-detail-bar').hidden = window.scrollY < 8;
  }
}

window.addEventListener('scroll', updateMountainTitle, { passive: true });

const levelHelp = byId('mt-level-help');
const levelTip = byId('mt-level-tip');
function showLevelTip(open) {
  levelTip.hidden = !open;
  levelHelp.setAttribute('aria-expanded', String(open));
}
levelHelp.addEventListener('click', () => showLevelTip(levelTip.hidden));
document.addEventListener('click', event => {
  if (!levelTip.hidden && !levelHelp.parentElement.contains(event.target)) showLevelTip(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !levelTip.hidden) {
    showLevelTip(false);
    levelHelp.focus();
  }
});

const bookmarkButton = byId('mountain-bookmark');
function toggleBookmark(button, key) {
  const selected = button.getAttribute('aria-pressed') !== 'true';
  if (selected) localStorage.setItem(key, String(Date.now()));
  else localStorage.removeItem(key);
  button.setAttribute('aria-pressed', String(selected));
}

bookmarkButton.addEventListener('click', () => {
  toggleBookmark(bookmarkButton, 'chabak.mountain-bookmark.' + bookmarkButton.dataset.mountainId);
});

byId('hike-mountain-course-list').addEventListener('click', event => {
  const button = event.target.closest('button[data-course-id]');
  if (button) toggleBookmark(button, 'chabak.course-bookmark.' + button.dataset.courseId);
});

byId('mountain-course-cta').addEventListener('click', () => {
  const heading = byId('hike-mountain-courses');
  heading.focus({ preventScroll: true });
  heading.scrollIntoView({ block: 'start' });
});

function setCourseField(element, text) {
  const split = text.lastIndexOf(' (');
  if (split < 0) {
    element.textContent = text;
    return;
  }
  const annotation = document.createElement('small');
  annotation.className = 'field-name';
  annotation.textContent = text.slice(split + 1);
  element.replaceChildren(text.slice(0, split), ' ', annotation);
}

byId('course-detail-bookmark').addEventListener('click', event => {
  const button = event.currentTarget;
  toggleBookmark(button, 'chabak.course-bookmark.' + button.dataset.courseId);
});

const sourceSheet = byId('hike-sources');
const options = byId('hike-options');
byId('open-sources').addEventListener('click', () => {
  options.hidePopover();
  byId('hike-more').focus();
  sourceSheet.showModal();
});
sourceSheet.addEventListener('click', event => {
  if (event.target !== sourceSheet) return;
  const bounds = sourceSheet.getBoundingClientRect();
  if (event.clientY < bounds.top || event.clientX < bounds.left || event.clientX > bounds.right) sourceSheet.close();
});

function renderSources(hike, isCourse) {
  const sources = [];
  if (isCourse) {
    if (hike.extraSources) sources.push(...hike.extraSources);
    if (hike.source) sources.push([sourceName(hike.source) + ' · ' + hike.course, hike.source]);
  } else {
    sources.push(hike.id === 'jeju'
      ? ['두루누비 · 제주올레 코스 자료', dnb('0000001276')]
      : ['산림청 100대 명산 · 이름·소재지·높이', forestBook]);
    if (hike.profileSource) sources.push(['숲나들e · ' + hike.mountain + ' 개요', hike.profileSource]);
    if (hike.latitude != null) sources.push(['기상청 정상 예보 지점 · ' + hike.latitude + ', ' + hike.longitude, summitStationSource]);
  }
  const photo = hikePhoto(hike);
  if (photo?.source) {
    sources.push([['썸네일 정보', photo.place, photo.author, photo.license].filter(Boolean).join(' · '), photo.source]);
  }
  byId('source-list').replaceChildren(...sources.map(([label, url]) => {
    const row = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = label;
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    row.append(link);
    return row;
  }));
  byId('sources-empty').hidden = sources.length > 0;
}

const searchInput = byId('hike-query');

byId('home-search-link').addEventListener('click', event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  location.hash = event.currentTarget.hash;
  // Focus within the tap so mobile browsers can open the keyboard.
  byId('hike-search').hidden = false;
  searchInput.focus({ preventScroll: true });
});

function renderSearch() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  byId('home-search-prompt').hidden = Boolean(query);
  byId('search-results').hidden = !query;
  if (!query) return;
  const matches = values => values.flat().filter(Boolean).join(' ').toLocaleLowerCase().includes(query);
  const mountains = hikes.filter(hike => matches([hike.mountain, hike.location, hike.regions]));
  const routes = courses.filter(course => matches([course.course, course.mountain, course.area, course.stops]));
  const params = new URLSearchParams(location.hash.split('?')[1]);
  const suffix = '/search?' + params.toString().replaceAll('&', '&amp;');
  renderList('search-mountains', mountains, 'mountain', false, suffix);
  renderList('search-courses', routes, 'course', false, suffix);
  byId('search-mountains-empty').hidden = mountains.length > 0;
  byId('search-courses-empty').hidden = routes.length > 0;
}

searchInput.addEventListener('input', () => {
  const params = new URLSearchParams(location.hash.split('?')[1]);
  if (searchInput.value) params.set('q', searchInput.value);
  else params.delete('q');
  history.replaceState(null, '', '#search' + (params.size ? '?' + params : ''));
  renderSearch();
});

function showScreen() {
  showLevelTip(false);
  const [path, params] = location.hash.slice(1).split('?');
  const [screen, id, from] = path.split('/');
  const isSearch = screen === 'search';
  const hike = (screen === 'course' ? courses : hikes).find(item => item.id === id);
  const isMountain = screen === 'mountain' && Boolean(hike);
  const isCourse = screen === 'course' && Boolean(hike);
  const isHome = !isMountain && !isCourse && !isSearch;
  byId('hike-home').hidden = !isHome;
  byId('hike-detail').hidden = !isMountain && !isCourse;
  byId('hike-search').hidden = !isSearch;
  if (isSearch) {
    const searchParams = new URLSearchParams(params);
    searchInput.value = searchParams.get('q') || '';
    byId('search-back').href = searchParams.get('tab') === 'courses' ? '#courses' : '#home';
    renderSearch();
    if (!searchInput.value) searchInput.focus();
  }
  if (isHome) byId('home-search-link').href = screen === 'courses' ? '#search?tab=courses' : '#search';
  byId('hike-mountain-detail').hidden = !isMountain;
  byId('hike-course-detail').hidden = !isCourse;
  if (options.matches(':popover-open')) options.hidePopover();
  if (sourceSheet.open) sourceSheet.close();
  if (isMountain || isCourse) renderSources(hike, isCourse);
  document.body.classList.toggle('has-bottom-nav', isHome);

  if (isHome) selectTab(byId(screen === 'courses' ? 'course-tab' : 'mountain-tab'));
  if (isMountain) {
    byId('hike-back').href = from === 'bookmarks' ? 'my-settings.html#bookmarks' : '#home';
    byId('hike-mountain-name').textContent = mountainField(hike, hike.mountain, 'frtrlNm');
    byId('hike-detail-bar').textContent = mountainField(hike, hike.mountain, 'frtrlNm');
    showHikeCover('mountain-cover', hike);
    const { location: locationLabel, heightM, description } = hike;
    const isGroup = hike.id === 'jeju';
    byId('hike-mountain-region').textContent = mountainField(hike, locationLabel, 'addrNm');
    const traits = byId('mt-traits');
    traits.dataset.traitsFor = hike.mountain;
    renderMountainTraits(traits, hike.mountain);
    byId('mt-description').textContent = mountainField(hike, description, 'mntidetails');
    byId('mt-peak').textContent = isGroup ? '오름별 상이' : field(heightM.toLocaleString('ko-KR') + 'm', 'aslAltide');
    const verified = courses.filter(course => course.mountainId === id && course.source && course.difficulty);
    const levels = ['쉬움', '보통', '어려움'];
    const score = verified.reduce((sum, course) => sum + levels.indexOf(course.difficulty), 0);
    const level = verified.length ? levels[Math.round(score / verified.length)] : '확인 중';
    const label = verified.length === 1 ? '코스 난이도' : '평균 난이도';
    levelHelp.querySelector('span').textContent = label;
    levelHelp.setAttribute('aria-label', label + ' 안내');
    levelTip.textContent = verified.length > 1
      ? `등록된 코스 중 난이도가 확인된 ${verified.length}개의 평균이에요. 쉬움·보통·어려움을 1~3점으로 환산해 반올림해요.`
      : verified.length === 1 ? `${verified[0].course} 1개의 난이도예요.` : '확인된 코스 난이도가 아직 없어요.';
    byId('mt-level').textContent = verified.length ? field(level, metricFields.difficulty) : level;
    byId('mt-level').dataset.level = level;
    renderMountainVideos(id);
    const notices = document.querySelector('.mt-notices');
    notices.scrollLeft = 0;
    for (const notice of notices.children) notice.open = false;
    const mountainCourses = coursesForMountain(id);
    renderList('hike-mountain-course-list', mountainCourses, 'course', true);
    byId('mountain-course-cta').textContent = hike.mountain + ' 코스 ' + mountainCourses.length;
    bookmarkButton.dataset.mountainId = id;
    bookmarkButton.setAttribute('aria-pressed', String(bookmarkTime('mountain', id) !== null));
    updateMountainTitle();
  }
  if (isCourse) {
    byId('course-packing-cta').href = 'packing.html?' + new URLSearchParams({ courseId: hike.id, courseTitle: hike.course });
    byId('hike-detail-bar').textContent = hike.course;
    byId('hike-detail-bar').hidden = window.scrollY < 8;
    byId('hike-back').href = from === 'bookmarks' ? 'my-settings.html#bookmarks/courses' : from === 'mountain' ? `#mountain/${hike.mountainId}` : from === 'courses' ? '#courses' : '#home';
    showHikeCover('course-cover', hike);
    setCourseField(byId('hike-course-name'), field(hike.course, 'stretNm'));
    const region = byId('hike-course-mountain');
    const mountainLink = document.createElement('a');
    mountainLink.href = '#mountain/' + hike.mountainId;
    setCourseField(mountainLink, mountainField(hike, hike.mountain, 'frtrlNm'));
    region.replaceChildren(mountainLink);
    if (hike.area) {
      const area = document.createElement('span');
      setCourseField(area, field(hike.area, 'beginRdnmadr, endRdnmadr'));
      region.append(' · ', area);
    }
    const stops = hike.stops || [];
    renderCourseMap(byId('course-map'), hike, stops);
    byId('course-stops').replaceChildren(...stops.map((stop, index) => {
      const point = document.createElement('li');
      const label = document.createElement('small');
      label.textContent = index === 0 ? '출발' : index === stops.length - 1 ? '도착' : '경유';
      const name = document.createElement('span');
      setCourseField(name, field(stop, 'coursInfo'));
      point.append(label, name);
      return point;
    }));
    byId('course-route-caption').hidden = stops.length > 0;
    byId('course-guide').hidden = !hike.guide;
    setCourseField(byId('course-guide'), field(hike.guide, 'stretIntrcn'));
    const stats = byId('course-stats');
    for (const [key, target] of [['km','detail-distance'], ['minutes','detail-duration'], ['difficulty','detail-difficulty']]) {
      const element = byId(target);
      const text = metric(hike, key) || (key === 'difficulty' ? '등급 정보 없음' : '');
      element.parentElement.hidden = !text;
      setCourseField(element, text);
    }
    stats.hidden = !stats.querySelector('div:not([hidden])');
    byId('detail-difficulty').dataset.level = hike.difficulty || '';
    const saved = byId('course-detail-bookmark');
    saved.dataset.courseId = id;
    saved.setAttribute('aria-pressed', String(bookmarkTime('course', id) !== null));
    const facilities = byId('course-facilities');
    facilities.replaceChildren();
    for (const [key, label] of [['transport','교통 안내'], ['parking','주차'], ['toilets','화장실'], ['water','식수'], ['shops','매점'], ['amenities','편의시설']]) {
      if (!hike[key]) continue;
      const term = document.createElement('dt');
      const detail = document.createElement('dd');
      term.textContent = label;
      setCourseField(detail, field(hike[key], facilityFields[key]));
      facilities.append(term, detail);
    }
    byId('course-facilities-section').hidden = !facilities.children.length;
  }
  if ((isMountain || isCourse) && from === 'search') byId('hike-back').href = '#search' + (params ? '?' + params : '');
  document.title = `차박차박 · ${isSearch ? '검색' : isCourse ? hike.course : isMountain ? hike.mountain : '홈'}`;
}

for (const tab of tabs) {
  tab.addEventListener('click', () => {
    history.replaceState(null, '', tab.id === 'course-tab' ? '#courses' : '#home');
    showScreen();
  });
  tab.addEventListener('keydown', event => {
    const targets = { ArrowLeft: tabs.find(item => item !== tab), ArrowRight: tabs.find(item => item !== tab), Home: tabs[0], End: tabs.at(-1) };
    const next = targets[event.key];
    if (!next) return;
    event.preventDefault();
    next.click();
    next.focus();
  });
}

for (const button of regionButtons) {
  button.addEventListener('click', () => {
    region = button.dataset.region;
    for (const option of regionButtons) option.setAttribute('aria-pressed', option === button);
    filterMountains();
  });
}
difficultyFilter.addEventListener('change', filterCourses);
durationFilter.addEventListener('change', filterCourses);
byId('hike-share').addEventListener('click', async () => {
  const url = location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, url });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }
  window.prompt('상세페이지 링크를 복사해 주세요.', url);
});

document.querySelector('.hike-feature h1').textContent = field(featuredCourse.course, 'stretNm');
window.addEventListener('hashchange', () => {
  showScreen();
  window.scrollTo(0, 0);
});
filterMountains();
filterCourses();
showScreen();

loadMountainTraits();

byId('featured-photo').src = hikePhoto(featuredCourse).src;
