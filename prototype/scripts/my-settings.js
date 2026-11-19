'use strict';
(() => {
 const root=document.querySelector('#settings-content'), dialog=document.querySelector('#settings-dialog');
 const titles={settings:'설정',bookmarks:'북마크',notifications:'알림 설정',account:'내 계정',notices:'공지사항',support:'이용 문의',terms:'서비스 이용약관',privacy:'개인정보 처리방침'};
 const button=(label,action,extra='')=>`<button class="settings-button" data-action="${action}" ${extra}>${label}</button>`;
 const info=(title,copy)=>{dialog.dataset.risky='false';document.querySelector('#confirm-title').textContent=title;document.querySelector('#confirm-copy').textContent=copy;document.querySelector('#confirm-action').hidden=true;document.querySelector('#confirm-cancel').textContent='닫기';window.prepareDialogActions(dialog);dialog.showModal();};
 const settingsMenu=`<nav class="settings-menu" aria-label="설정 메뉴"><a class="menu-item" href="community.html#/blocked"><img class="menu-icon" src="assets/icons/untitled-ui/user-x-01.svg" width="24" height="24" alt="" data-figma-node="1007:10560"><span>차단한 사용자</span></a>
      <a class="menu-item" href="my-settings.html#notifications"><img class="menu-icon" src="assets/icons/untitled-ui/bell-01.svg" width="24" height="24" alt="" data-figma-node="1007:10340"><span>알림 설정</span></a><a class="menu-item" href="my-settings.html#account"><img class="menu-icon" src="assets/icons/untitled-ui/user-01.svg" width="24" height="24" alt="" data-figma-node="1007:10494"><span>내 계정</span></a><a class="menu-item" href="my-settings.html#notices"><img class="menu-icon" src="assets/icons/untitled-ui/announcement-01.svg" width="24" height="24" alt="" data-figma-node="1007:10331"><span>공지사항</span></a><a class="menu-item" href="my-settings.html#support"><img class="menu-icon" src="assets/icons/message-question.svg" width="24" height="24" alt=""><span>이용 문의</span></a>
      <div class="menu-item app-version"><svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6 M12 7h.01"/></svg><span>앱 버전</span><span class="app-version__value">0.0.0</span></div>
      <a class="menu-item" href="my-settings.html#terms"><img class="menu-icon" src="assets/icons/untitled-ui/file-check-02.svg" width="24" height="24" alt="" data-figma-node="1007:11628"><span>서비스 이용약관</span></a><a class="menu-item" href="my-settings.html#privacy"><img class="menu-icon" src="assets/icons/untitled-ui/shield-tick.svg" width="24" height="24" alt="" data-figma-node="1007:8934"><span>개인정보 처리방침</span></a></nav>
      <footer class="business-footer" aria-label="사업자 정보">
        <p><span>대표이사 범지민</span> | <span>사업자등록번호 236-81-02950</span></p>
        <p>통신판매업신고번호 2026-인천연수구-2725</p>
        <p>인천광역시 연수구 갯벌로 12, 송도본원 7층 7-10호 (송도동, 인천창조경제혁신센터)</p>
        <p><span>TEL <a href="tel:0507-1336-1915">0507-1336-1915</a></span> | <span>EMAIL <a href="mailto:wiiee.company@gmail.com">wiiee.company@gmail.com</a></span></p>
      </footer>`;
 const notices=[
  {id:'welcome',title:'차박차박에 오신 것을 환영해요',date:'2026.11.17',datetime:'2026-11-17',intro:'나만의 속도로, 함께 걷는 즐거움',paragraphs:['차박차박은 산을 좋아하는 사람들의 작은 이야기가 모이는 공간이에요. 산을 찾고, 준비물을 챙기고, 다녀온 이야기를 나누는 순간까지 함께할게요.','관심 있는 산은 북마크하고, 출발 전에는 준비물 체크리스트를 확인해 보세요. 커뮤니티에서는 서로의 경험과 생각을 편하게 나눌 수 있어요.','앞으로의 새로운 소식과 이용 안내는 이곳에서 전해드릴게요.']},
  {id:'update',title:'차박차박 0.0.0 미리보기 안내',date:'2026.11.16',datetime:'2026-11-16',intro:'차박차박의 첫 모습을 만나보세요',paragraphs:['이번 미리보기에서는 마이페이지, 준비물 체크리스트, 커뮤니티 화면을 살펴볼 수 있어요.','마이페이지에서 프로필을 수정하고 내가 작성한 글과 댓글, 좋아요한 글을 모아볼 수 있어요. 준비물 체크리스트로 출발 전에 필요한 물건도 확인해 보세요.','현재는 디자인과 동작을 확인하는 프로토타입이에요. 실제 서비스의 기능과 구성은 달라질 수 있어요.']},
  {id:'community',title:'함께 만드는 기분 좋은 커뮤니티',date:'2026.11.15',datetime:'2026-11-15',intro:'서로를 존중하는 이야기를 나눠주세요',paragraphs:['처음 산에 오르는 사람도, 자주 산을 찾는 사람도 편하게 이야기를 나눌 수 있는 공간을 만들고 싶어요.','다른 의견에도 따뜻한 말로 답해 주세요. 사진과 글을 올릴 때는 다른 사람의 개인정보가 포함되어 있지 않은지 한 번 더 확인해 주세요.','불편한 게시글이나 댓글은 신고 기능을 통해 알려주세요. 보고 싶지 않은 사용자는 차단하고 마이페이지에서 관리할 수 있어요.']}
 ];
 function noticeContent(id){
  if(id){
   const item=notices.find(item=>item.id===id);
   if(!item)return '<section class="notice-missing"><h2>공지사항을 찾을 수 없어요</h2></section>';
   return `<article class="notice-detail"><header class="notice-detail__header"><h2 tabindex="-1">${item.title}</h2><time datetime="${item.datetime}">${item.date}</time></header><div class="notice-detail__body"><h3>${item.intro}</h3>${item.paragraphs.map(copy=>`<p>${copy}</p>`).join('')}</div><p class="notice-demo-note">디자인 확인을 위한 예시 공지입니다.</p></article>`;
  }
  return `<section class="notice-board" aria-label="공지사항 목록"><ul class="notice-list">${notices.map(item=>`<li><a class="notice-row" href="#notices/${item.id}"><div class="notice-row__copy"><h2>${item.title}</h2><time datetime="${item.datetime}">${item.date}</time></div><svg class="notice-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></a></li>`).join('')}</ul></section>`;
 }
 function render(){
  const [key,noticeId]=(location.hash.slice(1)||'settings').split('/'),title=titles[key]||'설정';
  document.querySelector('.page-bar [aria-label="뒤로가기"]').href=key==='notices'&&noticeId?'#notices':key==='settings'||key==='bookmarks'?'mypage.html':'#settings';
  root.classList.toggle('settings-content--notices',key==='notices'||key==='terms'||key==='privacy');
  document.querySelector('#settings-title').textContent=title;document.title=`차박차박 · ${title}`;
  if(key==='settings')root.innerHTML=settingsMenu;
  else if(key==='notifications'){
   let preferences={comment:true,postLike:true,commentLike:true};
   try { preferences={...preferences,...JSON.parse(localStorage.getItem('chabak-notification-settings-v1')||'{}')}; } catch {}
   const items=[['comment','내 글의 댓글 알림'],['postLike','내 글의 좋아요 알림'],['commentLike','내 댓글의 좋아요 알림']];
   root.innerHTML=`<section class="notification-settings"><div class="detail-menu-list">${items.map(([id,title])=>`<label class="notification-toggle"><span class="notification-toggle__copy"><span class="notification-toggle__title">${title}</span></span><input type="checkbox" role="switch" data-notification="${id}" aria-label="${title}" ${preferences[id]?'checked':''}><span class="notification-toggle__track" aria-hidden="true"></span></label>`).join('')}</div><div class="notification-settings__footer"><p class="notification-settings__permission">푸시 알림을 받으려면 휴대폰의 앱 알림 권한도 허용해 주세요.</p>${button('휴대폰 알림 설정 열기','notification-help')}</div></section>`;
  }else if(key==='account')root.innerHTML=`<section class="account-settings"><div class="settings-row"><span>로그인 방식</span><span>연결된 계정 없음</span></div><div class="settings-row"><span>가입한 계정</span><span>로그인 후 표시</span></div><div class="account-settings__footer"><button type="button" class="account-settings__text-button" data-action="logout">로그아웃</button><button type="button" class="account-settings__text-button" data-action="withdraw">회원탈퇴</button></div></section>`;
  else if(key==='notices')root.innerHTML=noticeContent(noticeId);
  else if(key==='support')root.innerHTML='<h2>이용 중 궁금한 점이 있으신가요?</h2><p>문의 접수 채널은 서비스 오픈 시 안내할 예정이에요</p>';
  else if(key==='terms'||key==='privacy')root.innerHTML=`<article class="notice-detail policy-detail"><header class="notice-detail__header"><h2 tabindex="-1">${title}</h2></header><div class="notice-detail__body"><p>${title}은 준비 중이에요</p></div></article>`;
  else if(key==='bookmarks'){
   const isCourse = noticeId === 'courses';
   const type = isCourse ? 'course' : 'mountain';
   const label = isCourse ? '코스' : '산';
   const saved = (isCourse ? courses : hikes).map(hike => ({ hike, time: bookmarkTime(type, hike.id) }))
     .filter(entry => entry.time !== null)
     .sort((a, b) => b.time - a.time);
   const tabs = `<nav class="activity-tabs" aria-label="북마크 목록">
     <a href="#bookmarks" ${isCourse ? '' : 'aria-current="page"'}>북마크한 산</a>
     <a href="#bookmarks/courses" ${isCourse ? 'aria-current="page"' : ''}>북마크한 코스</a>
   </nav>`;
   const list = saved.length
     ? `<ul class="hike-list bookmark-list">${saved.map(({ hike }) => `<li><a class="hike-row" href="home.html#${type}/${hike.id}/bookmarks">${hikeThumbnail(hike)}<span><strong>${hike[type]}</strong><span class="hike-row__meta">${isCourse ? hike.mountain : hike.regions.join(' · ')}</span></span></a></li>`).join('')}</ul>`
     : `<div class="data-empty"><div class="edge-state__icon edge-state__icon--mountain" aria-hidden="true"></div><p class="edge-state__description">아직 북마크한 ${label}${isCourse ? '가' : '이'} 없어요</p></div>`;
   root.innerHTML = tabs + list;
  }
  else root.innerHTML='<p>화면을 찾을 수 없어요</p>';
 }
 root.addEventListener('click',e=>{
  const action=e.target.closest('[data-action]')?.dataset.action;
  if(action==='notification-help')info('알림 설정','휴대폰 설정 > 앱 > 차박차박 > 알림에서 변경해 주세요. 현재 HTML 미리보기에서는 휴대폰의 앱 설정으로 직접 이동할 수 없어요.');
  if(action==='logout'){dialog.dataset.risky='true';
   document.querySelector('#confirm-title').textContent='로그아웃할까요?';document.querySelector('#confirm-copy').textContent='다시 이용하려면 로그인해야 해요';
   const confirm=document.querySelector('#confirm-action');confirm.hidden=false;confirm.textContent='로그아웃';confirm.onclick=()=>info('로그아웃 미리보기','실제 로그인 연결 전이므로 계정과 저장된 데이터는 변경되지 않았어요');document.querySelector('#confirm-cancel').textContent='취소';window.prepareDialogActions(dialog);dialog.showModal();
  }
  if(action==='withdraw')root.innerHTML='<h2>탈퇴 전에 확인해 주세요</h2><p>회원탈퇴 후 계정 복구와 데이터 처리 기준은 최종 약관에 따라 안내됩니다. 현재 화면은 동작을 확인하는 미리보기이며 실제 탈퇴는 진행되지 않아요.</p><label><input type="checkbox" id="withdraw-consent"> 안내 내용을 확인했어요</label><button class="settings-button danger" id="withdraw-confirm" disabled>회원탈퇴</button>';
 });
 root.addEventListener('change',e=>{if(e.target.matches('[data-notification]')){const preferences=Object.fromEntries(Array.from(root.querySelectorAll('[data-notification]'),input=>[input.dataset.notification,input.checked]));try{localStorage.setItem('chabak-notification-settings-v1',JSON.stringify(preferences));}catch{info('알림 설정','설정을 저장하지 못했어요. 다시 시도해 주세요.');}}if(e.target.id==='withdraw-consent')document.querySelector('#withdraw-confirm').disabled=!e.target.checked;});
 root.addEventListener('click',e=>{if(e.target.id==='withdraw-confirm'){dialog.dataset.risky='true';document.querySelector('#confirm-title').textContent='정말 탈퇴할까요?';document.querySelector('#confirm-copy').textContent='최종 확인 단계입니다. 이 미리보기에서는 실제 데이터가 삭제되지 않아요.';const confirm=document.querySelector('#confirm-action');confirm.hidden=false;confirm.textContent='탈퇴 확인';confirm.onclick=()=>{dialog.close();render();info('탈퇴 미리보기 완료','실제 계정과 저장된 데이터는 변경되지 않았어요');};document.querySelector('#confirm-cancel').textContent='취소';window.prepareDialogActions(dialog);dialog.showModal();}});
 document.querySelector('#confirm-cancel').onclick=()=>dialog.close();
 function refreshBookmarks(){
  if(location.hash.split('/')[0] === '#bookmarks') render();
 }
 window.addEventListener('pageshow', refreshBookmarks);
 window.addEventListener('storage', refreshBookmarks);
 window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);const heading=root.querySelector('.notice-detail h2')||document.querySelector('#settings-title');heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});});render();
})();
