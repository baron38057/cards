const card = document.getElementById("card");       //card is moving 4 mouse
document.addEventListener("mousemove", (e) => {
  const x = (window.innerWidth / 2 - e.clientX) / 30;
  const y = (window.innerHeight / 2 - e.clientY) / 30;
  card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});
document.addEventListener("mouseleave", () => {
  card.style.transform = `rotateY(0deg) rotateX(0deg)`;
});

const volumeSlider = document.getElementById('volumeSlider');     //music player code
const volumeBtn = document.getElementById('volumeBtn');

const sound = new Howl({
  src: ['music/music.mp3'],
  html5: true,
  volume: 0.1,
  onplay: () => {
    document.getElementById('playBtn').textContent = '⏸';
    requestAnimationFrame(updateProgress);
  },
  onpause: () => {
    document.getElementById('playBtn').textContent = '▶';
  },
  onstop: () => {
    document.getElementById('playBtn').textContent = '▶';
  },
  onend: () => {
    document.getElementById('playBtn').textContent = '▶';
  }
});

volumeSlider.value = sound.volume();
updateVolumeIcon(sound.volume());

const playBtn = document.getElementById('playBtn');
playBtn.addEventListener('click', () => {
  sound.playing() ? sound.pause() : sound.play();
});

const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

function updateProgress() {
  if (sound.playing()) {
    const seek = sound.seek() || 0;
    const duration = sound.duration() || 1;
    const percent = (seek / duration) * 100;
    progressBar.style.width = `${percent}%`;

    currentTimeEl.textContent = formatTime(seek);
    durationEl.textContent = formatTime(duration);

    requestAnimationFrame(updateProgress);
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

progressContainer.addEventListener('click', (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const width = rect.width;
  const duration = sound.duration();

  if (duration > 0) {
    const newTime = (offsetX / width) * duration;
    sound.seek(newTime);
    progressBar.style.width = `${(newTime / duration) * 100}%`;
  }
});

volumeSlider.addEventListener('input', () => {
  const volume = parseFloat(volumeSlider.value);
  sound.volume(volume);
  updateVolumeIcon(volume);
});

volumeBtn.addEventListener('click', () => {
  if (sound.volume() > 0) {
    sound.volume(0);
    volumeSlider.value = 0;
    updateVolumeIcon(0);
  } else {
    sound.volume(0.3);
    volumeSlider.value = 0.3;
    updateVolumeIcon(0.3);
  }
});

function updateVolumeIcon(volume) {
  if (volume === 0) {
    volumeBtn.textContent = '🔇';
  } else if (volume < 0.5) {
    volumeBtn.textContent = '🔈';
  } else {
    volumeBtn.textContent = '🔊';
  }
}

window.addEventListener('DOMContentLoaded', () => { // function 4 starting cringe music after hiding text "tap anywhere to continue"
  overlay.addEventListener('click', () => {
    const playBtn = document.getElementById('playBtn');
    if (playBtn) playBtn.click();
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity = '1';
    requestAnimationFrame(() => {
      overlay.style.opacity = '0';
    });
    setTimeout(() => {
      overlay.style.display = 'none';
      card.style.display = 'block';
    }, 500); 
  });
});
