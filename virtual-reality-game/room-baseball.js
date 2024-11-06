/*global THREE Vue settings Terrain shuffleArray getRandom */
/*
 * A game to play with witch friends
 * Tap the fire to assign hats
 */

settings.scenes.baseball = {
 
  hatColor: "#D3D3D3",
  billColor: "#D3D3D3",
  gloveSide: "Left",

  setup() {
    // Do something when we start this mode
  },

  
  step() {
    // Do something every n seconds
    // Not a good place to set Firebase data each frame,
    // that's a lot of read/write calls and could go past the free limit
  },

  setupAvatar(avatar) {

    // This doesn't work
    //  	avatar.hatColor = new THREE.Vector3(0, 0, 20)
    // We need to use Vue to make the color *reactive*
    // e.g. Vue.set(avatar, "hatColor", new THREE.Vector3(0, 0, 20));
    
  },
};

settings.activeSceneID = "baseball";

/*==========================================================
 * Controls - for avatar creation or other interactions
 * Note that they disappear in VR mode!
 ==========================================================*/
Vue.component("baseball-controls", {
  template: `<div>
    
	</div>`,
  props: ["userAvatar", "avatars", "settings"],
});

/*==========================================================
 * A scene 
 ==========================================================*/
Vue.component("baseball-scene", {
  template: `
	  <a-entity id="baseball-scene">
      
      <!-- skybox -->
      <a-sky src="#corn-field"/>
      
      <!-- main ambient light -->
      <a-light type="ambient" color="#ffffff"></a-light>
      
      <!-- sunlight -->
      <a-light 
        position="120 200 -120"
        color="white"
        intensity="0.75"
        light="type: directional; 
               castShadow: true">
      </a-light>
      
      <!-- outfield grass -->
      <a-cylinder
        shadow="receive: true"
        position="40 -1 0"
        rotation="0 -140 0"
        radius="210"
        height="0.2"
        theta-start="0"
        theta-length="100"
        repeat="210 210"
        src= "#turf-diffuse"
        normal-scale= "1 1"
        normal-texture-repeat="210 210"
        normal-map= "#turf-normal"
        material="roughness:0.9">
      </a-cylinder>
      
      <!-- fence -->
      <a-curvedimage 
        shadow="receive: true"
        position="40 -1 0"
        rotation="0 -140 0"
        radius="210"
        height="7"
        theta-start="0"
        theta-length="100"
        repeat="100 7"
        src= "#fence-diffuse">
      </a-curvedimage>
      
      <!-- scoreboard -->
      <a-curvedimage 
        shadow="receive: true"
        position="40 30 0"
        rotation="0 -102.5 0"
        radius="210"
        height="50"
        theta-start="0"
        theta-length="25"
        repeat="25 50"
        src= "#tee-diffuse">
      </a-curvedimage>
      
      <!-- Gus Image -->
      <a-curvedimage 
        shadow="receive: true"
        position="41 30 0"
        rotation="0 -101 0"
        radius="210"
        height="40"
        theta-start="0"
        theta-length="22"
        repeat="3 1"
        :src= gusImage
        @click="changeGusPhoto">
      </a-curvedimage>
      
      <!-- infield grass -->
      <a-box
        shadow="receive: true"
        height="0.1"
        position="0 -0.93 0"
        width="35"
        depth="35"
        rotation="0 45 0"
        repeat="35 35"
        src= "#turf-diffuse"
        normal-scale= "1 1"
        normal-texture-repeat="35 35"
        normal-map= "#turf-normal"
        material="roughness:0.9">
      </a-box>
      
      <!-- infield dirt -->
      <a-cylinder
        shadow="receive: true"
        position="40 -0.99 0"
        rotation="0 -140 0"
        radius="80"
        height="0.2"
        theta-start="0"
        theta-length="100"
        repeat="80 80"
        src= "#dirt-diffuse"
        normal-scale= "1 1"
        normal-texture-repeat="80 80"
        normal-map= "#dirt-normal"
        material="roughness:0.9">
      </a-cylinder>
      
      <!-- pitching dirt -->
      <a-cylinder
        shadow="receive: true"
        position="2 -0.96 0"
        rotation="0 -135 0"
        radius="5"
        height="0.2"
        repeat="5 5"
        src= "#dirt-diffuse"
        normal-scale= "1 1"
        normal-texture-repeat="5 5"
        normal-map= "#dirt-normal"
        material="roughness:0.9">
      </a-cylinder>
      
      <!-- pitching mound -->
      <a-box
        shadow="receive: true"
        color="white"
        height="0.2"
        width="0.35"
        depth="2"
        position="0 -0.9 0">
      </a-box>
      
      <!-- home plate -->
      <a-box
        shadow="receive: true"
        color="white"
        height="0.2"
        width="1"
        depth="1"
        position="30 -0.9 0"
        rotation="0 45 0">
        
        <!-- tee base -->
        <a-box
          shadow="receive: true"
          height="0.05"
          width="0.75"
          depth="0.75"
          position="0 0.15 0"
          repeat="0.75 0.75"
          src= "#tee-diffuse"
          normal-scale= "1 1"
          normal-texture-repeat="0.75 0.75"
          normal-map= "#tee-normal"
          material="roughness:0.9">
        </a-box>
        
        <!-- ball -->
        <a-sphere
          id="ball_ball"
          shadow="receive: true"
          position="0 1.2 0"
          radius="0.25"
          @click="hitBaseball">
          
        </a-sphere>
        
        <!-- tee shaft -->
        <a-cylinder
          id="tee"
          shadow="receive:true"
          position="0 0.5 0"
          height="1.2"
          radius="0.06"
          repeat="0.06 1.2"
          src= "#tee-diffuse"
          normal-scale= "1 1"
          normal-texture-repeat="0.06 1.2"
          normal-map= "#tee-normal"
          material="roughness:0.9">
        </a-cylinder>
        
        <!-- third base line -->
        <a-box
          shadow="receive: true"
          color="white"
          height="0.01"
          width="250"
          depth="0.1"
          position="-125 0.01 0.5"
          rotation="0 0 0">
          
          <!-- third base foul pole -->
          <a-cylinder
            color="yellow"
            height="40"
            radius="0.75"
            position="-79 20 0">
          </a-cylinder>
          
        </a-box>
        
        <!-- first base line -->
        <a-box
          shadow="receive: true"
          color="white"
          height="0.01"
          width="250"
          depth="0.1"
          position="0.5 0.01 -125"
          rotation="0 90 0">
          
          <!-- first base foul pole -->
          <a-cylinder
            color="yellow"
            height="40"
            radius="0.75"
            position="79 20 0">
          </a-cylinder>
          
        </a-box>
        
      </a-box>
      
      <!-- first base -->
      <a-box
        shadow="receive: true"
        color="white"
        height="0.2"
        width="1"
        depth="1"
        position="0 -0.9 -30"
        rotation="0 45 0">
      </a-box>
      
      <!-- third base -->
      <a-box
        shadow="receive: true"
        color="white"
        height="0.2"
        width="1"
        depth="1"
        position="0 -0.9 30"
        rotation="0 45 0">
      </a-box>
      
      <!-- second base -->
      <a-box
        shadow="receive: true"
        color="white"
        height="0.2"
        width="1"
        depth="1"
        position="-30 -0.9 0"
        rotation="0 45 0">
      </a-box>
        
    </a-entity>`,
  
  data() {
    return {
      ballVelocity: new THREE.Vector3(0, 0, 0),
      isBallInFlight: false,
      ballPosition: new THREE.Vector3(0, 1.2, 0),
      currentGusImageId: 2,
    };
  },

  methods: {
    
    changeGusPhoto()
    {
      this.currentGusImageId++
      if (this.currentGusImageId > 5)
      {
        this.currentGusImageId = 0
      }
    },
    
    hitBaseball()
    {
      this.isBallInFlight = true
      
      // generate random velocity vector
      let v = Math.random() * 25 + 25 // forward velocity between 25 and 50
      let theta = Math.random() * Math.PI/2
      let x = v * Math.cos(theta)
      let z = v * Math.sin(theta)
      let y = Math.random() * 25 + 10 // upward velocity between 10 and 35 
      
      this.ballVelocity = new THREE.Vector3(-1 * x, y, -1 * z)
    },
    
    getCameraRotation()
    {
      // get camera rotation from window
      let cameraRotation = document.querySelector('#camera').getAttribute('rotation').y
      
      // get it to a value between 0 and 360
      while (true)
      {
        if (cameraRotation > 360)
        {
          cameraRotation -= 360
        }
        else if (cameraRotation < 0)
        {
          cameraRotation += 360
        }
        else
        {
          break
        }
      }
      
      // convert from degree to radians
      cameraRotation = (cameraRotation / 180) * Math.PI
      
      return cameraRotation
    },
    
    
    UpdateBall()
    {
      // if ball not in flight, no need to do anything
      if (!this.isBallInFlight) { return; }
      
      // otherwise, update its velocity based on gravitational acceleration
      this.ballVelocity.add(new THREE.Vector3(0, -9.8, 0).multiplyScalar(0.03))
      
      // then update its position based on velocity
      let copy = this.ballVelocity.clone()
      this.ballPosition.add(copy.multiplyScalar(0.03))
      
      // set the ball's position in the html so it updates on screen
      let ballString = `${this.ballPosition.x} ${this.ballPosition.y} ${this.ballPosition.z}`
      document.getElementById("ball_ball").setAttribute('position', ballString)
      
      // if ball is below ground, reset
      if (this.ballPosition.y < 0)
      {
        this.isBallInFlight = false
        let hitDistance = 1.85 * Math.sqrt(this.ballPosition.x*this.ballPosition.x + this.ballPosition.z*this.ballPosition.z)
        document.getElementById('hitDistance').innerHTML = `Last Hit Distance: ${Math.round(hitDistance)}ft`
        this.ballPosition = new THREE.Vector3(0, 1.2, 0)
        let ballString = `${this.ballPosition.x} ${this.ballPosition.y} ${this.ballPosition.z}`
        document.getElementById("ball_ball").setAttribute('position', ballString)
      }
      
    },
  },

  mounted() 
  {
    this.ballVelocity = new THREE.Vector3(0, 0, 0)
    this.isBallInFlight = false
    this.currentGusImageID = 2
    this.ballPosition = new THREE.Vector3(0, 1.2, 0)
    
    // update ball stuff
    setInterval(() => this.UpdateBall(), 10)
  },
  
  computed:
  {
    gusImage()
    {
      return `#gus${this.currentGusImageId}`
    }
  },
  
  props: ["avatars", "settings", "userAvatar"],
});

/*==========================================================
 * Each avatar 
 * The avatar doesn't get drawn for the player
 ==========================================================*/

// This pieces moves with their body position,
// ie, only if you move them
// or have a 6DoF headset, like the Quest
Vue.component("baseball-avatar-body", {
  template: `<a-entity class="baseball-body">
      
      <!-- feet -->
      <a-cylinder
        shadow="receive: true"
        height="2"
        color="white" 
        position="0 0 0"
        radius="0.2"
        src= "#shirt-diffuse"
        repeat="2 2"
        normal-scale= "1 1"
        normal-texture-repeat="2 2"
        normal-map= "#shirt-normal">
      </a-cylinder>
      
      <!-- glove -->
      <a-entity
        shadow="receive: true"
        gltf-model="#glove"
        ref="glove"
        scale="0.02 0.02 0.02"
        :position=glovePosition>
      </a-entity>
      
      <!-- bat -->
      <a-entity
        shadow="receive: true"
        gltf-model="#bat"
        ref="bat"
        scale="1.2 1.2 1.2"
        rotation="0 0 -90"
        :position=batPosition
        material="roughness:0.3">
      </a-entity>
     
    </a-entity>
	`,
  
  computed: {
    glovePosition()
    {
      if (this.settings.gloveSide == "Left")
      {
        return "-0.6 0.8 0"
      }
      else
      {
        return "0.6 0.8 0"
      }
    },
    
    batPosition()
    {
      if (this.settings.gloveSide == "Left")
      {
        return "-0.6 1 -0.4"
      }
      else
      {
        return "-1.5 1 -0.4"
      }
    }
  },

  props: ["avatar", "settings"],
});

// avatar customization controls
Vue.component("baseball-controls", {
  template: `
      <!-- colorpicker for the hat -->
      <div>
        <label>Hat Color: </label>
        <input v-model="settings.hatColor"  type="color" />
        <label>Bill Color: </label>
        <input v-model="settings.billColor"  type="color" />
        <br>
        <label>Glove Side: </label>
        <select v-model="settings.gloveSide">
           <option>Left</option>
           <option>Right</option>
        </select>
        <br>
        <label id="hitDistance">Last Hit Distance: 0ft</label>
      </div>
	`,

  props: ["avatar", "settings"],
});

// This piece moves with their head tilt
Vue.component("baseball-avatar-head", {
  template: `
      <a-entity class="baseball-head">
       
        <!-- HEAD -->
        <a-sphere
          shadow="receive: true"
          radius=".25"  
          :color="avatar.headColor.toHSL({shade:.4})">
        </a-sphere>
        
        <!-- NOSE -->
        <a-cone
          shadow="receive: true"
          radius-bottom=".1" height=".2"  
          :color="avatar.headColor.toHSL({shade:-.6})" 
          scale="1 1 2"
          position="0 0 .2">
        </a-cone>
          
       <!-- HAT -->
       <a-sphere
         :color="settings.hatColor"
         shadow="receive: true"
         radius="0.2"
         position="0 0.15 0"
         theta-start="0"
         theta-length="90"
         src= "#shirt-diffuse"
         repeat="2 1"
         normal-scale= "1 1"
         normal-texture-repeat="2 1"
         normal-map= "#shirt-normal">
       </a-sphere>
       
       <!-- HAT BILL -->
       <a-cylinder
         :color="settings.billColor"
         shadow="receive: true"
         radius="0.15"
         height="0.01"
         position="0 0.15 0.08"
         scale="1.2 1 1.85"
         theta-start="270"
         theta-length="180"
         src= "#shirt-diffuse"
         repeat="1 1"
         normal-scale= "1 1"
         normal-texture-repeat="1 1"
         normal-map= "#shirt-normal">
       </a-cylinder>
       
    </a-entity>
	`,

  props: ["avatar", "settings"],
});

// This piece isn't moved at all
// You probably don't need to use it
Vue.component("baseball-avatar-noposition", {
  template: `<a-entity class="baseball-noposition">

  </a-entity>`,

  props: ["avatar", "settings"],
});

Vue.component("baseball-avatar-hand", {
  template: `<a-entity class="baseball-hand">
     <a-sphere 
        radius="0.01"  
        :color="avatar.headColor.toHSL({shade:.4})" 
      />
  </a-entity>`,

  props: ["avatar", "settings", "side", "userAvatar"],
});
