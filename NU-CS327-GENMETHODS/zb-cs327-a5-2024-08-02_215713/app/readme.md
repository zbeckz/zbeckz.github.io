# A5: Parametric Spaces

### Your Glitch(etc) link

https://zb-cs327-a5.glitch.me



### Which is your best space?

trees (space 1)


------------

## Space 1: Trees


### What kinds of things does this space make?:

It makes tree type structures with branching


### What are each of the dimensions for this, and what do they control

1. _leafColor_: Controls the default color for a leaf
2. _leafColorVariance_: Controls the amount of variance from the default color for leafs
3. _leafSizeVariance_: Controls the amount of variance from the default leaf size
4. _leftOdds_: Controls the odds of a left branch forming at a junction
5. _rightOdds_: Controls the odds of a right branch forming at a junction
6. _depth_: Controls the amount of branches that can form before a leaf is made
7. _randomSeed_: Controls the random seed set before drawing (so that continuity exists for dna)
8. _angle_: Controls the angle at which branches sprout off at


### What expected kinds of these things are *not* in this space? (ie, what might someone expect this to generate, but its not part of your system)

Someone might expect branches to sprout at varying angles, but in this space it is always the same


### Is this space completely continuous, or does it have discontinuities (ie, number of flower petals jumping between integers, or if statements)

It has discontinuities. The depth is rounded to an integer, and branches can spawn and despawn when changing sliders


### What are your landmarks, and why did you pick those?

My landmarks are a colorful tree, grid pattern, more natural looking tree, a singular curve, and hexagonal pattern.

These showcase the variety of appearance this space can produce, from things that appear to be natural looking trees to 
very rigid grid patterns

------------

## Space 2: Squiggles


### What kinds of things does this space make?:

It makes squiggles (sin curves with perlin noise)


### What are each of the dimensions for this, and what do they control

1. _amplitude_: Controls the amplitude of the underlying sin wave
2. _frequency_: Controls the frequency of the underlying sin save
3. _noise_: Controls the amplitude of the underlying perlin noise
4. _color_: Controls the default color
5. _thickness_: Controls the brush thickness
6. _colorVariance_: Controls the amount of variance in color from the default

### What expected kinds of these things are *not* in this space? (ie, what might someone expect this to generate, but its not part of your system)

One might expect the squiggles to look more like they are drawn, not generated


### Is this space completely continuous, or does it have discontinuities (ie, number of flower petals jumping between integers, or if statements)

It is continuous


### What are your landmarks, and why did you pick those?

My landmarks are a pure sine wave, pure perlin noise, a line bouncing up and down, 
a sin wave that jiggles with perlin noise, a perlin noise wave that moves with sin, and an ocean wave.

These showcase some pure ends of the squiggle spectrum, some in the middle, and some outliers

------------

## Space 3: Pastas


### What kinds of things does this space make?:

Pasta noodles with a sauce

### What are each of the dimensions for this, and what do they control

1. _bendFrequency_: Controls the frequency of bends in the noodle
2. _bendHeight_: Controls the amplitude of bends in the noodle
3. _noodleHue_: Controls the hue of the noodle color
4. _noodleSaturation_: Controls the saturation of the noodle color
5. _sauceHue_: Controls the hue of the sauce color
6. _sauceLightness_: Controls the lightness of the sauce color


### What expected kinds of these things are *not* in this space? (ie, what might someone expect this to generate, but its not part of your system)

One might expect to control the amount of noodles, amount of sauce, or toppings


### Is this space completely continuous, or does it have discontinuities (ie, number of flower petals jumping between integers, or if statements)

It is continuous


### What are your landmarks, and why did you pick those?

My landmarks are mac and cheese, fettucine alfredo, fusilli pesto, cavatappi vodka sauce, and spinach pasta with red sauce

These are intended to look like common dishes or real noodle shapes with real sauces. I am colorblind, and though I did get some
help from peers picking the colors for the landmarks, they are certainly not perfect!

------------

### What is one new skill that you gained during this project?

Making branching structures!

### Glitch handles of people in class you got help from, and their help, (or help you gave!)

_@alvaroreynoso2024_: helped me pick out pasta landmark colors because he has full color vision 

### Assets you got from online and why you have permission to include them

N/A

### Online help, including ChatGPT 

N/A