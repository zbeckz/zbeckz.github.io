/* globals Vue, systems, Vector2D, tracery */

(function () {

	let bot = {
		// Start with no messages
		messages: [],
		
		//=========================================================================================
		
		hide: false,
		name: "wavebot", // Lowercase only no spaces! (we reuse this for some Vue stuff)
		description: "a bot that makes waveforms when it or the user say something",
		chatControlsHeight: 100, // How big do your controls need to be?
		
		// display names
		userDisplayName: "User",
		botDisplayName: "Bot",

		// waveform data
		userColor: [255, 100, 50],
    userAmp: 5,
    userFreq: 0.1,
		botColor: [0, 100, 50],
    botAmp: 5,
    botFreq: 0.1,
    
    // bot response grammar
    grammar: new tracery.Grammar(
    {
	    "bot_response": ["#amazement# #that# a #description# waveform!"],
      "that": ["that's", "that is"],
      "description": ["#adj# #adj# #adj#", "#adj# #adj#", "#adj#"],
      "adj": ["super", "cool", "awesome", "fantastic", "radical", "amazing", "wonderful", "great"],
      "amazement": ["Wow!", "Woah!","Wooooow!!", "Woahhh!"]
		}),
    
		//=========================================================================================
		// events

		setup() 
    {
      let text = "Tell me anything! :)"
      setTimeout(() => 
      {
        this.messages.push
        ({
          text: text,
          from: "bot"
        })

        this.waveTextBot(this.p, text)
      }, 500)
		
		},

		// If you need more input data, add it here, and pass it in
		input({text,from, otherDataHere}) 
    {      
      // send message in chat
			this.messages.push
      ({
				text,
				from
			})
      
      // show the waves of the text
      this.waveTextUser(this.p, text)
		},
    
    botRespond(p)
    {
      let text = this.grammar.flatten("#bot_response#")
      
      this.messages.push
      ({
        text: text,
        from: "bot"
      })

      this.waveTextBot(p, text)
    },
    
    waveTextBot(p, text)
    {
      // loop through every word in message
      let words = text.split(" ");
      for (let i = 0; i < words.length; i++)
      {
        let wordLength = words[i].length
        
        // transition amplitude up and downbased on word length
        for (let j = 0; j < 150; j++)
        {
          // up
          setTimeout(() => 
          {
            this.botAmp = p.map(j, 0, 150, 5, wordLength*25);
          }, 305*i + j);
          
          // down
          setTimeout(() => 
          {
            this.botAmp = p.map(j, 0, 150, 5, wordLength*25);
          }, 305*i + 300 - j);
        }
      }
    },
    
    waveTextUser(p, text)
    {
      // loop through every word in message
      let words = text.split(" ");
      for (let i = 0; i < words.length; i++)
      {
        let wordLength = words[i].length
        
        // transition amplitude up and downbased on word length
        for (let j = 0; j < 150; j++)
        {
          // up
          setTimeout(() => 
          {
            this.userAmp = p.map(j, 0, 150, 5, wordLength*25);
          }, 305*i + j);
          
          // down
          setTimeout(() => 
          {
            this.userAmp = p.map(j, 0, 150, 5, wordLength*25);
          }, 305*i + 300 - j);
        }
      }
      
      // have bot respond
      setTimeout(() => 
      {
        this.botRespond(this.p)
      }, 305 * words.length + 1000);
    }
	};

	const WIDTH = 600;
	const HEIGHT = 400;

	Vue.component(`panel-${bot.name}`, 
  {
		template: `<div ref="p5"></div>`,

		mounted() 
    {
			// CREATE A PROCESSING INSTANCE IN THE PANEL
			new p5(p => 
      {
				this.bot.p = p
			 
				p.setup = () => 
        {
					p.createCanvas(WIDTH,HEIGHT)
					p.colorMode(p.HSL)
					p.ellipseMode(p.RADIUS)
          p.strokeWeight(2)
				}
        
				p.draw = () => 
        {
          // make sure chat colors are updated
          let chats = document.getElementsByClassName("message-row-bot");
          for (let i = 0; i < chats.length; i++)
          {
            chats[i].style.backgroundColor = 
              `hsl(${bot.botColor[0]}, ${bot.botColor[1]}%, ${bot.botColor[2]}%)`;
          }
          
          chats = document.getElementsByClassName("message-row-user");
          for (let i = 0; i < chats.length; i++)
          {
            chats[i].style.backgroundColor = 
              `hsl(${bot.userColor[0]}, ${bot.userColor[1]}%, ${bot.userColor[2]}%)`;
          }
          
          // get time for later
          let t = p.millis() * 0.01
          
          // draw white background
          p.background(0,0,100)
          
          // draw bot's waveform
          p.stroke(bot.botColor)
          p.beginShape()
          for (let x = 50; x < 275; x++)
          {
            let amp
            x > 80 && x < 245 ? amp = bot.botAmp : amp = 5
            p.vertex(x, amp*(p.noise(bot.botFreq*x + t, 100)-0.5) + 200)
          }
          p.endShape()
          
          // draw user's waveform
          p.stroke(bot.userColor)
          p.beginShape()
          for (let x = 325; x < 550; x++)
          {
            let amp
            x > 355 && x < 520 ? amp = bot.userAmp : amp = 5
            p.vertex(x, amp*(p.noise(bot.userFreq*x + t, 1)-0.5) + 200)
          }
          p.endShape()
        }


			}, this.$refs.p5)
		},

		props: {"bot":{required:true, type:Object}} // We need to have bot

	})
  
	Vue.component(`input-${bot.name}`, 
  {
		template: 
    `<div>
			<!-- Basic chat control, press enter or the button to input -->
			<input @keyup.enter="sendText" v-model="inputText" />
			<button @click="sendText">send</button>

			<div>
				bot color:<color-picker v-model="bot.botColor" />
				human color:<color-picker v-model="bot.userColor" />
			</div>
		</div>`,

		methods: 
    {
			sendText() 
      {
				// Send the current text to the bot
				this.bot.input({text:this.inputText, from: "user"})
				// Then clear it
				this.inputText = ""
			}
		},

		// Custom data for these controls
		data() 
    {
			return { inputText: "", }
		},
		props: {"bot":{required:true, type:Object}} // We need to have bot
	})

	bots.push(bot);
})();
