# A2

Animated GIFs

### Your glitch handle (if applicable)

zb22

### Your glitch page url (or other URL)

https://zb-cs327-a2.glitch.me/

### Describe the 6 gifs you made, and what tools each used

1. *Self Portrait* involves halloween themed emojis randomly appearing on a black background and gradually fading to black. It uses p.text and p.random
2. *MOD (not pizza)* uses the mathematical modulo operation in conjunction with position on screen to color in pixels. It randomly chooses a divisor for the operation and has multiple "layers" drawing at once
3. *Solar System* uses random generation to determine planet colors, starting location, orbit direction, and orbit speed. Polar math controls the orbit. Stars are randomly generated and use perlin noise to simulate twinkling
4. *Neon (Loop)* uses a sin curve along with increasingly smaller and lighter colored circles to create a neon appearing brush
5. *Billiard Balls* uses an array of json objects that represent billiard balls, which contain methods to detect collision with each other and the walls
6. *Spiral* involves polar mathematics with a changing r and theta value to draw a looping spiral


## What P5 method or technique did you enjoy using the most? What was interesting to you about it?

I enjoyed using perlin noise to create twinkling stars. It was so interesting to see what features of the stars (circles) would look like when adding perlin noise to them (diameter, lightness)

## Did you find any P5 functionality that wasn't covered in class?
 
Nope!

## How did you get your looping gif to loop smoothly? What was hard or easy about that techinque?
 
I put a loopLength field in the sketch object so the gif saved that many frames (I chose 30). I had a variable controlling motion that started at 0, increased by 1 every frame, and reset to 0 when it reached 30. The visual I had looping was color, so I used modulo and a calculated step size to ensure after 30 steps it would be at the same starting point


## Link a few GIFs you found inspirational here

None

### Does the self-portrait "look like you"? What is missing? What worked well?

It doesn't "look like me" in a physical sense. I'm notoriously bad at drawing faces in real life and didn't think I'd fare much better in code. That being said, it is October, and halloween season is upon us. My family always puts up a ton of decorations and it was a great bonding experience, so the halloween theme represents something that is a big part of my identity

### What is one new skill that you gained during this project?

p5!


### Glitch handles of people in class you got help from, and their help

N/A

### Assets you got from online and why you have permission to include them

N/A

### Online help, including ChatGPT 

I looked at https://wykhuh.github.io/shiffman-p5-tutorials/, working code of Daniel Shiffman's p5 tutorials, to see how to implement things like drawing many versions of the same object and collision detection
