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

textureSelect.addEventListener('change', () => {
  texture.src = `textures/${textureSelect.value}`;
  texture.onload = () => draw();
});

[blendMode, opacitySlider, brightnessSlider, contrastSlider, saturationSlider].forEach(control => {
  control.addEventListener('input', draw);
});

function draw() {
  if (!photo) return;

  const boxWidth = 500;
  const boxHeight = 500;

  canvas.width = boxWidth;
  canvas.height = boxHeight;

  ctx.clearRect(0, 0, boxWidth, boxHeight);

  // Calculate scale to fit image into box without distortion
  const scale = Math.min(boxWidth / photo.width, boxHeight / photo.height);
  const drawWidth = photo.width * scale;
  const drawHeight = photo.height * scale;
  const offsetX = (boxWidth - drawWidth) / 2;
  const offsetY = (boxHeight - drawHeight) / 2;

  ctx.filter = `
    brightness(${brightnessSlider.value / 100})
    contrast(${contrastSlider.value / 100})
    saturate(${saturationSlider.value / 100})
  `;

  // Draw photo scaled inside fixed box
  ctx.drawImage(photo, offsetX, offsetY, drawWidth, drawHeight);

  if (texture.src) {
    ctx.globalAlpha = opacitySlider.value / 100;
    ctx.globalCompositeOperation = blendMode.value;
    ctx.drawImage(texture, offsetX, offsetY, drawWidth, drawHeight);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  ctx.filter = 'none';
}

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'blended-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
