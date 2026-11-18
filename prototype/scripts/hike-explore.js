const mountainProfiles = {
  sobaeksan: ['경북 영주시 · 충북 단양군 일대', ['국립공원', '능선', '초원'], '1,439m', '소백산은 능선을 따라 넓은 초원이 펼쳐지는 산이에요. 바람에 풀이 일렁이는 모습을 보며 잠시 쉬어 가기 좋아요.'],
  bukhansan: ['서울 · 경기 북부', ['국립공원', '암릉'], '836m', '북한산은 서울 가까이에서 큼직한 바위 봉우리를 만날 수 있는 산이에요. 능선에서 내려다보면 산자락 너머로 익숙한 도시 풍경이 펼쳐져요.'],
  odaesan: ['강원 평창군 일대', ['국립공원', '숲길'], '1,563m', '오대산은 나무가 빼곡한 숲길이 매력적인 산이에요. 잠시 걸음을 늦추고 나뭇잎 사이로 들어오는 햇살과 바람 소리를 느껴 보세요.'],
  jeju: ['제주특별자치도', ['오름'], '오름별 상이', '제주 곳곳에는 오름이라 부르는 작은 화산들이 있어요. 둥근 능선이 이어지는 곳도, 숲이 우거진 곳도 있어 골라 걷는 재미가 있어요.'],
  seoraksan: ['강원 속초시 · 인제군 일대', ['국립공원', '암릉'], '1,708m', '설악산은 뾰족한 바위 봉우리들이 겹겹이 솟아 있는 산이에요. 계곡을 따라 걸으며 올려다볼 때와 능선에서 바라볼 때의 풍경이 사뭇 달라요.']
};

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
    if (typeof title === 'string' && title.trim()) label.textContent = title;
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
let mode = 'difficulty';
const values = { difficulty: '', duration: '' };
let region = '';

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  return [hours && `${hours}시간`, minutes % 60 && `${minutes % 60}분`].filter(Boolean).join(' ');
}

function renderList(id, items, type, fromMountain = false) {
  byId(id).innerHTML = items.map(hike => {
    const isMountain = type === 'mountain';
    const name = isMountain ? hike.mountain : hike.course;
    let meta;
    if (isMountain) {
      meta = hike.regions.join(' · ');
    } else {
      const difficulty = `<span data-level="${hike.difficulty}">${hike.difficulty}</span>`;
      const distanceAndTime = `${hike.km}km · ${formatDuration(hike.minutes)}`;
      meta = fromMountain
        ? `${difficulty} · ${distanceAndTime}`
        : `${hike.mountain} · ${distanceAndTime} · ${difficulty}`;
      if (!hike.source) meta += ' · 시연용';
    }
    const bookmark = fromMountain ? `<button type="button" class="course-bookmark" data-course-id="${hike.id}"
      aria-label="${name} 북마크" aria-pressed="${bookmarkTime('course', hike.id) !== null}">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v15l-7-4z"/></svg>
    </button>` : '';
    const from = fromMountain ? '/mountain' : '/courses';
    return `<li><a class="hike-row" href="#${type}/${hike.id}${isMountain ? '' : from}">
      <span class="terrain hike-row__image" data-range="${hike.mountainId || hike.id}" aria-hidden="true"></span>
      <span><strong>${name}</strong><span class="hike-row__meta">${meta}</span></span>
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
    const timeBand = hike.minutes <= 120 ? 'short' : hike.minutes <= 240 ? 'medium' : 'long';
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
    byId('hike-mountain-name').textContent = hike.mountain;
    byId('hike-detail-bar').textContent = hike.mountain;
    const cover = byId('mountain-cover');
    cover.dataset.range = hike.id;
    cover.setAttribute('aria-label', hike.mountain + ' 산 능선 일러스트');
    const [locationLabel, traits, peak, description] = mountainProfiles[hike.id];
    byId('hike-mountain-region').textContent = locationLabel;
    byId('mt-traits').replaceChildren(...traits.map(trait => {
      const chip = document.createElement('span');
      chip.textContent = trait;
      return chip;
    }));
    byId('mt-description').textContent = description;
    byId('mt-peak').textContent = peak;
    const verified = courses.filter(course => course.mountainId === id && course.source);
    const levels = ['쉬움', '보통', '어려움'];
    const score = verified.reduce((sum, course) => sum + levels.indexOf(course.difficulty), 0);
    const level = verified.length ? levels[Math.round(score / verified.length)] : '확인 중';
    const label = verified.length === 1 ? '코스 난이도' : '평균 난이도';
    levelHelp.querySelector('span').textContent = label;
    levelHelp.setAttribute('aria-label', label + ' 안내');
    levelTip.textContent = verified.length > 1
      ? `등록된 코스 중 난이도가 확인된 ${verified.length}개의 평균이에요. 쉬움·보통·어려움을 1~3점으로 환산해 반올림해요.`
      : verified.length === 1 ? `${verified[0].course} 1개의 난이도예요.` : '확인된 코스 난이도가 아직 없어요.';
    byId('mt-level').textContent = level;
    byId('mt-level').dataset.level = level;
    renderMountainVideos(id);
    const notices = document.querySelector('.mt-notices');
    notices.scrollLeft = 0;
    for (const notice of notices.children) notice.open = false;
    const mountainCourses = courses.filter(course => course.mountainId === id);
    renderList('hike-mountain-course-list', mountainCourses, 'course', true);
    byId('mountain-course-cta').textContent = hike.mountain + ' 코스 ' + mountainCourses.length;
    bookmarkButton.dataset.mountainId = id;
    bookmarkButton.setAttribute('aria-pressed', String(bookmarkTime('mountain', id) !== null));
    updateMountainTitle();
  }
  if (isCourse) {
    byId('hike-detail-bar').hidden = false;
    byId('hike-detail-bar').textContent = '코스 상세';
    byId('hike-back').href = from === 'bookmarks' ? 'my-settings.html#bookmarks/courses' : from === 'mountain' ? `#mountain/${hike.mountainId}` : from === 'courses' ? '#courses' : '#home';
    byId('hike-course-name').textContent = hike.course;
    byId('hike-course-mountain').textContent = hike.mountain;
    const source = byId('course-source');
    source.hidden = !hike.source;
    source.href = hike.source || '';
    source.textContent = hike.sourceLabel || '한국관광공사 두루누비';
    byId('course-demo-note').hidden = Boolean(hike.source);
    if (hike.area) byId('hike-course-mountain').textContent += ' · ' + hike.area;
    byId('course-stops').replaceChildren(...(hike.stops || ['출발', '경유', '도착']).map(stop => {
      const point = document.createElement('li');
      point.textContent = stop;
      return point;
    }));
    byId('course-route-caption').hidden = Boolean(hike.stops);
    byId('course-demo-steps').hidden = Boolean(hike.guide);
    byId('course-guide').textContent = hike.guide || '';
    byId('course-guide').hidden = !hike.guide;
    byId('detail-distance').textContent = `${hike.km}km`;
    byId('detail-duration').textContent = formatDuration(hike.minutes);
    byId('detail-difficulty').textContent = hike.difficulty;
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

window.addEventListener('hashchange', () => {
  showScreen();
  window.scrollTo(0, 0);
});
filterMountains();
filterCourses();
showScreen();
