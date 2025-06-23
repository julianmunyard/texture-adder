// grab all the controls
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

// 🔁 Re-draw on any control change
blendMode.addEventListener('change', draw);
opacitySlider.addEventListener('input', draw);
brightnessSlider.addEventListener('input', draw);
contrastSlider.addEventListener('input', draw);

// 🖌️ Main draw function
function draw() {
  if (!photo) return;

  // match canvas size to photo
  const w = photo.width, h = photo.height;
  canvas.width = w;
  canvas.height = h;

  // clear and apply brightness/contrast filter to the photo
  ctx.clearRect(0, 0, w, h);
  ctx.filter = `brightness(${brightnessSlider.value/100}) contrast(${contrastSlider.value/100})`;
  ctx.drawImage(photo, 0, 0);

  // reset filter so the texture draws normally
  ctx.filter = 'none';

  // draw the texture with blend & opacity
  if (texture.src) {
    ctx.globalAlpha = opacitySlider.value / 100;
    ctx.globalCompositeOperation = blendMode.value;
    ctx.drawImage(texture, 0, 0, w, h);

    // reset blend settings
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
}

// 💾 Download the result
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'blended-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
