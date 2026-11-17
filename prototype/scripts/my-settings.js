'use strict';
(() => {
 const root=document.querySelector('#settings-content'), dialog=document.querySelector('#settings-dialog');
 const titles={bookmarks:'북마크한 산',notifications:'알림 설정',account:'내 계정',notices:'공지사항',support:'이용 문의',terms:'서비스 이용약관',privacy:'개인정보 처리방침'};
 const button=(label,action,extra='')=>`<button class="settings-button" data-action="${action}" ${extra}>${label}</button>`;
 const info=(title,copy)=>{dialog.dataset.risky='false';document.querySelector('#confirm-title').textContent=title;document.querySelector('#confirm-copy').textContent=copy;document.querySelector('#confirm-action').hidden=true;document.querySelector('#confirm-cancel').textContent='닫기';window.prepareDialogActions(dialog);dialog.showModal();};
 function render(){
  const key=location.hash.slice(1)||'account',title=titles[key]||'설정';
  document.querySelector('#settings-title').textContent=title;document.title=`차박차박 · ${title}`;
  if(key==='notifications'){
   let preferences={comment:true,postLike:true,commentLike:true};
   try { preferences={...preferences,...JSON.parse(localStorage.getItem('chabak-notification-settings-v1')||'{}')}; } catch {}
   const items=[['comment','내 글의 댓글 알림'],['postLike','내 글의 좋아요 알림'],['commentLike','내 댓글의 좋아요 알림']];
   root.innerHTML=`<section class="notification-settings"><div class="detail-menu-list">${items.map(([id,title])=>`<label class="notification-toggle"><span class="notification-toggle__copy"><span class="notification-toggle__title">${title}</span></span><input type="checkbox" role="switch" data-notification="${id}" aria-label="${title}" ${preferences[id]?'checked':''}><span class="notification-toggle__track" aria-hidden="true"></span></label>`).join('')}</div><div class="notification-settings__footer"><p class="notification-settings__permission">푸시 알림을 받으려면 휴대폰의 앱 알림 권한도 허용해 주세요.</p>${button('휴대폰 알림 설정 열기','notification-help')}</div></section>`;
  }else if(key==='account')root.innerHTML=`<div class="settings-row"><span>로그인 방식</span><span>연결된 계정 없음</span></div><div class="settings-row"><span>가입한 계정</span><span>로그인 후 표시</span></div><p style="margin-top:16px">현재는 로그인 기능이 연결되지 않은 디자인 미리보기예요</p>${button('로그아웃','logout')}<button class="settings-button danger" data-action="withdraw">회원탈퇴</button>`;
  else if(key==='notices')root.innerHTML='<div class="data-empty"><div class="edge-state__icon edge-state__icon--mountain" aria-hidden="true"></div><p class="edge-state__description">등록된 공지사항이 없어요</p></div>';
  else if(key==='support')root.innerHTML='<h2>이용 중 궁금한 점이 있으신가요?</h2><p>문의 접수 채널은 서비스 오픈 시 안내할 예정이에요</p>';
  else if(key==='terms'||key==='privacy')root.innerHTML=`<label for="policy-version">문서 버전</label><select id="policy-version" disabled><option>등록된 버전 없음</option></select><div class="settings-row"><span>시행일</span><span>확정 전</span></div><p style="margin-top:16px">${title}은 준비 중이에요</p><p>문서가 등록되면 현재 내용과 이전 버전을 확인할 수 있어요</p>`;
  else if(key==='bookmarks')root.innerHTML='<div class="data-empty"><div class="edge-state__icon edge-state__icon--mountain" aria-hidden="true"></div><p class="edge-state__description">북마크 화면은 준비 중이에요</p></div>';
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
 window.addEventListener('hashchange',render);render();
})();
