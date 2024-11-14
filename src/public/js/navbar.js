const _closeBtn = document.getElementById('_closeBtn')
_closeBtn.addEventListener('click', () => window.app.close())

const _miniBtn = document.getElementById('_miniBtn')
_miniBtn.addEventListener('click', () => window.app.minimize())

const _maxBtn = document.getElementById('_maxBtn')
_maxBtn.addEventListener('click', () => window.app.maximize())
