// UI 렌더링 모듈
import { findMenuById } from './menuData.js';
import { applySwiperToMenuCard } from './swiperConfig.js';

// 메뉴 카드 생성 함수
export function createMenuCard(menu) {
    const card = document.createElement('div');
    card.className = 'menu-card';
    
    // 첫 번째 이미지를 기본 이미지로 사용
    const mainImage = menu.images ? menu.images[0] : '';
    
    card.innerHTML = `
        <div class="menu-image">
            <img src="${mainImage}" alt="${menu.name}" loading="lazy">
        </div>
        <div class="menu-content">
            <h3 class="menu-title">${menu.name}</h3>
            <p class="menu-description">${menu.description}</p>
            <div class="menu-footer">
                <span class="menu-price">${menu.price.toLocaleString()}원</span>
                <button class="add-to-cart-btn" data-menu-id="${menu.id}">
                    <span class="btn-icon">+</span>
                </button>
            </div>
        </div>
    `;

    // 여러 이미지가 있으면 Swiper 적용 (메뉴 ID 전달)
    if (menu.images && menu.images.length > 1) {
        setTimeout(() => {
            applySwiperToMenuCard(card, menu.images, menu.id);
        }, 300);
    }

    return card;
}

// 메뉴 그리드 렌더링 함수
export function renderMenuGrid(menuList, container) {
    container.innerHTML = '';
    menuList.forEach(menu => {
        const card = createMenuCard(menu);
        container.appendChild(card);
    });
}

// 장바구니 아이템 생성 함수
export function createCartItem(cartItem) {
    const menu = findMenuById(cartItem.menuId);
    if (!menu) return null;

    const item = document.createElement('div');
    item.className = 'cart-item';
    
    // 첫 번째 이미지 사용
    const image = menu.images ? menu.images[0] : '';
    
    item.innerHTML = `
        <div class="cart-item-image">
            <img src="${image}" alt="${menu.name}">
        </div>
        <div class="cart-item-info">
            <div class="cart-item-name">${menu.name}</div>
            <div class="cart-item-price">${menu.price.toLocaleString()}원</div>
        </div>
        <div class="cart-item-controls">
            <button class="quantity-btn decrease-btn" data-menu-id="${menu.id}">-</button>
            <span class="cart-item-quantity">${cartItem.quantity}</span>
            <button class="quantity-btn increase-btn" data-menu-id="${menu.id}">+</button>
            <button class="delete-btn" data-menu-id="${menu.id}">🗑️</button>
        </div>
    `;
    return item;
}

// 장바구니 렌더링 함수
export function renderCart(cart, container) {
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <p>장바구니가 비어있습니다</p>
            </div>
        `;
        return;
    }

    cart.forEach(cartItem => {
        const item = createCartItem(cartItem);
        if (item) {
            container.appendChild(item);
        }
    });
}

// 장바구니 카운트 업데이트 함수
export function updateCartCount(cart) {
    const countElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countElement.textContent = `${totalItems}개`;
}

// 총 금액 업데이트 함수
export function updateTotalAmount(cart) {
    const totalElement = document.getElementById('total-amount');
    const total = cart.reduce((sum, item) => {
        const menu = findMenuById(item.menuId);
        return sum + (menu ? menu.price * item.quantity : 0);
    }, 0);
    totalElement.textContent = `${total.toLocaleString()}원`;
}

// 카테고리 버튼 활성화 함수
export function updateCategoryButtons(activeCategory) {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === activeCategory) {
            btn.classList.add('active');
        }
    });
}
