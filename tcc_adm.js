// símbolos
const SYMBOLS = [
    { id: 'banana',  src: 'banana.png', multiplier: 2,  probability: 0.55 },
    { id: 'fruit',   src: 'fruit.png',  multiplier: 3,  probability: 0.20 },
    { id: 'grape',   src: 'grape.png',  multiplier: 5,  probability: 0.10 },
    { id: 'money',   src: 'money.png',  multiplier: 8,  probability: 0.07 },
    { id: 'bag',     src: 'bag.png',    multiplier: 12, probability: 0.04 },
    { id: 'cards',   src: 'cards.png',  multiplier: 25, probability: 0.025 },
    { id: 'seven',   src: 'seven.png',  multiplier: 40, probability: 0.015 }
];

// estado do jogo
let balance = 30;           // saldo inicial
let currentBet = 10;        // aposta selecionada
let totalBet = 0;           // total apostado (acumulado)
let totalWon = 0;           // total ganho (acumulado)
let totalLost = 0;          // total perdido (acumulado)
let spinning = false;       // trava para evitar múltiplos giros

// elementos dom
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

// sortear símbolo probabilidade
function getRandomSymbol() {
    const rand = Math.random();
    let cumulative = 0;
    for (const symbol of SYMBOLS) {
        cumulative += symbol.probability;
        if (rand <= cumulative) {
            return symbol;
        }
    }
    // fallback (nunca deve acontecer)
    return SYMBOLS[0];
}

// gerar 3 símbolos aleatórios
function generateSpinResult() {
    return [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
}

// verifica vitórias (3 iguais)
// retorna o multiplicador ou 0 se perdeu
function checkWin(symbols) {
    const [s1, s2, s3] = symbols;
    // só ganha se os três forem exatamente o mesmo símbolo
    if (s1.id === s2.id && s2.id === s3.id) {
        return s1.multiplier;   // multiplicador do símbolo
    }
    return 0;   // perdeu
}

// autualiza a interface
function updateUI() {
    // atualiza os valores numéricos
    balanceEl.textContent = balance;
    totalBetEl.textContent = totalBet;
    totalWonEl.textContent = totalWon;
    totalLostEl.textContent = totalLost;
    currentBetDisplay.textContent = currentBet;

    // atualiza os botões de aposta (comportamento radio)
    betButtons.forEach(btn => {
        const val = parseInt(btn.dataset.bet);
        btn.classList.toggle('active', val === currentBet);
    });

    // gerencia estado de fim de jogo (saldo < 5)
    const gameOver = balance < 5;
    if (gameOver) {
        spinBtn.style.display = 'none';
        restartBtn.style.display = 'block';
        gameMessageEl.innerHTML = '<div style="color:#f97316; font-weight:600;">💸 Fim do jogo! A casa sempre vence no longo prazo.</div>';
    } else {
        spinBtn.style.display = 'block';
        restartBtn.style.display = 'none';
        spinBtn.disabled = (balance < currentBet) || spinning;
    }
}

// exibir os símbolos nos slots
function renderSlots(symbols) {
    symbols.forEach((symbol, index) => {
        slotElements[index].innerHTML = `<img src="${symbol.src}" alt="${symbol.id}">`;
    });
}

// girar
function spin() {
    // Verifica se pode girar
    if (spinning) return;
    if (balance < currentBet) {
        gameMessageEl.innerHTML = '<div style="color:#ef4444;">Saldo insuficiente para essa aposta.</div>';
        return;
    }

    // inicia o giro – bloqueia novos cliques
    spinning = true;
    spinBtn.disabled = true;

    // deduz a aposta do saldo ANTES do sorteio
    balance -= currentBet;
    totalBet += currentBet;
    updateUI();

    // animação rápida (12 trocas)
    let spinCount = 0;
    const interval = setInterval(() => {
        // gera três símbolos aleatórios para o efeito
        const tempSymbols = generateSpinResult();
        renderSlots(tempSymbols);
        spinCount++;

        if (spinCount >= 12) {
            clearInterval(interval);

            // sorteio final (resultado real)
            const finalSymbols = generateSpinResult();
            renderSlots(finalSymbols);

            // verifica vitória
            const multiplier = checkWin(finalSymbols);
            let winAmount = 0;

            if (multiplier > 0) {
                // ganhou – calcula prêmio
                winAmount = currentBet * multiplier;
                balance += winAmount;
                totalWon += winAmount;
                gameMessageEl.innerHTML = `<div style="color:#fbbf24; font-weight:600;">🎉 VITÓRIA! Ganhou R$ ${winAmount} (x${multiplier}) 🎉</div>`;
            } else {
                // perdeu
                totalLost += currentBet;
                gameMessageEl.innerHTML = '<div style="color:#ef4444; font-weight:600;">❌ Você perdeu.</div>';
            }

            // atualiza interface com os novos valores
            updateUI();

            // libera o botão para novo giro
            spinning = false;
            spinBtn.disabled = false;

            // verifica se o jogo acabou
            if (balance < 5) {
                updateUI(); // reavalia estado de game over
            }
        }
    }, 55); // 55ms entre cada troca
}

// reiniciar jogo
function restartGame() {
    balance = 30;
    currentBet = 10;
    totalBet = 0;
    totalWon = 0;
    totalLost = 0;
    spinning = false;
    spinBtn.disabled = false;

    // reseta os slots com banana (símbolo padrão)
    const defaultSymbol = SYMBOLS[0];
    renderSlots([defaultSymbol, defaultSymbol, defaultSymbol]);

    gameMessageEl.innerHTML = '';
    updateUI();
}

// evento dos botões (radio button)
betButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        if (spinning) return; // não permite mudar durante giro
        const value = parseInt(this.dataset.bet);
        if (value <= balance) {
            currentBet = value;
            updateUI();
        } else {
            gameMessageEl.innerHTML = `<div style="color:#f59e0b;">Saldo insuficiente para aposta de R$ ${value}.</div>`;
        }
    });
});

// botões principais
spinBtn.addEventListener('click', spin);
restartBtn.addEventListener('click', restartGame);

// inicialização
// configura os slots com banana
const initialSymbol = SYMBOLS[0];
renderSlots([initialSymbol, initialSymbol, initialSymbol]);
updateUI();
