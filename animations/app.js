document.addEventListener("DOMContentLoaded", (event) => {

  // We have all the elements, get one with id "app"

	new Vue({
		template: `<div id="app">
 
    <button id="pauseAllButton" @click="pauseAll">Pause all ⏸️</button>

		<main>

		<section class="sketch-holder" :style="holderStyle">
		
		<!-- make a div with title and description for each sketch -->
		<div v-for="(sketch, index) in activeSketches" class="sketch">

			<!-- Title for this sketch -->
			<h4>{{sketch.name}}</h4>

			<!-- the P5 instance goes in here -->
			<div :ref="'canvas' + index" />

			<!-- Description for this sketch -->
			<p class="description">{{sketch.description}}</p>

			<!-- Press this button to save the sketch -->
			<button @click="saveSketch(sketch)">💾</button>
      
      <!-- Pause button for sketches -->
      <button @click="pauseSketch(sketch)">⏸️</button>

		</div>

		</section>


		</main>



		</div>`,
		methods: {
			saveSketch(sketch) {
				sketch.p.saveGif(sketch.name + ".gif", sketch.loopLength || DEFAULT_LOOP_LENGTH_IN_FRAMES, {units:"frames"})
			},
      
      pauseAll()
      {
        this.activeSketches.forEach((sketch,index) => {
           sketch.pause = true 
        })
      },
      
      pauseSketch(sketch)
      {
        if (sketch.pause)
        {
          sketch.pause = false;
        }
        else
        {
          sketch.pause = true;
        }
      }
		},
		computed: {
			activeSketches() {
				return this.sketches.filter(s => s.show)
			},

			holderStyle() {
				return {
					"grid-template-columns": `repeat(auto-fill, minmax(${WIDTH}px, 1fr))`
				}
			}
		},

		mounted() {
			
			// For each sketch, make a p5 instance
			this.activeSketches.forEach((sketch,index) => {
			
				new p5(p => {
					p.frameRate(30)

  				// We have a new "p" object representing the sketch
					sketch.p = p

					p.setup = () => {
						let dim = [WIDTH, HEIGHT]
						p.createCanvas(...dim)

						p.colorMode(p.HSL)

						sketch.setup?.(p)

					}

					p.draw = () => sketch.draw(p)

				}, this.$refs["canvas" + index][0])
			})
		},

		data() {
			return {sketches}
		}, 
		el: "#app"
	})
});
