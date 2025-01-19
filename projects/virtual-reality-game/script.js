/* global IO THREE Vue Avatar avatars userAvatar PARAMS */
// **** YOU DON'T NEED TO CHANGE ANYTHING IN HERE **/

// Data about the current settings
let settings = {
  mirrorUser: PARAMS.mirror,
  ioPrint: PARAMS.ioPrint,
  scenes: {},
};

IO.setup();

window.onload = function (e) {
  // Set the starting scene from the queryparams
  settings.activeSceneID =
    PARAMS.room || settings.activeSceneID || Object.keys(settings.scenes)[0];

  // A Vue element for the controls
  new Vue({
    template: `<div id="controls">
    

      
      <div class="avatarcontrols">
       <details>
       <summary>Avatar motion:<select v-model="IO.avatarMotion">
              <option v-for="v in IO.avatarMotionOptions">{{v}}</option>
            </select>
         </summary>
       
        <table>
         
          <tr v-for="a in sortedAvatars" >
            <td  :style="colorStyle(a.color)" >{{a.uid.slice(-4)}}
             
              <span :style="colorStyle(a.headColor)">°</span>
            </td>
            <td >role:{{a.role}}</td>
            <td>{{a.pos.toAFrame()}}<span v-if="a.isUser">*</span> </td>
          </tr>
        </table>
        </details>
      </div>
      
      <div class="universalcontrols">
         Mirror:<input type="checkbox" v-model="settings.mirrorUser" />
         IO prints:<input type="checkbox" v-model="settings.ioPrint" />
         <select v-model="settings.activeSceneID">
           <option v-for="(scene,sceneID) in settings.scenes">{{sceneID}}</option>
         </select>

       </div>
        
     
      <component :is="settings.activeSceneID + '-controls' "
        :avatars="avatars"  
        :userAvatar="userAvatar"
        :settings="activeSceneSettings"
         
      />
      
    </div>`,

    watch: {
      // update the room data when it changes
      "activeSceneSettings.roomData": {
        deep: true,
        handler() {
          // When any of the room data changes,
          // push the changes to the server
          IO.pushRoomDataToServer();
        },
      },
    },

    computed: {
      sortedAvatars() {
        let a2 = this.avatars.slice();
        a2.sort((a, b) => a.role - b.role);
        return a2;
        // return avatars
      },
      activeSceneSettings() {
        return this.settings.scenes[this.settings.activeSceneID];
      },
    },

    methods: {
      colorStyle(color) {
        return {
          color: color.toHSL({ shade: -0.3 }),
          backgroundColor: color.toHSL({ shade: 0.3 }),
        };
      },
    },

    data() {
      return {
        userAvatar,
        avatars,
        settings,
      };
    },

    el: "#controls",
  });

  // A Vue element for the scene
  new Vue({
    template: `<a-entity id="scene">
      
      <!-- Position of hands and camera -->
      <!-- Oddly, can't translate hands?? -->
      <a-entity id="leftHand" hand-controls="hand: left; color: #ff12ff" ></a-entity> 
      <a-entity id="rightHand" hand-controls="hand: right; color: #ff43ff"></a-entity> 
      <a-camera ref="camera" id="camera">
        <a-cursor />
      </a-camera>
        
      <!-- translate the world, not the avatar -->
      <a-entity :rotation="userCameraRot" >
       <a-entity  :position="userCameraPos" >


        <component :is="settings.activeSceneID + '-scene'" 
          :avatars="avatars"  
          :userAvatar="userAvatar"
          :settings="activeSceneSettings"
         
          :settings="activeSceneSettings"
          />
      
        <!-- Make one body per avatar -->
        <avatar v-for="avatar in avatars" :avatar="avatar" 
          :key="avatar.uid"
          :mirrorUser="settings.mirrorUser"
          :settings="activeSceneSettings" 
          :sceneID="settings.activeSceneID" 
          />
        
        
        </a-entity>
        
      </a-entity>
    </a-entity>`,
    computed: {
      //-------------------------------------
      // Compute the user's current position
      // so we can move the camera to it
      userCameraPos() {
        let p2 = new THREE.Vector3();
        p2.copy(this.userAvatar.pos);
        p2.negate();
        return p2.toAFrame();
      },

      userCameraRot() {
        let p2 = new THREE.Vector3();
        p2.copy(this.userAvatar.rot);
        p2.negate();
        p2.y += 180;
        return p2.toAFrame();
      },

      //-------------------------------------

      activeSceneSettings() {
        return this.settings.scenes[this.settings.activeSceneID];
      },
    },

    watch: {
      "settings.activeSceneID"() {
        this.startScene();
      },
    },

    methods: {
      startScene() {
        // setup the scene and each avatar
        this.activeSceneSettings.setup(this.activeSceneSettings);
        this.avatars.forEach((a) => this.activeSceneSettings.setupAvatar(a));

        // Try to enter the room on Firebase, if we've connected to the server
        IO.enterRoom(this.settings.activeSceneID);
      },
    },

    mounted() {
      let cameraEl = this.$refs.camera;
      this.camObj = cameraEl.object3D;

      // Watch on a short refresh
      //   every time the AFrame camera moves,
      //   update the user's position/rotation
      setInterval(() => {
        IO.camera.updateFromCameraObject(this.camObj);
      });

      setInterval(() => {
        this.activeSceneSettings.step(this.activeSceneSettings);
      }, 100);

      // Start the current mode
      this.startScene();
    },
    data() {
      return {
        camObj: undefined,
        avatars,
        userAvatar,
        settings,
      };
    },

    el: "#scene",
  });
};
