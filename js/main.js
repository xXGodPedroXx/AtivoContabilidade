/* ==========================================================
   ATIVO CONTABILIDADE · main.js

   ÍNDICE
   1. Configurações (WhatsApp, Instagram, Facebook)
   2. Links de WhatsApp, Facebook e Instagram
   3. Rolagem suave do menu
   4. Barra inferior (aparece ao rolar)
   5. Janela "Fale conosco" e envio do formulário
   ========================================================== */
/* ==========================================================
   0. SEMPRE COMEÇAR NO TOPO AO CARREGAR O SITE
   ========================================================== */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('pageshow', function () {
  /* se o endereço tem um #, como "#planos", respeita e vai até a seção */
  if (!location.hash) window.scrollTo(0, 0);
});
/* ==========================================================
   1. CONFIGURAÇÕES  (é o que você mais vai querer trocar)
   ========================================================== */
/* Coloque aqui o WhatsApp da empresa: 55 + DDD + número, sem espaços. Ex.: 5544999999999 */
var NUMERO = "554430196237";
var MENSAGEM = "Olá, vim pelo site e gostaria de uma conversa.";
/* Instagram da empresa: só o nome de usuário, sem @. Ex.: ativocontabilidade */
var INSTAGRAM = "ativo.contabilidade.cia";
var FACEBOOK = "ativo.contabilidade.cia";

/* ==========================================================
   2. LINKS DE WHATSAPP, FACEBOOK E INSTAGRAM
   ========================================================== */
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (a) {
  var texto = a.dataset.msg || MENSAGEM;
  a.href = "https://wa.me/" + NUMERO;
  a.addEventListener('click', function (e) {
    e.preventDefault();
    window.open("https://wa.me/" + NUMERO + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
  });
});
document.querySelectorAll('a[data-facebook]').forEach(function (a) {
  a.href = "https://facebook.com/" + FACEBOOK;
  a.target = "_blank";
  a.rel = "noopener";
});
document.querySelectorAll('a[data-instagram]').forEach(function (a) {
  a.href = "https://instagram.com/" + INSTAGRAM;
  a.target = "_blank";
  a.rel = "noopener";
});

/* ==========================================================
   3. ROLAGEM SUAVE DO MENU
   ========================================================== */
document.querySelectorAll('a[href^="#"]:not(.pular)').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var id = link.getAttribute('href');
    var alvo = id.length > 1 ? document.querySelector(id) : null;
    if (id.length > 1 && !alvo) return;
    e.preventDefault();
    var destino = alvo ? alvo.getBoundingClientRect().top + window.scrollY - 36 : 0;
    var inicio = window.scrollY, dist = destino - inicio, dur = 250, t0 = null;
    function passo(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var suave = 1 - Math.pow(1 - p, 3);
      window.scrollTo(0, inicio + dist * suave);
      if (p < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  });
});

/* ==========================================================
   4. BARRA INFERIOR (aparece ao rolar a página)
   ========================================================== */
var bottombar = document.getElementById('bottombar');
function marcaBarraInferior() {
  bottombar.classList.toggle('visible', window.scrollY > 300);
}
window.addEventListener('scroll', marcaBarraInferior, { passive: true });
marcaBarraInferior();

/* ==========================================================
   5. JANELA "FALE CONOSCO" E ENVIO DO FORMULÁRIO
   ========================================================== */
var modal = document.getElementById('modal-contato');
document.getElementById('abrir-contato').addEventListener('click', function () { modal.showModal(); });
document.getElementById('modal-fechar').addEventListener('click', function () { modal.close(); });
modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
var formContato = document.querySelector('#modal-contato form');
var msgForm = document.getElementById('msg-form');
formContato.addEventListener('submit', function (e) {
  e.preventDefault();
  var botao = formContato.querySelector('button[type="submit"]');
  botao.disabled = true;
  botao.textContent = 'Enviando...';
  msgForm.textContent = '';
  fetch(formContato.action, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new FormData(formContato)
  })
    .then(function (r) { return r.json(); })
    .then(function (dados) {
      if (!dados.success) throw new Error();
      formContato.reset();
      msgForm.textContent = 'Mensagem enviada! Em breve entraremos em contato.';
    })
    .catch(function () {
      msgForm.textContent = 'Não foi possível enviar agora. Tente de novo ou fale pelo WhatsApp.';
    })
    .finally(function () {
      botao.disabled = false;
      botao.textContent = 'Enviar mensagem';
    });
});
/* ==========================================================
   6. ANIMAÇÃO: CONTEÚDO ENTRA PELAS LATERAIS AO ROLAR
   Cada linha: ['seletor', 'direção']
   direção: 'da-esq' (vem da esquerda), 'da-dir' (vem da direita), 'da-baixo'
   ========================================================== */
(function () {
  var grupos = [
    /* topo */
    ['.hero-texto', 'da-esq'],
    ['.hero-foto', 'da-dir'],
    /* por que ter um contador */
    ['#comparar h2, #comparar .lead', 'da-esq'],
    ['#comparar .tbl', 'da-dir'],
    /* o que fazemos */
    ['.servicos-foto', 'da-esq'],
    ['.servicos-texto', 'da-dir'],
    /* planos */
    ['#planos h2, #planos .lead', 'da-esq'],
    ['.plan:nth-child(1)', 'da-esq'],
    ['.plan:nth-child(2)', 'da-baixo'],
    ['.plan:nth-child(3)', 'da-dir'],
    /* depoimentos */
    ['#depoimentos h2, #depoimentos .lead', 'da-esq'],
    ['.grid3 blockquote:nth-child(1)', 'da-esq'],
    ['.grid3 blockquote:nth-child(2)', 'da-baixo'],
    ['.grid3 blockquote:nth-child(3)', 'da-dir'],
    /* dúvidas */
    ['#duvidas h2', 'da-esq'],
    ['.faq', 'da-dir'],
    /* rodapé */
    ['.rodape-info', 'da-esq'],
    ['.mapa-box', 'da-dir']
  ];

  var itens = [];
  grupos.forEach(function (g) {
    document.querySelectorAll(g[0]).forEach(function (el) {
      el.classList.add('revela', g[1]);
      itens.push(el);
    });
  });

  /* navegador antigo: mostra tudo sem animar */
  if (!('IntersectionObserver' in window)) {
    itens.forEach(function (el) { el.classList.add('visivel'); });
    return;
  }

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.classList.add('visivel');
      observador.unobserve(el);   /* anima só na primeira vez */
      /* depois da animação, tira as classes para não atrapalhar
         os efeitos de hover dos planos e botões */
      setTimeout(function () {
        el.classList.remove('revela', 'da-esq', 'da-dir', 'da-baixo', 'visivel');
      }, 1000);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

  itens.forEach(function (el) { observador.observe(el); });
})();/* ==========================================================
   7. NÚMEROS DO TOPO CONTANDO DE ZERO
   Anima os números dentro de ".hero .stats b" (ex.: "+30 anos", "+100")
   ========================================================== */
(function () {
  var caixa = document.querySelector('.hero .stats');
  if (!caixa) return;

  var itens = [];
  caixa.querySelectorAll('b').forEach(function (b) {
    var achado = b.textContent.match(/\d+/);
    if (!achado) return;                       /* sem número: não anima */
    itens.push({
      el: b,
      texto: b.textContent,                    /* texto original, ex.: "+30 anos" */
      achado: achado[0],                       /* o número dentro dele, ex.: "30" */
      alvo: parseInt(achado[0], 10)
    });
  });
  if (!itens.length) return;

  /* quem desativou animações, ou navegador antigo: mantém os números prontos */
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var DURACAO = 1500;                          /* em milissegundos */

  function anima(item) {
    var inicio = null;
    item.el.textContent = item.texto.replace(item.achado, '0');
    function passo(t) {
      if (!inicio) inicio = t;
      var p = Math.min((t - inicio) / DURACAO, 1);
      var suave = 1 - Math.pow(1 - p, 3);      /* começa rápido e termina devagar */
      item.el.textContent = item.texto.replace(item.achado, Math.round(item.alvo * suave));
      if (p < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      observador.unobserve(e.target);          /* conta só uma vez */
      itens.forEach(anima);
    });
  }, { threshold: 0.4 });

  observador.observe(caixa);
})();/* ==========================================================
   8. MÁSCARA DO TELEFONE NO FORMULÁRIO  →  (44) 99999-9999
   ========================================================== */
(function () {
  var campo = document.getElementById('telefone');
  if (!campo) return;

  campo.maxLength = 15;            /* tamanho de "(44) 99999-9999" */
  campo.placeholder = '(44) 99999-9999';

  function formata(valor) {
    var d = valor.replace(/\D/g, '');
    if (d.length > 11 && d.indexOf('55') === 0) d = d.slice(2);  /* colou com +55 */
    d = d.slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return '(' + d;
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  campo.addEventListener('input', function () {
    campo.value = formata(campo.value);
    var digitos = campo.value.replace(/\D/g, '').length;
    /* exige DDD + número (fixo com 10 dígitos ou celular com 11) */
    campo.setCustomValidity(digitos > 0 && digitos < 10 ? 'Digite o telefone com DDD. Ex.: (44) 99999-9999' : '');
  });
})();