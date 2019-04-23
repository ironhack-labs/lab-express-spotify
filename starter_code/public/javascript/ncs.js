window.onload = () => {
  var audio = document.querySelectorAll(".audio");
  let source = "";

  var wavesurfer = WaveSurfer.create({
    container: "#waveform"
  });

  for (let i = 0; i < audio.length; i++) {
    audio[i].addEventListener("click", () => {
      wavesurfer.load(audio[i].getAttribute("src"));
      wavesurfer.on("ready", function() {
        wavesurfer.play();
      });
    });
  }
};
