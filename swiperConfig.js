// Swiper 설정 모듈

// 기본 Swiper 초기화 함수
export function initSwiper() {
    return new Swiper(".mySwiper", {
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
            },
        }
    });
}

// 메뉴 카드에 Swiper 적용 함수
export function applySwiperToMenuCard(card, images, menuId) {
    const imageContainer = card.querySelector('.menu-image');
    if (!imageContainer || images.length <= 1) return;

    // 기존 내용 제거
    imageContainer.innerHTML = '';

    // 고유한 ID 생성
    const uniqueId = `menu-${menuId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Swiper 컨테이너 생성
    const swiperContainer = document.createElement('div');
    swiperContainer.className = 'swiper';
    swiperContainer.id = `swiper-${uniqueId}`;
    
    // Swiper 구조 생성
    swiperContainer.innerHTML = `
        <div class="swiper-wrapper">
            ${images.map((image, index) => `
                <div class="swiper-slide">
                    <img src="${image}" alt="메뉴 이미지 ${index + 1}" loading="lazy">
                </div>
            `).join('')}
        </div>
        <div class="swiper-pagination" id="pagination-${uniqueId}"></div>
        <div class="swiper-button-next" id="next-${uniqueId}"></div>
        <div class="swiper-button-prev" id="prev-${uniqueId}"></div>
    `;

    imageContainer.appendChild(swiperContainer);

    // Swiper 초기화 (약간의 지연 후)
    setTimeout(() => {
        try {
            const swiper = new Swiper(`#swiper-${uniqueId}`, {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                effect: "fade",
                fadeEffect: {
                    crossFade: true
                },
                navigation: {
                    nextEl: `#next-${uniqueId}`,
                    prevEl: `#prev-${uniqueId}`,
                },
                pagination: {
                    el: `#pagination-${uniqueId}`,
                    clickable: true,
                    dynamicBullets: true,
                },
                on: {
                    init: function() {
                        console.log(`Swiper initialized for menu ${menuId}`);
                    }
                }
            });
        } catch (error) {
            console.error(`Error initializing Swiper for menu ${menuId}:`, error);
        }
    }, 200);
}