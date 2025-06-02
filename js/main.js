// 전역 변수 및 유틸리티 함수
let isScrolling = false;

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 현재 섹션 하이라이트 함수 (중복 제거 및 개선)
function highlightCurrentSection() {
    if (isScrolling) return; // 스크롤 중복 방지
    
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // 모든 링크에서 active 클래스 제거
            document.querySelectorAll('.lnb a').forEach(link => {
                link.classList.remove('active');
            });
            
            // 현재 섹션에 해당하는 링크에 active 클래스 추가
            const currentLink = document.querySelector(`.lnb a[href="#${sectionId}"]`);
            if (currentLink) {
                currentLink.classList.add('active');
                
                // 부모 메뉴 항목도 활성화
                const parentMenuItem = currentLink.closest('.menu-item');
                if (parentMenuItem) {
                    const parentLink = parentMenuItem.querySelector(':scope > a');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            }
        }
    });
}

// Update active state in LNB based on current section (기존 함수와 통합)
const updateActiveSection = () => {
    const sections = document.querySelectorAll('section');
    const lnbLinks = document.querySelectorAll('.lnb a');
    
    if (!sections.length || !lnbLinks.length) return;
    
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        
        if (rect.top <= headerHeight + 100 && rect.bottom >= headerHeight + 100) {
            const currentId = section.getAttribute('id');
            if (currentId) {
                lnbLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
};

// 스크롤 이벤트 처리 (throttle 적용)
let scrollTimeout;
const handleScroll = () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
        highlightCurrentSection();
        updateActiveSection();
        isScrolling = false;
    }, 16); // 60fps
    
    isScrolling = true;
};

// Add scroll event listener
window.addEventListener('scroll', handleScroll, { passive: true });

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            message: document.getElementById('message')?.value || ''
        };

        // Here you would typically send the data to a server
        console.log('Form submitted:', formData);
        
        // Show success message
        alert('메시지가 성공적으로 전송되었습니다!');
        
        // Reset form
        contactForm.reset();
    });
}

// Add scroll-based animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Add mobile menu functionality (개선)
let mobileMenuInitialized = false;

const createMobileMenu = () => {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (!nav || !navLinks) return;
    
    // 기존 모바일 메뉴 버튼 제거
    const existingButton = nav.querySelector('.mobile-menu-button');
    if (existingButton) {
        existingButton.remove();
    }
    
    if (window.innerWidth <= 768 && !mobileMenuInitialized) {
        const menuButton = document.createElement('button');
        menuButton.classList.add('mobile-menu-button');
        menuButton.innerHTML = '☰';
        menuButton.setAttribute('aria-label', '메뉴 열기');
        
        menuButton.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            menuButton.setAttribute('aria-label', 
                navLinks.classList.contains('show') ? '메뉴 닫기' : '메뉴 열기'
            );
        });
        
        const container = nav.querySelector('.container');
        if (container) {
            container.insertBefore(menuButton, navLinks);
        }
        
        mobileMenuInitialized = true;
    } else if (window.innerWidth > 768) {
        mobileMenuInitialized = false;
        navLinks.classList.remove('show');
    }
};

// Initialize mobile menu
createMobileMenu();
window.addEventListener('resize', createMobileMenu);

// DOM Content Loaded 이벤트 처리
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - 초기화 시작');
    
    // 초기 섹션 하이라이트
    setTimeout(() => {
        highlightCurrentSection();
    }, 100);
    
    // 서브메뉴 항목 클릭 처리
    const submenuLinks = document.querySelectorAll('.lnb .submenu a');
    console.log(`서브메뉴 링크 ${submenuLinks.length}개 발견`);
    
    submenuLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`서브메뉴 링크 ${index + 1} 클릭됨`);
            
            const targetId = this.getAttribute('href')?.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // URL 해시 업데이트
                if (history.pushState) {
                    history.pushState(null, null, `#${targetId}`);
                }
            } else {
                console.warn(`섹션을 찾을 수 없음: ${targetId}`);
            }
        });
    });
    
    // 메인 메뉴 항목 클릭 처리
    const mainMenuLinks = document.querySelectorAll('.lnb .menu-item > a');
    console.log(`메인 메뉴 링크 ${mainMenuLinks.length}개 발견`);
    
    mainMenuLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`메인 메뉴 링크 ${index + 1} 클릭됨`);
            
            const targetId = this.getAttribute('href')?.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // URL 해시 업데이트
                if (history.pushState) {
                    history.pushState(null, null, `#${targetId}`);
                }
            } else {
                console.warn(`섹션을 찾을 수 없음: ${targetId}`);
            }
        });
    });
    
    // 페이지 로드 시 URL 해시 처리
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            console.log(`URL 해시로 이동: ${targetId}`);
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }, 200);
        }
    }

    // Guide toggle functionality (개선된 버전)
    const toggleButtons = document.querySelectorAll('.guide-toggle');
    console.log(`토글 버튼 ${toggleButtons.length}개 발견`);
    
    if (toggleButtons.length === 0) {
        console.warn('토글 버튼을 찾을 수 없습니다. HTML 구조를 확인하세요.');
    }
    
    toggleButtons.forEach((toggle, index) => {
        console.log(`토글 버튼 ${index + 1} 초기화 중...`);
        
        // 구조 검증
        const guideContent = toggle.nextElementSibling;
        if (!guideContent) {
            console.error(`토글 버튼 ${index + 1}: 가이드 콘텐츠를 찾을 수 없습니다.`);
            return;
        }
        
        const arrowIcon = toggle.querySelector('.arrow-icon');
        const buttonText = toggle.querySelector('span');
        
        // 초기 상태 설정
        if (!toggle.classList.contains('active')) {
            guideContent.style.display = 'none';
            if (arrowIcon) {
                arrowIcon.style.transform = 'rotate(0deg)';
                arrowIcon.style.transition = 'transform 0.3s ease';
            }
        }
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`토글 버튼 ${index + 1} 클릭됨`);
            
            try {
                const isActive = this.classList.contains('active');
                console.log(`현재 상태: ${isActive ? '열림' : '닫힘'}`);
                
                // 상태 토글
                this.classList.toggle('active');
                guideContent.classList.toggle('active');
                
                const newState = this.classList.contains('active');
                
                // // 텍스트 변경
                // if (buttonText) {
                //     const newText = newState ? '상세 가이드 접기' : '상세 가이드 확인하기';
                //     buttonText.textContent = newText;
                // }
                
                // 화살표 회전
                if (arrowIcon) {
                    arrowIcon.style.transform = newState ? 'rotate(180deg)' : 'rotate(0deg)';
                }
                
                // 콘텐츠 표시/숨김 (부드러운 애니메이션)
                if (newState) {
                    // 열기
                    guideContent.style.display = 'block';
                    guideContent.style.maxHeight = '0px';
                    guideContent.style.overflow = 'hidden';
                    guideContent.style.transition = 'max-height 0.3s ease-out';
                    
                    // 실제 높이 계산 후 애니메이션
                    requestAnimationFrame(() => {
                        const height = guideContent.scrollHeight;
                        guideContent.style.maxHeight = height + 'px';
                        
                        // 애니메이션 완료 후 maxHeight 제거
                        setTimeout(() => {
                            if (guideContent.classList.contains('active')) {
                                guideContent.style.maxHeight = 'none';
                            }
                        }, 300);
                    });
                } else {
                    // 닫기
                    const height = guideContent.scrollHeight;
                    guideContent.style.maxHeight = height + 'px';
                    guideContent.style.overflow = 'hidden';
                    guideContent.style.transition = 'max-height 0.3s ease-out';
                    
                    requestAnimationFrame(() => {
                        guideContent.style.maxHeight = '0px';
                        
                        // 애니메이션 완료 후 숨김
                        setTimeout(() => {
                            if (!guideContent.classList.contains('active')) {
                                guideContent.style.display = 'none';
                            }
                        }, 300);
                    });
                }
                
                console.log(`토글 상태 변경 완료: ${newState ? '열림' : '닫힘'}`);
                
            } catch (error) {
                console.error(`토글 버튼 ${index + 1} 오류:`, error);
            }
        });
        
        console.log(`토글 버튼 ${index + 1} 초기화 완료`);
    });
    
    // 디버깅
    // window.debugTools = {
    //     checkToggles: () => {
    //         const toggles = document.querySelectorAll('.guide-toggle');
    //         console.log('=== 토글 상태 점검 ===');
    //         toggles.forEach((toggle, i) => {
    //             const content = toggle.nextElementSibling;
    //             console.log(`토글 ${i + 1}:`, {
    //                 active: toggle.classList.contains('active'),
    //                 contentVisible: content ? getComputedStyle(content).display !== 'none' : false,
    //                 contentHeight: content ? content.scrollHeight : 0
    //             });
    //         });
    //     },
        
    //     testToggle: (index) => {
    //         const toggle = document.querySelectorAll('.guide-toggle')[index - 1];
    //         if (toggle) {
    //             toggle.click();
    //             console.log(`토글 ${index} 테스트 클릭 완료`);
    //         } else {
    //             console.error(`토글 ${index}을 찾을 수 없습니다.`);
    //         }
    //     },
        
    //     checkSections: () => {
    //         const sections = document.querySelectorAll('section[id]');
    //         console.log('=== 섹션 점검 ===');
    //         sections.forEach((section, i) => {
    //             console.log(`섹션 ${i + 1}:`, {
    //                 id: section.id,
    //                 offsetTop: section.offsetTop,
    //                 height: section.offsetHeight
    //             });
    //         });
    //     }
    // };
    
    // console.log('디버깅 도구 사용법:');
    // console.log('debugTools.checkToggles() - 토글 상태 확인');
    // console.log('debugTools.testToggle(1) - 토글 테스트');
    // console.log('debugTools.checkSections() - 섹션 정보 확인');
    
    // console.log('DOM Content Loaded - 초기화 완료');


    
});