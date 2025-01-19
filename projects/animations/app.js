document.addEventListener("DOMContentLoaded", () => {
	new Vue({
		template: 
		`
			<div id="app">
    			<button id="pauseAllButton" @click="pauseAll">Pause all ⏸️</button>
				<main>
					<section class="sketch-holder" :style="holderStyle">
						<div v-for="(sketch, index) in activeSketches" class="sketch">
							<h4>{{sketch.name}}</h4>
							<div :ref="'canvas' + index" />
							<p class="description">{{sketch.description}}</p>
							<button @click="saveSketch(sketch)">💾</button>
							<button @click="pauseSketch(sketch)">⏸️</button>
						</div>
					</section>
				</main>
			</div>
		`,

		methods: 
		{
			saveSketch(sketch) 
			{
				sketch.p.saveGif(sketch.name + ".gif", sketch.loopLength || DEFAULT_LOOP_LENGTH_IN_FRAMES, {units:"frames"})
			},
      
			pauseAll()
			{
				this.activeSketches.forEach((sketch) => {
					sketch.pause = true 
				})
			},
      
			pauseSketch(sketch)
			{
				sketch.pause = !sketch.pause
			}
		},

		computed: 
		{
			activeSketches() 
			{
				return this.sketches.filter(s => s.show)
			},

			holderStyle() 
			{ 
				return {
					"grid-template-columns": `repeat(auto-fill, minmax(${WIDTH}px, 1fr))`
				}
			}
		},

		mounted() 
		{
			this.activeSketches.forEach((sketch,index) => {
				new p5(p => {
					p.frameRate(30)
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

		data() 
		{
			return {sketches}
		}, 
		
		el: "#app"
	})
});
