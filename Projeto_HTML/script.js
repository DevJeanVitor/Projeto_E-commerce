document.addEventListener('DOMContentLoaded', () => {

  const products = [
    { id: 1, name: 'Arduino UNO', price: 100.00, image: 'Projeto_HTML/produto1.png' },
    { id: 2, name: 'Arduino Mega 2560', price: 175.00, image: 'Projeto_HTML/produto2.png' },
    { id: 3, name: 'Arduino Nano 33 IoT', price: 120.00, image: 'Projeto_HTML/produto3.png' },
    { id: 4, name: 'Raspberry Pi RP2040', price: 270.00, image: 'Projeto_HTML/imagem7.png' },
    { id: 5, name: 'Nano ESP32', price: 300.00, image: 'Projeto_HTML/imagem8.png' },
    { id: 6, name: 'Arduino Nano 33 BLE Sense', price: 360.00, image: 'Projeto_HTML/imagem9.png' },
    { id: 7, name: 'Arduino Nano 33 BLE', price: 420.00, image: 'Projeto_HTML/imagem10.png' }
  ];

  const pageElements = document.querySelectorAll('.page');
  const cartLink = document.getElementById('cart-link');

  function showPage(pageId) {
    pageElements.forEach(page => page.classList.remove('active'));
    const activePage = document.getElementById(pageId);
    if (activePage) activePage.classList.add('active');
    window.scrollTo(0, 0);
  }

  const getCart = () => JSON.parse(localStorage.getItem('shoppingCart')) || {};
  const saveCart = cart => localStorage.setItem('shoppingCart', JSON.stringify(cart));

  const selectedProductList = document.getElementById('selected-product-list');
  const totalPriceEl = document.getElementById('total-price');
  const checkoutBtn = document.getElementById('checkout-btn');

  function renderCart() {
    const cart = getCart();
    selectedProductList.innerHTML = '';
    let total = 0;
    const productIds = Object.keys(cart);

    if (productIds.length === 0) {
      selectedProductList.innerHTML = '<p>Seu carrinho está vazio.</p>';
      if (checkoutBtn) checkoutBtn.style.display = 'none';
    } else {
      if (checkoutBtn) checkoutBtn.style.display = 'inline-block';
      productIds.forEach(productId => {
        const product = products.find(p => p.id == productId);
        const quantity = cart[productId];
        if (!product) return;

        total += product.price * quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <div class="cart-item-info">
            <h4>${product.name}</h4>
            <p>R$ ${product.price.toFixed(2)}</p>
          </div>
          <div class="quantity-controls">
            <button class="quantity-btn" data-id="${productId}" data-action="decrease">-</button>
            <span>${quantity}</span>
            <button class="quantity-btn" data-id="${productId}" data-action="increase">+</button>
          </div>
          <p><strong>Subtotal: R$ ${(product.price * quantity).toFixed(2)}</strong></p>
        `;
        selectedProductList.appendChild(cartItem);
      });
    }

    totalPriceEl.textContent = `TOTAL: R$ ${total.toFixed(2)}`;
  }

  document.querySelectorAll('.add-to-cart-main').forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      const productId = e.target.getAttribute('data-id');
      const cart = getCart();
      cart[productId] = (cart[productId] || 0) + 1;
      saveCart(cart);
      alert('Produto adicionado ao carrinho!');
      renderCart();
    });
  });

  cartLink.addEventListener('click', e => {
    e.preventDefault();
    renderCart();
    showPage('cart-page');
  });

  document.getElementById('continue-shopping-btn')
    .addEventListener('click', () => showPage('products-page'));

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => showPage('form-page'));
  }

  selectedProductList.addEventListener('click', e => {
    if (!e.target.classList.contains('quantity-btn')) return;
    const cart = getCart();
    const productId = e.target.getAttribute('data-id');
    const action = e.target.getAttribute('data-action');

    if (action === 'increase') {
      cart[productId]++;
    } else {
      cart[productId]--;
      if (cart[productId] <= 0) delete cart[productId];
    }

    saveCart(cart);
    renderCart();
  });

  document.getElementById('checkout-form')
    .addEventListener('submit', e => {
      e.preventDefault();
      showPage('payment-page');
    });

  const simulateBtn = document.getElementById('simulate-payment-btn');
  const popupOverlay = document.getElementById('popup-overlay');
  const closePopupBtn = document.getElementById('close-popup-btn');
  const trackingCodeEl = document.getElementById('tracking-code');

  function generateTrackingCode() {
    const numbers = Math.floor(10000000 + Math.random() * 90000000);
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return `BR${numbers}` +
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length));
  }

  simulateBtn.addEventListener('click', () => {
    trackingCodeEl.textContent = generateTrackingCode();
    popupOverlay.style.display = 'flex';
    localStorage.removeItem('shoppingCart');
  });

  function closePopup() {
    popupOverlay.style.display = 'none';
    showPage('products-page');
  }

  closePopupBtn.addEventListener('click', closePopup);
  popupOverlay.addEventListener('click', e => {
    if (e.target === popupOverlay) closePopup();
  });

  showPage('products-page');
  renderCart();

});
