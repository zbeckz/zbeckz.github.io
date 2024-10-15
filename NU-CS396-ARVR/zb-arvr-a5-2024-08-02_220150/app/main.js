settings.scenes.main = {
  archThickness: 0.2,
  leftLightColor: "#FF8800",
  rightLightColor: "#1E00FF",
  chairSeparation: 3,
};

Vue.component("main-controls", {
  template: `
    <div>
      
      <!-- Arch Thickness Slider -->
      <div>
        <label>Arch Thickness:</label>
        <input v-model.number ="settings.archThickness" type="range" step="0.05" min=0.05 max=0.5></input>
      </div>
      
      <!-- Chair Separation Slider -->
      <div>
        <label>Chair Separation:</label>
        <input v-model.number ="settings.chairSeparation" type="range" step="1" min=2 max=10></input>
      </div>
      
      <!-- colorpicker for the left light -->
      <div>
        <label>Left Light Color: </label>
        <input v-model="settings.leftLightColor"  type="color" />
      </div>
      
      <!-- colorpicker for the right light -->
      <div>
        <label>Right Light Color: </label>
        <input v-model="settings.rightLightColor"  type="color" />
      </div>
  
    </div>
  `,
  props: ["settings"],
});

// Create a scene here

Vue.component("main-scene", {
  template: `
    <a-entity class="main-scene">

      <!-- background -->
      <a-sky src="#panorama-lone-pine"></a-sky>
      
      <!-- main ambient light -->
      <a-light type="ambient" color="#ffffff"></a-light>
      
      <!-- floor -->
      <a-plane 
        shadow="receive: true"
        width="24" height="24" 
        rotation="-90 0 0" 
        repeat='5 5'
        src= "#sandstone-diffuse"
        normal-scale= "1 1"
        normal-texture-repeat="5 5"
        normal-map= "#sandstone-normal"
        material="roughness:0.6"
     ></a-plane>
          
     <!-- back wall -->
     <a-box
       shadow="receive: true"
       src="#metal-diffuse"
       width=24 
       position="0 1 12" 
       height=3
       repeat='24 3'
       src= "#metal-diffuse"
       normal-scale= "1 1"
       normal-texture-repeat="24 3"
       normal-map= "#metal-normal"
       material="roughness:0.2">
     </a-box>
   
     <!-- arches -->
     <a-entity v-for="pos in archPositions" :position="pos">
       <a-torus 
         shadow="receive: true"
         arc="180"
         radius="12"
         :radius-tubular="settings.archThickness"
         src= "#metal-diffuse"
         repeat="180 8"
         normal-scale= "1 1"
         normal-texture-repeat="180 8"
         normal-map= "#metal-normal"
         material="roughness:0.2">
       </a-torus>
     </a-entity>
     
     <!-- left seats -->
     <a-entity v-for="pos in leftSeatPositions" :position="pos">
       <a-box 
         shadow="receive: true"
         width="1" height="1" 
         repeat='1 1'
         src= "#metal-diffuse"
         normal-scale= "1 1"
         normal-texture-repeat="1 1"
         normal-map= "#metal-normal"
         material="roughness:0.6">
       </a-box>
     </a-entity>
     
     <!-- right seats -->
     <a-entity v-for="pos in rightSeatPositions" :position="pos">
       <a-box 
         shadow="receive: true"
         width="1" height="1" 
         repeat='1 1'
         src= "#metal-diffuse"
         normal-scale= "1 1"
         normal-texture-repeat="1 1"
         normal-map= "#metal-normal"
         material="roughness:0.6">
       </a-box>
     </a-entity>
     
     <!-- left lights -->
     <a-entity v-for="pos in leftLightPositions" :position="pos">
       <a-light 
        :color="settings.leftLightColor"
        light="type: point; 
               distance: 4;
               intensity: 1">
       </a-light>
     </a-entity>
     
     <!-- right lights -->
     <a-entity v-for="pos in rightLightPositions" :position="pos">
       <a-light 
        :color="settings.rightLightColor"
        light="type: point; 
               distance: 4;
               intensity: 1">
       </a-light>
     </a-entity>
     
     <!-- sunlight -->
     <a-light 
        position="-20 12 12"
        color="white"
        light="type: directional; 
               castShadow: true">
     </a-light>

   </a-entity>
   `,
  
  computed: {
    archPositions()
    {
      let positions = []
      for (var i = 0; i < 8; i++)
      {
        positions[i] = `0 0 ${8 - 2*i}`
      }
      return positions
    },
    
    leftSeatPositions()
    {
      let positions = []
      for (var i = 0; i < 8; i++)
      {
        positions[i] = `-${this.settings.chairSeparation} 0.5 ${8 - 2*i}`
      }
      return positions
    },
    
    rightSeatPositions()
    {
      let positions = []
      for (var i = 0; i < 8; i++)
      {
        positions[i] = `${this.settings.chairSeparation} 0.5 ${8 - 2*i}`
      }
      return positions
    },
    
    leftLightPositions()
    {
      let positions = []
      for (var i = 0; i < 8; i++)
      {
        positions[i] = `-12 2 ${8 - 2*i}`
      }
      return positions
    },
    
    rightLightPositions()
    {
      let positions = []
      for (var i = 0; i < 8; i++)
      {
        positions[i] = `12 2 ${8 - 2*i}`
      }
      return positions
    },
  },
  
  props: ["avatars", "settings"],
});
