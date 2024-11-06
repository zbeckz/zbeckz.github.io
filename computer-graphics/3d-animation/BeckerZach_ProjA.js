
// Vertex shader program
var VSHADER_SOURCE = 
  'uniform mat4 u_ModelMatrix;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE = 
//  '#ifdef GL_ES\n' +					
  'precision mediump float;\n' +
//  '#endif GL_ES\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

// ---------------------- Easy-Access Global Variables ----------------------------------

var g_Constant = 0.0;
var constantStep = 0.05;

// Mouse stuff
var g_isDrag = false;		// mouse-drag: true when user holds down mouse button
var g_xMclik = 0.0;			// last mouse button-down position (in CVV coords)
var g_yMclik = 0.0;   
var g_xMdragTot = 0.0;	// total (accumulated) mouse-drag amounts (in CVV coords).
var g_yMdragTot = 0.0;

// tetra size
var g_tetraSize;

// tetra swaying angles
var g_tetraBottomAngle;
var g_tetraMiddleAngle;
var g_tetraTopAngle;

// tetra swaying steps
var g_tetraBottomStep;
var g_tetraMiddleStep;
var g_tetraTopStep;

// tetra position stuff
var g_tetraOrbitAngle;
var g_tetraOrbitSpeed;
var g_tetraOrbitRadius;

// Rotation steps in degrees per sec
var g_rubiksStep;       
var g_sideStep1;
var g_sideStep2;
var g_tetraStep;

// current rotation angles
var g_rubiksCubeAngle;   
var g_sideAngle1;        
var g_sideAngle2; 
var g_tetraAngle; 

// rotation brakes. 1 = go, 0 = stop
var g_cubeBrake;
var g_sideBrake1;
var g_sideBrake2;

// webgl stuff
var g_canvas
var gl;                   // WebGL's rendering context; value set in main()
var g_nVerts;             // # of vertices in VBO; value set in main()
var g_modelMatrix;		  // 4x4 matrix in JS; sets 'uniform' in GPU
var g_modelLoc;		      // GPU location where this uniform is stored.


function main()
{

    // keyboard event handler
    window.addEventListener("keydown", myKeyDown, false);

    // mouse event handlers
    window.addEventListener("mousedown", myMouseDown); 
    window.addEventListener("mousemove", myMouseMove); 
	window.addEventListener("mouseup", myMouseUp);	
    
    // Retrieve <canvas> element we created in the HTML file:
    g_canvas = document.getElementById('HTML5_canvas');

    // Get rendering context from our HTML-5 canvas needed for WebGL use.
    gl = getWebGLContext(g_canvas);
    if (!gl)
    {
        console.log('Failed to get the WebGL rendering context from g_canvas');
        return;
    }

    // Specify the color for clearing <canvas>
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Create a Vertex Buffer Object (VBO) in the GPU, and then fill it with
    // g_nVerts vertices.  (builds a float32array in JS, copies contents to GPU)
    g_nVerts = initVertexBuffer();
    if (g_nVerts < 0) 
    {
        console.log('Failed to set the vertex information');
        return;
    }

    // NEW!! Enable 3D depth-test when drawing: don't over-draw at any pixel 
    gl.enable(gl.DEPTH_TEST); 

    // Init tetra swaying angles
    g_tetraBottomAngle = 0.0;
    g_tetraMiddleAngle = 0.0;
    g_tetraTopAngle = 0.0;

    // Init tetra swaying steps;
    g_tetraBottomStep = 68.0;
    g_tetraMiddleStep = 68.0;
    g_tetraTopStep = 68.0;

    // Init tetra size
    g_tetraSize = 0.18;
    
    // Init tetra orbit stuff
    g_tetraOrbitAngle = 0.0;
    g_tetraOrbitSpeed = 1.0;
    g_tetraOrbitRadius = 0.7;

    // Init angle steps
    g_rubiksStep = 45.0;
    g_sideStep1 = 45.0;
    g_sideStep2 = -45.0;
    g_tetraStep = 22.0;
    
    // Init current rotation angle values in JavaScript
    g_rubiksCubeAngle = 0.0;
    g_sideAngle1 = 0.0;
    g_sideAngle2 = 0.0;
    g_tetraAngle = 22.0;

    // init angle brakes (1 means go, 0 means stop)
    g_cubeBrake = 1.0;
    g_sideBrake1 = 1.0;
    g_sideBrake2 = 1.0;

    // Get handle to graphics system's storage location of u_ModelMatrix
    g_modelLoc = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!g_modelLoc) 
    { 
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }
    
    // Create a local version of our model matrix in JavaScript 
    g_modelMatrix = new Matrix4();
    
    // Transfer modelMatrix values to the u_ModelMatrix variable in the GPU
    gl.uniformMatrix4fv(g_modelLoc, false, g_modelMatrix.elements);
    
    // DRAW STUFF!
    var tick = function() 
    {
        calculateAngles();                                                                    // update angles
        g_tetraOrbitRadius = document.getElementById("OrbitRadiusSlider").value * 0.01;       // update tetrahedron orbit radius
        drawAll();                                                                            // Draw shapes
        requestAnimationFrame(tick, g_canvas);                                                // Request that the browser re-draw the webpage
    };
    
    // AFTER that, call the function (infinite loop)
    tick();							
}     

function initVertexBuffer() 
{
    var c30 = Math.sqrt(0.75);					// == cos(30deg) == sqrt(3) / 2
	var sq2	= Math.sqrt(2.0);						 

    var colorShapes = new Float32Array
    ([
    // Vertex coordinates(x,y,z,w) and color (R,G,B)
    /* 
      Cube Nodes  ('node': a 3D location where we specify 1 or more vertices)
     -1.0, -1.0, -1.0, 1.0	// Node 0
     -1.0,  1.0, -1.0, 1.0	// Node 1
      1.0,  1.0, -1.0, 1.0	// Node 2
      1.0, -1.0, -1.0, 1.0	// Node 3
      
      1.0,  1.0,  1.0, 1.0	// Node 4
     -1.0,  1.0,  1.0, 1.0	// Node 5
     -1.0, -1.0,  1.0, 1.0	// Node 6
      1.0, -1.0,  1.0, 1.0	// Node 7
    */
      // +x face: ORANGE
      1.0, -1.0, -1.0, 1.0,		1.0, 0.6, 0.0,	// Node 3
      1.0,  1.0, -1.0, 1.0,		1.0, 0.6, 0.0,	// Node 2
      1.0,  1.0,  1.0, 1.0,	  1.0, 0.6, 0.0,  // Node 4
      
      1.0,  1.0,  1.0, 1.0,	  1.0, 0.6, 0.0,	// Node 4
      1.0, -1.0,  1.0, 1.0,	  1.0, 0.6, 0.0,	// Node 7
      1.0, -1.0, -1.0, 1.0,	  1.0, 0.6, 0.0,	// Node 3

      // +y face: BLUE
     -1.0,  1.0, -1.0, 1.0,	  0.0, 0.0, 1.0,	// Node 1
     -1.0,  1.0,  1.0, 1.0,	  0.0, 0.0, 1.0,	// Node 5
      1.0,  1.0,  1.0, 1.0,	  0.0, 0.0, 1.0,	// Node 4

      1.0,  1.0,  1.0, 1.0,	  0.0, 0.0, 1.0,	// Node 4
      1.0,  1.0, -1.0, 1.0,	  0.0, 0.0, 1.0,	// Node 2 
     -1.0,  1.0, -1.0, 1.0,	  0.0, 0.0, 1.0,	// Node 1

      // +z face: WHITE
     -1.0,  1.0,  1.0, 1.0,	  1.0, 1.0, 1.0,	// Node 5
     -1.0, -1.0,  1.0, 1.0,	  1.0, 1.0, 1.0,	// Node 6
      1.0, -1.0,  1.0, 1.0,	  1.0, 1.0, 1.0,	// Node 7

      1.0, -1.0,  1.0, 1.0,	  1.0, 1.0, 1.0,	// Node 7
      1.0,  1.0,  1.0, 1.0,	  1.0, 1.0, 1.0,	// Node 4
     -1.0,  1.0,  1.0, 1.0,	  1.0, 1.0, 1.0,	// Node 5

      // -x face: RED
     -1.0, -1.0,  1.0, 1.0,	  1.0, 0.0, 0.0,	// Node 6	
     -1.0,  1.0,  1.0, 1.0,	  1.0, 0.0, 0.0,	// Node 5 
     -1.0,  1.0, -1.0, 1.0,	  1.0, 0.0, 0.0,	// Node 1
      
     -1.0,  1.0, -1.0, 1.0,	  1.0, 0.0, 0.0,	// Node 1
     -1.0, -1.0, -1.0, 1.0,	  1.0, 0.0, 0.0,	// Node 0  
     -1.0, -1.0,  1.0, 1.0,	  1.0, 0.0, 0.0,	// Node 6  
      
      // -y face: GREEN
      1.0, -1.0, -1.0, 1.0,	  0.0, 0.6, 0.0,	// Node 3
      1.0, -1.0,  1.0, 1.0,	  0.0, 0.6, 0.0,	// Node 7
     -1.0, -1.0,  1.0, 1.0,	  0.0, 0.6, 0.0,	// Node 6

     -1.0, -1.0,  1.0, 1.0,	  0.0, 0.6, 0.0,	// Node 6
     -1.0, -1.0, -1.0, 1.0,	  0.0, 0.6, 0.0,	// Node 0
      1.0, -1.0, -1.0, 1.0,	  0.0, 0.6, 0.0,	// Node 3

      // -z face: YELLOW
      1.0,  1.0, -1.0, 1.0,	  1.0, 1.0, 0.0,	// Node 2
      1.0, -1.0, -1.0, 1.0,	  1.0, 1.0, 0.0,	// Node 3
     -1.0, -1.0, -1.0, 1.0,	  1.0, 1.0, 0.0,	// Node 0		

     -1.0, -1.0, -1.0, 1.0,	  1.0, 1.0, 0.0,	// Node 0
     -1.0,  1.0, -1.0, 1.0,	  1.0, 1.0, 0.0,	// Node 1
      1.0,  1.0, -1.0, 1.0,	  1.0, 1.0, 0.0,	// Node 2

      // TETRAHEDRON:

      // Face 0: (left side)
      0.0,	0.0, sq2, 1.0,		1.0,  1.0,	1.0,	
      c30, -0.5, 0.0, 1.0, 		0.0,  0.0,  1.0, 	
      0.0,  1.0, 0.0, 1.0,  	1.0,  0.0,  0.0,	
			
      // Face 1: (right side)
	  0.0,  0.0, sq2, 1.0,		1.0,  1.0,	1.0,	
      0.0,  1.0, 0.0, 1.0,  	1.0,  0.0,  0.0,	
     -c30, -0.5, 0.0, 1.0, 		0.0,  1.0,  0.0, 	
    	
      // Face 2: (lower side)
	  0.0,	0.0, sq2, 1.0,		1.0,  1.0,	1.0,	 
     -c30, -0.5, 0.0, 1.0, 		0.0,  1.0,  0.0, 	
      c30, -0.5, 0.0, 1.0, 		0.0,  0.0,  1.0, 	 
     	
      // Face 3: (base side)  
     -c30, -0.5, -0.0, 1.0, 	0.0,  1.0,  0.0, 	
      0.0,  1.0, -0.0, 1.0,  	1.0,  0.0,  0.0,	
      c30, -0.5, -0.0, 1.0, 	0.0,  0.0,  1.0,      
    ]);
    
    var nn = 48;
    
    // Create a buffer object
    var shapeBufferHandle = gl.createBuffer();  
    if (!shapeBufferHandle)
    {
        console.log('Failed to create the shape buffer object');
        return false;
    }

    // Bind the the buffer object to target:
    gl.bindBuffer(gl.ARRAY_BUFFER, shapeBufferHandle);
    
    // Transfer data from Javascript array colorShapes to Graphics system VBO
    // (Use sparingly--may be slow if you transfer large shapes stored in files)
    gl.bufferData(gl.ARRAY_BUFFER, colorShapes, gl.STATIC_DRAW);

    var FSIZE = colorShapes.BYTES_PER_ELEMENT; // how many bytes per stored value?
    
    // Connect a VBO Attribute to Shaders------------------------------------------
    //Get GPU's handle for our Vertex Shader's position-input variable: 
    var a_PositionLoc = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_PositionLoc < 0) 
    {
        console.log('Failed to get attribute storage location of a_Position');
        return -1;
    }
    
    // Use handle to specify how to Vertex Shader retrieves position data from VBO:
    gl.vertexAttribPointer(
        a_PositionLoc, 	  // choose Vertex Shader attribute to fill with data
                    4, 		// how many values? 1,2,3 or 4.  (we're using x,y,z,w)
             gl.FLOAT, 		// data type for each value: usually gl.FLOAT
                false, 		// did we supply fixed-point data AND it needs normalizing?
            FSIZE * 7, 		// Stride -- how many bytes used to store each vertex?
                          // (x,y,z,w, r,g,b) * bytes/value
                    0);		// Offset -- now many bytes from START of buffer to the
                          // value we will actually use?
    
                          gl.enableVertexAttribArray(a_PositionLoc);  
                      
    // Get graphics system's handle for our Vertex Shader's color-input variable;
    var a_ColorLoc = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_ColorLoc < 0) 
    {
        console.log('Failed to get the attribute storage location of a_Color');
        return -1;
    }
    
    // Use handle to specify how Vertex Shader retrieves color data from our VBO:
    gl.vertexAttribPointer(
      a_ColorLoc, 			  // choose Vertex Shader attribute to fill with data
               3, 				// how many values? 1,2,3 or 4. (we're using R,G,B)
        gl.FLOAT, 			  // data type for each value: usually gl.FLOAT
           false, 				// did we supply fixed-point data AND it needs normalizing?
       FSIZE * 7, 			  // Stride -- how many bytes used to store each vertex?
                          // (x,y,z,w, r,g,b) * bytes/value
       FSIZE * 4);			  // Offset -- how many bytes from START of buffer to the
                          // value we will actually use?  Need to skip over x,y,z,w 									
    
    gl.enableVertexAttribArray(a_ColorLoc);  

    // UNBIND the buffer object: we have filled the VBO & connected its attributes
    // to our shader, so no more modifications needed.
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return nn;
}


function drawAll() 
{
    // Clear <canvas>  colors AND the depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // draw rubiks cube
    g_modelMatrix.setIdentity();  
    g_modelMatrix.scale(0.07, 0.07, 0.07);
    g_modelMatrix.rotate(-14, 1, 0, 0)
    g_modelMatrix.rotate(-1 * g_rubiksCubeAngle, 0, 1, 0);
	g_modelMatrix.rotate(g_yMdragTot * 120, 0, 0, 1);
    drawRubiksCube()

    // draw tetrahedron chain
    g_modelMatrix.setTranslate(g_tetraOrbitRadius * Math.cos(g_tetraOrbitAngle), g_tetraOrbitRadius * Math.sin(g_tetraOrbitAngle), 0.0); 
    g_modelMatrix.scale(g_tetraSize, g_tetraSize, g_tetraSize);
    g_modelMatrix.rotate(g_tetraAngle, 0, 1, 0);  // spin around y axis
    drawTetraChain();
}

function drawTetraChain()
{
    pushMatrix(g_modelMatrix);
    
    // draw bottom tetrahedron
    g_modelMatrix.rotate(g_tetraBottomAngle, 0, 0, 1);
    drawTetra();
    
    // next, smaller tetrahedron in middle
    g_modelMatrix.translate(0, 1, -0.25);
    g_modelMatrix.scale(0.6, 0.6, 0.6);
    g_modelMatrix.rotate(g_tetraMiddleAngle, 0, 0, 1);
    drawTetra();

    // third, smaller tetrahedron on very top
    g_modelMatrix.translate(0, 1, -0.25);
    g_modelMatrix.scale(0.6, 0.6, 0.6);
    g_modelMatrix.rotate(g_tetraTopAngle, 0, 0, 1);
    drawTetra();

    // you get the drill :)
    g_modelMatrix.translate(0, 1, -0.25);
    g_modelMatrix.scale(0.6, 0.6, 0.6);
    g_modelMatrix.rotate(g_tetraTopAngle, 0, 0, 1);
    drawTetra();

    g_modelMatrix.translate(0, 1, -0.25);
    g_modelMatrix.scale(0.6, 0.6, 0.6);
    g_modelMatrix.rotate(g_tetraTopAngle, 0, 0, 1);
    drawTetra();
    
    g_modelMatrix = popMatrix();
}

// draws a rubik's cube by doing three cube grids stacked along the z axis
// draws at location of center cube of center grid
function drawRubiksCube()
{
    pushMatrix(g_modelMatrix);

    // center grid
    drawCubeGrid();

    // grid behind
    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(0, 0, 2.22);
    g_modelMatrix.rotate(g_sideAngle1, 0, 0, 1);
    drawCubeGrid();
    g_modelMatrix = popMatrix();

    // grid in front
    g_modelMatrix.translate(0, 0, -2.22);
    g_modelMatrix.rotate(g_sideAngle2, 0, 0, 1);
    drawCubeGrid();

    g_modelMatrix = popMatrix();
}

// makes a 3x3 grid (in the xy plane) of cubes
// initial drawing location is center of center cube (cube 5)
/* 
      Like this, where numbers are cubes:
      1   2   3
      4   5   6
      7   8   9
*/
function drawCubeGrid()
{
    pushMatrix(g_modelMatrix);

    // cube 5
    drawCube();

    // cube 6
    g_modelMatrix.translate(2.22, 0, 0);
    drawCube();

    // cube 3
    g_modelMatrix.translate(0, 2.22, 0);
    drawCube();

    // cube 2
    g_modelMatrix.translate(-2.22, 0, 0);
    drawCube();

    // cube 1
    g_modelMatrix.translate(-2.22, 0, 0);
    drawCube();

    // cube 4
    g_modelMatrix.translate(0, -2.22, 0);
    drawCube();

    // cube 7
    g_modelMatrix.translate(0, -2.22, 0);
    drawCube();

    // cube 8
    g_modelMatrix.translate(2.22, 0, 0);
    drawCube();

    // cube 9
    g_modelMatrix.translate(2.22, 0, 0);
    drawCube();

    g_modelMatrix = popMatrix();
}

function drawCube()
{
    gl.uniformMatrix4fv(g_modelLoc, false, g_modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
}

function drawTetra()
{
    gl.uniformMatrix4fv(g_modelLoc, false, g_modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 36, 12); 
}


// Last time that this function was called:  (used for animation timing)
var g_last = Date.now();

function calculateAngles() 
{
    // Calculate the elapsed time
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;

    // update overall angle
    g_rubiksCubeAngle += g_rubiksStep * elapsed * 0.001 * g_cubeBrake;
    g_rubiksCubeAngle %= 360;

    // update side 1 angle
    g_sideAngle1 +=  g_sideStep1 * elapsed * 0.001 * g_sideBrake1;
    g_sideAngle1 %= 360;

    // update side 2 angle
    g_sideAngle2 += g_sideStep2 * elapsed * 0.001 * g_sideBrake2;
    g_sideAngle2 %= 360;

    // update tetra angle
    g_tetraAngle += g_tetraStep * elapsed * 0.001;
    g_sideAngle2 %= 360;

    // update tetra orbit
    g_tetraOrbitAngle += g_tetraOrbitSpeed * elapsed * 0.001;
    g_tetraOrbitAngle %= 360;

    // update tetra swaying angles
    g_tetraBottomAngle += g_tetraBottomStep * elapsed * 0.001;
    if ((g_tetraBottomAngle > 45 || g_tetraBottomAngle < -45) && (g_tetraBottomAngle * g_tetraBottomStep > 0))
    {
        g_tetraBottomStep *= -1
    }

    g_tetraMiddleAngle += g_tetraMiddleStep * elapsed * 0.001;
    if ((g_tetraMiddleAngle > 45 || g_tetraMiddleAngle < -45) && (g_tetraMiddleAngle * g_tetraMiddleStep > 0))
    {
        g_tetraMiddleStep *= -1
    }

    g_tetraTopAngle += g_tetraTopStep * elapsed * 0.001;
    if ((g_tetraTopAngle > 45 || g_tetraTopAngle < -45) && (g_tetraTopAngle * g_tetraTopStep > 0))
    {
        g_tetraTopStep *= -1
    }
}

function CubeAngle_runStop()
{
  if(g_cubeBrake > 0.5)
  {
  	g_cubeBrake = 0.0;
  	document.getElementById("CubeAngleButton").value="Cube Rotation OFF";
	}
  else 
  {
  	g_cubeBrake = 1.0;
  	document.getElementById("CubeAngleButton").value="Cube Rotation ON";
	}
}

function SideAngle1_runStop()
{
  if(g_sideBrake1 > 0.5)
  {
  	g_sideBrake1 = 0.0;
  	document.getElementById("Side1AngleButton").value="Side 1 Rotation OFF";
	}
  else 
  {
  	g_sideBrake1 = 1.0;
  	document.getElementById("Side1AngleButton").value="Side 1 Rotation ON";
	}
}

function SideAngle2_runStop()
{
  if(g_sideBrake2 > 0.5)
  {
  	g_sideBrake2 = 0.0;
  	document.getElementById("Side2AngleButton").value="Side 2 Rotation OFF";
	}
  else 
  {
  	g_sideBrake2 = 1.0;
  	document.getElementById("Side2AngleButton").value="Side 2 Rotation ON";
	}
}

function myMouseDown(ev) 
{
    // Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
    var rect = ev.target.getBoundingClientRect();	        // get canvas corners in pixels
    var xp = ev.clientX - rect.left;						// x==0 at canvas left edge
    var yp = g_canvas.height - (ev.clientY - rect.top);	    // y==0 at canvas bottom edge
    
    // Convert to Canonical View Volume (CVV) coordinates too:
    var x = (xp - g_canvas.width/2)  / 		                // move origin to center of canvas and
                 (g_canvas.width/2);		                // normalize canvas to -1 <= x < +1,
    var y = (yp - g_canvas.height/2) /		                //				       -1 <= y < +1.
                 (g_canvas.height/2);
    
    g_isDrag = true;										// set our mouse-dragging flag
    g_xMclik = x;											// record where mouse-dragging began
    g_yMclik = y;
  };
  
  
  function myMouseMove(ev) 
  {
    if(g_isDrag==false) return;				                // IGNORE all mouse-moves except 'dragging'
  
    // Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
    var rect = ev.target.getBoundingClientRect();	        // get canvas corners in pixels
    var xp = ev.clientX - rect.left;						// x==0 at canvas left edge
    var yp = g_canvas.height - (ev.clientY - rect.top);  	// y==0 at canvas bottom edge
    
    // Convert to Canonical View Volume (CVV) coordinates too:
    var x = (xp - g_canvas.width/2)  / 		                // move origin to center of canvas and
                 (g_canvas.width/2);		                // normalize canvas to -1 <= x < +1,
    var y = (yp - g_canvas.height/2) /		                //	                   -1 <= y < +1.
                 (g_canvas.height/2);
  
    // find how far we dragged the mouse:
    g_xMdragTot += (x - g_xMclik);			 // Accumulate change-in-mouse-position,&
    g_yMdragTot += (y - g_yMclik);
  
    g_xMclik = x;							 // Make next drag-measurement from here.
    g_yMclik = y;
  };
  
  function myMouseUp(ev) 
  {
    // Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
    var rect = ev.target.getBoundingClientRect();	      // get canvas corners in pixels
    var xp = ev.clientX - rect.left;					  // x==0 at canvas left edge
    var yp = g_canvas.height - (ev.clientY - rect.top);	  // y==0 at canvas bottom edge

    // Convert to Canonical View Volume (CVV) coordinates too:
    var x = (xp - g_canvas.width/2)  / 		// move origin to center of canvas and
                 (g_canvas.width/2);		// normalize canvas to -1 <= x < +1,
    var y = (yp - g_canvas.height/2) /		//										 -1 <= y < +1.
                 (g_canvas.height/2);
    
    g_isDrag = false;											
    g_xMdragTot += (x - g_xMclik);
    g_yMdragTot += (y - g_yMclik);
  };

  function myKeyDown(kev)
  {
      switch (kev.code)
      {
          case "KeyQ":
              g_tetraSize -= 0.005;
              if (g_tetraSize < 0)
              {
                  g_tetraSize = 0;
              }
              break;
          case "KeyE":
              g_tetraSize += 0.005;
              break;
          default:
      }
  };
 