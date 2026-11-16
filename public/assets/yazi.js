// İnteraktif yazı sayfası davranışları. Görünen metinler content/prompt-yazisi.json'dan gelir (#yz-data).
(function () {
  var dataEl = document.getElementById('yz-data');
  if (!dataEl) return;
  var D = JSON.parse(dataEl.textContent), UI = D.ui;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var secs = [].slice.call(document.querySelectorAll('[data-sec]'));
  var links = {};
  [].forEach.call(document.querySelectorAll('[data-nav]'), function (a) { links[a.getAttribute('data-nav')] = a; });

  /* ---------- İlerleme çubuğu ve aktif bölüm ---------- */
  var bar = document.querySelector('.progress i');
  var article = document.querySelector('.yz-article');
  var current = null, ticking = false;
  function setActive(id) {
    if (id === current) return;
    current = id;
    Object.keys(links).forEach(function (k) {
      if (k === id) {
        links[k].setAttribute('aria-current', 'true');
        // Dar ekranda yatay menüde aktif öğe görünür kalsın (sayfa değil, sadece şerit kayar)
        var ol = links[k].closest('ol');
        if (ol && ol.scrollWidth > ol.clientWidth) ol.scrollLeft = links[k].offsetLeft - 16;
      } else links[k].removeAttribute('aria-current');
    });
  }
  function onScroll() {
    ticking = false;
    var vh = innerHeight;
    if (bar && article) {
      var r = article.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - vh)));
      bar.style.setProperty('--p', p.toFixed(3));
    }
    var line = vh * 0.35, id = secs[0] && secs[0].id;
    for (var i = 0; i < secs.length; i++) if (secs[i].getBoundingClientRect().top <= line) id = secs[i].id;
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) id = secs[secs.length - 1].id;
    setActive(id);
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- j / k: sonraki / önceki bölüm ---------- */
  // Kaydırma sürerken art arda basılırsa, bir sonraki adım gidilen bölümden hesaplanır.
  var target = null, targetTimer = null;
  function go(step) {
    var base = target !== null ? target : secs.findIndex(function (s) { return s.id === current; });
    var n = Math.max(0, Math.min(secs.length - 1, base + step));
    var next = secs[n];
    if (!next) return;
    target = n;
    clearTimeout(targetTimer);
    targetTimer = setTimeout(function () { target = null; }, 900);
    next.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', '#' + next.id);
  }
  addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
    if (e.key === 'j') { e.preventDefault(); go(1); } else if (e.key === 'k') { e.preventDefault(); go(-1); }
  });

  /* ---------- 01: iddia parçaları ---------- */
  var pillars = [].slice.call(document.querySelectorAll('.yz-pillar'));
  var marks = [].slice.call(document.querySelectorAll('.yz-claim mark'));
  pillars.forEach(function (b) {
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true', k = b.getAttribute('data-k');
      pillars.forEach(function (x) { x.setAttribute('aria-pressed', x === b && on ? 'true' : 'false'); });
      marks.forEach(function (m) { m.classList.toggle('on', on && m.getAttribute('data-k') === k); });
    });
  });

  /* ---------- 02: revizyon satırları ---------- */
  var revBtns = [].slice.call(document.querySelectorAll('.yz-revbtn'));
  var revAll = document.getElementById('yz-rev-all');
  function setRev(btn, on) {
    var row = btn.closest('.yz-habit');
    row.classList.toggle('is-rev', on);
    document.getElementById(btn.getAttribute('aria-controls')).hidden = !on;
    btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    btn.textContent = btn.getAttribute(on ? 'data-on' : 'data-off');
  }
  function syncRev() {
    if (!revAll) return;
    var every = revBtns.every(function (b) { return b.getAttribute('aria-expanded') === 'true'; });
    revAll.setAttribute('aria-pressed', every ? 'true' : 'false');
    revAll.textContent = revAll.getAttribute(every ? 'data-on' : 'data-off');
  }
  revBtns.forEach(function (b) { b.addEventListener('click', function () { setRev(b, b.getAttribute('aria-expanded') !== 'true'); syncRev(); }); });
  if (revAll) revAll.addEventListener('click', function () {
    var every = revBtns.every(function (b) { return b.getAttribute('aria-expanded') === 'true'; });
    revBtns.forEach(function (b) { setRev(b, !every); });
    syncRev();
  });

  /* ---------- Çevrilebilir kartlar (05) ---------- */
  // <button> olduğu için Enter ve Space tarayıcıda zaten "click" üretir.
  function setCard(card, on) {
    card.setAttribute('aria-pressed', on ? 'true' : 'false');
    card.querySelector('.yz-front').setAttribute('aria-hidden', on ? 'true' : 'false');
    card.querySelector('.yz-back').setAttribute('aria-hidden', on ? 'false' : 'true');
  }
  var allBtn = document.getElementById('yz-flip-all');
  var six = allBtn ? [].slice.call(document.querySelectorAll('.yz-cards-6 .yz-card')) : [];
  function syncAll() {
    if (!allBtn) return;
    var every = six.every(function (c) { return c.getAttribute('aria-pressed') === 'true'; });
    allBtn.setAttribute('aria-pressed', every ? 'true' : 'false');
    allBtn.textContent = every ? UI.unflipAll : UI.flipAll;
  }
  [].forEach.call(document.querySelectorAll('.yz-card'), function (card) {
    setCard(card, false);
    card.addEventListener('click', function () { setCard(card, card.getAttribute('aria-pressed') !== 'true'); syncAll(); });
  });
  if (allBtn) allBtn.addEventListener('click', function () {
    var every = six.every(function (c) { return c.getAttribute('aria-pressed') === 'true'; });
    six.forEach(function (c) { setCard(c, !every); });
    syncAll();
  });

  /* ---------- 03: reçete / hedef + sınır anahtarı ---------- */
  var ways = [].slice.call(document.querySelectorAll('[data-way]'));
  [].forEach.call(document.querySelectorAll('input[name="yz-way"]'), function (r) {
    r.addEventListener('change', function () { ways.forEach(function (w) { w.hidden = w.getAttribute('data-way') !== r.value; }); });
  });

  /* ---------- 04: sekmeler (ok tuşları, Home, End) ---------- */
  var tabs = [].slice.call(document.querySelectorAll('.yz-tablist [role=tab]'));
  function selectTab(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (n === undefined) return;
      e.preventDefault();
      selectTab(tabs[(n + tabs.length) % tabs.length], true);
    });
  });

  /* ---------- Kopyalama ---------- */
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }
  function copy(text, done) {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
    else done(fallbackCopy(text));
  }
  function feedback(btn, status, ok) {
    var label = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', label);
    btn.textContent = ok ? UI.copied : label;
    if (status) status.textContent = ok ? UI.copied : UI.copyFailed;
    clearTimeout(btn._t);
    btn._t = setTimeout(function () { btn.textContent = label; if (status) status.textContent = ''; }, 2400);
  }
  [].forEach.call(document.querySelectorAll('[data-copy="template"]'), function (btn) {
    var status = btn.closest('.yz-end-sec') ? document.getElementById('yz-status-end') : null;
    btn.addEventListener('click', function () { copy(D.template, function (ok) { feedback(btn, status, ok); }); });
  });

  /* ---------- 05: brief tezgâhı ---------- */
  var B = D.bench, F = B.fields;
  var form = document.getElementById('yz-form');
  if (!form) return;
  var $ = function (id) { return document.getElementById(id); };
  var goal = $('yz-goal'), inputs = $('yz-inputs'), limits = $('yz-limits'), measure = $('yz-measure');
  var oldTa = $('yz-old'), why = $('yz-why'), whyT = $('yz-why-t'), fillBtn = $('yz-fill');
  var err = $('yz-goal-err'), out = $('yz-out'), outL = $('yz-out-l'), copyBtn = $('yz-copy'), status = $('yz-status');
  var before = $('yz-before'), beforeT = $('yz-before-t'), beforeN = $('yz-before-n'), score = $('yz-score');
  var picks = [].slice.call(document.querySelectorAll('input[name="yz-ex"]'));
  var checkEls = {};
  [].forEach.call(document.querySelectorAll('[data-check]'), function (li) { checkEls[li.getAttribute('data-check')] = li; });
  var picked = null;

  function lower(s) { return String(s || '').toLocaleLowerCase('tr-TR'); }
  function clean(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function dot(s) { return /[.!?…:]$/.test(s) ? s : s + '.'; }
  function words(s) { var t = clean(s); return t ? t.split(' ').length : 0; }
  function items(s) {
    return String(s || '').split('\n').map(function (l) { return l.replace(/^\s*[-•*]\s*/, '').trim().replace(/[.;,]+$/, ''); }).filter(Boolean);
  }
  function has(text, list) { var t = ' ' + lower(text) + ' '; return (list || []).some(function (w) { return t.indexOf(lower(w)) !== -1; }); }

  function build() {
    var g = clean(goal.value), i = clean(inputs.value), l = items(limits.value), m = clean(measure.value);
    if (!g && !i && !l.length && !m) return '';
    var line = B.closingLine || '';
    var parts = [];
    if (g) parts.push(F.goal.label + ': ' + dot(g));
    if (i) parts.push(F.inputs.label + ': ' + dot(i));
    if (l.length) parts.push(F.limits.label + ':\n' + l.map(function (x) { return '- ' + x; }).join('\n'));
    if (m) parts.push(F.measure.label + ': ' + dot(m));
    if (line) parts.push(line);
    return parts.join('\n');
  }

  // Basit, yerel kurallar: hiçbir veri sayfadan çıkmaz.
  function check(text) {
    var l = items(limits.value), all = [goal.value, inputs.value, limits.value, measure.value].join(' ');
    var any = !!text;
    return {
      goal: !!clean(goal.value),
      inputs: !!clean(inputs.value),
      limit: l.length > 0,
      negative: l.some(function (x) { var w = lower(x); return /m[ae]$/.test(w.split(/[\s,]+/).pop() || '') || /m[ae](d[ae]n|yın)\b/.test(w) || has(w, B.detect.negative); }),
      measure: !!clean(measure.value) || /\d/.test(all),
      noRole: any && !has(all, B.detect.role),
      noSteps: any && !has(all, B.detect.steps)
    };
  }

  function render() {
    var text = build();
    out.textContent = text || B.template;
    out.classList.toggle('is-empty', !text);
    outL.textContent = outL.getAttribute(text ? 'data-full' : 'data-empty');
    var r = check(text), n = 0, keys = Object.keys(checkEls);
    keys.forEach(function (k) { var ok = !!r[k]; if (ok) n++; checkEls[k].classList.toggle('ok', ok); });
    score.textContent = n + '/' + keys.length;
    var o = clean(oldTa.value);
    before.hidden = !o;
    beforeT.textContent = o;
    beforeN.textContent = words(o) + ' ' + B.wordsUnit;
  }

  function choose(i) {
    picked = i === null ? null : B.examples[i];
    if (picked) { oldTa.value = picked.old; whyT.textContent = picked.why; }
    why.hidden = !picked;
    fillBtn.disabled = !picked;
    render();
  }
  picks.forEach(function (r) { r.addEventListener('change', function () { if (r.checked) choose(+r.value); }); });
  oldTa.addEventListener('input', function () {
    // Kendi promptunu yazınca seçili örnek bırakılır.
    if (picked && oldTa.value !== picked.old) { picks.forEach(function (r) { r.checked = false; }); choose(null); }
    render();
  });
  fillBtn.addEventListener('click', function () {
    if (!picked) return;
    goal.value = picked.goal || ''; inputs.value = picked.inputs || ''; limits.value = picked.limits || ''; measure.value = picked.measure || '';
    showError(false);
    render();
  });

  function showError(on) {
    err.hidden = !on;
    if (on) goal.setAttribute('aria-invalid', 'true'); else goal.removeAttribute('aria-invalid');
  }
  copyBtn.addEventListener('click', function () {
    if (!clean(goal.value)) { showError(true); goal.focus(); return; }
    showError(false);
    copy(build(), function (ok) { feedback(copyBtn, status, ok); });
  });
  form.addEventListener('input', function (e) { if (e.target === goal && clean(goal.value)) showError(false); render(); });
  form.addEventListener('change', render);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  render();
})();
