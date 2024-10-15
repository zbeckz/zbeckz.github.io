/* globals Vue, p5, tasks, CONTOURS, Vector2D, ml5, recorder, predictionToClassification, MUSIC */

/**
 * Assorted musical utilities from Galaxykate
 globals: p, p5
 **/
const MUSIC = (function () {
  
  function getRandom(arr) {
    return arr[Math.floor(arr.length*Math.random())]
  }
  const NOTE_FREQUENCIES = {
    C3: 130.81, // Frequency for C3
    "C#3": 138.59, // Frequency for C#3 / Db3
    D3: 146.83, // Frequency for D3
    "D#3": 155.56, // Frequency for D#3 / Eb3
    E3: 164.81, // Frequency for E3
    F3: 174.61, // Frequency for F3
    "F#3": 185.0, // Frequency for F#3 / Gb3
    G3: 196.0, // Frequency for G3
    "G#3": 207.65, // Frequency for G#3 / Ab3
    A3: 220.0, // Frequency for A3
    "A#3": 233.08, // Frequency for A#3 / Bb3
    B3: 246.94, // Frequency for B3
    C4: 261.63, // Frequency for C4
    "C#4": 277.18, // Frequency for C#4 / Db4
    D4: 293.66, // Frequency for D4
    "D#4": 311.13, // Frequency for D#4 / Eb4
    E4: 329.63, // Frequency for E4
    F4: 349.23, // Frequency for F4
    "F#4": 369.99, // Frequency for F#4 / Gb4
    G4: 392.0, // Frequency for G4
    "G#4": 415.3, // Frequency for G#4 / Ab4
    A4: 440.0, // Frequency for A4
    "A#4": 466.16, // Frequency for A#4 / Bb4
    B4: 493.88, // Frequency for B4
    // C5: 523.25, // Frequency for C5
    // "C#5": 554.37, // Frequency for C#5 / Db5
    // D5: 587.33, // Frequency for D5
    // "D#5": 622.25, // Frequency for D#5 / Eb5
    // E5: 659.26, // Frequency for E5
    // F5: 698.46, // Frequency for F5
    // "F#5": 739.99, // Frequency for F#5 / Gb5
    // G5: 783.99, // Frequency for G5
    // "G#5": 830.61, // Frequency for G#5 / Ab5
    // A5: 880.0, // Frequency for A5
    // "A#5": 932.33, // Frequency for A#5 / Bb5
    // B5: 987.77, // Frequency for B5
    // C6: 1046.5, // Frequency for C6
    // // Add even more notes as needed
  };
   //====================================================================================================================================
// MIDI
  
  
function initMidi({onKeyUp, onKeyDown, onFader}) {
  console.log("INIT MIDI")

  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
      sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
  } else {
    console.warn("No MIDI support in your browser.");
  }

  function onMIDISuccess(midiAccess) {
    console.log("Connected to MIDI")
    var inputs = midiAccess.inputs.values();
    console.log(inputs)

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // Each time there is a MIDI message, this event will be triggered
      input.value.onmidimessage = onMIDIMessage;
    }

    midiAccess.onstatechange = function (e) {
      console.log("MIDI device state changed:", e.port);
    };
  }

  function onMIDIFailure(error) {
    console.error("Could not access your MIDI devices.", error);
  }

  function onMIDIMessage(event) {
    var data = event.data;
    // console.log("MIDI message received:", data);

    var command = data[0] >> 4;
    var channel = data[0] & 0xf;
    var id = data[1];
    var val = data[2];
  
    switch(command) {
    case 11:
       console.log("Fader", command, channel, val, id)
       onFader?.({id, val})
      return 
    case 14:
       console.log("Pitch", command, channel, val, id)
        onFader?.({id:0, val})
       return
    case 9:
      onKeyDown?.({note: id, velocity: val})
      return
    case 8:
       onKeyUp?.({note: id, velocity: val})
       return
    default:
      console.log("unknown", command)
      return
    }
  
  

    // onMessage({command,channel,note,value})
    // ... Handle other MIDI commands ...
  }
}

  
  //====================================================================================================================================
// JUKEBOX

  class Jukebox {
    constructor() {
      this.startTitle = "351717__monkeyman535__cool-chill-beat-loop";
      this.activeSong = undefined;
      this.songs = {};
    }

    loadSongs(assetURL) {
      const regex = /\/([^/]+)\.mp3/; // Matches text between the last '/' and '.mp3'

      // All from CCMIXTER
      let songAssets = [
        "https://cdn.glitch.global/18feb58c-b4a9-4621-8002-9554790280e4/351717__monkeyman535__cool-chill-beat-loop.mp3?v=1666150235274",
        "https://cdn.glitch.global/cd78ff0d-0493-47a7-ade8-5d278fa2af3b/557815__alittlebitdrunkguy__solar-fi.mp3?v=1698364779726",
        "https://cdn.glitch.global/cd78ff0d-0493-47a7-ade8-5d278fa2af3b/arsonist%20-%20Hot%20salsa%20trip.mp3?v=1698364793492",
        // "https://cdn.glitch.global/cd78ff0d-0493-47a7-ade8-5d278fa2af3b/Broke%20For%20Free%20-%20As%20Colorful%20As%20Ever.mp3?v=1698364797206",
        // "https://cdn.glitch.global/cd78ff0d-0493-47a7-ade8-5d278fa2af3b/Jahzzar%20-%20The%20last%20ones.mp3?v=1698364798827",
        // "https://cdn.glitch.global/cd78ff0d-0493-47a7-ade8-5d278fa2af3b/Juanitos%20-%20Exotica.mp3?v=1698364801110",
        // "https://cdn.glitch.global/cd78ff0d-0493-47a7-ade8-5d278fa2af3b/purrple-cat-flourish.mp3?v=1698364803369",
        // "https://cdn.glitch.global/cd78ff0d-0493-47a7-ade8-5d278fa2af3b/Rolemusic%20-%20The%20Pirate%20And%20The%20Dancer.mp3?v=1698364807294",
        // "https://cdn.glitch.global/cd78ff0d-0493-47a7-ade8-5d278fa2af3b/Silence%20Is%20Sexy%20-%20Holiday%20(instrumental).mp3?v=1698364809631",
        // "https://cdn.glitch.global/cd78ff0d-0493-47a7-ade8-5d278fa2af3b/SONGO%2021%20-%20Opening%20para%20Songo%2021.mp3?v=1698364811208",
        // "https://cdn.glitch.global/cd78ff0d-0493-47a7-ade8-5d278fa2af3b/Sunsearcher%20-%20Brazilian%20Rhythm.mp3?v=1698364813483"
      ];

      songAssets.forEach((url) => {
        const title = url.match(regex)[1].replaceAll("%20", " ");
        // console.log(title)
        Vue.set(this.songs, title, p.loadSound(url));
      });
      this.selectedTitle = Object.keys(this.songs)[0];

      this.fft = new p5.FFT();
    }

    play(name) {
      if (!name) name = this.startTitle;

      // Stop playing current
      this.activeSong?.stop();
      this.activeSong = this.songs[name];
      // Play the new one
      this.activeSong.play();
    }

    analyze() {
      this.spectrum = this.fft.analyze();
    }

    stop() {
      this.activeSong?.stop();
    }

    draw(p) {
      this.analyze();
      // console.log(this.spectrum)
      let bandCount = this.spectrum.length - 800;
      p.fill(0);
      p.push();
      p.translate(0, p.height);
      p.rect(0, 0, p.width, -100);

      let dx = p.width / bandCount;
      for (var i = 0; i < bandCount; i++) {
        let x = dx * i;
        let h = -this.spectrum[i] * 0.3;
        p.fill((i * 23) % 360, 100, 50);
        p.rect(x, 0, dx, h);
      }
      p.pop();
    }
  }
  
   //====================================================================================================================================
  // INSTRUMENTS
  
  

  class Instrument {
    /**
     * an insturment, with a sample that it can play at different frequencies
     **/
    constructor(name) {
      this.name = name;
      // console.log("New instrument", name);
      instruments[name] = this;
    }

    load(p, assetURL) {
      this.sound = p.loadSound(assetURL);
      return this;
    }

    play(note) {
      let ratio = Math.random()*1 + .3;
      
      // Get a random note
      if (!note || NOTE_FREQUENCIES[note] === undefined) {
        
        note = getRandom(Object.keys(NOTE_FREQUENCIES));
      }
      ratio = NOTE_FREQUENCIES[note] / NOTE_FREQUENCIES.C4;
      console.log("playing note:", this.name, note)
      if (this.sound) {
        this.sound.play();
        this.sound.setVolume(2)
        this.sound.rate(ratio);
      }
      else
      console.warn("Can't play", this.name, "no sound loaded/enabled yet")
    }
  }
  let prefix =
    "https://cdn.glitch.global/cd78ff0d-0493-47a7-ade8-5d278fa2af3b/";
  const assetNames = {
    piano: "piano-C4.wav?v=1698338301924",
    violin: "violin-C4.wav?v=1698338301352",
    trumpet: "trumpet-C4.wav?v=1698338301641",
    flute: "flute-C4.wav?v=1698338301081",
    xylophone: "Xylophone.rosewood.ff.C5.stereo.wav?v=1698341987204",
    bells: "bells.plastic.ff.C5.stereo.wav?v=1698341988133",
    bellsBrass: "bells.brass.ff.C5.stereo.wav?v=1698341989018",
    xylophoneRubber: "Xylophone.hardrubber.ff.C5.stereo.wav?v=1698341989896",
    tabla: "689551__shototsu__tabla-short.wav?v=1698368963666",
    conga:
      "455508__mrrentapercussionist__lp-congas-quinto-open-tone.wav?v=1698368963992",
    bongo: "219157__jagadamba__bongo01.wav?v=1698368964217",
    bassClarinet: "BassClarinet.ff.C4.stereo_1.wav?v=1698369747814",
  };

  // Make an instrument for each asset
  let instruments = {};
  Object.keys(assetNames).forEach((name) => new Instrument(name));

  function loadInstruments() {
    console.log("Load instruments");

    Object.values(instruments).forEach((inst) =>
      inst.load(p, prefix + assetNames[inst.name])
    );
    console.log(instruments);
  }

  class Noise {
    constructor() {
      this.asdr = [0.1, 0.7, 0.3, 0.1];

      this.envelope = new p5.Envelope(...this.asdr);
      this.oscillator = new p5.Oscillator("sine");
    }

    randomizeASDR() {
      for (var i = 0; i < this.asdr.length; i++) {
        this.asdr[i] = Math.random();
      }
    }

    play() {
      // this.oscillator.freq(Math.random() * 400 + 100);
      this.randomizeASDR();
      console.log("asdr", this.asdr.map((val) => val.toFixed(2)).join(","));
      this.oscillator.start();
      this.envelope.setADSR(...this.asdr);
      this.envelope.play(this.oscillator);
    }
  }

  // Drums from https://sampleswap.org/
  // Other samples from https://theremin.music.uiowa.edu/MIS.html
  // Music from CCMixter

  return {
    initMidi,
    Noise,
    jukebox: new Jukebox(),
    loadInstruments,
    ...instruments,
    instrumentNames: Object.keys(instruments).concat(["random"]),
  };
})();
