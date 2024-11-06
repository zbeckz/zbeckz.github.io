document.addEventListener("DOMContentLoaded", () => {
	new Vue({
    template: 
    `
      <div id="app">
        <div class="canvas-holder">
          <div ref="p5" />
          <div class="tools">
            <button v-for="brush in displayBrushes" @click="setTool(brush)" v-html="brush.label"></button>
            <div class="settings">
              <color-picker v-model="settings.color0" />
              <color-picker v-model="settings.color1" />
              <input type="range"  v-model="settings.brushSize" max=10 step=".5" />
            </div>
          </div>
        </div>
      </div>
    `,

    mounted() 
    {
      new p5(p => {
          this.p = p
					p.frameRate(30)
  				
					p.setup = () => {
						p.createCanvas(WIDTH, HEIGHT)
						p.colorMode(p.HSL)
					  p.ellipseMode(p.RADIUS)
            p.background(0,0,100) // white background to start
            this.activeBrush.setup(p, this.settings)
					}

          // in the global draw function, call the active brush draw
					p.draw = () => {
            this.activeBrush.draw?.(p, this.settings)
          }
          
          // https://p5js.org/examples/input-mouse-functions.html
          p.mouseDragged = () => this.activeBrush.mouseDragged?.(p, this.settings)
          p.mousePressed = () => this.activeBrush.mousePressed?.(p, this.settings)
          p.mouseReleased = () => this.activeBrush.mouseReleased?.(p, this.settings)
        

				}, this.$refs.p5)
    },
    
    computed: 
    {
      displayBrushes() 
      {
        return this.brushes.filter(b => !b.hide)
      }
    },
    
    methods: 
    {
      setTool(brush)
      {
          this.activeBrush = brush
          this.activeBrush.setup?.(this.p)
      }
    },

    data() 
    {
      return {
        brushes,
        activeBrush: brushes.filter(b => !b.hide)[1],
        settings: {
          brushSize: STARTING_BRUSH_SIZE,
          color0: STARTING_COLOR0.slice(),
          color1: STARTING_COLOR1.slice(),
        }
      }
    },

    el: "#app"
    
  })
})