// 산 ID별로 차박차박의 실제 방문 영상만 [{ youtubeId, title }] 형식으로 등록한다.
const mountainVisitVideos = {
  bukhansan: [{ youtubeId: 'Rxdx86RJ02c', title: '서울 한복판에 가을냄새 한가득, 이렇게 아름다웠나 북한산' }]
};

async function syncVideoTitle(label, videoUrl) {
  try {
    const query = new URLSearchParams({ url: videoUrl, format: 'json' });
    const response = await fetch('https://www.youtube.com/oembed?' + query);
    if (!response.ok) return;
    const { title } = await response.json();
    if (typeof title === 'string' && title.trim()) label.textContent = field(title, 'oEmbed.title');
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
    label.textContent = field(title, 'video.title');
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
let mode = 'difficulty';
const values = { difficulty: '', duration: '' };
let region = '';

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  return [hours && `${hours}시간`, minutes % 60 && `${minutes % 60}분`].filter(Boolean).join(' ');
}

function sourceName(source) {
  if (!source) return '';
  const host = new URL(source).hostname;
  if (host.endsWith('durunubi.kr')) return '한국관광공사 두루누비';
  if (host.endsWith('knps.or.kr')) return '국립공원공단';
  if (host.endsWith('korea.kr')) return '대한민국 정책브리핑';
  return '한국관광공사 대한민국 구석구석';
}

function fieldLabel(path, original) {
  return '(' + path + (original ? ' · ' + original : '') + ')';
}

function field(value, path, original) {
  return value == null ? '미확인' : value + ' ' + fieldLabel(path, original);
}

function metric(course, key) {
  const originals = {
    km: ['길이', '코스거리'],
    minutes: ['소요시간', '코스소요시간'],
    difficulty: ['난이도', '코스난이도']
  };
  const isDurunubi = course.source?.includes('durunubi.kr');
  const isArchive = course.source?.includes('archive.knps.or.kr');
  const original = key === 'minutes' && course.timeOrigin ? course.timeOrigin : isDurunubi ? originals[key][0] : isArchive ? originals[key][1] : '';
  let value = course[key];
  if (value == null) return '미확인';
  if (key === 'km') value += 'km';
  if (key === 'minutes') {
    value = formatDuration(value);
    if (course.maxMinutes) return field(value + ' ~ ' + formatDuration(course.maxMinutes), 'course.minutes, course.maxMinutes');
  }
  return field(value, 'course.' + key, course.rawGrade && key === 'difficulty' ? '원문 ' + course.rawGrade : original);
}

function renderList(id, items, type, fromMountain = false) {
  byId(id).innerHTML = items.map(hike => {
    const isMountain = type === 'mountain';
    const name = isMountain ? hike.mountain : hike.course;
    let meta;
    if (isMountain) {
      meta = field(hike.regions.join(' · '), 'mountain.regions');
    } else {
      const difficulty = `<span data-level="${hike.difficulty || ''}">${metric(hike, 'difficulty')}</span>`;
      const distanceAndTime = `${metric(hike, 'km')} · ${metric(hike, 'minutes')}`;
      meta = fromMountain
        ? `${difficulty} · ${distanceAndTime}`
        : `${field(hike.mountain, 'course.mountain')} · ${distanceAndTime} · ${difficulty}`;

    }
    const bookmark = fromMountain ? `<button type="button" class="course-bookmark" data-course-id="${hike.id}"
      aria-label="${name} 북마크" aria-pressed="${bookmarkTime('course', hike.id) !== null}">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v15l-7-4z"/></svg>
    </button>` : '';
    const from = fromMountain ? '/mountain' : '/courses';
    return `<li><a class="hike-row" href="#${type}/${hike.id}${isMountain ? '' : from}">
      <span class="terrain hike-row__image" data-range="${hike.mountainId || hike.id}" aria-hidden="true"></span>
      <span><strong>${field(name, isMountain ? 'mountain.mountain' : 'course.course')}</strong><span class="hike-row__meta">${meta}</span></span>
    </a>${bookmark}</li>`;
  }).join('');
}

function filterMountains() {
  const matches = hikes.filter(hike => !region || hike.regions.includes(region));
  renderList('mountain-list', matches, 'mountain');
  byId('mountain-empty').hidden = matches.length > 0;
}

function filterCourses() {
  const matches = courses.filter(hike => {
    const timeBand = hike.minutes == null ? null : hike.minutes <= 120 ? 'short' : hike.minutes <= 240 ? 'medium' : 'long';
    return !values[mode] || values[mode] === (mode === 'difficulty' ? hike.difficulty : timeBand);
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
  if (!byId('hike-mountain-detail').hidden) {
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

function showScreen() {
  showLevelTip(false);
  const [screen, id, from] = location.hash.slice(1).split('/');
  const hike = (screen === 'course' ? courses : hikes).find(item => item.id === id);
  const isMountain = screen === 'mountain' && Boolean(hike);
  const isCourse = screen === 'course' && Boolean(hike);
  const isHome = !isMountain && !isCourse;
  byId('hike-home').hidden = !isHome;
  byId('hike-detail').hidden = isHome;
  byId('hike-mountain-detail').hidden = !isMountain;
  byId('hike-course-detail').hidden = !isCourse;
  byId('mountain-share-actions').hidden = !isMountain;
  document.body.classList.toggle('has-bottom-nav', isHome);

  if (isHome) selectTab(byId(screen === 'courses' ? 'course-tab' : 'mountain-tab'));
  if (isMountain) {
    byId('hike-back').href = from === 'bookmarks' ? 'my-settings.html#bookmarks' : '#home';
    byId('hike-mountain-name').textContent = field(hike.mountain, 'mountain.mountain');
    byId('hike-detail-bar').textContent = field(hike.mountain, 'mountain.mountain');
    const cover = byId('mountain-cover');
    cover.dataset.range = hike.id;
    cover.setAttribute('aria-label', hike.mountain + ' 산 능선 일러스트');
    const { location: locationLabel, traits, heightM, description } = hike;
    const isGroup = hike.id === 'jeju';
    const source = byId('mountain-source');
    const profile = byId('profile-source');
    profile.hidden = !hike.profileSource;
    if (hike.profileSource) profile.href = hike.profileSource;
    const station = byId('summit-station');
    station.hidden = hike.latitude == null;
    if (!station.hidden) {
      station.href = summitStationSource;
      station.textContent = '정상 예보 지점 ' + field(hike.latitude, 'mountain.latitude', '위도') + ' · ' + field(hike.longitude, 'mountain.longitude', '경도');
    }
    source.href = isGroup ? dnb('0000001276') : forestBook;
    source.textContent = isGroup ? '차박차박 지역 묶음 · 제주올레 코스 자료' : '산림청 100대 명산 · 이름·소재지·높이';
    byId('hike-mountain-region').textContent = field(locationLabel, 'mountain.location', isGroup ? '' : '소재지');
    byId('mt-traits').replaceChildren(...traits.map(trait => {
      const chip = document.createElement('span');
      chip.textContent = field(trait, 'mountain.traits');
      return chip;
    }));
    byId('mt-description').textContent = field(description, 'mountain.description', '편집 요약');
    byId('mt-peak').textContent = isGroup ? '오름별 상이' : field(heightM.toLocaleString('ko-KR') + 'm', 'mountain.heightM', '산높이');
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
    byId('mt-level').textContent = verified.length ? field(level, 'level', verified.length > 1 ? '코스 평균' : '단일 코스') : level;
    byId('mt-level').dataset.level = level;
    renderMountainVideos(id);
    const notices = document.querySelector('.mt-notices');
    notices.scrollLeft = 0;
    for (const notice of notices.children) notice.open = false;
    const mountainCourses = courses.filter(course => course.mountainId === id);
    renderList('hike-mountain-course-list', mountainCourses, 'course', true);
    byId('mountain-course-cta').textContent = hike.mountain + ' 코스 ' + field(mountainCourses.length, 'mountainCourses.length');
    bookmarkButton.dataset.mountainId = id;
    bookmarkButton.setAttribute('aria-pressed', String(bookmarkTime('mountain', id) !== null));
    updateMountainTitle();
  }
  if (isCourse) {
    byId('hike-detail-bar').hidden = false;
    byId('hike-detail-bar').textContent = '코스 상세';
    byId('hike-back').href = from === 'bookmarks' ? 'my-settings.html#bookmarks/courses' : from === 'mountain' ? `#mountain/${hike.mountainId}` : from === 'courses' ? '#courses' : '#home';
    byId('hike-course-name').textContent = field(hike.course, 'course.course');
    byId('hike-course-mountain').textContent = field(hike.mountain, 'course.mountain');
    const source = byId('course-source');
    source.hidden = !hike.source;
    source.href = hike.source || '';
    source.textContent = sourceName(hike.source);
    byId('course-demo-note').hidden = Boolean(hike.source);
    if (hike.area) byId('hike-course-mountain').textContent += ' · ' + field(hike.area, 'course.area');
    byId('course-stops').replaceChildren(...(hike.stops || []).map(stop => {
      const point = document.createElement('li');
      point.textContent = field(stop, 'course.stops');
      return point;
    }));
    byId('course-route-caption').hidden = Boolean(hike.stops);
    const trackSource = byId('course-track-source');
    trackSource.hidden = !hike.source?.includes('durunubi.kr');
    if (!trackSource.hidden) trackSource.href = hike.source;
    byId('course-demo-steps').hidden = true;
    const guide = hike.guide || (hike.stops ? hike.stops[0] + '에서 출발해 ' + hike.stops.at(-1) + '에 도착해요.' : '');
    byId('course-guide').textContent = guide ? field(guide, hike.guide ? 'course.guide' : 'course.stops', hike.guide ? '편집 요약' : '경로에서 생성') : '';
    byId('course-guide').closest('section').hidden = !guide;
    byId('course-guide').hidden = !guide;
    byId('detail-distance').textContent = metric(hike, 'km');
    byId('detail-duration').textContent = metric(hike, 'minutes');
    byId('detail-difficulty').textContent = metric(hike, 'difficulty');
    const facilities = byId('course-facilities');
    facilities.replaceChildren();
    for (const [key, label] of [['water','식수'], ['shops','매점'], ['transport','교통 안내'], ['toilets','화장실']]) {
      if (!hike[key]) continue;
      const term = document.createElement('dt');
      const detail = document.createElement('dd');
      term.textContent = label;
      detail.textContent = field(hike[key], 'course.' + key, label);
      facilities.append(term, detail);
    }
  }
  document.title = `차박차박 · ${isCourse ? hike.course : isMountain ? hike.mountain : '홈'}`;
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
for (const button of document.querySelectorAll('[data-mode]')) {
  button.onclick = () => {
    mode = button.dataset.mode;
    for (const option of document.querySelectorAll('[data-mode]')) {
      const active = option === button;
      option.setAttribute('aria-pressed', active);
      byId(option.dataset.mode).hidden = !active;
    }
    filterCourses();
  };
}
for (const button of document.querySelectorAll('[data-value]')) {
  button.onclick = () => {
    values[mode] = button.dataset.value;
    for (const option of byId(mode).querySelectorAll('button')) option.setAttribute('aria-pressed', option === button);
    filterCourses();
  };
}
byId('mountain-share').addEventListener('click', async () => {
  const url = location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, url });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }
  window.prompt('산 상세 링크를 복사해 주세요.', url);
});

document.querySelector('.hike-feature h1').textContent = field(featuredCourse.course, 'featuredCourse.course');
window.addEventListener('hashchange', () => {
  showScreen();
  window.scrollTo(0, 0);
});
filterMountains();
filterCourses();
showScreen();
