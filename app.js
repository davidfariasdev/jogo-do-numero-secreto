let listaDeNumerosSorteados = [];
let numeroLimite = 100
let numeroSecreto = gerarNumeroAleatorio();
let tentativas = 1;
let chutesFeitos = [];

function exibirTextoNaTela(tag, texto) {
    let campo = document.querySelector(tag);
    campo.innerHTML = texto;
    if ('speechSynthesis' in window) {
        let utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.2;
        window.speechSynthesis.speak(utterance);
    } else {
        console.log("Web Speech API não suportada neste navegador.");
    }
}

function exibirMensagemInicial() {
    exibirTextoNaTela('h1', 'JOGO DO NÚMERO SECRETO');
    exibirTextoNaTela('p', `Escolha um número entre 1 e ${numeroLimite}`);
}

exibirMensagemInicial();
const campoInput = document.querySelector('input');

function enterParaVerificarChute(event) {
    if (event.key === 'Enter') {
        verificarChute();
    }
}

function enterParaReiniciar(event) {
    if (event.key === 'Enter') {
        reiniciarJogo();
    }
}

campoInput.addEventListener('keydown', enterParaVerificarChute);

function verificarChute() {
    let chuteInput = document.querySelector('input').value;
    let chute = parseInt(chuteInput);

    if (isNaN(chute) || chute < 1 || chute > numeroLimite) {
        exibirTextoNaTela('p', `Valor inválido. Digite um número entre 1 e ${numeroLimite}.`);
        limparCampo();
        return;
    }

    if (chute === numeroSecreto) {
        dica = '👏 acertou!';
              chutesFeitos.push({ numero: chute, dica });

        atualizarListaDeChutes();

        exibirTextoNaTela('h1', 'ACERTOU!');
        let palavraTentativa = tentativas > 1 ? 'tentativas' : 'tentativa';
        let mensagemTentativas = `Você acertou o número secreto com ${tentativas} ${palavraTentativa}!`;
        exibirTextoNaTela('p', mensagemTentativas);
        document.getElementById('reiniciar').removeAttribute('disabled');

        campoInput.removeEventListener('keydown', enterParaVerificarChute);
        campoInput.addEventListener('keydown', enterParaReiniciar);
    }
    else {
        if (chute > numeroSecreto) {
            dica = '↓';
            exibirTextoNaTela('p', 'O número secreto é menor');
        } else {
            dica = '↑';
            exibirTextoNaTela('p', 'O número secreto é maior');
        }

        chutesFeitos.push({numero: chute, dica});
        atualizarListaDeChutes();
        tentativas++;
        limparCampo();
    }
}

function atualizarListaDeChutes() {
    const campoChutes = document.getElementById('chutes');
    
    if (chutesFeitos.length === 0) {
        campoChutes.textContent = 'Nenhum chute ainda.';
        return;
    }
    let texto = chutesFeitos.map(item => `${item.numero} ${item.dica}`).join(' | ');
    campoChutes.textContent = `${texto}`;
}

function gerarNumeroAleatorio() {
    let numeroEscolhido = parseInt(Math.random() * numeroLimite + 1);
    let quantidadeDeElementosNaLista = listaDeNumerosSorteados.length;

    if (quantidadeDeElementosNaLista == numeroLimite) {
        listaDeNumerosSorteados = [];
    }
    if (listaDeNumerosSorteados.includes(numeroEscolhido)) {
        return gerarNumeroAleatorio();
    } else {
        listaDeNumerosSorteados.push(numeroEscolhido);
        console.log(listaDeNumerosSorteados);
        return numeroEscolhido;
    }
}

function limparCampo() {
    let chute = document.querySelector('input');
    chute.value = '';
}


function reiniciarJogo() {
    numeroSecreto = gerarNumeroAleatorio();
    limparCampo();
    tentativas = 1;
    exibirMensagemInicial();
    document.getElementById('reiniciar').setAttribute('disabled', true);
    chutesFeitos = [];
    atualizarListaDeChutes();


   
    campoInput.removeEventListener('keydown', enterParaReiniciar);
    campoInput.addEventListener('keydown', enterParaVerificarChute);
}