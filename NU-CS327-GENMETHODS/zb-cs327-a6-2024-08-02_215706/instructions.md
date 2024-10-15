# Assignment 6: Chatbots


## Speedrun

* Remix [https://glitch.com/edit/#!/galaxykate-a6](https://glitch.com/edit/#!/galaxykate-a6)
* Create a HuggingFace account and get your access token (optional but recommended!)
* Create at least two new bots by copying `bot-drawing` or `bot-empty.js` and adding them to your HTML
* For each bot:
  * Think about what your bot's character is. It's not an everything-bot, its got a particular viewpoint, and things it wants to say or hear.
  * There are two Vue components for you to modify:
    * a panel, where you can have a p5 canvas, or any other HTML stuff
    * a chat input section, where you might have a place for the user to type, but also other controls
    * Both have access to `bot` which is your current bot, with all the data and methods in it
    * For example, the bot has a `input({text,from,etc}` method that you can call whenever you want to pass some user input to the bot.
    * You can also make other bot methods if you want.  Do you have a p5 instance? Maybe you want to draw the bot animating, by making a draw method and calling it in your P5 instance
  * Your bot should have a way to **listen**, to **think**, and to **speak** ("speaking" may just be graphical or sound based if you want!) 
    * It will probably do that when you get user input, but you can also give it its own interval function in the setup (e.g. emptybot's counting)
  * Each bot should be able to respond to at least three different things. These might be different keywords that could appear in the user's input, or different ways of responding if the bot is in one of three moods, etc. 
  * Give each bot at least a bit of CSS styling. You can change it in `bot.css`, if you prefix the element selector with the bot's name, e.g `.bot-drawingbot .chat-messages-holder`, then that style will only apply when that bot is active

* **Complexifiers:**
* At least one of your bots should use a Tracery grammar to generate text
* Between your two bots, you should have at least 2 other "complicated features" in the way that your bot listens, thinks, or speaks:
  * Play sounds
  * Have a P5 canvas and use it to show the bot's state or other interactions
  * Have multiple "states" that it moves through (ie, track what mood the bot is in, and change how it responds) and represent that on the panel or in chat somehow
  * Makes requests to HuggingFace API (see io.js)

Your bots should be different enough from the sample code (definitely from emptybot!) that you need to significantly change the panel or the input (and probably both).  Vue is hard to debug. Go slow and change **one thing** at a time before testing to make sure it still works.



*Bot ideas:*

  * A bot that draws random tarot cards (https://github.com/dariusk/corpora/blob/master/data/divination/tarot_interpretations.json) in response to your questions, and then says something ominous
  * A bot that speaks only in the musical instruments from last week's example
  * A bot that speaks in P5 graphical text, not in the chat window https://www.galaxykate.com/apps/mima-origins/ (bot I was commissioned to make for a Swedish ambient band's album release, has sound)
  * A bot that doesn't take natural language input, but only emoji buttons as input, ie "😂" => "Oh, did something funny happen? Tell me about it!"
  * A kitten that moves between states of hungry, sleeping, or playful, and responds accordingly
  * A bot that uses your A5 latent space or A4 particles, and changes its dimensions or forces depending on its mood
  * Drawing bot, but it uses your brushes, and responds to which one you used
  * Coffeepotbot that makes you a drink and draws it (badly)

## Rubric


*   1pts: have readme.md filled out
*   2x2pts: Two bots
*   1pt: Tracery grammar
*   1pt: Complicated thing #1
*   1pt: Complicated thing #2
*   1pt: Bots have different visual style
*   1pts: GIF (or screenshots) submitted to Canvas


