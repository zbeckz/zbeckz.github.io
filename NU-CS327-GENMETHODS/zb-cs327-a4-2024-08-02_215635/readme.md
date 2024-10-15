# A4: Swarms

### Your Glitch link

https://zb-cs327-a4.glitch.me


### Which systems behaved like you expected? Which ones surprised you? In which ones did your initial idea evolve into something different?

I had to tinker a lot with scale factors for forces to behave in interesting ways. Gravity, for example, sometimes was too strong or not strong enough


### Describe your 1st system. What forces does it use? What is its emergent behavior? What debug draw info and controls did you add?
Planets. A few stars and a bunch of planets randomly spawn. Planets are attracted to stars via gravitational force
The debug draws velocity and force vectors. Users can click to spawn a new planet at the mouse location, the initial
specs of which are governed by the control panel


### Describe your 2nd system. What forces does it use? What is its emergent behavior? What debug draw info and controls did you add?
Bubbles. Random force exists at each point generated via perlin noise. This force field is shown by debug mode
There is also a force between bubbles - either attracting or repelling, depending on the slider in the controls


### Describe your 3rd system. What forces does it use? What is its emergent behavior? What debug draw info and controls did you add?
Fireworks. Fireworks spawn at a rate chosen in the control panel. They are affected by gravity. When they explode, they
create smaller child particles that are unaffected by gravity, but disappear after a given time. This countdown is displayed in the debug info


### Describe your 4th system. What forces does it use? What is its emergent behavior? What debug draw info and controls did you add?
Snakes. Based on the popular "Snake" game. Each snake has a force applied to it based on where the closest food is
The control panel has a slider to determine how quickly snakes can turn towards food. Debug shows an arrow pointing in the direction
of the closest food for each snake


### Which system has one particle uses particle-to-particle interaction? Explain how.

Bubbles: when two bubbles come close enough together, they merge into one big new one

### Which system has particles that leave a trail or creates new particles

Snakes: each snake has a trail it draws

### Which system interacts with user behavior, and how?

Bubbles: you can click on bubbles to pop them and spawn new ones


### What is one new skill that you gained during this project?

Applying forces to particles

### Glitch handles of people in class you got help from, and their help, (or help you gave!)

N/A

### Assets you got from online and why you have permission to include them

N/A

### Online help, including ChatGPT 

N/A