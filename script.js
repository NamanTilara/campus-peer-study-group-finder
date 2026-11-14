(function(){
  var REG=/^[0-9]{8}$/;
  var JOIN=`<details class="joinbox"><summary class="btn">Join this circle</summary>
            <form class="joinform"><label>Your registration no. (8 digits)<input type="text" inputmode="numeric" pattern="[0-9]{8}" maxlength="8" required placeholder="e.g. 12627377"></label><button class="btn" type="submit">Confirm join</button></form></details>
          <p class="joined" hidden><span></span> <button type="button" class="leave">Leave</button></p>
          <p class="err" role="alert" hidden></p>
          <details class="chatbox" hidden><summary class="btn ghost">Open circle chat</summary>
            <div class="chatlog" role="log" aria-live="polite"><p class="empty">No messages yet. Ask a question or share a note.</p></div>
            <form class="chatform"><input type="text" class="chat-text" placeholder="Type a message or note" aria-label="Message" maxlength="500"><label class="attach">Attach file<input type="file" hidden></label><button class="btn" type="submit">Send</button></form></details>`;
  var form=document.getElementById('create-form');
  var grid=document.querySelector('.grid');
  var msg=document.getElementById('posted');
  var areas={prog:'Programming',math:'Maths',sci:'Science',core:'Core CSE'};
  function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
  function row(label,value){var li=el('li');li.appendChild(el('b',null,label+' '));li.appendChild(document.createTextNode(value));return li;}
  function members(card){return JSON.parse(card.dataset.members||'[]');}
  function refresh(card){
    var n=+card.dataset.n,t=+card.dataset.t;
    card.querySelector('.bar-seat i').style.setProperty('--n',n);
    card.querySelector('.bar-seat i').style.setProperty('--t',t);
    card.querySelector('.count').textContent=n+' of '+t+' filled'+(n>=t?' (full)':'');
    var box=card.querySelector('.joinbox');
    var joined=!card.querySelector('.joined').hidden;
    var isHost=!!card.dataset.host;
    box.hidden=joined||isHost||n>=t;
    var chat=card.querySelector('.chatbox');
    chat.hidden=!(joined||isHost);
    if(chat.hidden)chat.open=false;
  }
  Array.prototype.forEach.call(document.querySelectorAll('.card'),refresh);

  grid.addEventListener('submit',function(ev){
    if(!ev.target.classList.contains('joinform'))return;
    ev.preventDefault();
    var card=ev.target.closest('.card');
    var input=ev.target.querySelector('input');
    var err=card.querySelector('.err');
    var reg=input.value.trim();
    err.hidden=true;
    if(!REG.test(reg)){err.textContent='Enter your 8-digit registration number.';err.hidden=false;return;}
    var list=members(card);
    if(list.indexOf(reg)!==-1){err.textContent='This registration number is already in this circle.';err.hidden=false;return;}
    if(+card.dataset.n>=+card.dataset.t){err.textContent='This circle is full.';err.hidden=false;return;}
    list.push(reg);
    card.dataset.members=JSON.stringify(list);
    card.dataset.n=+card.dataset.n+1;
    var j=card.querySelector('.joined');
    j.querySelector('span').textContent='You joined with reg. no. '+reg+'.';
    j.dataset.reg=reg;j.hidden=false;
    card.querySelector('.joinbox').open=false;
    input.value='';
    refresh(card);
  });
  grid.addEventListener('click',function(ev){
    if(!ev.target.classList.contains('leave'))return;
    var card=ev.target.closest('.card');
    var j=card.querySelector('.joined');
    var list=members(card).filter(function(x){return x!==j.dataset.reg;});
    card.dataset.members=JSON.stringify(list);
    card.dataset.n=+card.dataset.n-1;
    j.hidden=true;
    refresh(card);
  });

  grid.addEventListener('change',function(ev){
    if(ev.target.type!=='file')return;
    ev.target.parentNode.classList.toggle('has',ev.target.files.length>0);
    ev.target.parentNode.firstChild.nodeValue=ev.target.files.length?ev.target.files[0].name:'Attach file';
  });
  grid.addEventListener('submit',function(ev){
    if(!ev.target.classList.contains('chatform'))return;
    ev.preventDefault();
    var card=ev.target.closest('.card');
    var input=ev.target.querySelector('.chat-text');
    var fileIn=ev.target.querySelector('input[type=file]');
    var text=input.value.trim();
    var file=fileIn.files[0];
    if(!text&&!file)return;
    var j=card.querySelector('.joined');
    var who=card.dataset.meName||('Reg. no. '+(j.dataset.reg||card.dataset.me));
    var log=card.querySelector('.chatlog');
    var empty=log.querySelector('.empty');if(empty)empty.remove();
    var m=el('div','m me');
    var time=new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
    m.appendChild(el('small',null,who+' at '+time));
    if(text)m.appendChild(el('div',null,text));
    if(file){
      var a=el('a',null,'Attached: '+file.name);
      a.href=URL.createObjectURL(file);a.download=file.name;
      m.appendChild(a);
    }
    log.appendChild(m);
    log.scrollTop=log.scrollHeight;
    input.value='';fileIn.value='';
    fileIn.parentNode.classList.remove('has');fileIn.parentNode.firstChild.nodeValue='Attach file';
  });

  form.addEventListener('submit',function(ev){
    ev.preventDefault();
    var name=document.getElementById('c-name').value.trim();
    var host=document.getElementById('h-name').value.trim();
    var reg=document.getElementById('h-reg').value.trim();
    var year=document.getElementById('h-year').value;
    var subject=document.getElementById('c-sub').value.trim();
    var area=document.getElementById('c-area').value;
    var seats=parseInt(document.getElementById('c-size').value,10);
    var date=document.getElementById('c-date').value;
    var time=document.getElementById('c-time').value;
    var place=document.getElementById('c-place').value.trim();
    var note=document.getElementById('c-note').value.trim();
    if(!name||!host||!subject||!year){return;}
    if(!REG.test(reg)){msg.textContent='Enter your 8-digit registration number.';msg.hidden=false;return;}
    var when='To be decided';
    if(date||time){
      var d=date?new Date(date+'T00:00').toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short'}):'';
      var t=time?new Date('1970-01-01T'+time).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}):'';
      when=(d+' '+t).trim();
    }
    var card=el('article','card new');
    card.setAttribute('data-s',area);
    card.dataset.n=1;card.dataset.t=seats;
    card.dataset.members=JSON.stringify([reg]);
    card.dataset.host='1';card.dataset.me=reg;card.dataset.meName=host;
    card.appendChild(el('span','tag',areas[area]));
    card.appendChild(el('h3',null,name));
    var ul=el('ul','meta');
    ul.appendChild(row('Subject:',subject));
    ul.appendChild(row('When:',when));
    ul.appendChild(row('Where:',place||'To be decided'));
    if(note){ul.appendChild(row('Covers:',note));}
    ul.appendChild(row('Host:',host+', B.Tech '+year));
    ul.appendChild(row('Host reg. no.:',reg));
    card.appendChild(ul);
    var seatsBox=el('div','seats');
    var bar=el('div','bar-seat');bar.appendChild(document.createElement('i'));
    seatsBox.appendChild(bar);seatsBox.appendChild(el('span','count'));
    card.appendChild(seatsBox);
    var tpl=document.createElement('div');tpl.innerHTML=JOIN;
    while(tpl.firstChild){card.appendChild(tpl.firstChild);}
    grid.insertBefore(card,grid.firstChild);
    refresh(card);
    document.getElementById('f-all').checked=true;
    msg.textContent='Circle posted. "'+name+'" is now first in the open circles list.';
    msg.hidden=false;
    form.reset();
    document.getElementById('groups').scrollIntoView({behavior:'smooth'});
  });
})();
