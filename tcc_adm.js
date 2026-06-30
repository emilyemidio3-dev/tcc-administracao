// ========== CONTROLE DO MENU MOBILE ==========
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    // Criar overlay se não existir
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    // Abrir/fechar menu
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            menuToggle.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Muda o ícone entre ☰ e ✕
            const icon = menuToggle.querySelector('.icon');
            if (icon) {
                icon.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
            }
        });
    }

    // Fechar menu ao clicar em um link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            menuToggle.classList.remove('active');
            body.classList.remove('menu-open');
            
            const icon = menuToggle.querySelector('.icon');
            if (icon) {
                icon.textContent = '☰';
            }
        });
    });

    // Fechar menu ao clicar no overlay
    overlay.addEventListener('click', function() {
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.classList.remove('active');
        body.classList.remove('menu-open');
        
        const icon = menuToggle.querySelector('.icon');
        if (icon) {
            icon.textContent = '☰';
        }
    });

    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            menuToggle.classList.remove('active');
            body.classList.remove('menu-open');
            
            const icon = menuToggle.querySelector('.icon');
            if (icon) {
                icon.textContent = '☰';
            }
        }
    });
});

// ========== SCROLL SUAVE ==========
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

console.log('🎰 Site JOGO JUSTO | TCC carregado com sucesso!');
