const upload = document.getElementById('videoUpload');
const canvas = document.getElementById('videoCanvas');
const ctx = canvas.getContext('2d');
const video = document.getElementById('video');
const container = document.getElementById('videoContainer');
const playPauseBtn = document.getElementById('playPause');
const seekBar = document.getElementById('seekBar');
const fpsSlider = document.getElementById('fpsSlider');
const fpsValue = document.getElementById('fpsValue');

let fps = parseInt(fpsSlider.value);
let animationId;

fpsSlider.addEventListener('input', () => {
  fps = parseInt(fpsSlider.value);
  fpsValue.textContent = fps;
});

upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  video.src = url;

  video.onloadeddata = () => {
    container.style.display = 'inline-block';
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    video.play();
    drawToCanvas();
  };
});

function drawToCanvas() {
  cancelAnimationFrame(animationId);
  let lastTime = 0;

  function draw(time) {
    const interval = 1000 / fps;
    if (time - lastTime >= interval) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      lastTime = time;
    }
    animationId = requestAnimationFrame(draw);
  }

  animationId = requestAnimationFrame(draw);
}

playPauseBtn.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    playPauseBtn.textContent = '❚❚';
  } else {
    video.pause();
    playPauseBtn.textContent = '►';
  }
});

video.addEventListener('timeupdate', () => {
  seekBar.max = video.duration;
  seekBar.value = video.currentTime;
});

seekBar.addEventListener('input', () => {
  video.currentTime = seekBar.value;
});

video.addEventListener('play', () => playPauseBtn.textContent = '❚❚');
video.addEventListener('pause', () => playPauseBtn.textContent = '►');
