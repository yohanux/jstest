// 장바구니 관리 모듈
import { saveData, loadData } from './storage.js';
import { findMenuById } from './menuData.js';
import { renderCart, updateCartCount, updateTotalAmount } from './uiRenderer.js';

class CartManager {
    constructor() {
        // 페이지 새로고침 시 장바구니 초기화
        this.cart = [];
        this.cartContainer = document.getElementById('cart-items');
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    // 장바구니에 메뉴 추가
    addToCart(menuId) {
        const existingItem = this.cart.find(item => item.menuId === menuId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                menuId: menuId,
                quantity: 1
            });
        }
        
        this.saveAndRender();
    }

    // 장바구니에서 메뉴 수량 증가
    increaseQuantity(menuId) {
        const item = this.cart.find(item => item.menuId === menuId);
        if (item) {
            item.quantity += 1;
            this.saveAndRender();
        }
    }

    // 장바구니에서 메뉴 수량 감소
    decreaseQuantity(menuId) {
        const item = this.cart.find(item => item.menuId === menuId);
        if (item) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                this.removeFromCart(menuId);
            } else {
                this.saveAndRender();
            }
        }
    }

    // 장바구니에서 메뉴 제거
    removeFromCart(menuId) {
        this.cart = this.cart.filter(item => item.menuId !== menuId);
        this.saveAndRender();
    }

    // 장바구니 비우기
    clearCart() {
        this.cart = [];
        this.saveAndRender();
    }

    // 장바구니 저장 및 렌더링
    saveAndRender() {
        // 로컬 스토리지 저장 제거 - 페이지 새로고침 시 초기화되도록
        this.render();
    }

    // 장바구니 렌더링
    render() {
        renderCart(this.cart, this.cartContainer);
        updateCartCount(this.cart);
        updateTotalAmount(this.cart);
    }

    // 이벤트 바인딩
    bindEvents() {
        // 장바구니 아이템 이벤트 위임
        this.cartContainer.addEventListener('click', (e) => {
            const menuId = parseInt(e.target.dataset.menuId);
            if (!menuId) return;

            if (e.target.classList.contains('increase-btn')) {
                this.increaseQuantity(menuId);
            } else if (e.target.classList.contains('decrease-btn')) {
                this.decreaseQuantity(menuId);
            } else if (e.target.classList.contains('delete-btn')) {
                this.removeFromCart(menuId);
            }
        });

        // 주문하기 버튼 이벤트
        const orderButton = document.getElementById('order-button');
        orderButton.addEventListener('click', () => {
            this.processOrder();
        });
    }

    // 주문 처리
    processOrder() {
        if (this.cart.length === 0) {
            alert('장바구니가 비어있습니다.');
            return;
        }

        const total = this.cart.reduce((sum, item) => {
            const menu = findMenuById(item.menuId);
            return sum + (menu ? menu.price * item.quantity : 0);
        }, 0);

        const orderDetails = this.cart.map(item => {
            const menu = findMenuById(item.menuId);
            return `${menu.name} x${item.quantity}`;
        }).join('\n');

        const confirmMessage = `주문 내역:\n${orderDetails}\n\n총 금액: ${total.toLocaleString()}원\n\n주문하시겠습니까?`;
        
        if (confirm(confirmMessage)) {
            alert('주문이 완료되었습니다!');
            this.clearCart();
        }
    }

    // 장바구니 상태 반환
    getCart() {
        return this.cart;
    }

    // 장바구니 아이템 수 반환
    getCartItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

export default CartManager;
