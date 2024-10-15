/**
 * Starter code
 * 
 */
/* globals Vue, p5 */
// GLOBAL VALUES, CHANGE IF YOU WANT


const bots = []

document.addEventListener("DOMContentLoaded", (event) => {
	console.log("DOM fully loaded and parsed");

	// We have all the elements, get one with id "app"

	new Vue({
		template: `<div id="app" :class="{['bot-' + activeBot.name]:true}">
			<div class="columns"> 
			<div class="tools column">
				<div>
					<select v-model="activeBot">
						<option v-for="bot in bots.filter(b=>!b.hide)" :value="bot">{{bot.name}}</option>
					</select>
				</div>
				<chat-window :bot="activeBot"/>
				
				 <div class="chat-controls-holder" :style="{maxHeight: activeBot.chatControlsHeight + 'px'}">
   	         		<component :is="'input-' + activeBot.name" :bot="activeBot" />
           		</div>
			</div>

			<div class="column">
				<component :is="'panel-' + activeBot.name" :bot="activeBot" class="panel" />
			</div>
			</div>
		</div>`,
		mounted() {

			this.activeBot.setup()
			



			
		},

		watch: {
			activeBot() {
				localStorage.setItem("lastBot", this.activeBot.name)
				this.activeBot.setup()
			}
		},

	
		data() {
			let lastBot = localStorage.getItem("lastBot")
							// Use the last-used space, or the first if we don't have a record
			let activeBot = bots.find(s => s.name === lastBot) 
			|| bots.filter(s => !s.hide)[0]

			return {

							// Stuff that we pass to all fxns
				settings: {
					p: undefined,
					deltaTime:0.1,
					time:0
				},
				
				activeBot,
				isPaused: false,
				bots,
			}
		}, 
		el: "#app"

	})
})