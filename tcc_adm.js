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

// ========== SIMULAÇÃO DE APOSTAS ==========
class SimulacaoAposta {
    constructor() {
        this.saldo = 100;
        this.rodadas = 0;
        this.rodadasTotais = 30;
        this.historico = [];
        this.faseAtual = 'confianca';
        this.probabilidadeAtual = 0.55;
        this.ganhosConsecutivos = 0;
        this.perdasConsecutivas = 0;
        this.totalApostado = 0;
        this.totalGanho = 0;
    }

    // Determina a fase atual baseado na rodada
    determinarFase() {
        const progresso = this.rodadas / this.rodadasTotais;
        
        if (progresso < 0.25) {
            this.faseAtual = 'confianca';
        } else if (progresso < 0.60) {
            this.faseAtual = 'equilibrio';
        } else {
            this.faseAtual = 'desvantagem';
        }
        
        this.atualizarProbabilidade();
    }

    // Atualiza a probabilidade de vitória com variações naturais
    atualizarProbabilidade() {
        let prob = 0.55;
        
        switch(this.faseAtual) {
            case 'confianca':
                // Fase de confiança: alta probabilidade (70-85%)
                prob = 0.70 + (Math.random() * 0.15);
                // Efeito de sequência de vitórias (diminui ligeiramente para não ser muito óbvio)
                if (this.ganhosConsecutivos > 2) {
                    prob = Math.max(0.65, prob - 0.05 * this.ganhosConsecutivos);
                }
                break;
                
            case 'equilibrio':
                // Fase de equilíbrio: probabilidade média (45-60%)
                prob = 0.45 + (Math.random() * 0.15);
                // Se estiver em sequência de perdas, dá uma chance
                if (this.perdasConsecutivas > 3) {
                    prob = Math.min(0.65, prob + 0.05);
                }
                break;
                
            case 'desvantagem':
                // Fase de desvantagem: baixa probabilidade (25-40%)
                prob = 0.25 + (Math.random() * 0.15);
                // Se estiver perdendo muito, raramente dá uma vitória pequena
                if (this.perdasConsecutivas > 5 && Math.random() < 0.2) {
                    prob = 0.50 + (Math.random() * 0.10);
                }
                break;
        }
        
        this.probabilidadeAtual = Math.max(0.20, Math.min(0.90, prob));
    }

    // Calcula o multiplicador baseado na fase
    calcularMultiplicador(venceu) {
        if (!venceu) return 0;
        
        let mult = 1.5 + (Math.random() * 0.5);
        
        switch(this.faseAtual) {
            case 'confianca':
                // Ganhos generosos na fase de confiança
                mult = 1.8 + (Math.random() * 0.7);
                break;
                
            case 'equilibrio':
                // Ganhos moderados
                mult = 1.3 + (Math.random() * 0.5);
                break;
                
            case 'desvantagem':
                // Ganhos pequenos na fase final
                mult = 1.1 + (Math.random() * 0.3);
                break;
        }
        
        return Math.max(0, Math.min(3.0, mult));
    }

    // Executa uma rodada da simulação
    executarRodada(aposta) {
        this.rodadas++;
        this.totalApostado += aposta;
        
        // Determina fase atual
        this.determinarFase();
        
        // Verifica se o saldo é suficiente
        if (this.saldo < aposta) {
            aposta = this.saldo;
        }
        
        // Determina resultado
        const venceu = Math.random() < this.probabilidadeAtual;
        
        // Calcula multiplicador
        const multiplicador = this.calcularMultiplicador(venceu);
        
        // Calcula ganho/perda
        let ganho = 0;
        let novoSaldo = this.saldo;
        
        if (venceu) {
            ganho = aposta * multiplicador;
            novoSaldo = this.saldo + ganho - aposta;
            this.ganhosConsecutivos++;
            this.perdasConsecutivas = 0;
            this.totalGanho += ganho;
        } else {
            ganho = -aposta;
            novoSaldo = this.saldo - aposta;
            this.perdasConsecutivas++;
            this.ganhosConsecutivos = 0;
        }
        
        // Atualiza saldo
        const saldoAnterior = this.saldo;
        this.saldo = Math.max(0, Math.round(novoSaldo * 100) / 100);
        
        // Registra no histórico
        const resultado = {
            rodada: this.rodadas,
            fase: this.faseAtual,
            aposta: aposta,
            venceu: venceu,
            multiplicador: multiplicador,
            ganho: ganho,
            saldoAnterior: saldoAnterior,
            saldoAtual: this.saldo,
            probabilidade: Math.round(this.probabilidadeAtual * 100),
            streakGanhos: this.ganhosConsecutivos,
            streakPerdas: this.perdasConsecutivas
        };
        
        this.historico.push(resultado);
        
        return resultado;
    }

    // Reinicia a simulação
    reiniciar() {
        this.saldo = 100;
        this.rodadas = 0;
        this.historico = [];
        this.faseAtual = 'confianca';
        this.probabilidadeAtual = 0.55;
        this.ganhosConsecutivos = 0;
        this.perdasConsecutivas = 0;
        this.totalApostado = 0;
        this.totalGanho = 0;
    }

    // Obtém estatísticas da simulação
    getEstatisticas() {
        const totalRodadas = this.historico.length;
        const vitorias = this.historico.filter(r => r.venceu).length;
        const derrotas = totalRodadas - vitorias;
        const taxaVitoria = totalRodadas > 0 ? (vitorias / totalRodadas) * 100 : 0;
        
        const distribuicaoFases = {
            confianca: { rodadas: 0, vitorias: 0, saldo: 0 },
            equilibrio: { rodadas: 0, vitorias: 0, saldo: 0 },
            desvantagem: { rodadas: 0, vitorias: 0, saldo: 0 }
        };
        
        this.historico.forEach(r => {
            if (distribuicaoFases[r.fase]) {
                distribuicaoFases[r.fase].rodadas++;
                if (r.venceu) distribuicaoFases[r.fase].vitorias++;
                distribuicaoFases[r.fase].saldo += r.ganho;
            }
        });
        
        return {
            totalRodadas,
            vitorias,
            derrotas,
            taxaVitoria,
            saldoFinal: this.saldo,
            saldoInicial: 100,
            lucroTotal: this.saldo - 100,
            totalApostado: this.totalApostado,
            totalGanho: this.totalGanho,
            roi: this.totalApostado > 0 ? ((this.saldo - 100) / this.totalApostado * 100) : 0,
            distribuicaoFases,
            streakMaxGanhos: this.calcularMaxStreak('venceu'),
            streakMaxPerdas: this.calcularMaxStreak('!venceu')
        };
    }

    calcularMaxStreak(tipo) {
        let maxStreak = 0;
        let currentStreak = 0;
        const condicao = tipo === 'venceu' ? r => r.venceu : r => !r.venceu;
        
        this.historico.forEach(r => {
            if (condicao(r)) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        });
        
        return maxStreak;
    }
}

// ========== INSTÂNCIA E CONTROLE DA SIMULAÇÃO ==========
const simulacao = new SimulacaoAposta();

// Elementos DOM
const betAmount = document.getElementById('betAmount');
const rollButton = document.getElementById('rollButton');
const resetButton = document.getElementById('resetButton');
const saldoDisplay = document.getElementById('saldo');
const rodadaDisplay = document.getElementById('rodada');
const resultadoDisplay = document.getElementById('resultado');
const probabilidadeDisplay = document.getElementById('probabilidade');
const faseDisplay = document.getElementById('fase');
const edgeBar = document.getElementById('edgeBar');

// Atualiza interface
function atualizarUI(resultado) {
    if (saldoDisplay) {
        saldoDisplay.textContent = `R$ ${simulacao.saldo.toFixed(2)}`;
    }
    
    if (rodadaDisplay) {
        rodadaDisplay.textContent = `Rodada ${simulacao.rodadas} de ${simulacao.rodadasTotais}`;
    }
    
    if (resultado) {
        const textoResultado = resultado.venceu ? 
            `🎉 VENCEU! Ganhou R$ ${resultado.ganho.toFixed(2)}` : 
            `💔 PERDEU! Perdeu R$ ${Math.abs(resultado.ganho).toFixed(2)}`;
        
        if (resultadoDisplay) {
            resultadoDisplay.textContent = textoResultado;
            resultadoDisplay.style.color = resultado.venceu ? '#4ade80' : '#ef4444';
        }
        
        if (probabilidadeDisplay) {
            probabilidadeDisplay.textContent = `${resultado.probabilidade}%`;
        }
        
        if (faseDisplay) {
            const faseNomes = {
                confianca: 'Confiança',
                equilibrio: 'Equilíbrio',
                desvantagem: 'Desvantagem'
            };
            faseDisplay.textContent = faseNomes[resultado.fase] || resultado.fase;
            
            const faseColors = {
                confianca: '#4ade80',
                equilibrio: '#fbbf24',
                desvantagem: '#ef4444'
            };
            faseDisplay.style.color = faseColors[resultado.fase] || '#f97316';
        }
        
        if (edgeBar) {
            const progresso = (simulacao.rodadas / simulacao.rodadasTotais) * 100;
            edgeBar.style.width = `${Math.min(progresso, 100)}%`;
        }
    }
}

// Evento de rolagem
if (rollButton) {
    rollButton.addEventListener('click', function() {
        if (simulacao.rodadas >= simulacao.rodadasTotais) {
            alert('A simulação terminou! Clique em "Reiniciar" para começar novamente.');
            return;
        }
        
        const aposta = parseFloat(betAmount ? betAmount.value : 10);
        
        if (isNaN(aposta) || aposta <= 0) {
            alert('Por favor, insira um valor de aposta válido.');
            return;
        }
        
        if (aposta > simulacao.saldo) {
            alert(`Saldo insuficiente! Você tem R$ ${simulacao.saldo.toFixed(2)}`);
            return;
        }
        
        const resultado = simulacao.executarRodada(aposta);
        atualizarUI(resultado);
        
        if (simulacao.rodadas >= simulacao.rodadasTotais) {
            const stats = simulacao.getEstatisticas();
            setTimeout(() => {
                alert(`Simulação concluída!\n\nSaldo final: R$ ${stats.saldoFinal.toFixed(2)}\nLucro: R$ ${stats.lucroTotal.toFixed(2)}\nTaxa de vitórias: ${stats.taxaVitoria.toFixed(1)}%\n\nEsta simulação demonstra como a vantagem da casa se manifesta ao longo do tempo.`);
            }, 300);
        }
    });
}

// Evento de reinicialização
if (resetButton) {
    resetButton.addEventListener('click', function() {
        simulacao.reiniciar();
        atualizarUI(null);
        if (resultadoDisplay) {
            resultadoDisplay.textContent = 'Simulação reiniciada';
            resultadoDisplay.style.color = '#f97316';
        }
        if (edgeBar) {
            edgeBar.style.width = '0%';
        }
        if (probabilidadeDisplay) {
            probabilidadeDisplay.textContent = '-';
        }
        if (faseDisplay) {
            faseDisplay.textContent = '-';
            faseDisplay.style.color = '#f97316';
        }
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    if (betAmount) {
        betAmount.value = 10;
        betAmount.min = 1;
        betAmount.max = 100;
        betAmount.step = 0.5;
    }
    
    atualizarUI(null);
});

// ========== ANIMAÇÃO DE SCROLL SUAVE ==========
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

console.log('🎰 Simulação de Apostas - TCC JOGO JUSTO');
console.log('📊 A simulação demonstra o comportamento das plataformas de apostas');
console.log('🔄 Fases: Confiança → Equilíbrio → Desvantagem');
