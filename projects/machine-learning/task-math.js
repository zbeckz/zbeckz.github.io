/* globals Vue, p5, tasks, CONTOURS, Vector2D, ml5, recorder, predictionToClassification, MUSIC */
(function () {
  let task = {
    //=========================================================================================
    // TODO: custom data

    modelIsLoaded: false, // This will update automatically when the model is loaded
    hide: false,
    name: "math", // Lowercase only no spaces! (we reuse this for some Vue/model stuff)
    description: "detect mathematical operation symbols with the hands",
    mode: "hands",
    // mode: "faces",
    indices: CONTOURS.fingers,
    labels: ["plus", "minus", "multiply", "divide"],

    // Get this from your Glitch assets folder once you upload your model
    weightsURL: "https://cdn.glitch.global/500be3ce-0fd8-4a0e-9477-e9ceb99c37f4/math_model.weights.bin?v=1701820347070",
    // Set these to your task's model, once you have it trained
    modelURL: "data/math_model.json",
    metadataURL: "data/math_model_meta.json",
    operator: "+",
    number1: 12,
    number2: 4,
    result: 0,

    //=========================================================================================
    // NEURAL NETWORK MAGIC!
    // Setup, train, save and load a model, and use it to classify hands or faces
    // https://learn.ml5js.org/#/reference/neural-network

    initializeNeuralNetwork() 
    {
      // **** STEP 1: set your neural network options *****

      // Our input is twice the size of the indices(x,y)
      this.inputSize = this.indices.flat().length * 2;
      this.outputSize = this.labels.length;

      const options = {
        task: "classification",
        debug: true,
        inputs: this.inputSize,
        outputs: this.outputSize,
      };

      // Make the network
      this.nn = ml5.neuralNetwork(options);
    },

    train(epochs = 30) {
      // Following the steps from here:
      // https://learn.ml5js.org/#/reference/neural-network

      // **** STEP 2: get all the training data *****
      // Data needs to be reshaped or normalized -
      // - we need a vector of numbers

      // Get all the training data from our dataset
      let data = recorder.toData(this);

      // Add each input/output set to the nn for training
      data.forEach(({ input, output }) => {
        // Each data is a pair of input data (lots of flattened vectors, and the output)
        this.nn.addData(input, output);
      });

      this.nn.normalizeData();

      // Train your neural network
      const trainingOptions = {
        epochs,
        batchSize: 12,
      };

      // **** STEP 3: train - show the network all the data and record patterns *****
      this.nn.train(trainingOptions, () => {
        // When finished
        // **** STEP 4: get the model *****
      this.nn.save();
      });
    },

    loadModel() {
      // **** STEP 5: load a model *****
      if (task.weightsURL && task.metadataURL && task.weightsURL) {
        // This is where we load the model from
        // Make sure your model is in the folder "models"  with the prefix "example_"
        //  (or what your task's name is)
        // This allows us to have multiple models
        const modelDetails = {
          model: task.modelURL,
          metadata: task.metadataURL,
          weights: task.weightsURL,
        };

        try {
          this.nn.load(modelDetails, () => {
            // Once the model is loaded, do.... something
            this.modelIsLoaded = true;
          });
        } catch (err) {
        }
      }
    },

    classify({ hands, faces }) {
       // **** STEP 6: make predictions *****
     // Predict on hands or faces
      let objectsToPredictOn = task.mode === "hands" ? hands : faces;

      objectsToPredictOn.forEach((obj) => {
        // Get the data for this object
        let input = obj.toData().flat();
        
        // Predict a label for this object
        this.nn.predict(input, (error, rawPrediction) => {
          if (error) {
            console.warn("--- PREDICTION FAILED ---");
            console.warn(error);
          } else {
            // Attach this prediction to the object
            let oldClass = obj.classification;
            let newClass = predictionToClassification(
              task.labels,
              rawPrediction
            );
            obj.classification = newClass;
          }
        });
      });
    },
  
    setup({ p }) 
    {

    },

    drawBackground({ p }) 
    {
      p.background(100, 100, 100, 1);
    },

    setupHand({ p, hand }) 
    {
      // Any data that you need on each hand
    },

    setupFace({ p, face }) 
    {
      // Any data that you need on each face
    },

   
    // TODO:
    // DRAW SOMETHING ON THE FACE OR THE HANDS BASED ON WHAT LABEL IT IS
    drawHand({ p, hand }) 
    {
      let t = p.millis() * 0.001;
      p.noFill();
      // Landmark-based- draw an emoji on each landmark
      CONTOURS.fingers.forEach((fingerContour) => {
        hand.drawContour({
          p,
          contour: fingerContour,
        });
      });

      CONTOURS.fingers.forEach((fingerIndices) => {
        let fingerTipIndex = fingerIndices[3];
        let fingerTip = hand.landmarks[fingerTipIndex];
        p.circle(...fingerTip, 10);

        let operation = "?"
        let size = 30;
        if (hand.classification) {
            operation = this.getOperator(hand.classification.winner.label)
            size = hand.classification.winner.score * 30;
        }
        p.textSize(size);
        p.text(operation, ...fingerTip);
        this.operator = operation
      });
    },
    
    getOperator(operation) 
    {
        switch(operation)
        {
          case "plus":
            return "+"
          case "minus":
            return "-"
          case "multiply":
            return "*"
          case "divide":
            return "/"
          default:
            return "?"
        }
    },

    drawFace({ p, face }) 
    {
      let t = p.millis() * 0.001;

      p.noFill();
      p.stroke(190, 100, 80, 1);
      p.strokeWeight(3);
      face.drawContour({
        p,
        contour: CONTOURS.mouth[3],
        contour1: CONTOURS.mouth[4],
        useCurveVertices: true,
        close: true,
      });

      // Do something for each side
      face.forEachSide((SIDE_CONTOURS, sideIndex) => {
        p.noFill();
        p.stroke(190, 100, 80, 1);
        SIDE_CONTOURS.faceRings.forEach((contour) => {
          face.drawContour({
            p,
            contour,
            useCurveVertices: true,
            contour1: CONTOURS.centerLine,
            close: true,
          });
        });

        SIDE_CONTOURS.eyeRings.forEach((contour) => {
          face.drawContour({
            p,
            contour,
            useCurveVertices: true,
            close: true,
          });
        });
      });
    },
    
    
      drawAll({ p, faces, hands }) 
      {
    
        switch (this.operator)
        {
          case "+":
            this.result = +this.number1 + +this.number2
            break
          case "*":
            this.result = +this.number1 * +this.number2
            break
          case "-":
            this.result = +this.number1 - +this.number2
            break
          case "/":
            this.result = +this.number1 / +this.number2
            break
          default:
            
        }
        
        // draw white rectangle for text to be displayed
        
        // draw text
        p.textSize(40)
        p.fill(100,100,100)
        p.stroke(0,0,0)
        p.strokeWeight(2)
        p.text(`${this.number1} ${this.operator} ${this.number2} = ${this.result}`, 20, 100)
   }
  };
  
 

  //============================================================
  /**
   * Input controls for this bot.
   * Do we just need a chat input? Do we need anything else?
   * What about game controls, useful buttons, sliders?
   **/

  Vue.component(`input-${task.name}`, {
    // Custom inputs for this bot
    template: 
    `<div>
        <label>1st Number:   </label><input v-model="task.number1" placeholder="input number"/><br>
        <label>2st Number:   </label><input v-model="task.number2" placeholder="input number"/>
		</div>`,

    methods: 
    {

    },

    // Custom data for these controls
    data() {
      return {
      };
    },
    props: { task: { required: true, type: Object } }, // We need to have bot
  });

  tasks.push(task);
})();
