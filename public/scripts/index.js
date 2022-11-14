// Pauses current playing track if starting the next one 
document.addEventListener("play", (event) => {
  const audios = document.getElementsByTagName("audio");

  for (let i in audios) {
    if (audios[i] !== event.target) {
      audios[i].pause();
    }
  }
}, true);
