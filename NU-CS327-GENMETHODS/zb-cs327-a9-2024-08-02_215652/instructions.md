# Assignment 9: Training a network

**NOTE: WE HAVE A PROBLEM WITH A FEW STUDENTS TURNING IN LIGHTLY MODIFIED EXAMPLE CODE**
Even if you have to do a very fast assignment, you still need to significantly modify the example code to get to a new piece of art.  Make sure to create a new file, change the name, change the controls, and make sure that yours is visually distinct from what came before! 


## Speedrun

* Create an experience that classifies at 3 different hand or face gestures (pick either hand or face, we can't do both)
* Use Teachable Machine to try detecting those gestures. https://teachablemachine.withgoogle.com/
  * Teachable Machine works with pixels, not vector positions, so it is at a disadvantage, but try it out to see if it can distinguish between gestures
* **SETUP**
  * Clone task-example or task-faceexample
    * **comment out the weightsURL/modelURL/metadataURL**, this will put it in training mode for now
  * Create your *own set of labels*.  
    * I recommend 3-5, 
    * they can be emoji 
    * or any string: "look left"/"look up" "dab"/"vogue"
  * Important: read through each step in the NEURAL NETWORK section
* **GETTING TRAINING DATA**
  * You are going to *record some training data* 
    * It's recorded as a list of {faces,hands} vector data, one for each frame in the recording
  * These recordings are stored in your browser's local storage. They will persist between reloads, **but not exist on other peoples computers**
  * Record at least one recording for each label (more is good, but you are space-limited to about 20 recordings)
* **TRAINING**
   * Train short (or long if you have a fast computer)
    * If the graph doesn't go down, something went wrong, make sure your data is labeled
    * If you get a "model must be compiled" error, you need to comment out the previous weights
  * Download all three files
    * `model_meta.json` and `model.json` - open these up, they contain information about what type of neural network this is, how many layers, etc
    * `model.weights.bin` - all of the weights of the neural network in binary form
  * Rename the files with your task name, e.g. `emojidectector_model_meta.json` `emojidectector_model.json` 
    * add the json files to the `data` folder
    * add the `.bin` file to Glitch's assets and copy its URL
    * set the URLs that you commented out to the right paths
    * **You're ready to use your model**
      * Unlike the training data, anyone who visits your site has access to this model
      * This is a common pattern of ML - the training data is big and kept secret, the model is smaller and available
* **MAKING PREDICTIONS** 
  * Once you have a model's urls specified, your task will go into "prediction mode" and start predicting labels
  * Watch the section above the recording section, you should see hands or faces and their predicted labels show up
  * Each trackable (hand or face) will get a "classification" attribute
    * These contain `classification.sorted`, a list of  `{label,score}` predicitions for each label you made
    * Also a `classification.winner` of just the label and score of the top
    * Also a `scoresByLabel` so you can look up any label `classification.scoresByLabel["👍"]`
  * Make some custom behavior based on the labels!
  * This could include:
    * changing the way the hands or face are drawn 
    * drawing ui in `drawAll`
    * doing something *when a label changes* with `onChangeLabel`
  * `task-example` has UI, music when the gestures change, drawing the label on the hands, etc
    

