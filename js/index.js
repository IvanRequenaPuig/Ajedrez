/* ---- carga ---- */
let pr = 0; const iv = setInterval(() => { pr += 2 + Math.random() * 5; $('pb').style.width = Math.min(pr, 100) + '%'; if (pr >= 100) { clearInterval(iv); $('app').hidden = false; $('ld').style.opacity = 0; setTimeout(() => $('ld').remove(), 500) } }, 90);
