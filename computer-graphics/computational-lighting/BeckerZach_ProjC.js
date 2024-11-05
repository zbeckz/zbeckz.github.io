// Global Variables  
// WebGl Stuff
var gl;												
var g_canvas;		

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

// For multiple VBOs & Shaders
var worldBox = new VBObox0();		  // Holds VBO & shaders for 3D 'world' ground-plane grid, etc;
var gouraudBox = new VBObox1();		  // "  "  for first set of custom-shaded 3D parts
var phongBox = new VBObox2();         // "  "  for second set of custom-shaded 3D parts

// Light Controls
var g_DiffuseSwitch = 1.0;
var g_AmbientSwitch = 1.0;
var g_SpecularSwitch = 1.0;
var g_diffuseColor = [0.8, 0.8, 0.8];
var g_ambientColor = [0.2, 0.2, 0.2];
var g_lightPosition = [2.0, 2.0, 2.0];
var g_specularColor = [1.0, 1.0, 1.0];
var g_IsBlinn = 0.0;
var g_Shininess = 22.2;
var g_C = 0.0;
var g_S = 0.1;

// For animation
var g_last = Date.now();			// Timestamp (in milliseconds)
var g_sphereRotationAngle = 0.0;
var g_SphereRotationStep = 22.2;   

// For mouse/keyboard
var g_show0 = 1;				// 0==Show, 1==Hide VBO0 contents on-screen.
var g_show1 = 1;				// 	"		"		VBO1	"		"		" 
var g_show2 = 0;                //  "       "       VBO2    "       "       "

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

  document.getElementById('ambientR').value = 0.1;
  document.getElementById('ambientG').value = 0.1;
  document.getElementById('ambientB').value = 0.1;

  document.getElementById('diffuseR').value = 0.8;
  document.getElementById('diffuseG').value = 0.8;
  document.getElementById('diffuseB').value = 0.8;

  document.getElementById('lightX').value = 2.0;
  document.getElementById('lightY').value = 2.0;
  document.getElementById('lightZ').value = 2.0;

  document.getElementById('specularR').value = 1.0;
  document.getElementById('specularG').value = 1.0;
  document.getElementById('specularB').value = 1.0;

  document.getElementById('lightingSelection').value = 'Phong';
  document.getElementById('shadingSelection').value = 'Gouraud';

  // immediately resize to specifications
  drawResize();

  // Get rendering context from our HTML-5 canvas needed for WebGL use.
  gl = getWebGLContext(g_canvas);
  if (!gl)
  {
      console.log('Failed to get the WebGL rendering context from g_canvas');
      return;
  }

  // Init eye stuff
  g_eyeX = 2.358;
  g_eyeY = -1.0;
  g_eyeZ = 0.727;
  g_aimTheta = 5.86;            // IN RADIANS, ranges from 0 to 2pi
  g_aimPhi = 4.49;              // IN RADIANS, ranges from pi to 2pi...thought it'd be 0 to pi but whatevs it works

  // Initialize each of our 'vboBox' objects: 
  worldBox.init(gl);		// ground plane                                   
  gouraudBox.init(gl);		// for 1st kind of shading & lighting
  phongBox.init(gl);        // for 2nd kind of shading & lighting
	
  gl.clearColor(0.0, 0.0, 0.0, 1);	  // RGBA color for clearing <canvas>

  gl.enable(gl.DEPTH_TEST); 
  
  var tick = function() 
  {		                 
    requestAnimationFrame(tick, g_canvas);                           
    timerAll();               // Update all time-varying params
    drawAll();                // Draw all the VBObox contents
  };
 
  tick();                       
}

function timerAll() 
{
    // Calculate the elapsed time
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;

    // update overall angle
    g_sphereRotationAngle += g_SphereRotationStep * elapsed * 0.001
    g_sphereRotationAngle %= 360;

    g_C += g_S*elapsed*0.005;
    if (g_C > 1.0)
    {
        g_C = 1.0
        g_S *= -1.0;
    }
    else if (g_C < -1.0)
    {
        g_C = -1.0;
        g_S *= -1.0
    }


    // check text box light stuff
    g_ambientColor = [document.getElementById('ambientR').value, document.getElementById('ambientG').value, document.getElementById('ambientB').value]
    g_lightPosition = [document.getElementById('lightX').value, document.getElementById('lightY').value, document.getElementById('lightZ').value]
    g_specularColor = [document.getElementById('specularR').value, document.getElementById('specularG').value, document.getElementById('specularB').value]
    g_Shininess = document.getElementById('shininessSlider').value;
    g_diffuseColor = [document.getElementById('diffuseR').value, document.getElementById('diffuseG').value, document.getElementById('diffuseB').value,]

    if (document.getElementById('lightingSelection').value == 'Phong')
    {
        g_IsBlinn = 0.0;
    }
    else
    {
        g_IsBlinn = 1.0;
    }

    if (document.getElementById('shadingSelection').value == 'Phong')
    {
        g_show1 = 0;
        g_show2 = 1;
    }
    else
    {
        g_show1 = 1;
        g_show2 = 0;
    }
}

function drawAll() 
{
    // Clear on-screen HTML-5 <canvas> object:
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var b4Draw = Date.now();
    var b4Wait = b4Draw - g_last;

    gl.viewport(0, 0, g_canvas.width, g_canvas.height);

    if (g_show0 == 1)
    {
        worldBox.switchToMe();  
	    worldBox.adjust();		  
	    worldBox.draw();
    }

    if (g_show1 == 1)
    {
        gouraudBox.switchToMe();  
	    gouraudBox.adjust();		  
	    gouraudBox.draw();
    }
    
    if (g_show2 == 1)
    {
        phongBox.switchToMe();  
	    phongBox.adjust();		  
	    phongBox.draw();
    }
    
}

function myMouseDown(ev) 
{
    
};
  
  
function myMouseMove(ev) 
{

};

function myMouseUp(ev) 
{

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
    g_canvas.height = window.innerHeight * 2 / 3;
    if (g_canvas.height > window.innerWidth)
    {
        g_canvas.width = window.innerWidth * 2 / 3;
    }
    else
    {
        g_canvas.width = g_canvas.height
    }
    
}

function diffuseLightSwitch()
{
    if (g_DiffuseSwitch == 1)
    {
        g_DiffuseSwitch = 0;
        document.getElementById('diffuseLightSwitch').textContent = 'Diffuse Currently Off'
    }
    else
    {
        g_DiffuseSwitch = 1;
        document.getElementById('diffuseLightSwitch').textContent = 'Diffuse Currently On'
    }
}

function ambientSwitch()
{
    if (g_AmbientSwitch == 1)
    {
        g_AmbientSwitch = 0;
        document.getElementById('ambientSwitch').textContent = 'Ambient Currently Off'
    }
    else
    {
        g_AmbientSwitch = 1;
        document.getElementById('ambientSwitch').textContent = 'Ambient Currently On'
    }
}

function specularSwitch()
{
    if (g_SpecularSwitch == 1)
    {
        g_SpecularSwitch = 0;
        document.getElementById('specularSwitch').textContent = 'Specular Currently Off'
    }
    else
    {
        g_SpecularSwitch = 1;
        document.getElementById('specularSwitch').textContent = 'Specular Currently On'
    }
}
