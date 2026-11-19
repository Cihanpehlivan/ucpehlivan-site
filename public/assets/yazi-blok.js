// Blok biçimli yazı bileşenleri (scripts/yazi-blok.mjs). Ortak davranışlar (menü, ilerleme, j/k, paylaşım) yazi.js'tedir.
(function () {
  if (!document.querySelector('.yb')) return;
  function each(sel, fn) { [].forEach.call(document.querySelectorAll(sel), fn); }
  // Kapsayıcının durumunu yaz: data-state, .is-alt (ilk seçenek dışı), içteki .yb-on metinleri.
  function setState(box, val, first) {
    box.setAttribute('data-state', val);
    box.classList.toggle('is-alt', String(val) !== String(first));
    [].forEach.call(box.querySelectorAll('.yb-on'), function (el) { el.hidden = el.getAttribute('data-on') !== String(val); });
  }

  /* Anahtarlı kutular: radyo grubu durumu değiştirir */
  each('[data-yb="state"]', function (box) {
    var radios = [].slice.call(box.querySelectorAll('input[type=radio]'));
    if (!radios.length) return;
    var first = radios[0].value;
    radios.forEach(function (r) { r.addEventListener('change', function () { if (r.checked) setState(box, r.value, first); }); });
    var checked = radios.filter(function (r) { return r.checked; })[0];
    setState(box, checked ? checked.value : first, first);
  });

  /* Sürüm kaydırıcısı */
  each('[data-yb="range"]', function (box) {
    var input = box.querySelector('input[type=range]');
    var stops = JSON.parse(input.getAttribute('data-stops') || '[]');
    function sync() { input.setAttribute('aria-valuetext', stops[+input.value] || input.value); setState(box, input.value, '0'); }
    input.addEventListener('input', sync);
    sync();
  });

  /* Okura soru: tek seçim, kısa cevap */
  each('[data-yb="poll"]', function (box) {
    var btns = [].slice.call(box.querySelectorAll('.yb-choice'));
    var reply = box.querySelector('.yb-reply');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        reply.textContent = b.getAttribute('data-reply');
      });
    });
  });

  /* Üç soru: gereken sorular işaretlenince karar */
  each('[data-yb="questions"]', function (box) {
    var need = JSON.parse(box.getAttribute('data-need') || '[]');
    var boxes = [].slice.call(box.querySelectorAll('input[type=checkbox]'));
    var v = box.querySelector('.yb-verdict'), vt = v.querySelector('.yb-vt'), vn = v.querySelector('.yb-vn');
    function sync() {
      var n = need.filter(function (i) { return boxes[i] && boxes[i].checked; }).length;
      var ok = n === need.length;
      vt.textContent = v.getAttribute(ok ? 'data-yes' : 'data-wait');
      vn.textContent = ok ? '' : n + '/' + need.length;
      v.classList.toggle('ok', ok);
    }
    boxes.forEach(function (b) { b.addEventListener('change', sync); });
    sync();
  });
})();
