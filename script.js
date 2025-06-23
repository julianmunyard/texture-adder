const uploadInput = document.getElementById('upload');
const textureSelect = document.getElementById('textureSelect');
const blendMode = document.getElementById('blendMode');
const opacitySlider = document.getElementById('opacitySlider');
const brightnessSlider = document.getElementById('brightnessSlider');
const contrastSlider = document.getElementById('contrastSlider');
const saturationSlider = document.getElementById('saturationSlider');
const downloadBtn = document.getElementById('download');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let photo = null;
let texture = new Image();

// 📷 Handle photo upload
uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    photo = new Image();
    photo.onload = () => draw();
    photo.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// 🎨 Handle texture selection
textureSelect.addEventListener('change', () => {
  texture.src = `textures/${textureSelect.value}`;
  texture.onload = () => draw();
});

// 🔁 Update on any setting change
blendMode.addEventListener('change', draw);
opacitySlider.addEventListener('input', draw);
brightnessSlider.addEventListener('input', draw);
contrastSlider.addEventListener('input', draw);
saturationSlider.addEventListener('input', draw);

// 🖌️ Draw everything
function draw() {
  if (!photo) return;

  const width = photo.width;
  const height = photo.height;

  canvas.width = width;
  canvas.height = height;

  // Set filters
  ctx.clearRect(0, 0, width, height);
  ctx.filter = `
    brightness(${brightnessSlider.value / 100})
    contrast(${contrastSlider.value / 100})
    saturate(${saturationSlider.value / 100})
  `;

  // Draw base photo
  ctx.drawImage(photo, 0, 0, width, height);

  // Draw texture
  if (texture.src) {
    ctx.globalAlpha = opacitySlider.value / 100;
    ctx.globalCompositeOperation = blendMode.value;
    ctx.drawImage(texture, 0, 0, width, height);

    // Reset blend mode
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  ctx.filter = 'none';
}

// 💾 Download result
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'blended-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
