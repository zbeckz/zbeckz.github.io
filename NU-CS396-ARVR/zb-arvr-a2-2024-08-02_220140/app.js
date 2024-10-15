window.onload = function()
{
  // config info for my firebase database
  const firebaseConfig = {
    apiKey: "AIzaSyCeFnWX0tEAHztEwBMxVBPvzJyA_VLaAzc",
    authDomain: "zb-arvr-a2.firebaseapp.com",
    databaseURL: "https://zb-arvr-a2-default-rtdb.firebaseio.com",
    projectId: "zb-arvr-a2",
    storageBucket: "zb-arvr-a2.appspot.com",
    messagingSenderId: "815769724174",
    appId: "1:815769724174:web:794a294fedca059c49635f"
  }

  // try to initilize firebase
	try 
  {
		firebase.initializeApp(firebaseConfig);  
	} 
  catch (err) 
  {
		console.warn("Can't connect to firebase")
	}

	//  make a reference to the database
	const db = firebase.database()
  
  new Vue
  ({
     // which element the vue controls
        el: "#app",

        // the html of the element
        template: 
        `
          <div id="app">
            <h1>🐶 🦴 🐕 &nbsp&nbsp Canine Click &nbsp&nbsp 🐕 🦴 🐶</h1>
            <div id="dataDisplay" class="flex-container">
              <table id="dataTable">
                <tr>
                  <td>Username:</td>
                  <td class="data-entry">{{username}}</td>
                </tr>  
                <tr>
                  <td>Score:</td>
                  <td class="data-entry">{{score}}</td>
                </tr>   
              </table>
              <button @click="Reset">Reset</button>
            </div>
            <div id="gameDisplay" class="flex-container">
              <img id="targetImage" v-bind:src=images[currentTarget] alt="Target Image">
              <img id="clickImage" v-bind:src=images[currentClick] @click="CheckImages" alt="Click Image">
              <div id="leaderboard">
                <table id="leaderboardTable">
					        <caption>Leaderboard</caption>
                  <br>
					        <tr v-for="player in leaderboard">						
						        <td>{{player.username}}</td>
						        <td class="data-entry">{{player.score}}</td>
					        </tr>
				        </table>
              </div>
            </div>
          </div>
        `,

        // the data of the app returned in json format
        data()
        {
          return {
            username: "player0",
            score: 0,
            images: {
              "0": "https://cdn.glitch.global/47371004-817d-48a5-80de-32400b9f36ff/gus0.jpg?v=1681693870301",
              "1": "https://cdn.glitch.global/47371004-817d-48a5-80de-32400b9f36ff/gus1.jpg?v=1681693874548",
              "2": "https://cdn.glitch.global/47371004-817d-48a5-80de-32400b9f36ff/gus4.jpg?v=1681693887102",
              "3": "https://cdn.glitch.global/47371004-817d-48a5-80de-32400b9f36ff/gus5.jpg?v=1681693898384",
              "4": "https://cdn.glitch.global/47371004-817d-48a5-80de-32400b9f36ff/gus6.jpg?v=1681693904443"
            },
            currentTarget: 0,
            currentClick: 4,
            isCooldown: false,
            players: {},
            leaderboard: []
          }
        },

        // run once when the app starts
        mounted()
        {
          // set the picture changing functions
          setInterval(() => this.TargetTick(), 5000)
          setInterval(() => this.ClickTick(), 1000)
          
          // if they have already signed in, set the username to the previous one
          if (localStorage.getItem("username") !== null)
          {
            this.username = localStorage.getItem("username")
          }
          else
          {
            // get username from user
            let name = prompt("Welcome to Canine Click! Your goal is to click the middle photo when it matches the photo on the left. Doing so correctly will give you 5 points, but be careful because an incorrect click resets your score to 0! Please enter your username:", "")
            
            // loop until they put in a valid username
            while (true)
            {
              if (name.length > 10)
              {
                name = prompt("Sorry, that name is too long! Please limit to 10 characters")
              }
              else if (name.includes(".") || name.includes("#") || name.includes("$") || name.includes("[") || name.includes("]"))
              {
                name = prompt("Sorry, invalid character used. Please only use letters, numbers, and dashes")   
              }
              else
              {
                break
              }
            }
            this.username = name
          }
          
          // if they have a score already, set it
          if (!isNaN(parseInt(localStorage.getItem("score"))))
          {
            this.score = parseInt(localStorage.getItem("score"))
          }
          
          // set up players table
          let playersRef = db.ref("players")
          
			    // When we get a new player, add them to the player list
			    playersRef.on("child_added", (snapshot) => {
			      let playerData = snapshot.val()
			      Vue.set(this.players, snapshot.key, playerData)
            this.UpdateLeaderboard()
			    })

			    // When one of the players changes, listen to it
			    playersRef.on("child_changed", (snapshot) => {
				    let playerData = snapshot.val()
				    Vue.set(this.players, snapshot.key, playerData)
            this.UpdateLeaderboard()
			    })	
        },

        // simple methods, like for onclick events
        methods: 
        { 
          // update the leaderboard array based on current player data in the database, sorted
          UpdateLeaderboard()
          {
            let arr = []
            for (let player in this.players)
            {
              arr.push(this.players[player])
            }
            arr.sort((a, b) => b["score"] - a["score"])
            this.leaderboard = arr
          },
          
          // reset local storage so they can change username
          Reset()
          {
            localStorage.clear()
            location.reload()
          },
          
          // update the target image
          TargetTick()
          {
            this.currentTarget = Math.floor(Math.random() * 5)
          },
          
          // update the clickable image
          ClickTick()
          {
            this.currentClick = Math.floor(Math.random() * 5)
            this.isCooldown = false
          },
          
          // check if they clicked correctly
          CheckImages()
          {
            // if still in cooldown, ignore
            if (this.isCooldown) { return }
            
            // if they clicked correctly, yay!
            if (this.currentClick == this.currentTarget)
            {
              this.score += 5
              this.isCooldown = true
            }
            else
            {
              // if they didn't, yikes :(
              this.score = 0
            }
          }
        },

        // values that need to be re computed when another value changes
        computed:
        {
          
        },
        
        // can do stuff when a variable changes
        watch: 
        { 
          isCooldown(newVal, oldVal)
          {
            let obj = document.getElementById("clickImage");
            if (newVal) // now on cooldown
            {
              obj.style.opacity = 0.5
            }
            else
            {
              obj.style.opacity = 1
            }
          },
          
          // update score in the database
          score(newVal, oldVal)
          {
            db.ref(`players/${this.username}`).set({
              username: this.username,
              score: newVal
            })
            localStorage.setItem("username", this.username)
            localStorage.setItem("score", newVal.toString())
          }
        }
  })
}