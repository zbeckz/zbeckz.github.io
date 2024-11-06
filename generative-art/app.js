/**
 * Starter code
 * 
 */
/* globals Vue, STARTING_COLOR0, STARTING_COLOR1, STARTING_BRUSH_SIZE, WIDTH, HEIGHT, p5 */
// GLOBAL VALUES, CHANGE IF YOU WANT
const WIDTH = innerWidth * 0.65;
const HEIGHT = innerHeight * 0.65;
const DEFAULT_FRAME_RATE = 30;
const DEFAULT_LOOP_LENGTH_IN_FRAMES = 100;
let latentSpaces = []

function drawBackground(p, {}) {
	// TODO, draw any background you want here each frame
	p.background(50)
}


document.addEventListener("DOMContentLoaded", (event) => {

	// We have all the elements, get one with id "app"

	new Vue({
		template: `<div id="app" >
			<div class="columns"> 
			<div class="tools column">

				<!-- select which space -->
				<select v-model="selectedSpace" >
					<option v-for="space in activeSpaces" :value="space">{{space.name}}</option>
				</select>

				<!-- ----------------------------------- -->
				<!-- controls for the POPULATION -->

				<div class="animation-container">
					<!-- animation buttons -->
					<button v-for="mode in modes" @click="animationMode=mode">{{mode}}</button>
				</div>

				<div>
					<!-- Mutation and randomness -->
					<label class="slider-label">Mutation rate:</label><input type="range" v-model.number="mutationRate" min=".01" max=".5" step=".01" />
				</div>

				
				<div>
					<div><label>population count:{{populationCount}}</label></div>
					<input type="range" v-model.number="populationCount" min="1" max="20"/>
				</div>

				<!-- ----------------------------------- -->
				<!-- sliders for the current INDIVIDUAL -->
				<div class="panel">
					<h3>Individual #{{selectedIndividualIndex}}'s DNA</h3>
					<button @click="copyToClipboard">copy current DNA to clipboard📋</button>

					<!-- LANDMARKS -->
					<div class="panel landmarks">
						Set to:
						<button 
							@click="setFromLandmark(landmark)"
							v-for="landmark in selectedSpace.landmarks">
							{{landmark.name}}
						</button>
					</div>

					<!-- show all the sliders for this DNA -->
					<table>
					<tr v-for="dimName, index in selectedSpace.dimensions">
						<td class="slider-label"><label>{{dimName}}</label></td>
						<input type="range" v-model.number="selectedIndividual.dna[index]" min="0" max="1" step=".01" style="accent-color: #F55050;" />
						<td class="slider-label">{{selectedIndividual.dna[index].toFixed(2)}}</td>
						
					</tr>
					</table>
				</div>
			</div>

			<div class="canvas-holder column">
				<div ref="p5" />
			</div>
			</div>
		</div>`,
		mounted() {

			// Create the P5 element
			new p5(p => {
				// We have a new "p" object representing the sketch
				
				// Save p to the Vue element, so we have access in other methods
				this.settings.p = p

				p.frameRate(DEFAULT_FRAME_RATE)

				p.setup = () => {
					// Initialize time
					this.settings.time = p.millis()*.001
					p.createCanvas(WIDTH,HEIGHT)
					p.colorMode(p.HSL)
          p.rectMode(p.CORNER)
					p.ellipseMode(p.CENTER)

					// Add mousePos and mouseVelocity
					p.mousePos = new Vector2D()
					p.mouseVelocity = new Vector2D()

					this.startSpace()

					// Set the starting base positions for each
					this.calculateBasePositions()
			
				}

				p.mouseClicked = () => {
					let mousePos = new Vector2D(p.mouseX, p.mouseY)

					if (mousePos.isWithin(0, 0, p.width, p.height)) {
					
						// Get closest and select it
						let closest = mousePos.getClosest(this.activePopulation, {
							range: 1000,
							getPosition: (ind)=>{
								return ind.basePosition
							} 
						})
						if (closest) {
							let index = this.population.indexOf(closest)
							this.selectedIndividualIndex = index
							this.stopAnimating()
						}

					}
						
				}

				p.doubleClicked = () => {
					let mousePos = new Vector2D(p.mouseX, p.mouseY)
					// EVOLVE 
					if (mousePos.isWithin(0, 0, p.width, p.height)) {
							evolveNewPopulationFrom({
							parent:this.selectedIndividual,
							population:this.population,
							mutationRate: this.mutationRate
						})
					}
				}


				p.draw = () => {
					// Setup the current time
					this.settings.time = p.millis()*.001
					let dt = p.constrain(p.deltaTime*.001, .01, 1) // dont' simulate more than a second at a time
					this.settings.deltaTime = dt

					// Play the animation
					switch(this.animationMode) {
					case "wander":
						this.activePopulation.forEach(ind => {
							ind.setDNAToWander(this.settings.time)
						})
						
						break;
					}
					
					// Calculate current mouse pos and velocity
					p.mousePos.setTo(p.mouseX, p.mouseY)
					p.mouseVelocity.lerpTo({x:p.movedX/dt,y:p.movedY/dt}, .2)

					let toDraw = this.activePopulation.toReversed()
					// Draw the individuals in reverse order

					// Updates (if separate from draw)
					this.selectedSpace.update?.(this.settings)
					toDraw.forEach((individual) => this.selectedSpace.updateIndividual?.(individual, this.settings))
					
					// Draw space, then individuals
					this.selectedSpace.draw?.(this.settings)
					
					
					toDraw.forEach((individual) => {
						p.noStroke()

						if (individual === this.selectedIndividual) {
							p.strokeWeight(4)
							p.stroke(0)
						}
						p.fill(0, 0, 0, .3)
						p.ellipse(...individual.basePosition, 40, 20)
						p.noStroke()
						
						// Draw all individuals!
						this.selectedSpace.drawIndividual(individual, this.settings)
						
					})
					
				}


			}, this.$refs.p5)
		},

		watch: {
			populationCount() {
				this.calculateBasePositions()
			},
			selectedSpace() {
				this.startSpace()
			}
		},
		computed: {
			selectedIndividual() {
				return this.population[this.selectedIndividualIndex]
			},
			activeSpaces() {
				return this.latentSpaces.filter(s => !s.hide)
			},
			currentDNALength() {
				return this.selectedSpace.dimensions.length
			},
			activePopulation() {
				// We can ignore any we aren't useing
				return this.population.slice(0, this.populationCount)
			}	
		},

		methods: {
			startSpace() {
				localStorage.setItem("lastSpace", this.selectedSpace.name )
				this.selectedSpace.setup?.(this.settings)
				this.population.forEach(individual => this.selectedSpace.setupIndividual?.(individual, this.settings))
			},
			stopAnimating() {
				this.animationMode = "none"
			},
			calculateBasePositions() {

				// Goofy math to figure out positions
				let cols = 3
				if (this.populationCount==1)
					cols = 1
				if (this.populationCount>4)
					cols = 5

				let rows = Math.ceil(this.populationCount/cols)
				
				for (var i = 0; i < this.populationCount; i++) {
					let ind = this.population[i]
					let pct = i/(this.populationCount -1 ) 
					if (isNaN(pct))
						pct = .5
					
					let border = 165 - this.populationCount
				

					let x = cols==1?.5:(i%cols)/(cols -1)
					
					let y = Math.floor(i/cols)
					x += (y%rows)*.1 - (rows-1)*.04
					let x2 = map(x, 0, 1, border, this.settings.p.width - border)
					let y2 =  this.settings.p.height - 50 - 50*y
					
					ind.baseScale = 2 - (.4*(y**.4) + .01*this.populationCount)
					ind.basePosition.setTo(x2, y2)
				
				}
				
			},

			setFromLandmark(landmark) {
				// Set the current individual to the landmark
				this.selectedIndividual.loadFromLandmark(landmark)
				this.stopAnimating()
			},
			copyToClipboard() {
				let dnaText = this.selectedIndividual.dna.slice(0,this.currentDNALength).map(s => s.toFixed(2))
				navigator.clipboard.writeText(dnaText);


			}
		},
		data() {
			let lastSpace = localStorage.getItem("lastSpace")
							// Use the last-used space, or the first if we don't have a record
			let selectedSpace = latentSpaces.find(s => s.name === lastSpace) 
			|| latentSpaces.filter(s => !s.hide)[0]

			let populationCount = 5
			return {

				modes:["music(later)", "wander"],
				animationMode: "none",
				mutationRate: .1,

							// Stuff that we pass to all fxns
				settings: {
					p: undefined,
					deltaTime:0.1,
					time:0
				},

				population: createRandomPopulation(20),
				populationCount,
				selectedIndividualIndex: 0,
				

				latentSpaces,
				selectedSpace,

				isPaused: false,
			}
		}, 
		el: "#app"

	})
})