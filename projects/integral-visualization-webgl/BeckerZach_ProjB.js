
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

// Camera aiming stuff
var g_eyeX;
var g_eyeY;
var g_eyeZ;
var g_aimX;
var g_aimY;
var g_aimZ;
var g_aimTheta;
var g_aimPhi;
var near = 0.1;
var angle = 35.0; // degrees
var far = (15.0 / Math.tan(angle/2 * Math.PI / 180.0)) - near; // such that -5, 5, -5, 5 are the correct
                                                               // corners for the viewing frustrum at z = (near-far)/3       

// Mouse stuff
var g_isDrag = false;		// mouse-drag: true when user holds down mouse button
var g_xMclik = 0.0;			// last mouse button-down position (in CVV coords)
var g_yMclik = 0.0;   
var g_xMdragTot = 0.0;	// total (accumulated) mouse-drag amounts (in CVV coords).
var g_yMdragTot = 0.0;
var qNew = new Quaternion(0,0,0,1);  // most-recent mouse drag's rotation
var qTot = new Quaternion(0,0,0,1);	// 'current' orientation (made from qNew)
var quatMatrix = new Matrix4();				// rotation matrix, made from latest qTot

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

    // immediately resize to specifications
    drawResize();

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

    // Init eye stuff
    g_eyeX = 6.076;
    g_eyeY = -0.644;
    g_eyeZ = 1.454;
    g_aimTheta = 6.083;                 // IN RADIANS, ranges from 0 to 2pi
    g_aimPhi = 4.5;                   // IN RADIANS, ranges from pi to 2pi...thought it'd be 0 to pi but whatevs it works

    // Init tetra swaying angles
    g_tetraBottomAngle = 0.0;
    g_tetraMiddleAngle = 0.0;
    g_tetraTopAngle = 0.0;

    // Init tetra swaying steps;
    g_tetraBottomStep = 68.0;
    g_tetraMiddleStep = 68.0;
    g_tetraTopStep = 68.0;

    // Init tetra size
    g_tetraSize = 0.3;
    
    // Init tetra orbit stuff
    g_tetraOrbitAngle = 0.0;
    g_tetraOrbitSpeed = 1.0;
    g_tetraOrbitRadius = 1.2;

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
        drawAll();                                                                            // Draw shapes
        requestAnimationFrame(tick, g_canvas);                                                // Request that the browser re-draw the webpage
    };
    
    // AFTER that, call the function (infinite loop)
    tick();							
}     

function initVertexBuffer() 
{
    var myShapes = makeShapesArr();
    var lineAxes = makeLineAxes();
    var groundVerts = makeGroundGrid();
    var orbitVerts = makeOrbitLines();
    
    var nn = myShapes.length + groundVerts.length + lineAxes.length + orbitVerts.length;

    var colorShapes = new Float32Array(nn);

    for (var i = 0; i < nn; i++)
    {
        if (i < myShapes.length)
        {
            colorShapes[i] = myShapes[i] // cube and tetrahedron 
        }
        else if (i < myShapes.length + groundVerts.length)
        {
            colorShapes[i] = groundVerts[i - myShapes.length] // ground grid
        }
        else if (i < myShapes.length + groundVerts.length + lineAxes.length)
        {
            colorShapes[i] = lineAxes[i - myShapes.length - groundVerts.length] // axes
        }
        else
        {
            colorShapes[i] = orbitVerts[i - myShapes.length - groundVerts.length - lineAxes.length] // orbit lines
        }
    }

    
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

    // Left view (perspective)
    gl.viewport(0, 0, g_canvas.width/2, g_canvas.height);
    g_modelMatrix.setIdentity();
    pushMatrix(g_modelMatrix);
    g_modelMatrix.perspective(angle, 1, near, far);        // perspective(angle, aspect ratio, near, far)
    drawScene();
    g_modelMatrix = popMatrix();

    // Right view (orthographic)
    gl.viewport(g_canvas.width/2, 0, g_canvas.width/2, g_canvas.height);
    g_modelMatrix.setOrtho(-5, 5, -5, 5, near, far);	// orthographic(left, right, bottom, top, near, far)
    drawScene();
}

function drawScene()
{
    // utilizing spherical coordinates
    g_aimX = g_eyeX + Math.sin(g_aimPhi)*Math.cos(g_aimTheta);
    g_aimY = g_eyeY + Math.sin(g_aimPhi)*Math.sin(g_aimTheta);
    g_aimZ = g_eyeZ + Math.cos(g_aimPhi);

    // lookAt(eye, aim, up)
    g_modelMatrix.lookAt(g_eyeX, g_eyeY, g_eyeZ,
                         g_aimX, g_aimY, g_aimZ,
                              0,      0,      1);

    // draw tetrahedron orbits
    pushMatrix(g_modelMatrix);
    g_modelMatrix.scale(g_tetraOrbitRadius, g_tetraOrbitRadius, g_tetraOrbitRadius);
    drawOrbit();
    g_modelMatrix.rotate(90, 1, 0, 0);
    drawOrbit();
    g_modelMatrix.rotate(-90, 1, 0, 0);
    g_modelMatrix.rotate(90, 0, 1, 0);
    drawOrbit();
    g_modelMatrix = popMatrix();

    // draw rubiks cube that you can rotate with the mouse
    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(0, 2, 0.1)
    quatMatrix.setFromQuat(qTot.x, qTot.y, qTot.z, qTot.w);	// Quaternion-->Matrix
	g_modelMatrix.concat(quatMatrix);	// apply that matrix.
    drawAxes();
    g_modelMatrix.scale(0.1, 0.1, 0.1);
    drawRubiksCube(false);
    g_modelMatrix = popMatrix();

    // draw rubiks cube that rotates by itself
    pushMatrix(g_modelMatrix);
    drawAxes();
    g_modelMatrix.scale(0.07, 0.07, 0.07);
    g_modelMatrix.rotate(-1 * g_rubiksCubeAngle, 1, 0, 0);
    drawRubiksCube(true)
    g_modelMatrix = popMatrix();

    // draw tetrahedron chain rotating around the z axis
    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(g_tetraOrbitRadius * Math.cos(g_tetraOrbitAngle), g_tetraOrbitRadius * Math.sin(g_tetraOrbitAngle), 0.0); 
    g_modelMatrix.scale(g_tetraSize, g_tetraSize, g_tetraSize);
    g_modelMatrix.rotate(90, 1, 0, 0); 
    drawTetraChain();
    g_modelMatrix = popMatrix();

    // draw tetrahedron chain rotating around the x axis
    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(0.0, g_tetraOrbitRadius * Math.sin(g_tetraOrbitAngle+180), g_tetraOrbitRadius * Math.cos(g_tetraOrbitAngle+180)); 
    g_modelMatrix.scale(g_tetraSize, g_tetraSize, g_tetraSize);
    g_modelMatrix.rotate(90, 1, 0, 0); 
    drawTetraChain();
    g_modelMatrix = popMatrix();

    // draw tetrahedron chain rotating around the y axis
    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(g_tetraOrbitRadius * Math.cos(g_tetraOrbitAngle-90), 0.0, g_tetraOrbitRadius * Math.sin(g_tetraOrbitAngle-90)); 
    g_modelMatrix.scale(g_tetraSize, g_tetraSize, g_tetraSize);
    g_modelMatrix.rotate(90, 1, 0, 0); 
    drawTetraChain();
    g_modelMatrix = popMatrix();

    // draw ground grid
    g_modelMatrix.translate(0, 0, 0);	
  	g_modelMatrix.scale(0.1, 0.1, 0.1);				
    gl.uniformMatrix4fv(g_modelLoc, false, g_modelMatrix.elements);
    gl.drawArrays(gl.LINES, 48, 400);
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
// boolean parameter
function drawRubiksCube(rotateSides)
{
    pushMatrix(g_modelMatrix);

    // center grid
    drawCubeGrid();

    // grid behind
    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(0, 0, 2.22);
    if (rotateSides)
    {
        g_modelMatrix.rotate(g_sideAngle1, 0, 0, 1);
    }
    drawCubeGrid();
    g_modelMatrix = popMatrix();

    // grid in front
    g_modelMatrix.translate(0, 0, -2.22);
    if (rotateSides)
    {
        g_modelMatrix.rotate(g_sideAngle2, 0, 0, 1);
    }
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

function drawAxes()
{
    gl.uniformMatrix4fv(g_modelLoc, false, g_modelMatrix.elements);
    gl.drawArrays(gl.LINES, 448, 9); 
}

function drawOrbit()
{
    gl.uniformMatrix4fv(g_modelLoc, false, g_modelMatrix.elements);
    gl.drawArrays(gl.LINE_LOOP, 457, 222);
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

    dragQuat(x - g_xMclik, y - g_yMclik);
  
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

    dragQuat(x - g_xMclik, y - g_yMclik);
  };

  function myKeyDown(kev)
  {
      switch (kev.code)
      {
        case "ArrowRight":
            g_aimTheta -= 0.01;
            if (g_aimTheta < 0)
            {
                g_aimTheta += 2*Math.PI;
            }         
            break;
        case "ArrowLeft":
            g_aimTheta += 0.01;
            if (g_aimTheta > 2*Math.PI)
            {
                g_aimTheta -= 2*Math.PI;
            }          
            break;
        case "ArrowUp":
            g_aimPhi += 0.01;
            if (g_aimPhi > 2*Math.PI-0.02)
            {
                g_aimPhi = 2*Math.PI-0.02;
            }         
            break;
        case "ArrowDown":
            g_aimPhi -= 0.01;
            if (g_aimPhi < Math.PI+0.02)
            {
                g_aimPhi = Math.PI+0.02;
            }  
            break;
        case "KeyW":
            g_eyeX += 0.05 * (g_aimX - g_eyeX);
            g_eyeY += 0.05 * (g_aimY - g_eyeY);
            g_eyeZ += 0.05 * (g_aimZ - g_eyeZ);
            break;
        case "KeyS":
            g_eyeX -= 0.05 * (g_aimX - g_eyeX);
            g_eyeY -= 0.05 * (g_aimY - g_eyeY);
            g_eyeZ -= 0.05 * (g_aimZ - g_eyeZ);
            break;
        case "KeyA":
            var aimVec = new Vector3([g_aimX - g_eyeX, g_aimY - g_eyeY, g_aimZ - g_eyeZ]);
            var upVec = new Vector3([0, 0, 1]);
            var horzVec = upVec.cross(aimVec).normalize();
            g_eyeX += 0.05 * horzVec.elements[0];
            g_eyeY += 0.05 * horzVec.elements[1];
            g_eyeZ += 0.05 * horzVec.elements[2];
            break;
        case "KeyD":
            var aimVec = new Vector3([g_aimX - g_eyeX, g_aimY - g_eyeY, g_aimZ - g_eyeZ]);
            var upVec = new Vector3([0, 0, 1]);
            var horzVec = upVec.cross(aimVec).normalize();
            g_eyeX -= 0.05 * horzVec.elements[0];
            g_eyeY -= 0.05 * horzVec.elements[1];
            g_eyeZ -= 0.05 * horzVec.elements[2];
            break;
        default:
      }
  };

  function drawResize()
  {
      g_canvas.width = window.innerWidth - 20;
      g_canvas.height = window.innerHeight * 2 / 3;
  }

  function makeGroundGrid() 
  {
    // Create a list of vertices that create a large grid of lines in the x,y plane
    // centered at x=y=z=0.  Draw this shape using the GL_LINES primitive.
    
        var xcount = 100;			// # of lines to draw in x,y to make the grid.
        var ycount = 100;		
        var xymax	= 50.0;			// grid size; extends to cover +/-xymax in x and y.
        var xColr = new Float32Array([0.5, 0.5, 0.5]);	// gray
        var yColr = new Float32Array([0.5, 0.5, 0.5]);	// gray
         
        // Create an (global) array to hold this ground-plane's vertices:
        var gndVerts = new Float32Array(7*2*(xcount+ycount));
                            
        var xgap = xymax/(xcount-1);		// HALF-spacing between lines in x,y;
        var ygap = xymax/(ycount-1);		// (why half? because v==(0line number/2))
        
        // First, step thru x values as we make vertical lines of constant-x:
        for(v=0, j=0; v<2*xcount; v++, j+= 7) 
        {
            if(v%2==0) 
            {	// put even-numbered vertices at (xnow, -xymax, 0)
                gndVerts[j  ] = -xymax + (v  )*xgap;	               // x
                gndVerts[j+1] = -xymax;								// y
                gndVerts[j+2] = 0.0;									// z
                gndVerts[j+3] = 1.0;									// w.
            }
            else 
            {				// put odd-numbered vertices at (xnow, +xymax, 0).
                gndVerts[j  ] = -xymax + (v-1)*xgap;	// x
                gndVerts[j+1] = xymax;								// y
                gndVerts[j+2] = 0.0;									// z
                gndVerts[j+3] = 1.0;									// w.
            }
            gndVerts[j+4] = xColr[0];			// red
            gndVerts[j+5] = xColr[1];			// grn
            gndVerts[j+6] = xColr[2];			// blu
        }
        // Second, step thru y values as wqe make horizontal lines of constant-y:
        // (don't re-initialize j--we're adding more vertices to the array)
        for(v=0; v<2*ycount; v++, j+= 7) 
        {
            if(v%2==0) 
            {		// put even-numbered vertices at (-xymax, ynow, 0)
                gndVerts[j  ] = -xymax;								// x
                gndVerts[j+1] = -xymax + (v  )*ygap;	// y
                gndVerts[j+2] = 0.0;									// z
                gndVerts[j+3] = 1.0;									// w.
            }
            else 
            {					// put odd-numbered vertices at (+xymax, ynow, 0).
                gndVerts[j  ] = xymax;								// x
                gndVerts[j+1] = -xymax + (v-1)*ygap;	// y
                gndVerts[j+2] = 0.0;									// z
                gndVerts[j+3] = 1.0;									// w.
            }
            gndVerts[j+4] = yColr[0];			// red
            gndVerts[j+5] = yColr[1];			// grn
            gndVerts[j+6] = yColr[2];			// blu
        }

        return gndVerts;
    }


    function dragQuat(xdrag, ydrag) 
    {
        var qTmp = new Quaternion(0,0,0,1);
        var aimVec = new Vector3([g_aimX - g_eyeX, g_aimY - g_eyeY, g_aimZ - g_eyeZ]);
        var upVec = new Vector3([0, 0, 1]);
        var horzVec = upVec.cross(aimVec).normalize();
        var vertVec = aimVec.cross(horzVec).normalize();
       
        // apply vertical rotation around horizontal axis
        qNew.setFromAxisAngle(horzVec.elements[0] + 0.0001, horzVec.elements[1] + 0.0001, horzVec.elements[2], ydrag*150.0);               
        qTmp.multiply(qNew,qTot);
        qTot.copy(qTmp);

        // apply horizontal rotation around vertical axis
        qNew.setFromAxisAngle(vertVec.elements[0] + 0.0001, vertVec.elements[1] + 0.0001, vertVec.elements[2], xdrag*150.0);               
        qTmp.multiply(qNew,qTot);
        qTot.copy(qTmp);
    };

    function makeShapesArr()
    {
        var c30 = Math.sqrt(0.75);					// == cos(30deg) == sqrt(3) / 2
        var sq2	= Math.sqrt(2.0);						 
    
        var myShapes = new Float32Array
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

        return myShapes;
    }

    function makeLineAxes()
    {
        var lineAxes = new Float32Array
    ([ 0.0, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0, // red line x axis
       1.0, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0,
       0.0, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0,
    
       0.0, 0.0, 0.0, 1.0,   0.0, 1.0, 0.0, // green line y axis
       0.0, 1.0, 0.0, 1.0,   0.0, 1.0, 0.0,
       0.0, 0.0, 0.0, 1.0,   0.0, 1.0, 0.0,
    
       0.0, 0.0, 0.0, 1.0,   0.0, 0.0, 1.0, // blue line z axis
       0.0, 0.0, 1.0, 1.0,   0.0, 0.0, 1.0,
       0.0, 0.0, 0.0, 1.0,   0.0, 0.0, 1.0]);

       return lineAxes;
    }

    // white orbit path radius 1 around z axis
    function makeOrbitLines()
    {
        var orbitLines = new Float32Array(7 * 222)
        var j;
        var k;
        for (var i = 0; i < 222; i++)
        {
            j = i * 7;
            k = 2*Math.PI/222 * i;
            orbitLines[j] = Math.cos(k);        // x
            orbitLines[j + 1] = Math.sin(k);    // y
            orbitLines[j + 2] = 0.0;            // z
            orbitLines[j + 3] = 1.0;            // w
            orbitLines[j + 4] = 1.0;            // white color
            orbitLines[j + 5] = 1.0;            // white color
            orbitLines[j + 6] = 1.0;            // white color
        }

        return orbitLines;
    }
 