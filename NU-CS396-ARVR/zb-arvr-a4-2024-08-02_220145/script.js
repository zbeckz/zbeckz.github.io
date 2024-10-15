//==============================================
// Query parameters, useful for adding in variables based on a url
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
const PARAMS = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

window.onload = function()
{
  // config info for my firebase database
  const firebaseConfig = {
    apiKey: "AIzaSyAmSh-EqdWtXCPSXLm0FI7ciaJQRaqwpC8",
    authDomain: "zb-arvr-a4.firebaseapp.com",
    projectId: "zb-arvr-a4",
    storageBucket: "zb-arvr-a4.appspot.com",
    messagingSenderId: "537114459891",
    appId: "1:537114459891:web:4b83b9f8bac1a5477a8186"
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
            <h1>🗺 🔎 🏛 &nbsp&nbsp Campus Clue &nbsp&nbsp 🏛 🔍 🗺</h1>
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
              <button @click="UpdateLocation">Update Current Location</button>
              <button @click="NewRound">New Round</button>
            </div>
            <div id="gameDisplay" class="flex-container">
              <p> Distance To Secret Location: {{distanceToTarget}}<p>
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
            players: {},
            leaderboard: [],
            currentCoords: [], // longitude, latitude
            targetCoords: [], // longitude, latitude
            motionTracker: new MotionTracker()
          }
        },

        // run once when the app starts
        mounted()
        { 
          if (localStorage.getItem("username") !== null)
          {
            this.username = localStorage.getItem("username")
          }
          else
          {
            // get username from user
            let name = prompt("Welcome to Campus Clue! When you start a new round, a random location on Northwestern's campus will be selected but not shown to you. You will be told how far away you are from said location at any given point, and your goal is to move to the secret spot.\n\nDEBUGGING: Add \"?mode=debug\" to the end of the url to enable debugging mode. This changes the game so that when you click the button to update your location, you can input a latitude and longitude of your choice, as well as displaying the target location in the console.\n\nPlease enter your username:", "")
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
          
          localStorage.setItem("username", this.username)
          
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
          
          this.NewRound()
        },

        // simple methods, like for onclick events
        methods: 
        { 
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
          
          NewRound()
          {
            let long = Math.random() * 0.009 - 87.681 // -87.681 to -87.672
            let lat = Math.random() * 0.013 + 42.048 // 42.048 to 42.061
            this.targetCoords = [long, lat]
            if (PARAMS["mode"] === "debug")
            {
              console.log("Target Position:")
              console.log(`Latitude: ${lat}, Longitude: ${long}`);
            }
          },
          
          UpdateLocation()
          {
            if (PARAMS["mode"] === "debug")
            {
              let lat = prompt("Please input a latitude number", "0.00")
              let long = prompt("Please input a longitude number", "0.00")
              this.currentCoords = [long, lat]
              console.log("Current Position:")
              console.log(`Latitude: ${lat}, Longitude: ${long}`);
            }
            else
            {
              this.motionTracker.startTracking()
              this.currentCoords = this.motionTracker.location
            }
            

          }
        },

        // values that need to be re computed when another value changes
        computed:
        {
          distanceToTarget()
          {
            let dist = getDistanceBetweenCoordinates(this.currentCoords, this.targetCoords) * 0.1
            if (dist < 5)
            {
              alert("Congratulations! You found the location! Click new round to start again")
              this.score++
            }
            return dist
          }
        },
        
        // can do stuff when a variable changes
        watch: 
        { 
          score(newVal, oldVal)
          {
            db.ref(`players/${this.username}`).set({
              username: this.username,
              score: newVal
            })

            localStorage.setItem("score", newVal.toString())
          }
        }
  })
}