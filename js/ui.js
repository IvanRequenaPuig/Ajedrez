/* ---- UI ---- */
let AC; function snd(f) { if (!P.snd) return; try { AC = AC || new AudioContext(); const o = AC.createOscillator(), g = AC.createGain(); o.type = 'triangle'; o.frequency.value = f; g.gain.value = .15; g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + .1); o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + .1) } catch (e) { } }
function go(id) { cur = id; document.querySelectorAll('section').forEach(s => s.classList.toggle('on', s.id == id)); if (id != 'game') $('ht').innerHTML = ''; if (id == 'game' && G) render(); if (id == 'cpu') cpuUI() }
function modal(h) { $('md').innerHTML = '<div class="pn">' + h + '</div>'; $('md').classList.add('on') }
const closeM = () => $('md').classList.remove('on'); $('md').onclick = e => { if (e.target.id == 'md') closeM() };
const okb = (t, f) => `<button class="bt" style="margin:8px auto 0" onclick="${f}">${t}</button>`;
function stats() { const n = P.w + P.d + P.l; return `<span>Ganadas: ${P.w}</span><span>Empatadas: ${P.d}</span><span>Perdidas: ${P.l}</span><span>% victorias: ${n ? Math.round(P.w / n * 100) : 0}%</span>` }
function cpuUI() {
    const v = Math.min(P.lv, P.max); P.lv = v; $('rg').value = v; lvl(); $('st').innerHTML = stats();
    document.querySelectorAll('#sides button').forEach(b => b.classList.toggle('on', b.dataset.s == P.side));
    $('tk').innerHTML = LV.map((_, i) => `<i class="${i + 1 > P.max ? 'lk' : ''}"></i>`).join('')
}
const lvl = () => $('ln').textContent = `${P.lv} - ${LV[P.lv - 1][0].toUpperCase()}`;
$('rg').oninput = e => { let v = +e.target.value; if (v > P.max) { v = P.max; e.target.value = v; $('ln').textContent = '🔒 Supera el nivel ' + P.max; return } P.lv = v; save(); lvl() };
document.querySelectorAll('#sides button').forEach(b => b.onclick = () => { P.side = b.dataset.s; save(); cpuUI() });
function newGame(mode) {
    const me = mode == 'cpu' ? (P.side == 'r' ? (Math.random() < .5 ? 'w' : 'b') : P.side) : 'w';
    G = { mode, me, lv: P.lv, s: init(), h: [], sel: -1, mv: [], over: 0, busy: 0, hint: null, hints: 9 }; go('game'); render(); if (mode == 'cpu' && me == 'b') cpuMove()
}
function render() {
    const s = G.s, fl = G.mode == 'cpu' ? G.me == 'b' : (P.flip && s.t == 'b'), last = G.h.length ? G.h[G.h.length - 1].m : null, ck = inChk(s) ? kp(s.b, s.t) : -1, mine = !G.over && (G.mode != 'cpu' || s.t == G.me);
    const mvT = new Set(G.mv.map(m => m.t)), pm = P.pc && mine ? new Set(legal(s).map(m => m.f)) : new Set(); let h = '';
    for (let k = 0; k < 64; k++) {
        const i = fl ? 63 - k : k, r = i >> 3, f = i & 7, p = s.b[i]; let c = 'c ' + ((r + f) & 1 ? 'd' : 'l');
        if (i == G.sel) c += ' sel'; if (P.last && last && (i == last.f || i == last.t)) c += ' lm'; if (i == ck) c += ' ck'; if (G.hint && (i == G.hint.f || i == G.hint.t)) c += ' ht';
        if (P.mv && mvT.has(i)) c += p || G.mv.find(m => m.t == i && m.ep) ? ' cp' : ' mvd'; if (pm.has(i)) c += ' pm';
        h += `<div class="${c}" data-i="${i}">${p ? `<span class="p ${col(p)}">${GL[p.toLowerCase()]}</span>` : ''}${k % 8 == 0 ? `<i class="r">${8 - r}</i>` : ''}${k > 55 ? `<i class="f">${'abcdefgh'[f]}</i>` : ''}</div>`
    }
    $('bd').innerHTML = h; $('bdw').className = P.td ? 'td' : ''; $('hn').textContent = G.hints;
    if (cur == 'game') $('ht').innerHTML = G.mode == 'cpu' ? `<span class="gd">NIVEL ${G.lv}</span><br>${LV[G.lv - 1][0].toUpperCase()}` : `<span class="gd">2 JUGADORES</span><br>Mueven ${s.t == 'w' ? 'blancas' : 'negras'}`
}
$('bd').onclick = e => { const c = e.target.closest('.c'); if (c) clk(+c.dataset.i) };
function clk(i) {
    if (G.over || G.busy) return; const s = G.s, p = s.b[i]; if (G.mode == 'cpu' && s.t != G.me) return;
    const m = G.mv.find(x => x.t == i); if (G.sel >= 0 && m) return play(m);
    if (p && col(p) == s.t) { G.sel = i; G.mv = legal(s).filter(x => x.f == i) } else { G.sel = -1; G.mv = [] } G.hint = null; render()
}
function play(m) {
    const s = G.s, cap = s.b[m.t] || (m.ep ? (s.t == 'w' ? 'p' : 'P') : ''); G.h.push({ s, m, cap }); G.s = mk(s, m); G.sel = -1; G.mv = []; G.hint = null; snd(cap ? 170 : 320);
    const ms = legal(G.s); let r = 0; if (!ms.length) r = inChk(G.s) ? opp(G.s.t) : 'd'; else if (G.s.b.every(p => !p || p.toLowerCase() == 'k')) r = 'd';
    render(); if (r) { G.over = 1; return setTimeout(() => fin(r), 600) } if (G.mode == 'cpu' && G.s.t != G.me) cpuMove()
}
function cpuMove() { G.busy = 1; const g = G; setTimeout(() => { const L = LV[g.lv - 1], m = best(g.s, L[1], L[2]); g.busy = 0; if (g == G && m && !g.over) play(m) }, 350) }
function fin(r) {
    let t, sub = '';
    if (G.mode == 'cpu') { if (r == 'd') { P.d++; t = '🤝 Tablas' } else if (r == G.me) { P.w++; t = '🏆 ¡Victoria!'; if (G.lv >= P.max && P.max < LV.length) { P.max = G.lv + 1; P.lv = P.max; sub = '<p>¡Has desbloqueado el nivel ' + P.max + '!</p>' } } else { P.l++; t = 'Has perdido' } save() }
    else t = r == 'd' ? '🤝 Tablas' : '🏆 Ganan las ' + (r == 'w' ? 'blancas' : 'negras');
    modal(`<h4 style="font-size:28px">${t}</h4>${sub}${okb('Jugar otra vez', `closeM();${G.mode == 'cpu' ? "cpuUI();" : ''}newGame('${G.mode}')`)}${okb('Menú', "closeM();go('menu')")}`)
}
$('c1').onclick = () => { if (G) newGame(G.mode) };
$('c3').onclick = () => { if (!G || G.busy || G.over) return; const n = G.mode == 'cpu' && G.s.t == G.me ? 2 : 1; if (G.h.length < n) return; let e; for (let i = 0; i < n; i++)e = G.h.pop(); G.s = e.s; G.sel = -1; G.mv = []; G.hint = null; render() };
$('c4').onclick = () => { if (!G || G.over || G.busy || G.hints < 1 || (G.mode == 'cpu' && G.s.t != G.me)) return; G.hints--; G.hint = best(G.s, 2, 0); render() };
$('c2').onclick = () => {
    if (!G) return; const a = G.h.filter(x => x.cap && !isW(x.cap)).map(x => x.cap), b = G.h.filter(x => x.cap && isW(x.cap)).map(x => x.cap), o = 'qrbnp', srt = l => l.sort((x, y) => o.indexOf(x.toLowerCase()) - o.indexOf(y.toLowerCase())), g = l => srt(l).map(p => GL[p.toLowerCase()]).join('') || '—', v = l => l.reduce((t, p) => t + V[p.toLowerCase()] / 100, 0);
    modal(`<h4>Piezas capturadas</h4><p>Blancas han comido (+${v(a)}):</p><div class="cap b">${g(a)}</div><p>Negras han comido (+${v(b)}):</p><div class="cap">${g(b)}</div>${okb('Cerrar', 'closeM()')}`)
};
