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

  const previewWidth = 400;
  const previewHeight = 600;

  canvas.width = previewWidth;
  canvas.height = previewHeight;

  ctx.clearRect(0, 0, previewWidth, previewHeight);

  ctx.filter = `
    brightness(${brightnessSlider.value / 100})
    contrast(${contrastSlider.value / 100})
    saturate(${saturationSlider.value / 100})
  `;

  // Fit photo into canvas
  ctx.drawImage(photo, 0, 0, previewWidth, previewHeight);

  if (texture.src) {
    ctx.globalAlpha = opacitySlider.value / 100;
    ctx.globalCompositeOperation = blendMode.value;
    ctx.drawImage(texture, 0, 0, previewWidth, previewHeight);
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
