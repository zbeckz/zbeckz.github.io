
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

// webgl stuff
var g_canvas
var gl;                   // WebGL's rendering context; value set in main()
var g_nVerts;             // # of vertices in VBO; value set in main()
var g_modelMatrix;		  // 4x4 matrix in JS; sets 'uniform' in GPU
var g_modelLoc;		      // GPU location where this uniform is stored.

var integralCount;

function main()
{
    // keyboard event handler
    window.addEventListener("keydown", myKeyDown, false);
    
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
    integralCount = 1;
    var tick = function() 
    {
        if (integralCount > 101*101*101)
        {
            integralCount = 1
        }
        else
        {
            integralCount++;
        }
        drawAll();
        requestAnimationFrame(tick, g_canvas);                                               
    };
    
    // AFTER that, call the function (infinite loop)
    tick();							
}

function makeIntegralPath()
{
    var arr = new Float32Array(7*101*101*101);
    var i = 0;
    for (let z = 0; z <= 1; z += 0.01)
    {
        for (let theta = 0; theta <= Math.PI * 2; theta += Math.PI*2/100)
        {
            for (let r = 0; r <= 1; r += 0.01)
            {
                arr[i] = r * Math.cos(theta);
                i++;
                arr[i] = r * Math.sin(theta);
                i++;
                arr[i] = z;
                i++
                arr[i] = 1.0;
                i++
                arr[i] = 0.5;
                i++
                arr[i] = 0.5;
                i++
                arr[i] = 0.5;
                i++
            }
        }
    }
    return arr;
}

function initVertexBuffer() 
{
    var groundVerts = makeGroundGrid();
    var integralVerts = makeIntegralPath();  
    var nn = groundVerts.length + integralVerts.length;

    var colorShapes = new Float32Array(nn);

    for (var i = 0; i < nn; i++)
    {
        if (i < groundVerts.length)
        {
            colorShapes[i] = groundVerts[i];
        }
        else
        {
            colorShapes[i] = integralVerts[i - groundVerts.length];
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

    g_modelMatrix.setIdentity();
    pushMatrix(g_modelMatrix);
    g_modelMatrix.perspective(angle, 1, near, far);        // perspective(angle, aspect ratio, near, far)
    drawScene();
    g_modelMatrix = popMatrix();
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

    pushMatrix(g_modelMatrix);
    gl.uniformMatrix4fv(g_modelLoc, false, g_modelMatrix.elements);
    gl.drawArrays(gl.POINTS, 401, integralCount); 
    g_modelMatrix = popMatrix();
    
    // draw ground grid
    pushMatrix(g_modelMatrix)	
  	g_modelMatrix.scale(0.1, 0.1, 0.1);				
    gl.uniformMatrix4fv(g_modelLoc, false, g_modelMatrix.elements);
    gl.drawArrays(gl.LINES, 0, 400);
    g_modelMatrix = popMatrix();
}

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
    const newSize = window.innerHeight * 0.9;
    g_canvas.width = newSize;
    g_canvas.height = newSize;
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