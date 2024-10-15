// Use this later for people!
let avatars = [];
let settings = {
  sceneID: "main",
  rotationSpeed: 0,
  rotation: 0,
  scenes: {}
};

window.onload = function (e) {
  
  // A Vue element for the controls
  new Vue({
    template: `
      <div id="controls">
        Turntable speed: <input type="range" v-model.number="settings.rotationSpeed" step=".01" max="1"/>
        <component 
          :is="settings.sceneID + '-controls'" 
          :settings="settings.scenes[settings.sceneID]" 
          :avatars="avatars" />
      </div>
    `,  
    
    data() {
      return {
        avatars,
        settings,
      };
    },
    
    el: "#controls"
  });
  
  // A Vue element for the scene
  new Vue({
    template: `<a-entity id="scene">
    
       <a-entity :rotation="cameraRotation">
         <a-entity id="cameraRig" position="0 1.6 8">
           <a-camera />
         </a-entity>
       </a-entity>
       <component :is="componentID" :settings="sceneSettings" :avatars="avatars" />
       
    <a-entity>`,
  computed: {
    componentID() {
      return this.sceneID + "-scene"
    },
    sceneID() {
      return this.settings.sceneID
    },
    sceneSettings() {
      return this.settings.scenes[this.sceneID]
    },
    cameraRotation() {
      return `0 ${this.settings.rotation} 0`
    }
  },
    
    
  mounted() {
    console.log("Scene!")
    
    // Rotate the scene on a turntable
    setInterval(() => {
      settings.rotation += settings.rotationSpeed
    }, 10) 
  },
    data() {
      return {
        avatars,
        settings,
      };
    },
    
    el: "#scene"
  });
};
