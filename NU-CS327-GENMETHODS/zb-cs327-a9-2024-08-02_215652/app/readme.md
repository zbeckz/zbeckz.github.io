# A9: Gestures

### Your Glitch link

https://zb-cs327-a9.glitch.me


--------
## Teachable machine

## In Teachable machine, that data is not preprocessed into vector positions.  It has to learn on raw pixels. How long did it take to train the network with the Teachable Machine pixel-based approach?

1 minute


## How did the quality of predictions compare between them?

The quality of teachable machine predictions was great when I tried it


## How did the quality of predictions on Teachable Machine change when you changed the background or lighting?

Seemed to vary a little but work pretty well


-----------
## Your network


## Describe the experience you designed

I designed a hand based calculator experience. The gestures I attempted to train didn't work exactly, but the model learned enough that it is possible to consistently get the desired gestures detected if you know exactly what to do, which I will explain the next section

There are 4 gestures, corresponding to +, -, \*, and /, for the 4 major mathematical operations. There are two text input boxes in the controls, expecting numbers. Text will appear on screen for the equation and result of the gesture operation with the numbers you input

For example, the default number inputs are 12 and 4. If you gesture "+", it will display "12 + 4 = 16"

## For each hand or face gesture it responds to, what does it do?

"+": To recognize an addition symbol, hold your hand in a fist on the RIGHT side of the display screen. This changes the operator to plus and updates the result

"-": To recognize a subtraction symbol, do a thumbs up on the RIGHT side of the display screen. Your thumb must be pointing directly upward. This changes the operator to minus and updates the result

"\*": To recognize a multiplication symbol, hold your hand in any gesture on the LEFT side of the display screen. This changes the operator to multiply and updates the result

"/": To recognize a division symbol, hold your hand with all fingers extended (like you are waving hello) on the RIGHT side of the display screen. Your hand must be oriented directly upward. This changes the operator to divide and updates the result



## How are you visualizing or changing graphics with the gesture?

The operation that is classified is written above each finger (idea taken directly from the emoji example). The main work I did was displaying the equation and result based on your input and gesture as text on the canvas

## What gestures mentioned in the Lingthusiasm podcast are related to your gestures? Include terminology that they used

To be brutally honest, I did not watch the lingthusiasm podcast. I fell behind in some of my classes in this end of quarter push and it fell off of my radar. My apologies, if you'd like to deduct a point for that I completely underestand and take full responsibility for that


## Which gestures did it guess wrong and when? What could have improved that training data?

I tried to train the model to understand 4 distinct gestures in any position on the screen. It instead learned some gestures specific to which side of the screen the hand is on as well as orientation of the hand. It is consistent in what it learned, though, so I made it work

I definitely think more training data would be good. 20 frames is not much to cover all hand positions and orientations thoroughly. For the scope of this training data, though, I should've done a better job switching which side of the screen my hand was on


## In A9, the data is preprocessed by the MediaPipe model into vector positions. How long did it take to train your network?  How big was your model's weights file? 

A few minutes (I did the long train). My .bin file is 3KB.

##  Look up how long GPT3 took to train and how many parameters (or how big the weights are). How did yours compare, and why?

GPT3 took 34 days to train (wow). It has 175 billion parameters, 800GB in storage.

That is 266 MILLION times larger than mine, according to storage space. That is crazy, but not that surprising. My model is used for 1 simple input type with 1 output. GPT can take in so much variety of data and output basically anything

## What are the steps of machine learning?

1. Gather training data
2. Train some model with said data
3. Use the trained model to predict
4. Probably repeat!

-----------


### What is one new skill that you gained during this project?

Utilizing machine learning libraries

### Glitch handles of people in class you got help from, and their help, (or help you gave!)

N/A

### Assets you got from online and why you have permission to include them

N/A

### Online help, including ChatGPT 

N/A