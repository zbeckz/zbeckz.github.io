# Assignment 8: Digital Masks

**NOTE: WE HAVE A PROBLEM WITH A FEW STUDENTS TURNING IN LIGHTLY MODIFIED EXAMPLE CODE**
Even if you have to do a very fast assignment, you still need to significantly modify the example code to get to a new piece of art.  Make sure to create a new file, change the name, change the controls, and make sure that yours is visually distinct from what came before! 


## Speedrun

* Make two masks.  For each mask
	* Like the other assignments, make a copy and import your mask-yourmaskname.js to the HTML
	* Make at least three controls for each mask (if you use the ones provided, you need to add three more)
	* Each mask needs to have *secondary motion*, motion that is not just limited to the points on the face but is *off the face* and *responds to the faces motion*
	* Make sure to use the hand points and have an appropriate background!
* Use at least two of the techniques from A3 onward (one in each mask, or both in one, etc), for example:
	* Drawing tools
	* Tracking persistent curves 
	* Oscilloscope sound generation
	* Speech-to-text/text-to-speech
	* FFTs
	* Beat detection
	* Tracery grammars
	* API calls
	* JSON data
	* Particle systems (these go great with body tracking!)
		* Springs
		* Flowfields
		* Spawning new particles with lifespans
		* Agents (boids or braitenberg vehicles)
	* Voronoi/Delaunay algorithm

## Rubric

*  8pts: has two masks
	* have 3 controls
	* have secondary motion
	* use a technique from A3-A7
	* use hand positions and some form of background
*  1pts: have readme.md filled out
*  1pts: GIFs/recordings of each mask submitted to Canvas (you can use a tool like Licecap to easily record gifs - there are many Gif recorders for every OS)


# Tools
 -- KATE IN PROGRESS --

Face methods: 

* forEachSide( (side, index) => {}) Do something for each side of the face
* drawDebugData(p)
* drawContour({ p, contour, contour1, image = undefined, imageScale = 1,   useCurveVertices = false,
    onlyVertices = false}
    Given a 