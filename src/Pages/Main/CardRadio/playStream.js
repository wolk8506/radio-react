import Hls from 'hls.js';

let hls = null;
let currentUrl = null;

const isHls = url => /\.m3u8(\?|$)/i.test(url || '');

export const playStream = (audio, url) => {
  if (!audio) return;
  audio.pause();
  if (hls) {
    hls.destroy();
    hls = null;
  }
  currentUrl = url;
  if (isHls(url) && Hls.isSupported()) {
    hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(audio);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      audio.play().catch(() => {});
    });
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data && data.fatal && audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = url;
        audio.play().catch(() => {});
      }
    });
  } else if (isHls(url) && audio.canPlayType('application/vnd.apple.mpegurl')) {
    audio.src = url;
    audio.play().catch(() => {});
  } else {
    audio.src = url;
    audio.play().catch(() => {});
  }
};

export const resumeStream = (audio, url) => {
  if (!audio) return;
  if (currentUrl === url) {
    audio.play().catch(() => {});
  } else {
    playStream(audio, url);
  }
};

export const isCurrentStream = url => currentUrl === url;
