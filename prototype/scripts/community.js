'use strict';
(() => {
  const app = document.querySelector('#community');
  const dialog = document.querySelector('#dialog');
  const notice = document.querySelector('#notice');
  const storageKey = 'chabak-community-v1';
  const me = '나';
  const now = Date.now();
  const seed = {
    version: 1,
    posts: [
      { id: 'p1', title: '요즘 푹 빠진 취미가 있나요?', body: '저는 요즘 퇴근하고 짧게 그림을 그려요.\n잘 그리지는 못해도 하루를 마무리하는 시간이 생겨서 좋더라고요.\n\n다들 요즘 어떤 취미를 즐기고 있나요?', author: '소소', created: now - 3600000, likes: 3, liked: false, photo: '' },
      { id: 'p2', title: '주말에 읽기 좋은 책 추천해 주세요', body: '오랜만에 서점에 가려고 하는데 가볍게 읽을 수 있는 책이 궁금해요.\n최근에 재미있게 읽은 책이 있으면 알려주세요.', author: '책갈피', created: now - 7200000, likes: 5, liked: true, likedAt: now - 1800000, photo: '' },
      { id: 'p3', title: '오늘 작은 목표 하나 달성했어요', body: '미뤄두었던 책상 정리를 끝냈어요.\n마음까지 가벼워지네요.', author: me, created: now - 10800000, likes: 8, liked: false, photo: '' }
    ],
    comments: [
      { id: 'c1', post: 'p1', author: '느린오후', body: '저는 산책하면서 사진 찍고 있어요.', created: now - 1800000 },
      { id: 'c2', post: 'p1', author: me, body: '그림 좋네요! 저도 시작해 보고 싶어요.', created: now - 600000 }
    ],
    blocked: [], reports: []
  };
  let state = seed;
  let storageAvailable = true;
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored?.version === 1 && Array.isArray(stored.posts) && Array.isArray(stored.comments) && Array.isArray(stored.blocked) && Array.isArray(stored.reports)) state = stored;
  } catch { storageAvailable = false; }
  const icons = {
    back: '<path d="m14 6-6 6 6 6"/>',
    more: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    comment: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8Z"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><path d="m21 15-5-5L5 21"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const id = () => globalThis.crypto?.randomUUID?.() || `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const photoURL = value => /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value || '') ? value : '';
  const maxPhotos = 5;
  const photosOf = post => (Array.isArray(post?.photos) ? post.photos : [post?.photo]).filter(photoURL).slice(0, maxPhotos);
  const dateLabel = value => {
    const minutes = Math.max(0, Math.floor((Date.now() - value) / 60000));
    if (minutes < 1) return '방금';
    if (minutes < 60) return `${minutes}분 전`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 전`;
    return new Intl.DateTimeFormat('ko-KR', { month: 'numeric', day: 'numeric', timeZone: 'Asia/Seoul' }).format(value);
  };
  const visible = post => post && !state.blocked.includes(post.author);
  const postById = postId => state.posts.find(post => post.id === postId);
  const postComments = postId => state.comments.filter(comment => comment.post === postId && !state.blocked.includes(comment.author));
  const button = (label, action, extra = '', style = 'text-button') => `<button type="button" class="${style}" data-action="${action}" ${extra}>${label}</button>`;
  const avatar = author => `<span class="avatar" aria-hidden="true">${esc(author.slice(0, 1))}</span>`;
  let route = parseRoute();
  let returnRoute = '/';
  let reportReturn = '/';
  let draft = null;
  let draftBaseline = '';
  let photoBusy = false;
  let noticeTimer;
  let beforeDialogFocus;
  let dialogHandler = null;
  function parseRoute() { try { return decodeURIComponent(location.hash.slice(1)) || '/'; } catch { return '/'; } }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); storageAvailable = true; }
    catch { storageAvailable = false; toast('이 브라우저에 저장하지 못했어요. 새로고침하면 변경 내용이 사라질 수 있어요.'); }
  }
  function toast(message) { clearTimeout(noticeTimer); notice.textContent = message; notice.hidden = false; noticeTimer = setTimeout(() => { notice.hidden = true; }, 4500); }
  function dirty() { return draft && JSON.stringify(draft) !== draftBaseline; }
  function move(next, replace = false) {
    if (dialog.open) dialog.close();
    route = next;
    history[replace ? 'replaceState' : 'pushState'](null, '', `#${encodeURI(next)}`);
    draft = null; photoBusy = false;
    render();
    window.scrollTo(0, 0);
    app.querySelector('h1')?.focus({ preventScroll: true });
  }
  function navigate(next) {
    if (photoBusy) { toast('사진을 준비하고 있어요. 잠시 후 이동해 주세요.'); return; }
    if (dirty()) {
      confirm('작성을 그만둘까요?', '변경한 내용은 저장되지 않아요.', '나가기', () => move(next));
    } else move(next);
  }
  function header(title, right = '') {
    return `<header class="header">${route === '/' ? '' : button(icon('back'), 'back', 'aria-label="뒤로가기"', 'icon-button')}<h1 tabindex="-1"${route === "/write" ? ' class="sr-only"' : ''}>${title}</h1>${right}</header>`;
  }
  function empty(title, subtitle, action = '', cls = '') {
    return `<section class="empty ${cls}">${icon('comment')}<h2>${title}</h2><p>${subtitle}</p>${action}</section>`;
  }
  function card(post) {
    return `<article class="post"><a class="post-link" href="#/post/${esc(post.id)}" data-route="/post/${esc(post.id)}"><div class="post-copy"><div><h2 class="post-title">${esc(post.title)}</h2><p class="snippet">${esc(post.body)}</p></div>${photosOf(post).length ? `<div class="thumbnail-wrap"><img class="thumbnail" src="${photosOf(post)[0]}" alt="첨부 사진" loading="lazy">${photosOf(post).length > 1 ? `<span class="photo-count">${photosOf(post).length}</span>` : ''}</div>` : ''}</div><div class="post-meta"><span>${esc(post.author)} · ${dateLabel(post.created)}</span><span class="stats"><span class="stat ${post.liked ? 'liked' : ''}">${icon('heart')} ${post.likes}</span><span class="stat">${icon('comment')} ${postComments(post.id).length}</span></span></div></a></article>`;
  }
  function detail(postId) {
    const post = postById(postId);
    if (!visible(post)) return header('글 상세') + empty('볼 수 없는 글이에요', '삭제되었거나 숨겨진 글이에요.', button('글 목록으로', 'list', '', 'primary'));
    const comments = postComments(postId);
    return header('글 상세', button(icon('more'), 'post-menu', `data-id="${esc(post.id)}" aria-label="글 더보기"`, 'icon-button')) +
      `<article class="content"><h2>${esc(post.title)}</h2><div class="author">${avatar(post.author)}<div>${esc(post.author)}<p class="muted">${dateLabel(post.created)}${post.updated ? ' · 수정됨' : ''}</p></div></div><div class="body-copy">${esc(post.body)}</div>${photosOf(post).map((photo, index) => `<img class="post-image" src="${photo}" alt="게시글 첨부 사진 ${index + 1}" loading="lazy">`).join('')}<div class="reaction-row">${button(`${icon('heart')} ${post.likes}`, 'like', `data-id="${esc(post.id)}" aria-label="좋아요 ${post.likes}개" aria-pressed="${post.liked}"`, post.liked ? 'liked' : '')}${button(`${icon('comment')} ${comments.length}`, 'focus-comment', 'aria-label="댓글 작성"')}</div></article><h3 class="comments-heading">댓글 ${comments.length}</h3>` +
      (comments.length ? comments.map(comment => `<article class="comment" id="comment-${esc(comment.id)}"><div class="comment-top"><span>${esc(comment.author)}${comment.author === post.author ? '<span class="author-label">작성자</span>' : ''} <span class="muted">· ${dateLabel(comment.created)}</span></span>${button(icon('more'), 'comment-menu', `data-id="${esc(comment.id)}" aria-label="${esc(comment.author)} 댓글 더보기"`, 'icon-button')}</div><p class="comment-body">${esc(comment.body)}</p></article>`).join('') : empty('첫 댓글을 남겨보세요', '가볍게 생각을 나눠주세요.', '', 'comments-empty')) +
      `<form class="comment-form" data-form="comment" data-id="${esc(post.id)}"><label class="sr-only" for="comment-input">댓글 내용</label><textarea id="comment-input" rows="1" maxlength="1000" placeholder="댓글을 남겨주세요" required></textarea><button type="submit" disabled>등록</button></form>`;
  }
  function editor(postId) {
    const post = postId ? postById(postId) : null;
    if (postId && (!post || post.author !== me)) return header('글 수정') + empty('수정할 수 없는 글이에요', '내가 작성한 글만 수정할 수 있어요.');
    if (!draft) { draft = { title: post?.title || '', body: post?.body || '', photos: [...photosOf(post)], postId: postId || '' }; draftBaseline = JSON.stringify(draft); }
    return header(postId ? '글 수정' : '글쓰기', `<button class="text-button" type="submit" form="post-form" ${!draft.title.trim() || !draft.body.trim() || photoBusy ? 'disabled' : ''}>${postId ? '저장' : '등록'}</button>`) +
      `<form id="post-form" class="editor" data-form="post"><label><span class="sr-only">제목 (필수)</span><input class="editor-title" type="text" name="title" maxlength="100" placeholder="(필수) 제목을 입력해 주세요" value="${esc(draft.title)}" required></label><label class="editor-body"><span class="sr-only">내용 (필수)</span><textarea name="body" maxlength="10000" placeholder="(필수) 나누고 싶은 이야기를 적어주세요&#10;&#10;&#10;서로 존중하는 이야기를 나눠주세요." required>${esc(draft.body)}</textarea><span class="body-count" id="body-count">${draft.body.length.toLocaleString()} / 10,000</span></label><div class="photo-tools"><input id="photo-file" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden>${button(`${icon('image')} 사진 첨부 ${draft.photos.length} / ${maxPhotos}`, 'photo', photoBusy || draft.photos.length >= maxPhotos ? 'disabled' : '', 'photo-button')}<span class="muted">${photoBusy ? '사진을 준비하고 있어요…' : '최대 5장 · 사진당 5MB'}</span></div><div class="photo-previews">${draft.photos.map((photo, index) => `<div class="photo-preview">${button(`<img src="${photo}" alt="첨부할 사진 ${index + 1}">`, 'photo-open', `data-index="${index}" aria-label="첨부 사진 ${index + 1} 크게 보기"`, 'photo-open')}${button(icon('close'), 'photo-remove', `data-index="${index}" aria-label="첨부 사진 ${index + 1} 삭제" ${photoBusy ? 'disabled' : ''}`, 'photo-remove')}</div>`).join('')}</div></form>`;
  }
  function activity(tab) {
    const tabs = [['posts', '작성한 글'], ['comments', '작성한 댓글'], ['likes', '좋아요한 글']];
    let html = header('내 활동', button('차단 관리', 'blocked')) + `<nav class="tabs" aria-label="내 활동">${tabs.map(([key, title]) => `<a href="#/activity/${key}" data-route="/activity/${key}" ${tab === key ? 'aria-current="page"' : ''}>${title}</a>`).join('')}</nav>`;
    if (tab === 'comments') {
      const comments = state.comments.filter(comment => comment.author === me && visible(postById(comment.post))).sort((a, b) => b.created - a.created);
      return html + (comments.length ? comments.map(comment => `<article class="post"><a class="post-link" href="#/post/${esc(comment.post)}/comment/${esc(comment.id)}" data-route="/post/${esc(comment.post)}/comment/${esc(comment.id)}"><h2 class="post-title">${esc(comment.body)}</h2><p class="snippet">원글 · ${esc(postById(comment.post).title)}</p><p class="muted" style="margin-top:14px">${dateLabel(comment.created)}</p></a></article>`).join('') : empty('아직 작성한 댓글이 없어요', '마음이 가는 글에 댓글을 남겨보세요.', button('글 둘러보기', 'list', '', 'primary')));
    }
    const posts = state.posts.filter(post => visible(post) && (tab === 'likes' ? post.liked : post.author === me)).sort((a, b) => (tab === 'likes' ? b.likedAt - a.likedAt : b.created - a.created));
    return html + (posts.length ? posts.map(card).join('') : empty(tab === 'likes' ? '아직 좋아요한 글이 없어요' : '아직 작성한 글이 없어요', tab === 'likes' ? '다시 보고 싶은 글에 좋아요를 눌러보세요.' : '첫 이야기를 나눠보세요.', button(tab === 'likes' ? '글 둘러보기' : '글쓰기', tab === 'likes' ? 'list' : 'write', '', 'primary')));
  }
  function report(kind, targetId) {
    if (!['post', 'comment'].includes(kind)) return header('신고하기') + empty('화면을 찾을 수 없어요', '글 상세에서 다시 신고해 주세요.');
    const target = kind === 'comment' ? state.comments.find(comment => comment.id === targetId) : postById(targetId);
    if (!target || target.author === me) return header('신고하기') + empty('신고할 수 없는 항목이에요', '이미 삭제되었거나 내가 작성한 내용이에요.');
    return header('신고하기') + `<form class="report-form" data-form="report" data-kind="${kind}" data-id="${esc(targetId)}"><div><h2>신고 사유를 선택해 주세요</h2><p class="muted">${kind === 'comment' ? '댓글' : '게시글'} 신고 · 시연용이며 실제로 전송되지 않아요.</p></div><fieldset style="border:0;padding:0;margin:0"><legend class="sr-only">신고 사유</legend>${['광고·스팸', '욕설·비방·혐오 표현', '부적절한 콘텐츠', '개인정보 노출', '기타'].map(reason => `<label class="reason"><input type="radio" name="reason" value="${reason}" required>${reason}</label>`).join('')}</fieldset><label><span class="field-label">추가 설명 · 선택</span><textarea name="note" maxlength="1000" placeholder="신고 내용을 적어주세요"></textarea></label><button class="primary report-submit" type="submit" disabled>신고 접수</button></form>`;
  }
  function render() {
    const parts = route.split('/').filter(Boolean);
    let html;
    if (!parts.length) {
      const posts = state.posts.filter(visible).sort((a, b) => b.created - a.created);
      html = header('커뮤니티', button('내 활동', 'activity')) + (posts.length ? posts.map(card).join('') : empty('아직 게시글이 없어요', '첫 이야기를 나눠보세요.')) + `<div class="list-space"></div><div class="write-dock">${button(`${icon('plus')} 글쓰기`, 'write', '', 'primary')}</div>`;
    } else if (parts[0] === 'write') html = editor();
    else if (parts[0] === 'edit') html = editor(parts[1]);
    else if (parts[0] === 'post') html = detail(parts[1]);
    else if (parts[0] === 'activity') html = activity(['posts', 'comments', 'likes'].includes(parts[1]) ? parts[1] : 'posts');
    else if (parts[0] === 'blocked') html = header('차단한 사용자') + (state.blocked.length ? state.blocked.map(author => `<div class="blocked-row"><div class="blocked-user">${avatar(author)}${esc(author)}</div>${button('차단 해제', 'unblock', `data-author="${esc(author)}"`, 'secondary')}</div>`).join('') : empty('차단한 사용자가 없어요', '차단한 사용자는 이곳에서 관리할 수 있어요.'));
    else if (parts[0] === 'report') html = report(parts[1], parts[2]);
    else html = header('커뮤니티') + empty('화면을 찾을 수 없어요', '글 목록에서 다시 시작해 주세요.', button('글 목록으로', 'list', '', 'primary'));
    app.innerHTML = (!storageAvailable ? '<p class="storage-warning" role="alert">브라우저 저장이 제한되어 있어요. 변경 내용은 현재 화면에서만 유지돼요.</p>' : '') + html;
    document.title = `${app.querySelector('h1')?.textContent || '커뮤니티'} · 차박차박`;
    if (parts[2] === 'comment') requestAnimationFrame(() => { const comment = document.getElementById(`comment-${parts[3]}`); comment?.classList.add('highlight'); comment?.scrollIntoView({ block: 'center' }); });
  }
  function showDialog(title, body, actions, handler, sheet = false) {
    if (dialog.open) dialog.close();
    beforeDialogFocus = document.activeElement;
    dialog.className = sheet ? 'sheet' : '';
    dialog.innerHTML = `<h2 id="dialog-title">${esc(title)}</h2>${body}<div class="${sheet ? '' : 'actions'}">${actions}</div>`;
    dialogHandler = handler;
    window.prepareDialogCancel(dialog);
    dialog.showModal();
  }
  function confirm(title, body, label, action) {
    showDialog(title, `<p>${esc(body)}</p>`, button('취소', 'cancel', '', 'secondary') + button(label, 'confirm', '', 'primary'), key => { if (key === 'confirm') action(); });
  }
  function menu(kind, targetId) {
    const target = kind === 'post' ? postById(targetId) : state.comments.find(comment => comment.id === targetId);
    if (!target) return;
    const own = target.author === me;
    showDialog(kind === 'post' ? '글 메뉴' : '댓글 메뉴', '', (own ? (kind === 'post' ? button('수정하기', 'edit') : '') + button('삭제하기', 'delete') : button('신고하기', 'report') + button('작성자 차단', 'block')) + (kind === 'post' ? button('취소', 'cancel') : ''), action => {
      if (action === 'edit') navigate(`/edit/${targetId}`);
      if (action === 'delete') confirm(`${kind === 'post' ? '글' : '댓글'}을 삭제할까요?`, '삭제한 내용은 복구할 수 없어요.', '삭제', () => {
        if (kind === 'post') { state.posts = state.posts.filter(post => post.id !== targetId); state.comments = state.comments.filter(comment => comment.post !== targetId); save(); move(returnRoute); }
        else { state.comments = state.comments.filter(comment => comment.id !== targetId); save(); render(); }
        toast(`${kind === 'post' ? '글' : '댓글'}을 삭제했어요`);
      });
      if (action === 'report') { reportReturn = route; navigate(`/report/${kind}/${targetId}`); }
      if (action === 'block') confirm(`${target.author}님을 차단할까요?`, '이 사용자의 글과 댓글이 나에게 보이지 않아요. 내 활동의 차단 관리에서 해제할 수 있어요.', '차단하기', () => { if (!state.blocked.includes(target.author)) state.blocked.push(target.author); save(); if (kind === 'post') move('/'); else render(); toast(`${target.author}님을 차단했어요`); });
    }, true);
  }
  dialog.addEventListener('click', event => {
    if (event.target === dialog && dialog.classList.contains('sheet')) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
        dialog.close();
        return;
      }
    }
    const action = event.target.closest('button')?.dataset.action;
    if (!action) return;
    const handler = dialogHandler;
    dialog.close();
    handler?.(action);
  });
  dialog.addEventListener('close', () => { if (beforeDialogFocus?.isConnected) beforeDialogFocus.focus({ preventScroll: true }); });
  app.addEventListener('click', event => {
    const link = event.target.closest('[data-route]');
    if (link && !event.metaKey && !event.ctrlKey && !event.shiftKey) { event.preventDefault(); if (route === '/' || route.startsWith('/activity')) returnRoute = route; navigate(link.dataset.route); return; }
    const control = event.target.closest('button');
    if (!control) return;
    switch (control.dataset.action) {
      case 'list': navigate('/'); break;
      case 'activity': navigate('/activity/posts'); break;
      case 'blocked': navigate('/blocked'); break;
      case 'write': returnRoute = route; navigate('/write'); break;
      case 'back': navigate(route.startsWith('/report') ? reportReturn : route.startsWith('/edit/') ? `/post/${route.split('/')[2]}` : route === '/blocked' ? '/activity/posts' : route.startsWith('/activity') ? '/' : returnRoute); break;
      case 'post-menu': menu('post', control.dataset.id); break;
      case 'comment-menu': menu('comment', control.dataset.id); break;
      case 'focus-comment': document.querySelector('#comment-input')?.focus(); break;
      case 'like': {
        const post = postById(control.dataset.id);
        if (!visible(post)) break;
        post.liked = !post.liked; post.likes += post.liked ? 1 : -1; post.likedAt = post.liked ? Date.now() : null;
        save();
        control.classList.toggle('liked', post.liked); control.setAttribute('aria-pressed', String(post.liked)); control.setAttribute('aria-label', `좋아요 ${post.likes}개`); control.innerHTML = `${icon('heart')} ${post.likes}`;
        break;
      }
      case 'unblock': state.blocked = state.blocked.filter(author => author !== control.dataset.author); save(); render(); toast('차단을 해제했어요'); break;
      case 'photo-open': {
        const index = Number(control.dataset.index);
        const photo = draft?.photos[index];
        if (!photoURL(photo)) break;
        showDialog(`사진 ${index + 1} / ${draft.photos.length}`, `<img class="photo-full" src="${photo}" alt="첨부 사진 ${index + 1} 확대 보기">`, button(icon('close'), 'cancel', 'aria-label="사진 크게 보기 닫기"', 'viewer-close'), () => {});
        dialog.classList.add('photo-viewer');
        break;
      }
      case 'photo': document.querySelector('#photo-file').click(); break;
      case 'photo-remove': if (!photoBusy) { draft.photos.splice(Number(control.dataset.index), 1); render(); } break;
    }
  });
  app.addEventListener('input', event => {
    const form = event.target.closest('form');
    if (form?.dataset.form === 'post' && event.target.name) {
      draft.title = form.elements.title.value; draft.body = form.elements.body.value;
      document.querySelector('[form="post-form"]').disabled = photoBusy || !draft.title.trim() || !draft.body.trim();
      document.querySelector('#body-count').textContent = `${draft.body.length.toLocaleString()} / 10,000`;
    }
    if (form?.dataset.form === 'comment') { form.querySelector('button').disabled = !event.target.value.trim(); event.target.style.height = 'auto'; event.target.style.height = `${Math.min(event.target.scrollHeight, 140)}px`; }
    if (form?.dataset.form === 'report') form.querySelector('[type=submit]').disabled = !form.querySelector('[name=reason]:checked');
  });
  app.addEventListener('change', async event => {
    if (event.target.id !== 'photo-file') return;
    if (!draft || photoBusy) return;
    const files = Array.from(event.target.files);
    if (!files.length) return;
    if (draft.photos.length + files.length > maxPhotos) { toast(`사진은 최대 ${maxPhotos}장까지 첨부할 수 있어요. ${maxPhotos - draft.photos.length}장을 더 선택할 수 있어요.`); event.target.value = ''; return; }
    if (files.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) { toast('5MB 이하의 JPG, PNG, WebP 사진을 선택해 주세요.'); event.target.value = ''; return; }
    photoBusy = true; render();
    try {
      const prepared = [];
      for (const file of files) {
      const dataURL = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
      const image = await new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = dataURL; });
      const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext('2d'); context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(image, 0, 0, canvas.width, canvas.height);
      prepared.push(canvas.toDataURL('image/jpeg', 0.8));
      }
      draft.photos.push(...prepared);
    } catch { toast('사진을 읽지 못했어요. 다른 사진을 선택해 주세요.'); }
    finally { photoBusy = false; render(); }
  });
  app.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.target;
    if (form.dataset.form === 'post') {
      if (photoBusy || !draft?.title.trim() || !draft.body.trim()) return;
      const edited = Boolean(draft.postId);
      let post = edited ? postById(draft.postId) : null;
      if (edited && (!post || post.author !== me)) return;
      if (post) Object.assign(post, { title: draft.title.trim(), body: draft.body.trim(), photos: [...draft.photos], updated: Date.now() });
      else { post = { id: id(), title: draft.title.trim(), body: draft.body.trim(), photos: [...draft.photos], author: me, created: Date.now(), likes: 0, liked: false }; state.posts.unshift(post); }
      delete post.photo;
      save(); draft = null; move(`/post/${post.id}`, true); toast(storageAvailable ? (edited ? '수정한 내용을 저장했어요' : '글을 등록했어요') : '브라우저 저장 공간이 부족하거나 저장이 제한되어 현재 화면에서만 유지돼요.');
    }
    if (form.dataset.form === 'comment') {
      const body = form.querySelector('textarea').value.trim();
      if (!body || !visible(postById(form.dataset.id))) return;
      state.comments.push({ id: id(), post: form.dataset.id, author: me, body, created: Date.now() }); save(); render(); toast('댓글을 등록했어요');
    }
    if (form.dataset.form === 'report') {
      const reason = form.querySelector('[name=reason]:checked')?.value;
      if (!reason) return;
      state.reports.push({ kind: form.dataset.kind, target: form.dataset.id, reason, note: form.elements.note.value.trim(), created: Date.now() }); save();
      showDialog('신고 접수 화면', '<p>시연용 신고를 저장했어요.<br>운영자에게 실제 전송되지는 않아요.</p>', button('확인', 'done', '', 'primary'), () => move(reportReturn, true));
    }
  });
  window.addEventListener('popstate', () => {
    const next = parseRoute();
    if (dirty() || photoBusy) { history.pushState(null, '', `#${encodeURI(route)}`); navigate(next); }
    else { if (dialog.open) dialog.close(); route = next; draft = null; render(); }
  });
  window.addEventListener('beforeunload', event => { if (dirty() || photoBusy) { event.preventDefault(); event.returnValue = ''; } });
  render();
})();
