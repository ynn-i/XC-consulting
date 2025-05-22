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

// Update active state in LNB based on current section
const updateActiveSection = () => {
    const sections = document.querySelectorAll('section');
    const lnbLinks = document.querySelectorAll('.lnb a');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const headerHeight = document.querySelector('.header').offsetHeight;
        const lnbHeight = document.querySelector('.lnb').offsetHeight;
        
        if (rect.top <= headerHeight + 100 && rect.bottom >= headerHeight + 100) {
            const currentId = section.getAttribute('id');
            lnbLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

// Add scroll event listener
window.addEventListener('scroll', updateActiveSection);

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
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

// Add mobile menu functionality
const createMobileMenu = () => {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (window.innerWidth <= 768) {
        const menuButton = document.createElement('button');
        menuButton.classList.add('mobile-menu-button');
        menuButton.innerHTML = '☰';
        menuButton.setAttribute('aria-label', '메뉴 열기');
        
        menuButton.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
        
        nav.querySelector('.container').insertBefore(menuButton, navLinks);
    }
};

// Initialize mobile menu
createMobileMenu();
window.addEventListener('resize', createMobileMenu);

document.addEventListener('DOMContentLoaded', function() {
    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', function() {
        highlightCurrentSection();
    });
    
    // 페이지 로드 시 현재 섹션 하이라이트
    highlightCurrentSection();
    
    // 현재 섹션 하이라이트 함수
    function highlightCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100; // 오프셋 추가
        
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
                        const parentLink = parentMenuItem.querySelector('> a');
                        if (parentLink) {
                            parentLink.classList.add('active');
                        }
                    }
                }
            }
        });
    }
    
    // 서브메뉴 항목 클릭 시 해당 섹션으로 스크롤
    document.querySelectorAll('.lnb .submenu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // URL 해시 업데이트
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
    
    // 메인 메뉴 항목 클릭 시 해당 섹션으로 스크롤
    document.querySelectorAll('.lnb .menu-item > a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // URL 해시 업데이트
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
    
    // 페이지 로드 시 URL 해시가 있으면 해당 섹션으로 스크롤
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});
