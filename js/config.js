/* Configuración global, niveles, avatares y estado guardado */
const $ = id => document.getElementById(id), GL = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }; for (const k in GL) GL[k] += '\uFE0E';
const LV = [['Básico', 0, 0], ['Principiante', 1, 150], ['Fácil', 1, 35], ['Intermedio', 2, 60], ['Avanzado', 2, 0], ['Experto', 3, 20], ['Maestro', 3, 0], ['Gran maestro', 4, 0]];
const AV = ['🧔🏽', '👩🏻‍🎤', '🧑🏿‍✈️', '👵🏼', '🧙', '🤖', '🦊', '👑'];
const LS = (k, v) => { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)) } catch (e) { return null } };
let P = Object.assign({ av: 0, mv: 1, pc: 0, last: 1, flip: 0, snd: 1, td: 1, max: 1, w: 0, d: 0, l: 0, lv: 1, side: 'r' }, LS('chess') || {}), G = null, cur = 'menu', prev = 'menu';
const save = () => LS('chess', P);
