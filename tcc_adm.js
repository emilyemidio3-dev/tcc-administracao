// ============================================================
//  SIMULAÇÃO "JOGO DO TIGRINHO" - PROBABILIDADES EQUILIBRADAS
//  Regras: só ganha com 3 símbolos iguais.
//  Multiplicadores fixos por símbolo.
//  Probabilidades ajustadas para dar mais vitórias, mas sem
//  comprometer a vantagem da casa no longo prazo.
// ============================================================

// --------------------------------------------
// 1. CONFIGURAÇÃO DOS SÍMBOLOS (probabilidades revisadas)
// --------------------------------------------
const SYMBOLS = [
    { id: 'banana',  src: 'banana.png', multiplier: 2,  probability: 0.45 },
    { id: 'fruit',   src: 'fruit.png',  multiplier: 3,  probability: 0.22 },
    { id: 'grape',   src: 'grape.png',  multiplier: 5,  probability: 0.14 },
    { id: 'money',   src: 'money.png',  multiplier: 8,  probability: 0.09 },
    { id: 'bag',     src: 'bag.png',    multiplier: 12, probability: 0.05 },
    { id: 'cards',   src: 'cards.png',  multiplier: 25, probability: 0.03 },
    { id: 'seven',   src: 'seven.png',  multiplier: 40, probability: 0.02 }
];

// --------------------------------------------
// 2. ESTADO DO JOGO
// --------------------------------------------
let balance = 30;
let currentBet = 10;
let totalBet = 0;
let totalWon = 0;
let totalLost = 0;
let spinning = false;
let gameOver = false;  // flag para evitar ações após o fim

// --------------------------------------------
// 3. REFERÊNCIAS DOS ELEMENTOS DOM
// --------------------------------------------
const slotElements = [
    document.getElementById('slot1'),
    document.getElementById('slot2'),
    document.getElementById('slot3')
];
const balanceEl = document.getElementById('balance');
const totalBetEl = document.getElementById('totalBet');
const totalWonEl = document.getElementById('totalWon');
const totalLostEl = document.getElementById('totalLost');
const currentBetDisplay = document.getElementById('currentBetDisplay');
const gameMessageEl = document.getElementById('gameMessage');
const spinBtn = document.getElementById('spinBtn');
const restartBtn = document.getElementById('restartBtn');
const betButtons = document.querySelectorAll('.bet-btn');

// --------------------------------------------
// 4. FUNÇÃO AUXILIAR – SORTEAR SÍMBOLO CONFORME PROBABILIDADE
// --------------------------------------------
function getRandomSymbol() {
    const rand = Math.random();
    let cumulative = 0;
    for (const symbol of SYMBOLS) {
        cumulative += symbol.probability;
        if (rand <= cumulative) {
            return symbol;
        }
    }
    return SYMBOLS[0];
}

// --------------------------------------------
// 5. FUNÇÃO PARA GERAR TRÊS SÍMBOLOS ALEATÓRIOS
// --------------------------------------------
function generateSpinResult() {
    return [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
}

// --------------------------------------------
// 6. FUNÇÃO QUE VERIFICA SE HÁ VITÓRIA (3 IGUAIS)
// --------------------------------------------
function checkWin(symbols) {
    const [s1, s2, s3] = symbols;
    if (s1.id === s2.id && s2.id === s3.id) {
        return s1.multiplier;
    }
    return 0;
}

// --------------------------------------------
// 7. FUNÇÃO PARA ATUALIZAR A INTERFACE
// --------------------------------------------
function updateUI() {
    balanceEl.textContent = balance;
    totalBetEl.textContent = totalBet;
    totalWonEl.textContent = totalWon;
    totalLostEl.textContent = totalLost;
    currentBetDisplay.textContent = currentBet;

    // Botões de aposta (radio)
    betButtons.forEach(btn => {
        const val = parseInt(btn.dataset.bet);
        btn.classList.toggle('active', val === currentBet);
    });

    // Verifica se o jogo acabou (saldo < 5)
    if (balance < 5) {
        gameOver = true;
        spinBtn.style.display = 'none';
        restartBtn.style.display = 'block';
        // Mensagem final (limpa qualquer mensagem anterior enganosa)
        gameMessageEl.innerHTML = '<div style="color:#f97316; font-weight:600;">💸 Fim do jogo! A casa sempre vence no longo prazo.</div>';
        // Reseta os slots para um estado "neutro" para não confundir
        const neutralSymbol = SYMBOLS[0]; // banana
        renderSlots([neutralSymbol, neutralSymbol, neutralSymbol]);
    } else {
        gameOver = false;
        spinBtn.style.display = 'block';
        restartBtn.style.display = 'none';
        spinBtn.disabled = (balance < currentBet) || spinning;
    }
}

// --------------------------------------------
// 8. FUNÇÃO PARA EXIBIR OS SÍMBOLOS NOS SLOTS
// --------------------------------------------
function renderSlots(symbols) {
    symbols.forEach((symbol, index) => {
        slotElements[index].innerHTML = `<img src="${symbol.src}" alt="${symbol.id}">`;
    });
}

// --------------------------------------------
// 9. FUNÇÃO PRINCIPAL – GIRAR
// --------------------------------------------
function spin() {
    if (spinning || gameOver) return;
    if (balance < currentBet) {
        gameMessageEl.innerHTML = '<div style="color:#ef4444;">Saldo insuficiente para essa aposta.</div>';
        return;
    }

    spinning = true;
    spinBtn.disabled = true;

    // Deduz a aposta
    balance -= currentBet;
    totalBet += currentBet;
    updateUI();

    // Animação
    let spinCount = 0;
    const interval = setInterval(() => {
        const tempSymbols = generateSpinResult();
        renderSlots(tempSymbols);
        spinCount++;

        if (spinCount >= 12) {
            clearInterval(interval);

            // Resultado final
            const finalSymbols = generateSpinResult();
            renderSlots(finalSymbols);

            const multiplier = checkWin(finalSymbols);
            let winAmount = 0;

            if (multiplier > 0) {
                winAmount = currentBet * multiplier;
                balance += winAmount;
                totalWon += winAmount;
                gameMessageEl.innerHTML = `<div style="color:#fbbf24; font-weight:600;">🎉 VITÓRIA! Ganhou R$ ${winAmount} (x${multiplier}) 🎉</div>`;
            } else {
                totalLost += currentBet;
                gameMessageEl.innerHTML = '<div style="color:#ef4444; font-weight:600;">❌ Você perdeu.</div>';
            }

            spinning = false;
            spinBtn.disabled = false;
            updateUI(); // atualiza e verifica game over
        }
    }, 55);
}

// --------------------------------------------
// 10. FUNÇÃO PARA REINICIAR O JOGO
// --------------------------------------------
function restartGame() {
    balance = 30;
    currentBet = 10;
    totalBet = 0;
    totalWon = 0;
    totalLost = 0;
    spinning = false;
    gameOver = false;
    spinBtn.disabled = false;

    const defaultSymbol = SYMBOLS[0];
    renderSlots([defaultSymbol, defaultSymbol, defaultSymbol]);
    gameMessageEl.innerHTML = '';
    updateUI();
}

// --------------------------------------------
// 11. EVENTOS DOS BOTÕES DE APOSTA (RADIO BUTTON)
// --------------------------------------------
betButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        if (spinning || gameOver) return;
        const value = parseInt(this.dataset.bet);
        if (value <= balance) {
            currentBet = value;
            updateUI();
        } else {
            gameMessageEl.innerHTML = `<div style="color:#f59e0b;">Saldo insuficiente para aposta de R$ ${value}.</div>`;
        }
    });
});

// --------------------------------------------
// 12. EVENTOS DOS BOTÕES PRINCIPAIS
// --------------------------------------------
spinBtn.addEventListener('click', spin);
restartBtn.addEventListener('click', restartGame);

// --------------------------------------------
// 13. INICIALIZAÇÃO
// --------------------------------------------
const initialSymbol = SYMBOLS[0];
renderSlots([initialSymbol, initialSymbol, initialSymbol]);
updateUI();
