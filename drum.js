var bpm_Speed = 80;
var beat_Speed = 2;
var playing_Timer;
var is_AutoBegin = false;
var is_Played = false;
var playing_key;


function set_BpmSpeed(speed) {
  bpm_Speed = speed;
  document.querySelector(".bpm").innerHTML = speed;
}

function set_BeatSpeed(speed) {
  if (speed <= 4 && speed >= 1) {
    beat_Speed = speed;
    document.querySelector(".beats").innerHTML = speed * 4;
  } else {
    return;
  }
}

function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
  e.target.classList.remove("playing");
}

function removeHighlighted() {
  const keys_auto = Array.from(document.querySelectorAll(".active"));
  keys_auto.forEach((element) => element.classList.remove("active", "playing"));
}

function displayTransition(e, className) {
  const key = document.querySelector(`div[data-key="${e.keyCode}"]`);;

  // Terminate the process, if the key doesn't have any connection with func.
  if (!key) {
    return;
  }
  key.classList.add(className);
}

function playSound(e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);

  // Terminate the process, if the key doesn't have audio file connected.
  if (!audio) {
    return;
  }

  audio.currentTime = 0;
  audio.play();
}

function playAutoSound(e) {
  is_Played = true;
  playing_key = e.keyCode;

  playing_Timer = setInterval(function () {
    playSound(e)
  }, 60000 / (bpm_Speed * beat_Speed));
}

function stop_AutoPlay() {
  if (is_AutoBegin) {
    clearInterval(playing_Timer);
    is_AutoBegin = false;
    is_Played = false;
  }
}

function set_AutoPlay(e) {
  if (!is_AutoBegin) {
    is_AutoBegin = true;
  }
}

/* Initialize a basic environment */
set_BpmSpeed(bpm_Speed);
set_BeatSpeed(beat_Speed);


//Event handler
window.addEventListener('keydown', function (e) {
  const hit_key = e.keyCode;
  const keys = Array.from(document.querySelectorAll('.key'));

  displayTransition(e, "playing");

  //J K L ;
  if (hit_key === 74 || hit_key === 75 || hit_key === 76 || hit_key === 186) {
    if (is_AutoBegin) {
      if (is_Played === false) {
        displayTransition(e, "active");
        playAutoSound(e);
      } else {
        if (hit_key === playing_key) {
          stop_AutoPlay();
          removeHighlighted();
        } else {
          playSound(e);
        }
      }
    } else { //If other sound is playing
      playSound(e);
    }
  } else if (hit_key == 81) { // Q: Auto Play
    if (!is_AutoBegin || !is_Played) {
      set_AutoPlay(e);
      displayTransition(e, "active");
    } else {
      stop_AutoPlay();
      removeHighlighted();
    }

  } else if (hit_key == 38) { // ↑: inc bpm
    stop_AutoPlay();
    removeHighlighted();
    set_BpmSpeed(bpm_Speed + 1);

  } else if (hit_key == 40) { // ↓: dec bpm
    stop_AutoPlay();
    removeHighlighted();
    set_BpmSpeed(bpm_Speed - 1);

  } else if (hit_key == 37) { // ←: dec beats
    stop_AutoPlay();
    removeHighlighted();
    set_BeatSpeed(beat_Speed / 2);

  } else if (hit_key == 39) { // →: inc beats
    stop_AutoPlay();
    removeHighlighted();
    set_BeatSpeed(beat_Speed * 2);

  } else {
    playSound(e);
  }

  //Remove all the transition left
  keys.forEach(key => key.addEventListener('transitionend', (e) => removeTransition(e)));
});