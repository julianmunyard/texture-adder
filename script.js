// grab all the controls
const uploadInput       = document.getElementById('upload');
const textureSelect     = document.getElementById('textureSelect');
const blendMode         = document.getElementById('blendMode');
const opacitySlider     = document.getElementById('opacitySlider');
const brightnessSlider  = document.getElementById('brightnessSlider');
const contrastSlider    = document.getElementById('contrastSlider');
const saturationSlider  = document.getElementById('saturationSlider');
const downloadBtn       = document.getElementById('download');

const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

let photo   = null;
let texture = new Image();

// 🖼️ Handle photo upload
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
saturationSlider.addEventListener('input', draw);

// 🖌️ Main draw function: grouped filters + blend
function draw() {
  if (!photo) return;

  const w = photo.width,
        h = photo.height;
  canvas.width  = w;
  canvas.height = h;
  ctx.clearRect(0, 0, w, h);

  // 1) apply brightness, contrast & saturation to everything
  ctx.filter =
    `brightness(${brightnessSlider.value / 100}) ` +
    `contrast(${contrastSlider.value / 100}) ` +
    `saturate(${saturationSlider.value / 100})`;

  // 2) draw the base photo
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(photo, 0, 0);

  // 3) draw the texture overlay with blend & opacity
  if (texture.src) {
    ctx.globalAlpha = opacitySlider.value / 100;
    ctx.globalCompositeOperation = blendMode.value;
    ctx.drawImage(texture, 0, 0, w, h);
  }

  // 4) reset all drawing state
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

// 🔍 Magnifier setup
const magnifier = document.getElementById('magnifier');
const magnifierCanvas = magnifier.querySelector('canvas');
const magnifierCtx = magnifierCanvas.getContext('2d');

magnifierCanvas.width = canvas.width;
magnifierCanvas.height = canvas.height;

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Position the magnifier circle
  magnifier.style.display = 'block';
  magnifier.style.left = `${e.pageX - 75}px`;
  magnifier.style.top = `${e.pageY - 75}px`;

  // Update the magnifier image
  magnifierCtx.clearRect(0, 0, canvas.width, canvas.height);
  magnifierCtx.drawImage(canvas, 0, 0);

  // Move the zoomed canvas behind the circular frame
  magnifierCanvas.style.left = `-${x * 2 - 75}px`;
  magnifierCanvas.style.top = `-${y * 2 - 75}px`;
});

canvas.addEventListener('mouseleave', () => {
  magnifier.style.display = 'none';
});
