/* ---- motor ---- */
const D = [[1, 0], [-1, 0], [0, 1], [0, -1]], X = [[1, 1], [1, -1], [-1, 1], [-1, -1]], N = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]], V = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
const isW = p => p < 'a', col = p => isW(p) ? 'w' : 'b', opp = t => t == 'w' ? 'b' : 'w', kp = (b, t) => b.indexOf(t == 'w' ? 'K' : 'k');
function init() { const b = []; 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'.split('/').forEach(r => [...r].forEach(c => { if (c > 0) for (let i = 0; i < +c; i++)b.push(''); else b.push(c) })); return { b, t: 'w', c: 'KQkq', e: -1 } }
function att(b, sq, by) {
    const r = sq >> 3, f = sq & 7, w = by == 'w', pr = w ? r + 1 : r - 1;
    for (const df of [-1, 1]) { const x = f + df; if (pr >= 0 && pr < 8 && x >= 0 && x < 8 && b[pr * 8 + x] == (w ? 'P' : 'p')) return 1 }
    for (const [a, c] of N) { const y = r + a, x = f + c; if (y >= 0 && y < 8 && x >= 0 && x < 8 && b[y * 8 + x] == (w ? 'N' : 'n')) return 1 }
    for (const [a, c] of D.concat(X)) { let y = r + a, x = f + c, k = 0; while (y >= 0 && y < 8 && x >= 0 && x < 8) { const p = b[y * 8 + x]; if (p) { const q = p.toLowerCase(); if (col(p) == by && (q == 'q' || (a && c ? q == 'b' : q == 'r') || (!k && q == 'k'))) return 1; break } y += a; x += c; k++ } } return 0
}
function gen(s) {
    const b = s.b, t = s.t, w = t == 'w', m = [];
    for (let i = 0; i < 64; i++) {
        const p = b[i]; if (!p || col(p) != t) continue; const r = i >> 3, f = i & 7, q = p.toLowerCase(), add = (to, x) => m.push(Object.assign({ f: i, t: to }, x));
        if (q == 'p') {
            const d = w ? -1 : 1, r1 = r + d, pro = w ? 0 : 7; if (r1 < 0 || r1 > 7) continue;
            const push = (to, x) => (to >> 3) == pro ? add(to, Object.assign({ p: w ? 'Q' : 'q' }, x)) : add(to, x);
            if (!b[r1 * 8 + f]) { push(r1 * 8 + f); if (r == (w ? 6 : 1) && !b[(r + 2 * d) * 8 + f]) add((r + 2 * d) * 8 + f) }
            for (const df of [-1, 1]) { const x = f + df; if (x < 0 || x > 7) continue; const to = r1 * 8 + x; if (b[to] && col(b[to]) != t) push(to); else if (to == s.e) add(to, { ep: 1 }) }
        }
        else if (q == 'n' || q == 'k') {
            for (const [a, c] of q == 'n' ? N : D.concat(X)) { const y = r + a, x = f + c; if (y < 0 || y > 7 || x < 0 || x > 7) continue; const o = b[y * 8 + x]; if (!o || col(o) != t) add(y * 8 + x) }
            if (q == 'k' && i == (w ? 60 : 4)) {
                const e = opp(t), K = w ? 'K' : 'k', Q = w ? 'Q' : 'q';
                if (s.c.includes(K) && !b[i + 1] && !b[i + 2] && !att(b, i, e) && !att(b, i + 1, e) && !att(b, i + 2, e)) add(i + 2, { c: 1 });
                if (s.c.includes(Q) && !b[i - 1] && !b[i - 2] && !b[i - 3] && !att(b, i, e) && !att(b, i - 1, e) && !att(b, i - 2, e)) add(i - 2, { c: 1 })
            }
        }
        else for (const [a, c] of q == 'b' ? X : q == 'r' ? D : D.concat(X)) { let y = r + a, x = f + c; while (y >= 0 && y < 8 && x >= 0 && x < 8) { const o = b[y * 8 + x]; if (!o) add(y * 8 + x); else { if (col(o) != t) add(y * 8 + x); break } y += a; x += c } }
    }
    return m
}
function mk(s, m) {
    const b = s.b.slice(), p = b[m.f]; let c = s.c, e = -1; b[m.t] = m.p || p; b[m.f] = '';
    if (m.ep) b[m.t + (s.t == 'w' ? 8 : -8)] = '';
    if (m.c) { const h = m.f; if (m.t > h) { b[h + 1] = b[h + 3]; b[h + 3] = '' } else { b[h - 1] = b[h - 4]; b[h - 4] = '' } }
    if (p.toLowerCase() == 'p' && Math.abs(m.t - m.f) == 16) e = (m.f + m.t) / 2;
    const rm = x => { c = c.replace(x, '') }; if (p == 'K') { rm('K'); rm('Q') } if (p == 'k') { rm('k'); rm('q') }
    for (const [sq, x] of [[63, 'K'], [56, 'Q'], [7, 'k'], [0, 'q']]) if (m.f == sq || m.t == sq) rm(x);
    return { b, t: opp(s.t), c, e }
}
const inChk = s => att(s.b, kp(s.b, s.t), opp(s.t));
const legal = s => gen(s).filter(m => { const n = mk(s, m); return !att(n.b, kp(n.b, s.t), n.t) });
function ev(s) { let x = 0; for (let i = 0; i < 64; i++) { const p = s.b[i]; if (!p) continue; const q = p.toLowerCase(), r = i >> 3, f = i & 7; let v = V[q]; if ('nbp'.includes(q)) v += (7 - Math.abs(2 * f - 7) - Math.abs(2 * r - 7)) * 2; if (q == 'p') v += (isW(p) ? 6 - r : r - 1) * 5; x += isW(p) ? v : -v } return x }
const sc = (s, m) => (s.b[m.t] ? V[s.b[m.t].toLowerCase()] * 10 - V[s.b[m.f].toLowerCase()] : 0) + (m.p ? 800 : 0);
function ab(s, d, a, B) {
    const ms = legal(s); if (!ms.length) return inChk(s) ? -99999 - d : 0; if (!d) return ev(s) * (s.t == 'w' ? 1 : -1);
    ms.sort((x, y) => sc(s, y) - sc(s, x)); for (const m of ms) { const v = -ab(mk(s, m), d - 1, -B, -a); if (v >= B) return B; if (v > a) a = v } return a
}
function best(s, d, r) {
    const ms = legal(s); if (!ms.length) return; if (!d) return ms[Math.random() * ms.length | 0]; let b = null, bv = -1e9;
    ms.sort((x, y) => sc(s, y) - sc(s, x));
    for (const m of ms) { const v = -ab(mk(s, m), d - 1, -1e9, r ? 1e9 : -bv) + Math.random() * r; if (v > bv) { bv = v; b = m } } return b
}
