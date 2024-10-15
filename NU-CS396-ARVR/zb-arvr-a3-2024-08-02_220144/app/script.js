
const USER_FIELDS = ["name", "uid", "emoji", "color"]
const APP_NAME = "Dog Park"


//==============================================
// Query parameters, useful for adding in variables based on a url
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
const PARAMS = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

console.log(`Mode: '${PARAMS["mode"]}'  Name: '${PARAMS["name"]}'`)


//==============================================

window.onload = function(e) { 

	let authData = {
		uid: undefined
	}

	
	console.log("CONNECTING TO FIREBASE")
	
	// Your web app's Firebase configuration
	// It's ok for this to be public! Its visible in any web page
	const firebaseConfig = {
		apiKey: "AIzaSyDSBaj1KVNUhOkDbSqBbAg2eKoRAr9xfEM",
		authDomain: "cs396-arvr-sp23-social.firebaseapp.com",
		projectId: "cs396-arvr-sp23-social",
		storageBucket: "cs396-arvr-sp23-social.appspot.com",
		messagingSenderId: "126561591561",
		appId: "1:126561591561:web:f6de0cd16b0db9183533d8"
	};

	try {
		// Initialize Firebase
		firebase.initializeApp(firebaseConfig);
		console.log("FIREBASE INIT!")
		
	} catch (err) {
		console.warn("Can't connect to firebase")
	}

	// Create the database
	const db = firebase.database()

	let userList = new UserList(db)

	// Is there an override for uid
	if (PARAMS["uid"] !== null) {
		console.log( PARAMS["uid"])
		authData.uid = PARAMS["uid"]
		userList.addOrGetUser(authData.uid, true)
	} else {
		// Do authentication
		// Ignore if we have a test uid

		firebase.auth().onAuthStateChanged((newAuthData) => {

			if (newAuthData) {
				// User is signed in, see docs for a list of available properties
				// https://firebase.google.com/docs/reference/js/firebase.User
				
				// Save this user ID
				authData.uid = newAuthData.uid;
				console.log("Authenticated anonymously as", authData.uid)
				userList.addOrGetUser(authData.uid)
			} else {
				authData.uid = window.prompt("Please enter a username:", "DefaultUser")
        while (authData.uid !== null && authData.uid.length == 0)
        {
          authData.uid = window.prompt("Please include at least 1 character", "Pleaseee")
        }
			}
		});
	}


	// Create a new Vue object
	new Vue({
		template: `

		<!-- DEBUG VIEW -->
			<div id="app" v-if="mode=='debug'"> 
				<!-- user controls -->
				<div  class="section">
					AUTH ID: <span class="uid">{{authData.uid}}</span>

					<div v-if="user">
						<input v-model="user.name" />
					</div>
					<button @click="user.pushChangesToServer()">SAVE</button>
				</div>
				<!-- test message -->
				<div class="section">
					Send a test message
					<input v-model="editMessage.text" @keyup.enter="postEditMessage" />
					<button @click="postEditMessage">send message</button>
				</div>

				<div class="columns">

					<!-- user column -->
					<div class="column">
						
						<table>
							<tr><td>UID</td><td>EMOJI</td><td>NAME</td><td>COLOR</td>
							<tr v-for="user in userList.users">
								<td><span class="uid">{{user.uid}}</span></td>
								<td>{{user.emoji}}</td>
								<td>{{user.name}}</td>
								<td>{{user.color}}</td>
								<td @click="user.remove()">🗑️</td>
							</tr>

						</table>
					</div>

					<!-- message column -->
					<div class="column">
						
						<table>
							<tr><td>FROM</td><td>TO</td><td>TEXT</td><td>DATA</td>
							<tr v-for="message in messages">
								<td><span class="uid">{{message.from}}</span></td>
								<td><span class="uid">{{message.to}}</span></td>
								<td>{{message.text}}</td>
								<td>{{message.data}}</td>
								<td @click="deleteMessage(message)">🗑️</td>
							</tr>

						</table>
					</div>
				</div>

			</div>
		</div>

		<!-- REGULAR VIEW: DOGS -->
    <div id="app" v-else class="dog-app"> 
      <div id="background"></div>
      <div v-for="message in filterMessages" class="message-dog" :style="messageStyle(message)">
        <div class="message-user">User: {{message.from}}</div>
        <div class="message-text">Message: {{message.text}}</div>
        <div class="message-pets">Pets: {{message.pets}}</div>
        <!-- Actual Image URL (Creative Commons): https://www.pxfuel.com/en/free-photo-xghcd -->
        <img @click="petMessage(message)" src="https://cdn.glitch.global/a7ebc29c-63b3-41eb-bd97-78bd6840d9aa/GusTransparent.png?v=1682546511376" />
      </div>        
      <div class="post-ui">
        <button @click="makeDogPost">Post!</button>
      </div>
		</div>`,

		computed: {
      
			user() {
				// Get ...my data!
				// Which user has the same ID as us, if logged in?
				return this.userList.getUserByUID(this.authData.uid)
			},
      
      filterMessages() {
        // Which messages do I want?
        let newMessages = this.messages.filter(message => {
          return message.hasOwnProperty("x") && message.hasOwnProperty("y") && message.hasOwnProperty("pets") && message.hasOwnProperty("text") && (message.text.includes("Bark!") || message.text === "Woof!" || message.text === "Arf!")
        })
        return newMessages
      }
		},

		methods: {
      messageStyle(message) {
        console.log(message)
        // Use the message data
          return {
            position: "absolute",
            left: message.x + "px",
            top: message.y + "px",
          }
      },
      
      makeDogPost() {
        let t = "Placeholder"
        let ran = Math.random()
        if (ran < 1/3) {t = "Bark!"}
        else if (ran < 2/3) {t = "Woof!"}
        else { t = "Arf!"}
        this.post({
          text: t,
          x: Math.random()*1000,
          y: Math.random()*500,
          pets: 0
        })
      },
      
			postEditMessage() {
				// Post (then clear) the edited message
				this.post(this.editMessage)
				this.editMessage.text = ""
			},

			post(message, pet=false) {
				console.log("sendMessage", message)
				// Send if from myself unless I am spoofing
				message.timestamp = Date.now()
				message.app = this.appName	
        if (!pet) {message.from = this.authData.uid}
				console.log(`Posted (${message.app}:${message.from}) '${message.text}'`)

				if (message.data) {
					console.log("....with data ", message.data)
				}

				let msgRef = db.ref("messages")
				let newRef = msgRef.push()
				message.uid = newRef.key
				newRef.set(message)
			},

			deleteMessage(msg) {
				// Delete a message
				let ref = db.ref("messages/" + msg.uid)
				ref.set(null)
			},
      
      petMessage(msg) {
        let ref = db.ref("messages/" + msg.uid)
        ref.set(null)
        console.log("FROMMMMMMMM:" + msg.from)
        this.post({
          from: msg.from,
          uid: msg.uid,
          text: msg.text,
          x: msg.x,
          y: msg.y,
          pets: msg.pets + 1
        }, true)
      },

			subscribeToMessages() {

				// Subscribe to messages
				let msgRef = db.ref("messages")
				msgRef.on("child_added", (snapshot) => {
					let uid = snapshot.key

					let msg = snapshot.val()
					
					// Add this to the list
					this.messages.push(msg)	
				})

				msgRef.on("child_removed", (snapshot) => {
					// Received notice that this message has been removed
					let index = this.messages.findIndex(msg=>msg.uid===snapshot.key)
					console.log("remove message at", index)
					this.messages.splice(index, 1)
				})
			}
		},


		mounted() {
			this.subscribeToMessages()
		},



		// Data for our application
		data: {
			mode: PARAMS["mode"],

			appName: APP_NAME,

			authData: authData,
			userList: userList,
			messages: [],

			editMessage: 
      {
				to: null,
				text: "Hello",
			}
		},

		// Which element Vue controls
		el: "#app",
	})
}