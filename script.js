(function(){
  const WA_PHONE = "918320693531"; // user's whatsapp number with country code
  const menu = [
    { id: 'aloo', name:'Aloo Paratha', price:50, img:'https://images.unsplash.com/photo-1604908177125-9aa6f37d4b16?q=80&w=800&auto=format&fit=crop' },
    { id: 'paneer', name:'Paneer Paratha', price:70, img:'https://images.unsplash.com/photo-1617191511521-0c2b7fa2b2d5?q=80&w=800&auto=format&fit=crop' },
    { id: 'cheese', name:'Cheese Paratha', price:80, img:'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop' },
    { id: 'mixveg', name:'Mix Veg Paratha', price:60, img:'https://images.unsplash.com/photo-1625944535338-c36b25d13272?q=80&w=800&auto=format&fit=crop' }
  ];

  const coupons = [
    { code:'PJ50', text:'₹50 OFF on bill ₹399+'},
    { code:'FREECHAAS', text:'Free Masala Chaas with any combo'},
    { code:'CHEESE10', text:'10% OFF on Cheese Parathas'},
    { code:'BUY2GET1', text:'Buy 2 Get 1 Half Off'}
  ];

  const menuGrid = document.getElementById('menuGrid');
  menu.forEach(item=>{
    const div = document.createElement('div');
    div.className='menu-item';
    div.innerHTML = `<img src="${item.img}" alt="${item.name}" style="width:100%;border-radius:8px;object-fit:cover;height:120px">
      <h4>${item.name}</h4>
      <div class="menu-meta"><div class="price">₹${item.price}</div><div class="qty"><label class="muted">Qty</label><input type="number" min="0" value="0" data-id="${item.id}"></div></div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px"><button class="small ghost addStamp">Add Stamp</button><button class="cta" data-id="${item.id}">Add & Order</button></div>`;
    menuGrid.appendChild(div);
  });

  const orderModal = document.getElementById('orderModal');
  const orderForm = document.getElementById('orderForm');
  const orderItems = document.getElementById('orderItems');
  const totalAmount = document.getElementById('totalAmount');
  const orderQuick = document.getElementById('orderQuick');
  const getCouponBtn = document.getElementById('getCoupon');
  const couponBox = document.getElementById('couponBox');
  const stampsDiv = document.getElementById('stamps');
  const stampsStatus = document.getElementById('stampsStatus');
  const closeOrder = document.getElementById('closeOrder');
  const installBtn = document.getElementById('installBtn');
  const qrImg = document.getElementById('qrImg');
  const yearNode = document.getElementById('year');
  yearNode.textContent = new Date().getFullYear();

  let stamps = parseInt(localStorage.getItem('pj_stamps')||'0');
  renderStamps();

  function openOrderModal() {
    orderItems.innerHTML='';
    menu.forEach(it=>{
      const row = document.createElement('div');
      row.style.display='flex';row.style.gap='8px';row.style.alignItems='center';row.style.marginBottom='8px';
      row.innerHTML = `<div style="flex:1">${it.name}</div><div>₹${it.price}</div><div><input type="number" min="0" value="0" data-id="${it.id}"></div>`;
      orderItems.appendChild(row);
      row.querySelector('input').addEventListener('input', updateTotal);
    });
    updateTotal();
    orderModal.setAttribute('aria-hidden','false');
  }

  function closeModal(){ orderModal.setAttribute('aria-hidden','true'); }

  function updateTotal(){
    let total=0;
    orderItems.querySelectorAll('input').forEach(inp=>{
      const id = inp.getAttribute('data-id');
      const qty = parseInt(inp.value||'0');
      const item = menu.find(m=>m.id===id);
      total += qty * item.price;
    });
    totalAmount.textContent = '₹'+total;
  }

  orderForm.addEventListener('submit', function(e){
    e.preventDefault();
    let message = 'Hello Paratha Junction,%0aI want to order:%0a';
    let total=0;
    orderItems.querySelectorAll('input').forEach(inp=>{
      const id = inp.getAttribute('data-id');
      const qty = parseInt(inp.value||'0');
      if(qty>0){
        const item = menu.find(m=>m.id===id);
        message += '- '+qty+' '+item.name+'%0a';
        total += qty * item.price;
      }
    });
    if(total===0){ alert('Please add at least one item.'); return; }
    message += '%0aTotal: ₹'+total;
    const url = 'https://wa.me/'+WA_PHONE+'?text='+message;
    window.open(url,'_blank');
  });

  document.getElementById('closeOrder').addEventListener('click', closeModal);
  orderQuick.addEventListener('click', openOrderModal);

  document.querySelectorAll('.menu-item .cta').forEach(btn=>{
    btn.addEventListener('click', function(){
      const id = this.getAttribute('data-id');
      const container = this.closest('.menu-item');
      const qty = parseInt(container.querySelector('input').value||'0');
      if(qty<=0){ alert('Please choose quantity'); return; }
      const item = menu.find(m=>m.id===id);
      const total = qty * item.price;
      const message = 'Hello Paratha Junction,%0aI want to order:%0a- '+qty+' '+item.name+'%0a%0aTotal: ₹'+total;
      window.open('https://wa.me/'+WA_PHONE+'?text='+message, '_blank');
    });
  });

  document.querySelectorAll('.menu-item .addStamp').forEach((b,i)=>{
    b.addEventListener('click', function(){ stamps = Math.min(8, stamps+1); localStorage.setItem('pj_stamps', stamps); renderStamps(); alert('Stamp added!'); });
  });

  function renderStamps(){
    stampsDiv.innerHTML='';
    for(let i=0;i<8;i++){
      const s = document.createElement('div');
      s.className = 'stamp' + (i<stamps ? ' active' : '');
      s.textContent = i<stamps ? '★' : (i+1);
      s.addEventListener('click', ()=>{ if(i<stamps){ if(confirm('Redeem reward and reset stamps?')){ stamps=0; localStorage.setItem('pj_stamps',stamps); renderStamps(); alert('Reward redeemed. Enjoy your free paratha!'); } } });
      stampsDiv.appendChild(s);
    }
    stampsStatus.textContent = stamps>=8? 'Reward ready — show to cashier.' : (8-stamps)+' stamps to go';
  }

  getCouponBtn.addEventListener('click', ()=>{
    const pick = coupons[Math.floor(Math.random()*coupons.length)];
    couponBox.innerHTML = `<div style="font-weight:800">${pick.code}</div><div class="muted">${pick.text}</div><div style="margin-top:8px"><button class="small" onclick="navigator.clipboard.writeText('${pick.code}').then(()=>alert('Copied '+ '${pick.code}'))">Copy</button> <button class="ghost" onclick="window.open('https://wa.me/'+WA_PHONE+'?text=I%20want%20to%20use%20coupon%20${pick.code}','_blank')">Share on WhatsApp</button></div>`;
  });

  try{
    const url = location.href;
    qrImg.src = 'https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl='+encodeURIComponent(url);
  }catch(e){}

  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'inline-block';
  });
  installBtn.addEventListener('click', async ()=>{
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    const {outcome} = await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.style.display='none';
  });

})();