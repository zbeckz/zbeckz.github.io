Assignment 4: Swarms
==========================

Make 4 particle systems.

Use the information in the lectures or  to get ideas for new ways for particles to work.

When done, submit a <15 second **`yourname_a4.gif`** to Canvas, showing your particle systems, as well as a tgz/zip containing your filled out **readme.md and source code**

**Always keep your console open and run your code frequently! This assignment is HARD to debug**

**Inspiration and education:**

* How [flowfields work](https://tylerxhobbs.com/essays/2020/flow-fields), now with an [interactive version](https://observablehq.com/@esperanc/flow-fields) (and [even more flowfield tutorials](https://www.youtube.com/watch?v=na7LuZsW2UM&t=153s))
* [More Coding Train](https://www.youtube.com/watch?v=krRpZFU6rSI) on particles 
* [ALife simulation](https://www.redblobgames.com/x/2234-hunar-alife-simulation/#friction=50&exponent=100&counts=200,450,300,0&matrix=15,-20,30,0,-10,-2,10,0,-15,25,-40,0,0,0,0,0)
* Generating particles with [an image](https://www.youtube.com/watch?v=_gz8FMduwRc)
* Non-force-based motion for [cyberpunk effects](https://www.youtube.com/watch?v=_w4tNafprAY)
* Matrix-style [text rain](https://www.youtube.com/watch?v=S1TQCi9axzg)
* Particle [fireworks](https://www.youtube.com/watch?v=CKeyIbT3vXI)


Speedrun
========

*   Remix [https://glitch.com/edit/#!/galaxykate-a4](https://glitch.com/edit/#!/galaxykate-a4)
*   Make 4 particle systems
* You may choose to make them related (space particles) or part of a scene (duck pond), or not
* For each new system, 
  * Make a new "system-somename.js" file (use one of the provided examples) and import it in the HTML file and give it a name (all lowercase, no spaces, we need it for some automatic stuff in Vue)
  * This will automatically make a button appear in the left column of controls (resize the window if it doesnt)
  * Have some tuning values that you want to control for this system
    * e.g, colors, speeds, or any number you want to experiment with
  * Add controls for those tuning values in the Vue component (each system will have its own) at the bottom.  Notice the only thing that is different from normal HTML in vue is `v-model.number="system.noiseScale"` which allows us to react dynamically to the sliders or color pickers 
  * Make any helper functions you like (see the wind particles for an example)
  * Set up custom forces (and possibly custom behavior, reactions to mouse clicks, etc) for this particle system
  * Draw this particle *and* provide some debug drawing functionality to help yourself debug it.
* In your particles systems, have
  * one that keeps track of its trail or spawns new "child" particles
  * one that needs to track interactions between multiple particles (boids, collisions, springs, etc)
  * one that is interactive, and responds to the user in some way (click to add new particles, chase the mouse, etc). Controls and draggable particles are built-in already and don't count
  
There's a bit more "plumbing" in this one.  I'm trying to keep a balance between giving you lots of helpful tooling, and making code that you can still understand.  (new this week: particle systems that remember if they were turned on or off)

Rubric
======

*   2pts: have readme.md
*   1pts x 4: tools
*   1pts: one has trail or subparticls
*   1pts: one has interactions between particles
*   1pts: one is interactive
*   1pts: GIF (or screenshots) submitted to Canvas

Tools to use
============

There's a helfpul Vector2D library that I made.  You'll do a lot of adding vectors, getting the distance between them, calculating angles, etc.  `drawArrow` is very useful!


- `static polar(r, theta)`: Creates a new `Vector2D` instance using polar coordinates (radius `r` and angle `theta`).

- `static sub(pt0, pt1)`: Computes the vector subtraction of two `Vector2D` instances `pt0` and `pt1` and returns a new vector.

- `static edgePoint(...)`: Creates a new `Vector2D` instance representing a point on an edge or along a vector with optional offsets.

- `static distance(v1, v2)`: Calculates the Euclidean distance between two `Vector2D` instances `v1` and `v2`.

- `constructor(x=0, y=0)`: Initializes a `Vector2D` instance with optional `x` and `y` values, defaulting to (0, 0).

- `clone()`: Creates a new `Vector2D` instance that is a copy of the current instance.

- `get angle`: Returns the angle in radians of the vector.

- `get magnitude`: Returns the magnitude (length) of the vector.

- `getDistanceTo(v)`: Calculates the distance to another `Vector2D` instance `v`.

- `getAngleTo(v)`: Calculates the angle between the current vector and another `Vector2D` instance `v`.

- `getNormal()`: Returns a new `Vector2D` instance that is the normalized (unit) vector perpendicular to the current vector.

- `setTo(...)`: Sets the `x` and `y` values of the vector based on various argument types.

- `setToEdgePoint(...)`: Sets the vector to a point on an edge, optionally offset from that edge.

- `setToPolar(r, theta)`: Sets the vector based on polar coordinates.

- `setToLerp(v0, v1, pct)`: Sets the vector to a linear interpolation between two vectors `v0` and `v1` based on a percentage `pct`.

- `setToAddMultiple(...)`: Sets the vector to the sum of multiple vectors and scalars.

- `setToMultiple(m, v)`: Sets the vector to the product of a scalar `m` and another vector `v`.

- `setToAdd(...)`: Sets the vector to the sum of multiple vectors.

- `setToOffset(pt0, pt1)`: Sets the vector to the difference between two points.

- `constrain(min, max)`: Constrains the magnitude of the vector to be within a specified range.

- `wrap(x0, y0, x1, y1)`: Wraps the vector around a specified rectangular region.

- `lerpTo(pt, pct)`: Linearly interpolates the vector towards another point by a given percentage.

- `normalize()`: Normalizes the vector, making it a unit vector.

- `div(m)`: Divides the vector by a scalar `m`.

- `mult(m)`: Multiplies the vector by a scalar `m`.

- `addPolar(r, theta)`: Adds a polar coordinate offset to the vector.

- `addMultiple(...)`: Adds multiple vectors and scalars to the current vector.

- `add(...points)`: Adds one or more vectors to the current vector.

- `draw(p, radius=10)`: Draws a circle at the vector's coordinates using a specified graphics context.

- `drawArrow(p, {v, multiplyLength=1, normalOffset=0,  startOffset=0, endOffset=0, color})`: Draws an arrow from the vector's position using various parameters.
