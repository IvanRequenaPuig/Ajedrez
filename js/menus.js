/* ---- menús ---- */
$('b1').onclick = () => go('cpu'); $('b2').onclick = () => newGame('2p'); $('pl').onclick = () => newGame('cpu');
$('b3').onclick = $('b4').onclick = () => modal('<h4>Próximamente</h4><p>Esta sección estará disponible muy pronto.</p>' + okb('Vale', 'closeM()'));
$('gear').onclick = () => { if (cur != 'set') { prev = cur; go('set') } };
$('av').onclick = () => modal('<h4>Elige tu imagen de perfil</h4><div class="avs">' + AV.map((a, i) => `<button onclick="P.av=${i};save();setAv();closeM()">${a}</button>`).join('') + '</div>');
const setAv = () => $('av').textContent = AV[P.av]; setAv();
document.querySelectorAll('.tg').forEach(e => { e.classList.toggle('on', !!P[e.dataset.k]); e.onclick = () => { P[e.dataset.k] = P[e.dataset.k] ? 0 : 1; e.classList.toggle('on'); save() } });
const tdUI = () => { $('s3').classList.toggle('on', !!P.td); $('s2').classList.toggle('on', !P.td) }; tdUI();
$('s3').onclick = () => { P.td = 1; save(); tdUI() }; $('s2').onclick = () => { P.td = 0; save(); tdUI() };
$('rs').onclick = () => modal('<h4>¿Reiniciar estadísticas y progreso?</h4>' + okb('Sí, reiniciar', "P.w=P.d=P.l=0;P.max=1;P.lv=1;save();closeM()") + okb('Cancelar', 'closeM()'));
