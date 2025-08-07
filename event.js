// 카페 키오스크 시스템 - Figma 디자인 기반
// 카테고리별 메뉴 필터링, 장바구니 관리, 주문 기능을 포함한 시스템

// 장바구니 데이터 객체
let cart = [];

// 총 주문 금액
let totalAmount = 0;

// 현재 선택된 카테고리
let currentCategory = 'coffee';

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('카페 키오스크 시스템이 로드되었습니다.');
    
    // 카테고리 버튼 이벤트 리스너 설정
    setupCategoryButtons();
    
    // 초기 화면 업데이트
    updateCartDisplay();
});

/**
 * 카테고리 버튼 이벤트 리스너를 설정하는 함수
 */
function setupCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            switchCategory(category);
        });
    });
}

/**
 * 카테고리를 변경하는 함수
 * @param {string} category - 선택할 카테고리 (coffee, dessert, food)
 */
function switchCategory(category) {
    // 현재 카테고리 버튼 비활성화
    document.querySelector('.category-btn.active').classList.remove('active');
    
    // 새로운 카테고리 버튼 활성화
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // 메뉴 카드들 숨기기/보이기
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach(card => {
        if (card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    currentCategory = category;
    console.log(`카테고리가 ${category}로 변경되었습니다.`);
}

/**
 * 장바구니에 아이템을 추가하는 함수
 * @param {string} itemId - 아이템 ID
 * @param {number} price - 아이템 가격
 * @param {string} name - 아이템 이름
 */
function addToCart(itemId, price, name) {
    // 장바구니에 이미 있는 아이템인지 확인
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        // 기존 아이템 수량 증가
        existingItem.quantity++;
    } else {
        // 새로운 아이템 추가
        cart.push({
            id: itemId,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    // 총 금액 계산
    calculateTotal();
    
    // 장바구니 화면 업데이트
    updateCartDisplay();
    
    // 추가 애니메이션 효과
    showAddAnimation();
    
    console.log(`${name}이(가) 장바구니에 추가되었습니다.`);
}

/**
 * 장바구니에서 아이템을 제거하는 함수
 * @param {string} itemId - 제거할 아이템 ID
 */
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    calculateTotal();
    updateCartDisplay();
    console.log('아이템이 장바구니에서 제거되었습니다.');
}

/**
 * 장바구니 아이템의 수량을 변경하는 함수
 * @param {string} itemId - 아이템 ID
 * @param {number} change - 수량 변경값 (+1 또는 -1)
 */
function changeQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
        item.quantity += change;
        
        // 수량이 0 이하가 되면 장바구니에서 제거
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            calculateTotal();
            updateCartDisplay();
        }
    }
}

/**
 * 총 금액을 계산하는 함수
 */
function calculateTotal() {
    totalAmount = cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

/**
 * 장바구니 화면을 업데이트하는 함수
 */
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const totalAmountElement = document.getElementById('total-amount');
    
    // 장바구니 아이템 개수 업데이트
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = `${totalItems}개`;
    
    // 장바구니가 비어있는 경우
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>장바구니가 비어있습니다</p>
            </div>
        `;
    } else {
        // 장바구니 아이템들 표시
        let cartHTML = '';
        cart.forEach(item => {
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=50&h=50&fit=crop" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price.toLocaleString('ko-KR')}원</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                        <button class="delete-btn" onclick="removeFromCart('${item.id}')">🗑️</button>
                    </div>
                </div>
            `;
        });
        cartItemsContainer.innerHTML = cartHTML;
    }
    
    // 총 금액 업데이트 (천 단위 구분자 포함)
    totalAmountElement.textContent = totalAmount.toLocaleString('ko-KR') + '원';
}

/**
 * 추가 애니메이션 효과를 보여주는 함수
 */
function showAddAnimation() {
    // 장바구니 카운트에 애니메이션 효과 추가
    const cartCount = document.getElementById('cart-count');
    cartCount.style.transform = 'scale(1.2)';
    cartCount.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
    }, 200);
}

/**
 * 주문을 처리하는 함수
 */
function placeOrder() {
    if (cart.length === 0) {
        alert('장바구니가 비어있습니다. 메뉴를 선택해주세요.');
        return;
    }
    
    // 주문 내역 생성
    let orderSummary = '주문 내역:\n\n';
    cart.forEach(item => {
        orderSummary += `${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString('ko-KR')}원\n`;
    });
    orderSummary += `\n총 금액: ${totalAmount.toLocaleString('ko-KR')}원`;
    
    // 주문 확인
    if (confirm(orderSummary + '\n\n주문하시겠습니까?')) {
        alert('주문이 완료되었습니다! 감사합니다.');
        
        // 장바구니 초기화
        cart = [];
        totalAmount = 0;
        updateCartDisplay();
    }
}

/**
 * 장바구니를 초기화하는 함수
 */
function clearCart() {
    if (cart.length === 0) {
        alert('장바구니가 이미 비어있습니다.');
        return;
    }
    
    if (confirm('장바구니를 비우시겠습니까?')) {
        cart = [];
        totalAmount = 0;
        updateCartDisplay();
        console.log('장바구니가 초기화되었습니다.');
    }
}

/**
 * 현재 주문 상태를 콘솔에 출력하는 함수 (디버깅용)
 */
function logOrderStatus() {
    console.log('=== 현재 주문 상태 ===');
    cart.forEach(item => {
        console.log(`${item.name}: ${item.quantity}개 (${(item.price * item.quantity).toLocaleString('ko-KR')}원)`);
    });
    console.log(`총 금액: ${totalAmount.toLocaleString('ko-KR')}원`);
    console.log('=====================');
}

console.log('카페 키오스크 JavaScript 코드가 로드되었습니다.');