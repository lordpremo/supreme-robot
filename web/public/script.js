const form = document.getElementById('pair-form');
const resultBox = document.getElementById('result');
const errorBox = document.getElementById('error');
const pairCodeEl = document.getElementById('pair-code');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  let phone = document.getElementById('phone').value.trim().replace(/\s+/g, '');

  resultBox.classList.add('hidden');
  errorBox.classList.add('hidden');
  errorBox.textContent = '';
  pairCodeEl.textContent = '';

  if (!/^\d{10,15}$/.test(phone)) {
    errorBox.textContent = 'Invalid phone number format. Tumia 2557XXXXXXXX.';
    errorBox.classList.remove('hidden');
    return;
  }

  pairCodeEl.textContent = 'Please wait...';
  resultBox.classList.remove('hidden');

  try {
    const res = await fetch(`/code?number=${encodeURIComponent(phone)}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to get pair code');
    }

    pairCodeEl.textContent = data.code || 'Unavailable';
  } catch (err) {
    resultBox.classList.add('hidden');
    errorBox.textContent = err.message || 'Error fetching code';
    errorBox.classList.remove('hidden');
  }
});

// waves animation (ile ile ya awali)
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
