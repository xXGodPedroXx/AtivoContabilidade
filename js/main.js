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
