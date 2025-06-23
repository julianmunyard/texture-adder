// Grab all the controls
const uploadInput      = document.getElementById('upload');
const textureSelect    = document.getElementById('textureSelect');
const blendMode        = document.getElementById('blendMode');
const opacitySlider    = document.getElementById('opacitySlider');
const brightnessSlider = document.getElementById('brightnessSlider');
const contrastSlider   = document.getElementById('contrastSlider');
const downloadBtn      = document.getElementById('download');

const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

let photo   = null;
let texture = new Image();

// 📸 Handle photo upload
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

// 🔁 Redraw whenever any control changes
blendMode.addEventListener('change', draw);
opacitySlider.addEventListener('input', draw);
brightnessSlider.addEventListener('input', draw);
contrastSlider.addEventListener('input', draw);

// 🖌️ Main draw function: photo + texture, then brightness/contrast grouped
function draw() {
  if (!photo) return;

  const w = photo.width,
        h = photo.height;
  canvas.width  = w;
  canvas.height = h;
  ctx.clearRect(0, 0, w, h);

  // 1) Apply brightness & contrast to everything
  ctx.filter = 
    `brightness(${brightnessSlider.value / 100}) ` +
    `contrast(${contrastSlider.value / 100})`;

  // 2) Draw the base photo
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(photo, 0, 0);

  // 3) Draw the texture overlay with blend & opacity
  if (texture.src) {
    ctx.globalAlpha = opacitySlider.value / 100;
    ctx.globalCompositeOperation = blendMode.value;
    ctx.drawImage(texture, 0, 0, w, h);
  }

  // 4) Reset all drawing state
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.filter = 'none';
}

// 💾 Download the merged image
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'blended-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
