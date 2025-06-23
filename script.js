const uploadInput = document.getElementById('upload');
const textureSelect = document.getElementById('textureSelect');
const blendMode = document.getElementById('blendMode');
const opacitySlider = document.getElementById('opacitySlider');
const downloadBtn = document.getElementById('download');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let photo = null;
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

// 🎛️ Handle blend mode change
blendMode.addEventListener('change', draw);

// 🎚️ Handle opacity change
opacitySlider.addEventListener('input', draw);

// 🖌️ Main draw function
function draw() {
  if (!photo) return;

  const originalWidth = photo.width;
  const originalHeight = photo.height;
  canvas.width = originalWidth;
  canvas.height = originalHeight;

  // Draw base photo
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(photo, 0, 0);

  // Draw texture overlay
  if (texture.src) {
    ctx.globalAlpha = opacitySlider.value / 100;
    ctx.globalCompositeOperation = blendMode.value;
    ctx.drawImage(texture, 0, 0, canvas.width, canvas.height);

    // Reset blending
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
