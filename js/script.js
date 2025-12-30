(function(){
  const modal = document.getElementById('modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalPrice = modal.querySelector('.modal-price');
  const modalDesc = modal.querySelector('.modal-desc');
  const modalDetails = modal.querySelector('.modal-details');
  const modalImage = modal.querySelector('.modal-image img');
  const detailsBtns = document.querySelectorAll('.btn.details');
  const closeBtn = modal.querySelector('.modal-close');
  const backdrop = modal.querySelector('.modal-backdrop');
  const copyLink = document.getElementById('copyLink');

  // If a card has data-image set, inject the image into its .card-media with graceful fallback
  document.querySelectorAll('.card').forEach(card => {
    const src = card.dataset.image;
    const name = card.dataset.name || '';
    const media = card.querySelector('.card-media');
    if(src){
      // create a graceful placeholder that can be restored on error
      const fallback = document.createElement('div');
      fallback.className = 'placeholder';
      fallback.innerHTML = '<svg viewBox="0 0 100 100" class="icon" aria-hidden><circle cx="50" cy="50" r="30" fill="#00e5ff" opacity="0.12"></circle></svg>';
      // clear and add placeholder immediately (keeps layout stable)
      media.innerHTML = '';
      media.appendChild(fallback);
      const img = document.createElement('img');
      img.className = 'card-img';
      img.src = src;
      img.alt = name;
      img.loading = 'lazy';
      img.addEventListener('load', ()=> {
        media.classList.add('has-image');
        // remove fallback after a short fade
        setTimeout(()=> fallback.remove(), 220);
      });
      img.addEventListener('error', ()=> {
        // restore fallback if image fails to load
        media.classList.remove('has-image');
        if (img.parentElement) img.remove();
        fallback.style.opacity = 1;
      });
      media.appendChild(img);
    }
  });

  function openModal(card){
    const name = card.dataset.name;
    const price = card.dataset.price;
    const desc = card.dataset.desc;
    const details = card.dataset.details;
    const img = card.dataset.image || '';
    modalTitle.textContent = name;
    modalPrice.textContent = price;
    modalDesc.textContent = desc;
    modalDetails.textContent = details;
    if(modalImage){
      if(img){
        modalImage.src = img;
        modalImage.alt = name;
        modalImage.parentElement.style.display = '';
        modalImage.addEventListener('error', function(){ this.src = ''; this.alt = ''; this.parentElement.style.display = 'none'; }, {once:true});
      } else {
        modalImage.src = '';
        modalImage.alt = '';
        modalImage.parentElement.style.display = 'none';
      }
    }
    // Hide the modal buy button only for specified products
    const buyBtn = modal.querySelector('.modal-actions .btn.buy');
    if(buyBtn){
      const lower = (name || '').toLowerCase();
      if(/airpod/.test(lower) || /trapstar/.test(lower)){
        buyBtn.style.display = 'none';
      } else {
        buyBtn.style.display = '';
      }
    }
    modal.setAttribute('aria-hidden','false');
    // focus trap simple
    closeBtn.focus();
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
  }

  detailsBtns.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
      const card = e.target.closest('.card');
      openModal(card);
    });
  });

  closeBtn.addEventListener('click',closeModal);
  backdrop.addEventListener('click',closeModal);
  document.addEventListener('keydown',(e)=>{
    if(e.key === 'Escape') closeModal();
  });

  // Copy a simple share link to clipboard (mock)
  if(copyLink){
    copyLink.addEventListener('click',()=>{
      const name = modalTitle.textContent.replace(/\s+/g,'-').toLowerCase();
      const fake = `${location.origin}${location.pathname}#${encodeURIComponent(name)}`;
      navigator.clipboard?.writeText(fake).then(()=>{
        copyLink.textContent = 'Copied!';
        setTimeout(()=>copyLink.textContent = 'Copy link',1500);
      }).catch(()=>{
        copyLink.textContent = 'Failed';
        setTimeout(()=>copyLink.textContent = 'Copy link',1500);
      });
    });
  }
})();