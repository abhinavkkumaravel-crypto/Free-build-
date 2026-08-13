// app.js: Basic calculator logic

const displayEl = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let expression = '';

function updateDisplay() {
  displayEl.textContent = expression === '' ? '0' : expression;
}

function appendValue(v) {
  expression += v;
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function clearAll() {
  expression = '';
  updateDisplay();
}

function safeEvaluate(expr) {
  // allow only digits, operators, parentheses, decimal point and spaces
  const allowed = /^[0-9+\-*/().\s]+$/;
  if (!allowed.test(expr)) throw new Error('Invalid characters');
  // Basic protection: disallow sequences like "++" (but allow unary minus)
  // We'll try to evaluate using Function; keep try/catch around it.
  // NOTE: This is a simple evaluator for basic use. For production, use a proper parser.
  return Function('return ' + expr)();
}

function evaluateExpression() {
  try {
    const result = safeEvaluate(expression);
    expression = String(result);
    updateDisplay();
  } catch (err) {
    displayEl.textContent = 'Error';
    setTimeout(() => updateDisplay(), 800);
  }
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const v = btn.getAttribute('data-value');
    const action = btn.getAttribute('data-action');
    if (action === 'clear') return clearAll();
    if (action === 'back') return backspace();
    if (action === 'equals') return evaluateExpression();
    if (v) return appendValue(v);
  });
});

// keyboard support
window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); return evaluateExpression(); }
  if (e.key === 'Backspace') { e.preventDefault(); return backspace(); }
  if (e.key === 'Escape') { e.preventDefault(); return clearAll(); }
  // accept digits, operators, parentheses, dot
  const allowedKeys = '0123456789+-*/().';
  if (allowedKeys.includes(e.key)) {
    e.preventDefault();
    appendValue(e.key);
  }
});

// focus display so keyboard works immediately
displayEl.addEventListener('focus', () => displayEl.classList.add('focused'));
updateDisplay();
