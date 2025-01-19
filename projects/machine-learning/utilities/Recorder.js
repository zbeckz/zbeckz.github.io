function objToData(indices, obj) {
  let pts = [];
  // Use the landmarks if we have them, otherwise its a list of [xy]
  if (obj.landmarks) obj = obj.landmarks;
  // Zero out empty objects
  if (!obj) {
    pts = Array.from({ length: indices.length }, () => [0, 0]);
  } else {
    pts = indices.map((index) => obj[index].slice());
  }

  pts = pts.flat();

  return pts;
}

function frameToData({ indices = [], mode = "face", hands, faces, output }) {
  // Given a frame, either from a recording or the live tracker
  // get an array of abbreviated, flattened arrays of x y coords
  // You may need to attadn

  // REMEMBER: The hands and feet in the recording are bare [x,y] arrays

  let objs = mode == "hand" ? hands : faces;

  // console.log(mode, objs);

  // Currently single handed gestures only
  let data = objs.map((obj) => {
    let input = objToData(indices, obj);
    if (output) return { input, output };
    else return input;
  });

  // console.log(mode, hands, faces, objs.length, data.length)
  return data;
}



class Feed {
  constructor({ recording, frameCount, onEnd }) {
    this.isActive = false;
    this.index = 0;
    this.onEnd = onEnd;
    this.recording = recording;
    this.defaultFrameCount = frameCount;
    if (!recording) {
      this.startNewRecording();
    }
  }

  startNewRecording() {
    console.log("Start new recording");
    this.index = 0;
    this.recording = {
      label: "",
      timestamp: Date.now(),
      frames: Array.from({ length: this.defaultFrameCount }, () => {
        return {
          hands: [],
          faces: [],
        };
      }),
    };
  }

  setFrame({ faces, hands }) {
    console.log("set", this.status, faces.length, hands.length);

    this.frame.hands = hands.map((h) => h.toData());
    this.frame.faces = faces.map((f) => f.toData());
  }

  increment({ loop } = {}) {
    this.index++;

    if (loop) {
      this.index = this.index % this.recording.frames.length;
    }
    if (this.index >= this.recording.frames.length) {
      console.log("END", status);
      this?.onEnd();
    }
  }

  get frameCount() {
    return this.recording.frames.length;
  }

  get frame() {
    return this.recording.frames[this.index];
  }

  get status() {
    return `${this.index}/${this.recording.frames.length}`;
  }
}

class Recorder {
  constructor(tracker) {
    this.tracker = tracker;
    this.tracker.recorder = this;

    this.framesToRecord = 20;

// Get all the saved recordings
    let savedRecordingsData = localStorage.getItem("savedRecordings");
    let savedRecordings = savedRecordingsData
      ? JSON.parse(savedRecordingsData)
      : [];
    console.log("Saved recordings", savedRecordings);

    this.recordingCountdown = -1;
    this.recordings = [TEST_RECORDING];
    this.recordings = this.recordings.concat(savedRecordings);
    this.recordings.sort((a, b) => b.timestamp - a.timestamp);
    
    console.log(
      "Recordings loaded:",
      this.recordings.map((r) => r.label)
    );

    this.playbackFeed = new Feed({
      recording: this.recordings[this.recordings.length - 1],
    });
    this.recordingFeed = new Feed({
      frameCount: this.framesToRecord,
      onEnd: () => {
        this.stopRecording();
      },
    });

    this.tracker.onFrame = () => {
      if (this.recordingFeed.isActive) {
        this.recordingFeed.setFrame(this.tracker.activeTrackables);
        this.recordingFeed.increment();
      }
    };

    // this.startRecording()
  }

  get isPlaying() {
    return this.playbackFeed.isActive;
  }

  toData({ indices = [], mode = "face", labels }) {
    // Given recording data, make some abbreviated training data

    // For each frame of the recording, get just this data
    // Flatten the indexes in case they are in multiple arrays
    indices = indices.flat(3);
    console.log("mode: ", mode, "indices: ", indices);

    // One output/label for this whole recording
    // Get the one-hot conversion

    let recordingsToTrain = this.recordings.filter((rec) => rec.label);
    console.log(`Found ${recordingsToTrain.length} recordings to train on: `);
    console.log(
      recordingsToTrain.map((r) => r.frames.length + "frames:" + r.label)
    );

    let data = [];
    // Go through each recording
    // Is each frame its own input?
    // For simplicity, yes
    recordingsToTrain.forEach((rec) => {
      // Go through this recording and get the data for each frame

      // Each recording has one output for all frames, the one-hot of its label
      let output = oneHotFromLabels(rec.label, labels);

      let recName = toTimeText(rec.timestamp);
      console.log("Getting data from recording", recName);
      rec.frames.forEach((frame) => {
        // Get the data from this frame

        let frameData = frameToData({
          hands: frame.hands,
          faces: frame.faces,
          output,
          label: rec.label,
          indices,
          mode,
          labels,
        });
        data = data.concat(frameData);
      });
    });

    // We now have all of the training data

    return data;
  }

  deleteRecording(r) {
    this.stopPlayback();
    let index = this.recordings.indexOf(r);
    if (index >= 0) this.recordings.splice(index, 1);
    // this.saveRecordings()
  }

  saveRecordings() {
    localStorage.setItem(
      "savedRecordings",
      JSON.stringify(this.recordings.filter((r) => r.timestamp !== 0))
    );
  }

  startRecording() {
    this.recordingFeed.startNewRecording();
    console.log("Start recording");
    this.timeoutCountdown = 3;
    let countdownInterval = setInterval(() => {
      if (this.timeoutCountdown == 0) {
        console.log("GO!");
        this.recordingFeed.isActive = true;
        this.timeoutCountdown = -1;
        clearInterval(countdownInterval);
      } else {
        this.timeoutCountdown -= 1;
      }
    }, 100);

    // Whenever the tracker gets a new frame
  }

  stopRecording() {
    this.recordingFeed.isActive = false;
    console.log(this.recordingFeed.recording);
    console.log("Stop recording");
    this.recordings.unshift(this.recordingFeed.recording);
    // this.saveRecordings()
  }

  togglePlayback() {
    if (this.playbackFeed.isActive) {
      this.stopPlayback();
    } else {
      this.startPlayback();
    }
  }

  playRecording(recording) {
    this.playbackFeed.recording = recording;
    this.playbackFeed.index = 0;
    this.startPlayback();
  }

  startPlayback() {
    // Initialize playback
    clearInterval(this.playbackInterval);
    this.playbackFeed.isActive = true;
    this.playbackInterval = setInterval(() => {
      this.playbackFeed.increment({ loop: true });
      let frame = this.playbackFeed.frame;

      if (frame)
        this.tracker.setToRecordingFrame(
          frame,
          this.playbackFeed.recording.isOldStyle
        );
    }, 60);
  }

  stopPlayback() {
    clearInterval(this.playbackInterval);
    this.playbackFeed.isActive = false;
  }

  drawDebugData(p) {
    p.noStroke();
    let t = p.millis() * 0.001;
    p.fill(0);
    p.rect(0, 0, 100, 40);
    p.fill(100);
    p.textSize(10)
    p.text(`Playback:${this.playbackFeed.status}`, 10, 15);
    if (this.timeoutCountdown >= 0)
      p.text(`Countdown:${this.timeoutCountdown}`, 10, 20);
    if (this.recordingFeed.isActive) {
      p.text(`Recording:${this.recordingFeed.status}`, 10, 20);
      p.stroke(0, 100, 50);
      p.strokeWeight(10 + 10 * Math.sin(t * 10));
      p.noFill();
      p.rect(0, 0, p.width, p.height);
      p.strokeWeight(1);
    }
  }
}
