// Chat widget

// Define the ChatWindow component

/** 
 * Chat widget
 * Controls the scrolling behavior of the window, 
 * which is annoying for new users to implement
 **/

Vue.component('chat-message', {
	/**
	 * Make a nice message, with optional html 
	 * and custom behavior for different bots
	 **/

	template: `
		<component :is="'message-' + bot.name" v-if="hasCustomMessageComponent" /> 
       
        <div v-else :class="classes">
        	
        <!-- Who the message is from -->
        	 <div class="message-from" v-html="fromText"></div>
           
           <!-- What the message is -->
           <div  class="message-text" v-html="message.text" />
           	
        </div>

    `,
    computed: {

    	fromText() {
    		if (this.message.from === "bot") {
    			return this.bot.botDisplayName || "bot"
    		}
    		if (this.message.from === "user") {
    			return this.bot.userDisplayName || "user"
    		}
    	},
    	hasCustomMessageComponent() {
    		// console.log(this.bot.name, this.$options.components)
    		// return this.$options.components[`message-${this.bot.name}`]
    		return false
    	},
    	classes() {
    		// Get the classes for this message
    		return {
    			"message": true,
    			"message-row":true,
    			["message-row-" + this.message.from]:true
    		}
    	}
    },
	props: ["message", "bot"]
})

Vue.component('chat-window', {
    template: `
        <div class="chat-window" ref="chatWindow">
        	  <div class="chat-messages-holder">
            	<chat-message v-for="message in messages" :message="message" :bot="bot" />
   	        </div>
        </div>
    `,

    watch: {
    	messages() {
    		this.scrollToBottom()
    	}
    },

    methods: {
    	scrollToBottom() {
           this.$nextTick(() => {
                const chatWindow = this.$refs.chatWindow;
                const lastMessage = chatWindow.querySelector('.message:last-child');
                if (lastMessage) {
                    lastMessage.scrollIntoView({ behavior: 'smooth' });
                }
            });
        },
    },

    
    props: ["bot"],

    computed: {
    	messages() {
    		return this.bot.messages
    	}
    }
});