/* globals Vue, systems, Vector2D, tracery */

(function () {

	let bot = {
		// Start with no messages
		messages: [],
		
		//=========================================================================================
		
		hide: false,
		name: "spookybot", // Lowercase only no spaces! (we reuse this for some Vue stuff)
		description: "a bot that can be in different spooky moods",
		chatControlsHeight: 100, // How big do your controls need to be?
		
		// display names
		userDisplayName: "User",
		botDisplayName: "👻",
    
    // bot response grammar
    grammar: new tracery.Grammar({
      "ghost": ["#ghost_scare# #ghost_talk#"],
      "ghost_scare": ["Boo!", "OoOoooOoo"],
      "ghost_talk": ["Give me your soul!", "Mwahahaha", "You look scared...", "Prepare to be haunted", "I need ectoplasm"],
      
      "vampire": ["#vampire_greeting#blood!"],
      "vampire_greeting": ["", "I want your ", "Give me your ", "I'm going to suck your "],
      
      "zombie": ["#zombie_greeting##zombie_brains#"],
      "zombie_greeting": ["", "Give. Me. ", "Neeeed ", "Arghrhgrh "],
      "zombie_brains": ["brains!", "braaaaains", "your brain!", "your braaain", "brainnnn"],
      
      "skull": ["I miss my body", "Got any spare ribs?", "It's chilly in here", "Lost my soul :/"],

      "spider": ["If you catch any spare bugs, let me know!", "Don't be startled by my 8 legs, just a friendly spider looking for food", "Know any good spots for a web in these parts?", "Been working on my weaving technique, hope it pays off", "The insects are lovely this time of year"],
		}),
    
    
		//=========================================================================================
		// events

		setup() 
    { 
      this.botDisplayName = "👻"
      this.messages.push({
				text: "Hello there! I'm currently feeling like a " + this.botDisplayName + ". Try saying some spooky words and my mood may change",
				from: "bot"
			})
      
      setInterval(() => {
        this.botResponse()
      }, 5000)
      
      let panel = document.getElementsByClassName("panel")[0]
      let url
      switch(this.botDisplayName) {
        case "👻":
          url = "Ghost.png"
          break
        case "🧛":
          url = "Vampire.jpg"
          break
        case "🧟":
          url = "Zombie.png"
          break;
        case "💀":
          url = "Skeleton.png"
          break
        case "🕷️":
          url = "Spider.jpg"
          break
        default:
      }
      panel.style.backgroundImage = `data/${url}`
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
      
      let t = text.toLowerCase()
      if (t.includes("brain") || t.includes("zombie") || t.includes("undead")) 
      { 
        this.botDisplayName = "🧟"
      }
      else if (t.includes("ghost") || t.includes("spirit") || t.includes("haunt") || t.includes("ectoplasm") || t.includes("boo"))
      {
        this.botDisplayName = "👻"
      }
      else if (t.includes("vampire") || t.includes("blood") || t.includes("bat"))
      {
        this.botDisplayName = "🧛"
      }
      else if (t.includes("skull") || t.includes("skeleton") || t.includes("bone"))
      {
        this.botDisplayName = "💀"
      }
      else if (t.includes("spider") || t.includes("bug") || t.includes("insect") || t.includes("web"))
      {
        this.botDisplayName = "🕷️"
      }
		},
    
    botResponse()
    {
      let text
      switch(this.botDisplayName) 
      {
        case "👻":
          text = this.grammar.flatten("#ghost#")
          break
        case "🧛":
          text = this.grammar.flatten("#vampire#")
          break
        case "🧟":
          text = this.grammar.flatten("#zombie#")
          break;
        case "💀":
          text = this.grammar.flatten("#skull#")
          break
        case "🕷️":
          text = this.grammar.flatten("#spider#")
          break
        default:
      }
      
      this.messages.push
      ({
				text: text,
				from: "bot"
			})
    }
	};

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
					p.createCanvas(0,0)
					p.colorMode(p.HSL)
					p.ellipseMode(p.RADIUS)
				}
        
				p.draw = () => 
        {
          // background black
          p.background(0,0,0, 0)
          
          // make sure chats are black because other bot changes it
          let chats = document.getElementsByClassName("message-row-bot");
          for (let i = 0; i < chats.length; i++)
          {
            chats[i].style.backgroundColor = "black"
          }
          chats = document.getElementsByClassName("message-row-user");
          for (let i = 0; i < chats.length; i++)
          {
            chats[i].style.backgroundColor = "black"
          }
          
          // change background image to current mood
          let panel = document.getElementsByClassName("panel")[0]
          let url
          switch(bot.botDisplayName) 
          {
            case "👻":
              url = "Ghost.png"
              break
            case "🧛":
              url = "Vampire.jpg"
              break
            case "🧟":
              url = "Zombie.png"
              break;
            case "💀":
              url = "Skeleton.png"
              break
            case "🕷️":
              url = "Spider.jpg"
              break
            default:
          }
          panel.style.backgroundImage = `url(data/${url})`
          
          
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
      <br>
      <button @click="randomMood">Random Mood</button>
		</div>`,

		methods: 
    {
			sendText() 
      {
				// Send the current text to the bot
				this.bot.input({text:this.inputText, from: "user"})
				// Then clear it
				this.inputText = ""
			},
      
      randomMood()
      {
        bot.botDisplayName = bot.p.random(["👻", "🧛", "🧟", "💀", "🕷️"])
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
