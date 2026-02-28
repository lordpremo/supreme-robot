// web/public/script.js
const form = document.getElementById('pair-form');
const resultBox = document.getElementById('result');
const errorBox = document.getElementById('error');
const pairCodeEl = document.getElementById('pair-code');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const phone = document.getElementById('phone').value.trim();

  resultBox.classList.add('hidden');
  errorBox.classList.add('hidden');
  errorBox.textContent = '';
  pairCodeEl.textContent = '';

  if (!phone) {
    errorBox.textContent = 'Please enter your WhatsApp number.';
    errorBox.classList.remove('hidden');
    return;
  }

  try {
    const res = await fetch('/api/pair', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to get pair code');
    }

    pairCodeEl.textContent = data.code;
    resultBox.classList.remove('hidden');
  } catch (err) {
    errorBox.textContent = err.message || 'Something went wrong.';
    errorBox.classList.remove('hidden');
  }
});

// Simple animated waves background
const canvas = document.getElementById('waves');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let t = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const waves = 4;
  for (let i = 0; i < waves; i++) {
    const amplitude = 20 + i * 10;
    const wavelength = 120 + i * 40;
    const speed = 0.002 + i * 0.0007;
    const yOffset = canvas.height * 0.3 + i * 40;

    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += 8) {
      const y =
        yOffset +
        Math.sin((x + t * speed * 1000) / wavelength) * amplitude;
      ctx.lineTo(x, y);
    }

    const alpha = 0.12 + i * 0.05;
    const color =
      i % 2 === 0
        ? `rgba(0, 229, 255, ${alpha})`
        : `rgba(124, 77, 255, ${alpha})`;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  t += 16;
  requestAnimationFrame(draw);
}

draw();
