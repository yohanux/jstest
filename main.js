// 메인 애플리케이션 모듈
import { menuData, filterMenuByCategory } from './menuData.js';
import { renderMenuGrid, updateCategoryButtons } from './uiRenderer.js';
import CartManager from './cartManager.js';

class KioskApp {
    constructor() {
        this.currentCategory = 'all';
        this.menuGrid = document.getElementById('menu-grid');
        this.cartManager = new CartManager();
        this.init();
    }

    init() {
        this.renderMenu();
        this.bindEvents();
    }

    // 메뉴 렌더링
    renderMenu() {
        const filteredMenu = filterMenuByCategory(this.currentCategory);
        renderMenuGrid(filteredMenu, this.menuGrid);
        this.bindMenuEvents();
    }

    // 카테고리 변경
    changeCategory(category) {
        this.currentCategory = category;
        updateCategoryButtons(category);
        this.renderMenu();
    }

    // 이벤트 바인딩
    bindEvents() {
        // 카테고리 버튼 이벤트
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.changeCategory(category);
            });
        });
    }

    // 메뉴 카드 이벤트 바인딩
    bindMenuEvents() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const menuId = parseInt(e.target.closest('.add-to-cart-btn').dataset.menuId);
                this.cartManager.addToCart(menuId);
                
                // 버튼 애니메이션 효과
                this.animateAddButton(e.target);
            });
        });
    }

    // 추가 버튼 애니메이션
    animateAddButton(button) {
        button.style.transform = 'scale(0.8)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

// 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new KioskApp();
});