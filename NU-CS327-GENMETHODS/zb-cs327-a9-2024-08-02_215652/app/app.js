/**
 * Starter code
 *
 */
/* globals Vue, p5, Tracker */
// GLOBAL VALUES, CHANGE IF YOU WANT

const DEFAULT_FRAME_RATE = 30;

let tasks = [];
let p;
const WIDTH = 600;
const HEIGHT = 400;

let tracker = new Tracker(trackingConfig);
let recorder = new Recorder(tracker);

function toTimeText(timestamp) {
  let date = new Date(timestamp);
  return (
    date.toLocaleDateString("en-us", { month: "short", day: "numeric" }) +
    ", " +
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
  return;
}

Vue.component("classification-view", {
  template: `<tr v-if="obj.classification !== undefined" >  
   
    <td> {{obj.name}}</td>
    <td v-for="score, label in obj.classification.scoresByLabel">{{label}}:{{score.toFixed(2)}}
    </td>
  </tr>`,
  
  props: ["obj"]
})

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  new Vue({
    template: `<div id="app">
      
			<div ref="p5"></div>
      
      <div class="controls">
        
        <div class="controls-section" style="width:350px;overflow:scroll;max-height:200px">
          <div>
            <!-- get all the predictions for any trackables -->
            <table >
              <classification-view  v-for="obj in tracker.activeTrackables[activeTask.mode]" :obj="obj" />
             
            </table>
          </div>
           <table>
              <tr v-for="recording in recorder.recordings" :class="{active:recorder.playbackFeed.recording === recording}">
                <td><button @click="recorder.playRecording(recording)">▶️</button></td>
                <td><button @click="recorder.deleteRecording(recording)">🗑️</button></td>
                <td>{{toTimeText(recording.timestamp)}}</td>
                <td>{{recording.frames.length}} frames</td>
                <td><select v-model="recording.label"><option v-for="label in labels.concat([''])">{{label}}</option></select>
              </tr>
            </table>
        </div>
        <div class="controls-section" style="width:250px">
          Draw debug data:<input type="checkbox" v-model="drawDebugData" />
          <select v-model="activeTask">
            <option v-for="task in tasks.filter(b=>!b.hide)" :value="task">{{task.name}}</option>
          </select>
          <button @click="toggleLive">🎥 <span v-if="tracker.isActive">STOP</span><span v-else>START</span> CAMERA</button>

          <div>
            <div>
              <label># frames to record:</label>
              <input type="range" min="1" max="50" step="1" v-model.number="recorder.framesToRecord"/>{{recorder.framesToRecord}}
            </div>
            <button @click="recorder.startRecording()">⏺️ record</button>
            <button @click="recorder.togglePlayback()">⏯️ playback</button>
            <button @click="activeTask.train(30)" :disabled="missingLabels.length>0"> train short</button>
            <button @click="activeTask.train(100)" :disabled="missingLabels.length>0"> train long</button>
            <div v-if="missingLabels.length>0" class="problem">Missing data for labels: {{missingLabels}}</div>
          
          <table>
            <tr v-for="label in activeTask.labels">
              <td>{{label}}</td><td># of recordings: {{recordingsForLabel(label).length}}</td>
            </tr>
          </table>
           
          </div>
       	</div>
        
        
        <component class="controls-section" :is="'input-' + activeTask.name" :task="activeTask" />
      </div>


		</div>`,

    methods: {
      toTimeText,

      recordingsForLabel(label) {
        return this.recorder.recordings.filter((rec) => rec.label === label);
      },

      toggleLive() {
        if (!this.tracker.isActive) {
          this.startCameraAndTracking();
        } else {
          this.stopCameraAndTracking();
        }
      },

      stopCameraAndTracking() {
        console.log("TRACKING - STOP VIDEO CAPTURE");
        // this.capture.remove();
        this.tracker.isActive = false;
      },

      startCameraAndTracking() {
        console.log("TRACKING - START VIDEO CAPTURE");
        if (this.capture) {
          console.log("\treenable camera");
          this.tracker.isActive = true;
        } else {
          console.log("\tstart camera");
          this.capture = this.settings.p.createCapture(this.settings.p.VIDEO);
          this.capture.hide();

          // We have to wait until P5 has started the capture,
          // - but it doesn't give us a callback, so we're doing it the bad way by waiting
          let count = 0;
          const maxCount = 100;
          const interval = 50;
          const intervalId = setInterval(() => {
            // console.log(this.capture.elt)
            if (this.capture.elt.width > 0) {
              // If the condition is met, stop the loop
              clearInterval(intervalId);
              console.log("Condition met, stopping loop.");
              this.recorder.stopPlayback();
              this.tracker.setVideoSource(this.capture);
              this.tracker.initTracking();
            } else if (count >= maxCount) {
              // If 100 iterations have occurred without meeting the condition, stop the loop
              clearInterval(intervalId);
              console.warn("No capture created");
            }
            count++;
          }, interval);
        }
      },

      initializeTask() {
        let p = this.settings.p;

        // mask setup things
        this.activeTask.setup({ p });
        this.tracker.hands.forEach((hand) =>
          this.activeTask.setupHand({ p, hand })
        );
        this.tracker.faces.forEach((face) =>
          this.activeTask.setupFace({ p, face })
        );

        this.activeTask.initializeNeuralNetwork();
        this.activeTask.loadModel();
      },
    },

    computed: {
      labels() {
        return this.activeTask.labels;
      },
      missingLabels() {
        // Which labels are in our label set, but not in the data?

        let missing = [];

        for (let str of this.labels) {
          let found = false;
          for (let obj of this.recorder.recordings) {
            if (obj.label === str) {
              found = true;
              break;
            }
          }
          if (!found) {
            missing.push(str); // Add the missing string to the array
          }
        }

        return missing; // Return the array of missing strings
      },
    },

    watch: {
      activeTask() {
        this.initializeTask();
        console.log("Set last task", this.activeTask.name)
        localStorage.setItem("lastTask", this.activeTask.name);
      },

      "recorder.recordings": {
        deep: true,
        handler() {
          console.log("Recordings changed");
          this.recorder.saveRecordings();
        },
      },
    },

    mounted() {
      new p5((pNew) => {
        p = pNew
        // We have a new "p" object representing the sketch

        // Save p to the Vue element, so we have access in other methods
        this.settings.p = p;

        p.frameRate(DEFAULT_FRAME_RATE);

        this.capture;
        p.setup = () => {
          p.createCanvas(WIDTH, HEIGHT);

          p.colorMode(p.HSL);

          // setup()
          this.initializeTask();
          this.recorder.startPlayback();
        };

        p.draw = () => {
          // Draw a background for this task
          this.activeTask.drawBackground({ p });

          // Is the tracker active?
          if (this.tracker.isActive) {
            // Mirror the capture
            p.push();
            p.scale(-1, 1);
            p.translate(-this.capture.width, 0);
            p.image(this.capture, 0, 0);
            p.pop();

            // Detect faces and hands
            if (!this.recorder.isPlaying) this.tracker.detect();
          }

          // Classify the current trackables
          // If we have a model
          if (this.activeTask.modelIsLoaded) {
            this.activeTask.classify?.(this.tracker.activeTrackables);
          }

          this.tracker.activeTrackables.faces.forEach((face) =>
            this.activeTask.drawFace({ p, face })
          );
          this.tracker.activeTrackables.hands.forEach((hand) =>
            this.activeTask.drawHand({ p, hand })
          );

          this.activeTask.drawAll?.({
            p,
            ...this.tracker.activeTrackables,
            
          });

          this.recorder.drawDebugData(p);
          if (this.drawDebugData) this.tracker.drawDebugData(p);
        };
      }, this.$refs.p5);
    },

    data() {
      let last = localStorage.getItem("lastTask");
      // Use the last-used space, or the first if we don't have a record
      let activeTask =
        tasks.find((s) => s.name === last) || tasks.filter((s) => !s.hide)[0];
      
      return {
        // Stuff that we pass to all fxns
        settings: {
          p: undefined,
          deltaTime: 0.1,
          time: 0,
        },

        activeTask,

        recorder,
        tracker,

        drawDebugData: false,
        pauseTracking: false,
        isPaused: false,
      };
    },
    el: "#app",
  });
});
