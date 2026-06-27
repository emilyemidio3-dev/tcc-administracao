// Count-up animation
const counters = document.querySelectorAll('.stat-number[data-target]');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const el = entry.target;
            const target = parseFloat(el.dataset.target);
            let current = 0;
            const updateCounter = () => {
                let increment = target / 45;
                if(current < target){
                    current += increment;
                    if(current >= target) current = target;
                    if(target === 20) el.innerText = 'R$ ' + current.toFixed(0) + ' bi';
                    else if(target === 24) el.innerText = Math.floor(current) + ' mi';
                    else if(target === 38.8) el.innerText = 'R$ ' + current.toFixed(1) + ' bi';
                    else if(target === 84.7) el.innerText = current.toFixed(1) + '%';
                    setTimeout(updateCounter, 18);
                } else {
                    if(target === 20) el.innerText = 'R$ 20 bi';
                    else if(target === 24) el.innerText = '24 mi';
                    else if(target === 38.8) el.innerText = 'R$ 38,8 bi';
                    else if(target === 84.7) el.innerText = '84,7%';
                }
            };
            updateCounter();
            observer.unobserve(el);
        }
    });
}, {threshold: 0.5});
counters.forEach(c => observer.observe(c));

// Simulador de vantagem da casa
const oddSlider = document.getElementById('oddSlider');
const oddValueSpan = document.getElementById('oddValue');
const houseEdgeSpan = document.getElementById('houseEdge');
const expectedReturnSpan = document.getElementById('expectedReturn');
const houseTakeSpan = document.getElementById('houseTake');
const edgeBar = document.getElementById('edgeBar');
function updateHouseEdge() {
    let odd = parseFloat(oddSlider.value);
    oddValueSpan.innerText = odd.toFixed(2);
    let fairOdd = 2.00;
    let edge = ((1 / odd) - (1 / fairOdd)) * 100;
    edge = Math.abs(edge).toFixed(2);
    houseEdgeSpan.innerText = edge;
    let expectedReturnValue = (odd / fairOdd) * 100;
    expectedReturnSpan.innerText = expectedReturnValue.toFixed(2);
    let houseTakeValue = 100 - expectedReturnValue;
    houseTakeSpan.innerText = houseTakeValue.toFixed(2);
    edgeBar.style.width = edge + '%';
}
oddSlider.addEventListener('input', updateHouseEdge);
updateHouseEdge();

// ========== MENU HAMBÚRGUER ==========
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    function toggleMenu() {
        hamburgerBtn.classList.toggle('active');
        sideMenu.classList.toggle('open');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = sideMenu.classList.contains('open') ? 'hidden' : '';
    }

    function closeMenu() {
        hamburgerBtn.classList.remove('active');
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMenu);
    }
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }

    document.querySelectorAll('.side-menu a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});
