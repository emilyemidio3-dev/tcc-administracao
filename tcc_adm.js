// ========== CONTROLE DO MENU MOBILE ==========
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // Abrir menu
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.add('active');
            body.style.overflow = 'hidden'; // Impede scroll
        });
    }

    // Fechar menu
    if (menuClose) {
        menuClose.addEventListener('click', function() {
            navLinks.classList.remove('active');
            body.style.overflow = ''; // Restaura scroll
        });
    }

    // Fechar menu ao clicar em um link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Fechar menu ao clicar fora (no overlay)
    navLinks.addEventListener('click', function(e) {
        if (e.target === this) {
            navLinks.classList.remove('active');
            body.style.overflow = '';
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
        this.faseAtual = 'confianca'; // confianca, equilibrio, desvantagem
        this.probabilidadeBase = 0.55;
        this.probabilidadeAtual = 0.55;
        this.ganhosConsecutivos = 0;
        this.perdasConsecutivas = 0;
        this.totalApostado = 0;
        this.totalGanho = 0;
        this.fatorSorte = 0;
        
        // Configurações por fase
        this.configFases = {
            confianca: {
                duracao: 0.25, // 25% da sessão
                probMin: 0.65,
                probMax: 0.85,
                multiplicadorMin: 1.1,
                multiplicadorMax: 2.0,
                tendencia: 'positiva'
            },
            equilibrio: {
                duracao: 0.35, // 35% da sessão
                probMin: 0.45,
                probMax: 0.65,
                multiplicadorMin: 0.8,
                multiplicadorMax: 1.8,
                tendencia: 'neutra'
            },
            desvantagem: {
                duracao: 0.40, // 40% da sessão
                probMin: 0.25,
                probMax: 0.45,
                multiplicadorMin: 0.5,
                multiplicadorMax: 1.5,
                tendencia: 'negativa'
            }
        };
    }

    // Determina a fase atual baseado na rodada
    determinarFase() {
        const progresso = this.rodadas / this.rodadasTotais;
        
        if (progresso < this.configFases.confianca.duracao) {
            this.faseAtual = 'confianca';
        } else if (progresso < this.configFases.confianca.duracao + this.configFases.equilibrio.duracao) {
            this.faseAtual = 'equilibrio';
        } else {
            this.faseAtual = 'desvantagem';
        }
        
        // Atualiza a probabilidade baseada na fase
        this.atualizarProbabilidade();
    }

    // Atualiza a probabilidade de vitória com variações naturais
    atualizarProbabilidade() {
        const config = this.configFases[this.faseAtual];
        
        // Fator de variação natural (ruído)
        const variacao = (Math.random() - 0.5) * 0.15;
        
        // Tendência da fase
        let tendencia = 0;
        if (config.tendencia === 'positiva') {
            tendencia = 0.1 + (Math.random() * 0.1);
        } else if (config.tendencia === 'negativa') {
            tendencia = -0.1 - (Math.random() * 0.1);
        } else {
            tendencia = (Math.random() - 0.5) * 0.08;
        }
        
        // Ajusta baseado em sequências (efeito de streak)
        let streakAdjust = 0;
        if (this.ganhosConsecutivos > 2) {
            streakAdjust = -0.05 * Math.min(this.ganhosConsecutivos, 5);
        } else if (this.perdasConsecutivas > 3) {
            streakAdjust = 0.03 * Math.min(this.perdasConsecutivas, 4);
        }
        
        // Calcula probabilidade final
        let prob = config.probMin + (config.probMax - config.probMin) * Math.random();
        prob += variacao + tendencia + streakAdjust;
        
        // Garante que fique dentro dos limites
        prob = Math.max(config.probMin - 0.05, Math.min(config.probMax + 0.05, prob));
        
        this.probabilidadeAtual = prob;
    }

    // Calcula o multiplicador baseado na fase e probabilidade
    calcularMultiplicador(venceu) {
        const config = this.configFases[this.faseAtual];
        
        let mult;
        if (venceu) {
            // Vitória: multiplicador geralmente maior na fase de confiança
            const baseMult = config.multiplicadorMin + (config.multiplicadorMax - config.multiplicadorMin) * Math.random();
            
            // Vitórias na fase de desvantagem são menores
            if (this.faseAtual === 'desvantagem') {
                mult = baseMult * (0.6 + Math.random() * 0.3);
            } else {
                mult = baseMult;
            }
            
            // Aumenta um pouco se estiver em sequência de perdas
            if (this.perdasConsecutivas > 2) {
                mult *= (1 + Math.random() * 0.2);
            }
        } else {
            // Derrota: multiplicador base (perde a aposta)
            mult = 0;
        }
        
        // Garante que o multiplicador seja razoável
        mult = Math.max(0, Math.min(3.0, mult));
        
        return mult;
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
            novoSaldo = this.saldo + ganho - aposta; // subtrai a aposta e adiciona o ganho
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
        
        // Distribuição de resultados por fase
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
            
            // Feedback visual da fase
            const faseColors = {
                confianca: '#4ade80',
                equilibrio: '#fbbf24',
                desvantagem: '#ef4444'
            };
            faseDisplay.style.color = faseColors[resultado.fase] || '#f97316';
        }
        
        // Atualiza a barra de progresso
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
        
        // Atualiza gráficos se existirem
        atualizarGraficos();
        
        // Verifica se a simulação terminou
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

// Função para atualizar gráficos (placeholder)
function atualizarGraficos() {
    // Aqui você pode implementar a atualização dos gráficos
    // baseado no histórico da simulação
    const stats = simulacao.getEstatisticas();
    console.log('Estatísticas:', stats);
    
    // Exemplo: Atualizar gráficos de pizza se existirem
    const pieCharts = document.querySelectorAll('.pie-chart');
    if (pieCharts.length > 0 && stats.totalRodadas > 0) {
        // Atualiza o primeiro gráfico com a taxa de vitórias
        const vitorias = stats.vitorias;
        const derrotas = stats.derrotas;
        const total = stats.totalRodadas;
        
        if (total > 0) {
            const vitoriasPercent = (vitorias / total) * 360;
            const derrotasPercent = (derrotas / total) * 360;
            
            // Atualiza o gráfico de pizza (se for um elemento canvas ou div)
            pieCharts.forEach((chart, index) => {
                if (index === 0) {
                    // Atualiza o primeiro gráfico com dados de vitórias/derrotas
                    chart.style.background = `conic-gradient(
                        #4ade80 0deg ${vitoriasPercent}deg, 
                        #ef4444 ${vitoriasPercent}deg ${vitoriasPercent + derrotasPercent}deg
                    )`;
                }
            });
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configura valor inicial da aposta
    if (betAmount) {
        betAmount.value = 10;
        betAmount.min = 1;
        betAmount.max = 100;
        betAmount.step = 0.5;
    }
    
    atualizarUI(null);
    
    // Inicializa gráficos
    atualizarGraficos();
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

// ========== DETECTA DISPOSITIVO MÓVEL ==========
function isMobile() {
    return window.innerWidth <= 768;
}

// Atualiza a interface quando a janela for redimensionada
window.addEventListener('resize', function() {
    // Fecha o menu mobile se estiver aberto e a tela for maior que mobile
    if (!isMobile()) {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

console.log('🎰 Simulação de Apostas - TCC JOGO JUSTO');
console.log('📊 A simulação demonstra o comportamento das plataformas de apostas');
console.log('🔄 Fases: Confiança → Equilíbrio → Desvantagem');
