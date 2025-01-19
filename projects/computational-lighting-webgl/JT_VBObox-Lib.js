function VBObox0() 
{ 
	this.VERT_SRC =	
  'precision highp float;\n' +				// req'd in OpenGL ES if we use 'float'
  //
  'uniform mat4 u_ModelMat0;\n' +
  'attribute vec4 a_Pos0;\n' +
  'attribute vec3 a_Colr0;\n'+
  'varying vec3 v_Colr0;\n' +
  'uniform float u_C;\n' +
  //
  'void main() {\n' +
  '  vec4 p = vec4(a_Pos0.xy, a_Pos0.z + u_C*sin(0.5*a_Pos0.x), a_Pos0.w);\n' +
  '  gl_Position = u_ModelMat0 * a_Pos0;\n' +
  '	 v_Colr0 = a_Colr0;\n' +
  ' }\n';

	this.FRAG_SRC =
  'precision mediump float;\n' +
  'varying vec3 v_Colr0;\n' +
  'void main() {\n' +
  '  gl_FragColor = vec4(v_Colr0, 1.0);\n' + 
  '}\n';

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

  var groundVerts = makeGroundGrid();

  var nn = groundVerts.length + lineAxes.length

  this.vboVerts = 409;
    
	this.vboContents = new Float32Array(nn)

  for (var i = 0; i < nn; i++)
  {
      if (i < groundVerts.length)
      {
        this.vboContents[i] = groundVerts[i]
      }
      else
      {
        this.vboContents[i] = lineAxes[i - groundVerts.length]
      }
  }

	this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;                          
  this.vboBytes = this.vboContents.length * this.FSIZE;               
	this.vboStride = this.vboBytes / this.vboVerts; 
  this.vboFcount_a_Pos0 =  4;   
  this.vboFcount_a_Colr0 = 3; 
  console.assert((this.vboFcount_a_Pos0 +    
                  this.vboFcount_a_Colr0) *   
                  this.FSIZE == this.vboStride, 
                  "Uh oh! VBObox0.vboStride disagrees with attribute-size values!");

	this.vboOffset_a_Pos0 = 0;    
  this.vboOffset_a_Colr0 = this.vboFcount_a_Pos0 * this.FSIZE;    
	this.vboLoc;
	this.shaderLoc;	
	this.a_PosLoc;	
	this.a_ColrLoc;
  this.u_C;				

	this.ModelMat = new Matrix4();	// Transforms CVV axes to model axes.
	this.u_ModelMatLoc;							// GPU location for u_ModelMat uniform
}

VBObox0.prototype.init = function()
 {
	this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
	if (!this.shaderLoc) 
  {
    console.log(this.constructor.name + 
    						'.init() failed to create executable Shaders on the GPU. Bye!');
    return;
  }
	
  gl.program = this.shaderLoc;	
	this.vboLoc = gl.createBuffer();	
  if (!this.vboLoc)
  {
    console.log(this.constructor.name + 
    						'.init() failed to create VBO in GPU. Bye!'); 
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER,	      // GLenum 'target' for this GPU buffer 
  								this.vboLoc);				  // the ID# the GPU uses for this buffer.

  gl.bufferData(gl.ARRAY_BUFFER, 			  // GLenum target(same as 'bindBuffer()')
 					 				this.vboContents, 		// JavaScript Float32Array
  							 	gl.STATIC_DRAW);			// Usage hint.

  this.a_PosLoc = gl.getAttribLocation(this.shaderLoc, 'a_Pos0');
  if(this.a_PosLoc < 0) 
  {
    console.log(this.constructor.name + 
    						'.init() Failed to get GPU location of attribute a_Pos0');
    return -1;	// error exit.
  }
 	this.a_ColrLoc = gl.getAttribLocation(this.shaderLoc, 'a_Colr0');
  
   if(this.a_ColrLoc < 0) 
  {
    console.log(this.constructor.name + 
    						'.init() failed to get the GPU location of attribute a_Colr0');
    return -1;	// error exit.
  }

	this.u_ModelMatLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMat0');
  if (!this.u_ModelMatLoc) 
  { 
    console.log(this.constructor.name + 
    						'.init() failed to get GPU location for u_ModelMat1 uniform');
    return;
  }  

  this.u_C = gl.getUniformLocation(this.shaderLoc, 'u_C');
}

VBObox0.prototype.switchToMe = function() 
{
  gl.useProgram(this.shaderLoc);	

	gl.bindBuffer(gl.ARRAY_BUFFER,	        // GLenum 'target' for this GPU buffer 
										this.vboLoc);			    // the ID# the GPU uses for our VBO.

  gl.vertexAttribPointer(
		this.a_PosLoc,            //index == ID# for the attribute var in your GLSL shader pgm;
		this.vboFcount_a_Pos0,    // # of floats used by this attribute: 1,2,3 or 4?
		gl.FLOAT,			            // type == what data type did we use for those numbers?
		false,			             	// isNormalized == are these fixed-point values that we need normalize before use? true or false								
		this.vboStride,           // Stride == #bytes we must skip in the VBO to move to next attribute     
		this.vboOffset_a_Pos0);		// Offset == how many bytes from START of buffer to the first value we will actually use?  (We start with position).
		              
  gl.vertexAttribPointer(this.a_ColrLoc, this.vboFcount_a_Colr0, 
                        gl.FLOAT, false, 
                        this.vboStride, this.vboOffset_a_Colr0);
  							
  gl.enableVertexAttribArray(this.a_PosLoc);
  gl.enableVertexAttribArray(this.a_ColrLoc);
}

VBObox0.prototype.isReady = function() 
{
  var isOK = true;

  if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  
  {
    console.log(this.constructor.name + 
    						'.isReady() false: shader program at this.shaderLoc not in use!');
    isOK = false;
  }
  
  if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) 
  {
      console.log(this.constructor.name + 
  						'.isReady() false: vbo at this.vboLoc not in use!');
    isOK = false;
  }
  return isOK;
}

VBObox0.prototype.adjust = function() 
{
  if(this.isReady()==false) 
  {
        console.log('ERROR! before' + this.constructor.name + '.adjust() call you needed to call this.switchToMe()!!');
  }  
}

VBObox0.prototype.draw = function() 
{
  if(this.isReady()==false) 
  {
        console.log('ERROR! before' + this.constructor.name + '.draw() call you needed to call this.switchToMe()!!');
  }  

  this.ModelMat.setIdentity();

  gl.uniform1f(this.u_C, g_C);

  // perspective(angle, aspect ratio, near, far)
  this.ModelMat.perspective(angle, 1, near, far);        

  // utilizing spherical coordinates
  g_aimX = g_eyeX + Math.sin(g_aimPhi)*Math.cos(g_aimTheta);
  g_aimY = g_eyeY + Math.sin(g_aimPhi)*Math.sin(g_aimTheta);
  g_aimZ = g_eyeZ + Math.cos(g_aimPhi);

  // lookAt(eye, aim, up)
  this.ModelMat.lookAt(g_eyeX, g_eyeY, g_eyeZ,
                       g_aimX, g_aimY, g_aimZ,
                            0,      0,      1);

  
  pushMatrix(this.ModelMat)
  this.ModelMat.scale(0.1, 0.1, 0.1);	
  gl.uniformMatrix4fv(this.u_ModelMatLoc,	false, this.ModelMat.elements);
  gl.drawArrays(gl.LINES, 0, 400);  // groung grids
  this.ModelMat = popMatrix();

  // this.ModelMat.scale(1.0, 1.0, 1,0);
  // gl.uniformMatrix4fv(this.u_ModelMatLoc,	false, this.ModelMat.elements);
  // gl.drawArrays(gl.LINES, 400, 9);  // center axes
}

VBObox0.prototype.reload = function() 
{
 gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vboContents); 

}

//VBO BOX 1 --------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------

function VBObox1() 
{ 
  this.VERT_SRC =	
  'precision highp float;\n' +				// req'd in OpenGL ES if we use 'float'
  'uniform mat4 u_ModelMat1;\n' +
  'uniform mat4 u_OtherModel;\n' +
  'uniform vec3 u_LightColor;\n' +     // Light color
  'uniform vec3 u_LightPosition;\n' +  // Position of the light source
  'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
  'uniform vec3 u_SpecularColor;\n' +
  'uniform vec3 u_ViewerPos;\n' +
  'uniform float u_IsBlinn;\n' +
  'uniform float u_Shininess;\n' +
  'attribute vec4 a_Pos1;\n' +
  'attribute vec4 a_Colr1;\n'+
  'attribute vec4 a_Normal;\n' +
  'varying vec4 v_Colr1;\n' +
  'void main() {\n' +
  '  vec4 color = vec4(0.8, 0.8, 0.8, 1.0);\n' +
  '  gl_Position = u_ModelMat1 * a_Pos1;\n' +                         // transformed position
  '  vec4 n = vec4(a_Normal.xyz, 0.0);\n' +                           // normal vector with 4th element 0
  '  vec3 normal = normalize(vec3(u_OtherModel * n));\n' +            // real normal
  '  vec4 vertexPosition = u_OtherModel * a_Pos1;\n' +                // world coord vertex positions
  '  vec3 vPos = vertexPosition.xyz;\n' +                             // vec3 version above
  '  vec3 lightDirection = normalize(u_LightPosition - vPos);\n' +    // direction of the incoming light
  '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +        // lambertian
  '  vec3 diffuse = u_LightColor * a_Colr1.rgb * nDotL;\n' +          
  '  diffuse = u_LightColor * color.rgb * nDotL;\n' +
  '  vec3 ambient = u_AmbientLight * color.rgb;\n' +                  
  '  float specular = 0.0;\n' +                                      // specular stuff
  '  float specAngle = 0.0;\n' +
  '  if (nDotL > 0.0) {\n' +
  '     vec3 R = reflect(-lightDirection, normal);\n' +
  '     vec3 V = normalize(u_ViewerPos - vPos);\n' +                  // vector to the viewer
  '     if (u_IsBlinn == 0.0) {\n' +
  '        specAngle = max(dot(R, V), 0.0);\n' +
  '     }\n' +
  '     else {\n' +
  '        vec3 halfwayDir = normalize(lightDirection + V);\n' +
  '        specAngle = max(dot(normal, halfwayDir), 0.0);\n' +
  '     }\n' +
  '     specular = pow(specAngle, u_Shininess);\n' +
  '   }\n' +
  '  v_Colr1 = vec4(diffuse + ambient + specular*u_SpecularColor, color.a);\n' + 
  ' }\n';

	this.FRAG_SRC =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Colr1;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Colr1;\n' +
  '}\n';

	this.vboContents = makeSphere();

	this.vboVerts = this.vboContents.length/7;				
	this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;                          
  this.vboBytes = this.vboContents.length * this.FSIZE;               
	this.vboStride = this.vboBytes / this.vboVerts; 
  this.vboFcount_a_Pos1 =  4;   
  this.vboFcount_a_Colr1 = 3; 
  console.assert((this.vboFcount_a_Pos1 +    
                  this.vboFcount_a_Colr1) *   
                  this.FSIZE == this.vboStride, 
                  "Uh oh! VBObox1.vboStride disagrees with attribute-size values!");

	this.vboOffset_a_Pos1 = 0;    
  this.vboOffset_a_Colr1 = this.vboFcount_a_Pos1 * this.FSIZE;    
	this.vboLoc;
	this.shaderLoc;	
	this.a_PosLoc;	
	this.a_ColrLoc;			
  this.a_NormalLoc;	

	this.ModelMat = new Matrix4();	// Transforms CVV axes to model axes.
	this.u_ModelMatLoc;							// GPU location for u_ModelMat uniform

  this.u_OtherModel;
  this.u_LightColor;
  this.u_LightPosition;
  this.u_AmbientLight;
  this.u_SpecularColor;
  this.u_ViewerPos;
  this.u_IsBlinn;
  this.u_Shininess;
}

VBObox1.prototype.init = function()
 {
	this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
	if (!this.shaderLoc) 
  {
    console.log(this.constructor.name + 
    						'.init() failed to create executable Shaders on the GPU. Bye!');
    return;
  }
	
  gl.program = this.shaderLoc;	
	this.vboLoc = gl.createBuffer();	
  if (!this.vboLoc)
  {
    console.log(this.constructor.name + 
    						'.init() failed to create VBO in GPU. Bye!'); 
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER,	      // GLenum 'target' for this GPU buffer 
  								this.vboLoc);				  // the ID# the GPU uses for this buffer.

  gl.bufferData(gl.ARRAY_BUFFER, 			  // GLenum target(same as 'bindBuffer()')
 					 				this.vboContents, 		// JavaScript Float32Array
  							 	gl.STATIC_DRAW);			// Usage hint.

  this.a_PosLoc = gl.getAttribLocation(this.shaderLoc, 'a_Pos1');
  if(this.a_PosLoc < 0) 
  {
    console.log(this.constructor.name + 
    						'.init() Failed to get GPU location of attribute a_Pos1');
    return -1;	// error exit.
  }

  this.a_NormalLoc = gl.getAttribLocation(this.shaderLoc, 'a_Normal');
  if(this.a_Normal < 0) 
  {
    console.log(this.constructor.name + 
    						'.init() Failed to get GPU location of attribute a_Normal');
    return -1;	// error exit.
  }

 	this.a_ColrLoc = gl.getAttribLocation(this.shaderLoc, 'a_Colr1');
   if(this.a_ColrLoc < 0) 
  {
    console.log(this.constructor.name + 
    						'.init() failed to get the GPU location of attribute a_Colr1');
    return -1;	// error exit.
  }

	this.u_ModelMatLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMat1');
  if (!this.u_ModelMatLoc) 
  { 
    console.log(this.constructor.name + 
    						'.init() failed to get GPU location for u_ModelMat1 uniform');
    return;
  }
  
  this.u_OtherModel = gl.getUniformLocation(this.shaderLoc, 'u_OtherModel');
  this.u_LightColor = gl.getUniformLocation(this.shaderLoc, 'u_LightColor');
  this.u_LightPosition = gl.getUniformLocation(this.shaderLoc, 'u_LightPosition');
  this.u_AmbientLight = gl.getUniformLocation(this.shaderLoc, 'u_AmbientLight');
  this.u_SpecularColor = gl.getUniformLocation(this.shaderLoc, 'u_SpecularColor');
  this.u_ViewerPos = gl.getUniformLocation(this.shaderLoc, 'u_ViewerPos');
  this.u_IsBlinn = gl.getUniformLocation(this.shaderLoc, 'u_IsBlinn');
  this.u_Shininess = gl.getUniformLocation(this.shaderLoc, 'u_Shininess');
  if (!this.u_IsBlinn || !this.u_ViewerPos || !this.u_SpecularColor || !this.u_OtherModel || !this.u_LightColor || !this.u_LightPosition || !this.u_AmbientLight)
  { 
    console.log('.init() Failed to get the storage location of a gouraud shader uniform thingy');
    return;
  }
}

VBObox1.prototype.switchToMe = function() 
{
  gl.useProgram(this.shaderLoc);

	gl.bindBuffer(gl.ARRAY_BUFFER,	        // GLenum 'target' for this GPU buffer 
										this.vboLoc);			    // the ID# the GPU uses for our VBO.

  gl.vertexAttribPointer(
		this.a_PosLoc,            //index == ID# for the attribute var in your GLSL shader pgm;
		this.vboFcount_a_Pos1,    // # of floats used by this attribute: 1,2,3 or 4?
		gl.FLOAT,			            // type == what data type did we use for those numbers?
		false,			             	// isNormalized == are these fixed-point values that we need normalize before use? true or false								
		this.vboStride,           // Stride == #bytes we must skip in the VBO to move to next attribute     
		this.vboOffset_a_Pos1);		// Offset == how many bytes from START of buffer to the first value we will actually use?  (We start with position).
		              
  gl.vertexAttribPointer(this.a_ColrLoc, this.vboFcount_a_Colr1, 
                        gl.FLOAT, false, 
                        this.vboStride, this.vboOffset_a_Colr1);

  gl.vertexAttribPointer(
		this.a_NormalLoc,            
		this.vboFcount_a_Pos1,   
		gl.FLOAT,			            
		false,			             							
		this.vboStride,        
		this.vboOffset_a_Pos1);	                        
  							
  gl.enableVertexAttribArray(this.a_PosLoc);
  gl.enableVertexAttribArray(this.a_ColrLoc);
  gl.enableVertexAttribArray(this.a_NormalLoc);
}

VBObox1.prototype.isReady = function() 
{
  var isOK = true;

  if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  
  {
    console.log(this.constructor.name + 
    						'.isReady() false: shader program at this.shaderLoc not in use!');
    isOK = false;
  }
  
  if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) 
  {
      console.log(this.constructor.name + 
  						'.isReady() false: vbo at this.vboLoc not in use!');
    isOK = false;
  }
  return isOK;
}

VBObox1.prototype.adjust = function() 
{
  if(this.isReady()==false) 
  {
        console.log('ERROR! before' + this.constructor.name + '.adjust() call you needed to call this.switchToMe()!!');
  }  
}

VBObox1.prototype.draw = function() 
{
  if(this.isReady()==false) 
  {
        console.log('ERROR! before' + this.constructor.name + '.draw() call you needed to call this.switchToMe()!!');
  }
  
  // Set the light color (white)
  gl.uniform3f(this.u_LightColor, g_diffuseColor[0]*g_DiffuseSwitch, g_diffuseColor[1]*g_DiffuseSwitch, g_diffuseColor[2]*g_DiffuseSwitch);
  // Set the light position (in the world coordinate)
  gl.uniform3f(this.u_LightPosition, g_lightPosition[0], g_lightPosition[1], g_lightPosition[2]);
  // Set the ambient light
  gl.uniform3f(this.u_AmbientLight, g_ambientColor[0]*g_AmbientSwitch, g_ambientColor[1]*g_AmbientSwitch, g_ambientColor[2]*g_AmbientSwitch);
  // Set the specular color
  gl.uniform3f(this.u_SpecularColor, g_specularColor[0]*g_SpecularSwitch, g_specularColor[1]*g_SpecularSwitch, g_specularColor[2]*g_SpecularSwitch);
  // Set viewer pos
  gl.uniform3f(this.u_ViewerPos, g_eyeX, g_eyeY, g_eyeZ);
  // Set blinn
  gl.uniform1f(this.u_IsBlinn, g_IsBlinn);
  // Set shininess
  gl.uniform1f(this.u_Shininess, g_Shininess);

  // utilizing spherical coordinates
  g_aimX = g_eyeX + Math.sin(g_aimPhi)*Math.cos(g_aimTheta);
  g_aimY = g_eyeY + Math.sin(g_aimPhi)*Math.sin(g_aimTheta);
  g_aimZ = g_eyeZ + Math.cos(g_aimPhi);  

  var OtherModel = new Matrix4(); // Model view projection matrix
  this.ModelMat = new Matrix4();

  // perspective(angle, aspect ratio, near, far)
  this.ModelMat.perspective(angle, 1, near, far);        

  // lookAt(eye, aim, up)
  this.ModelMat.lookAt(g_eyeX, g_eyeY, g_eyeZ,
                       g_aimX, g_aimY, g_aimZ,
                            0,      0,      1);
  
  // transformations
  this.ModelMat.translate(0.0, 0.0, 0.3);
  this.ModelMat.scale(0.2, 0.2, 0.2);
  this.ModelMat.rotate(-1 * g_sphereRotationAngle, 0, 0, 1);
  gl.uniformMatrix4fv(this.u_ModelMatLoc, false, this.ModelMat.elements);	

  OtherModel.translate(0.0, 0.0, 0.3);
  OtherModel.scale(0.2, 0.2, 0.2);
  OtherModel.rotate(-1 * g_sphereRotationAngle, 0, 0, 1);
  gl.uniformMatrix4fv(this.u_OtherModel, false, OtherModel.elements);

  // draw sphere
  gl.drawArrays(gl.TRIANGLES, 0, this.vboVerts);
}

VBObox1.prototype.reload = function() 
{
 gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vboContents); 

}

// VBO BOX 2 -----------------------------------------------
// ---------------------------------------------------------

function VBObox2() 
{ 
	this.VERT_SRC =	
  this.VERT_SRC =	
  'precision highp float;\n' +				// req'd in OpenGL ES if we use 'float'
  'uniform mat4 u_ModelMat1;\n' +
  'uniform mat4 u_OtherModel;\n' +
  'attribute vec4 a_Pos1;\n' +
  'attribute vec4 a_Colr1;\n'+
  'attribute vec4 a_Normal;\n' +
  'varying vec3 normalInterp;\n' +
  'varying vec3 vertPos;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMat1 * a_Pos1;\n' +                         // transformed position
  '  vec4 vertexPosition = u_OtherModel * a_Pos1;\n' +                // world coord vertex positions
  '  vertPos = a_Colr1.rgb\n;' +                                      // this is here so compiler doesn't throw away a_colr1 lol
  '  vertPos = vertexPosition.xyz;\n' +                               // vec3 version above
  '  vec4 n = vec4(a_Normal.xyz, 0.0);\n' +                           // normal vector with 4th element 0
  '  normalInterp = normalize(vec3(u_OtherModel * n));\n' +            // real normal
  ' }\n';

	this.FRAG_SRC =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform vec3 u_LightColor;\n' +     // Light color
  'uniform vec3 u_LightPosition;\n' +  // Position of the light source
  'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
  'uniform vec3 u_SpecularColor;\n' +
  'uniform vec3 u_ViewerPos;\n' +
  'uniform float u_Shininess;\n' +
  'uniform float u_IsBlinn;\n' +
  'varying vec3 normalInterp;\n' +
  'varying vec3 vertPos;\n' +
  'void main() {\n' +
  '  vec4 color = vec4(0.8, 0.8, 0.8, 1.0);\n' +
  '  vec3 lightDirection = normalize(u_LightPosition - vertPos);\n' +    // direction of the incoming light
  '  float nDotL = max(dot(lightDirection, normalInterp), 0.0);\n' +        // lambertian     
  '  vec3 diffuse = u_LightColor * color.rgb * nDotL;\n' +
  '  vec3 ambient = u_AmbientLight * color.rgb;\n' +                  
  '  float specular = 0.0;\n' +                                      // specular stuff
  '  float specAngle = 0.0;\n' +
  '  if (nDotL > 0.0) {\n' +
  '     vec3 R = reflect(-lightDirection, normalInterp);\n' +
  '     vec3 V = normalize(u_ViewerPos - vertPos);\n' +                  // vector to the viewer
  '     if (u_IsBlinn == 0.0) {\n' +
  '        specAngle = max(dot(R, V), 0.0);\n' +
  '     }\n' +
  '     else {\n' +
  '        vec3 halfwayDir = normalize(lightDirection + V);\n' +
  '        specAngle = max(dot(normalInterp, halfwayDir), 0.0);\n' +
  '     }\n' +
  '     specular = pow(specAngle, u_Shininess);\n' +
  '   }\n' +
  '  gl_FragColor = vec4(diffuse + ambient + specular*u_SpecularColor, color.a);\n' + 
  '}\n';

	this.vboContents = makeSphere();

	this.vboVerts = this.vboContents.length/7;				
	this.FSIZE = this.vboContents.BYTES_PER_ELEMENT;                          
  this.vboBytes = this.vboContents.length * this.FSIZE;               
	this.vboStride = this.vboBytes / this.vboVerts; 
  this.vboFcount_a_Pos1 =  4;   
  this.vboFcount_a_Colr1 = 3; 
  console.assert((this.vboFcount_a_Pos1 +    
                  this.vboFcount_a_Colr1) *   
                  this.FSIZE == this.vboStride, 
                  "Uh oh! VBObox2.vboStride disagrees with attribute-size values!");

	this.vboOffset_a_Pos1 = 0;    
  this.vboOffset_a_Colr1 = this.vboFcount_a_Pos1 * this.FSIZE;    
	this.vboLoc;
	this.shaderLoc;	
	this.a_PosLoc;	
	this.a_ColrLoc;			
  this.a_NormalLoc;	

	this.ModelMat = new Matrix4();	// Transforms CVV axes to model axes.
	this.u_ModelMatLoc;							// GPU location for u_ModelMat uniform

  this.u_OtherModel;
  this.u_LightColor;
  this.u_LightPosition;
  this.u_AmbientLight;
  this.u_SpecularColor;
  this.u_ViewerPos;
  this.u_IsBlinn;
  this.u_Shininess;
}

VBObox2.prototype.init = function()
 {
	this.shaderLoc = createProgram(gl, this.VERT_SRC, this.FRAG_SRC);
	if (!this.shaderLoc) 
  {
    console.log(this.constructor.name + 
    						'.init() failed to create executable Shaders on the GPU. Bye!');
    return;
  }
	
  gl.program = this.shaderLoc;	
	this.vboLoc = gl.createBuffer();	
  if (!this.vboLoc)
  {
    console.log(this.constructor.name + 
    						'.init() failed to create VBO in GPU. Bye!'); 
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER,	      // GLenum 'target' for this GPU buffer 
  								this.vboLoc);				  // the ID# the GPU uses for this buffer.

  gl.bufferData(gl.ARRAY_BUFFER, 			  // GLenum target(same as 'bindBuffer()')
 					 				this.vboContents, 		// JavaScript Float32Array
  							 	gl.STATIC_DRAW);			// Usage hint.

  this.a_PosLoc = gl.getAttribLocation(this.shaderLoc, 'a_Pos1');
  if(this.a_PosLoc < 0) 
  {
    console.log(this.constructor.name + 
    						'.init() Failed to get GPU location of attribute a_Pos1');
    return -1;	// error exit.
  }

  this.a_NormalLoc = gl.getAttribLocation(this.shaderLoc, 'a_Normal');
  if(this.a_Normal < 0) 
  {
    console.log(this.constructor.name + 
    						'.init() Failed to get GPU location of attribute a_Normal');
    return -1;	// error exit.
  }

 	this.a_ColrLoc = gl.getAttribLocation(this.shaderLoc, 'a_Colr1');
   if(this.a_ColrLoc < 0) 
  {
    console.log(this.constructor.name + 
    						'.init() failed to get the GPU location of attribute a_Colr1');
    return -1;	// error exit.
  }

	this.u_ModelMatLoc = gl.getUniformLocation(this.shaderLoc, 'u_ModelMat1');
  if (!this.u_ModelMatLoc) 
  { 
    console.log(this.constructor.name + 
    						'.init() failed to get GPU location for u_ModelMat1 uniform');
    return;
  }
  
  this.u_OtherModel = gl.getUniformLocation(this.shaderLoc, 'u_OtherModel');
  this.u_LightColor = gl.getUniformLocation(this.shaderLoc, 'u_LightColor');
  this.u_LightPosition = gl.getUniformLocation(this.shaderLoc, 'u_LightPosition');
  this.u_AmbientLight = gl.getUniformLocation(this.shaderLoc, 'u_AmbientLight');
  this.u_SpecularColor = gl.getUniformLocation(this.shaderLoc, 'u_SpecularColor');
  this.u_ViewerPos = gl.getUniformLocation(this.shaderLoc, 'u_ViewerPos');
  this.u_IsBlinn = gl.getUniformLocation(this.shaderLoc, 'u_IsBlinn');
  this.u_Shininess = gl.getUniformLocation(this.shaderLoc, 'u_Shininess');
  if (!this.u_IsBlinn || !this.u_ViewerPos || !this.u_SpecularColor || !this.u_OtherModel || !this.u_LightColor || !this.u_LightPosition || !this.u_AmbientLight)
  { 
    console.log('.init() Failed to get the storage location of a phong shader uniform thingy');
    return;
  }
}

VBObox2.prototype.switchToMe = function() 
{
  gl.useProgram(this.shaderLoc);

	gl.bindBuffer(gl.ARRAY_BUFFER,	        // GLenum 'target' for this GPU buffer 
										this.vboLoc);			    // the ID# the GPU uses for our VBO.

  gl.vertexAttribPointer(
		this.a_PosLoc,            //index == ID# for the attribute var in your GLSL shader pgm;
		this.vboFcount_a_Pos1,    // # of floats used by this attribute: 1,2,3 or 4?
		gl.FLOAT,			            // type == what data type did we use for those numbers?
		false,			             	// isNormalized == are these fixed-point values that we need normalize before use? true or false								
		this.vboStride,           // Stride == #bytes we must skip in the VBO to move to next attribute     
		this.vboOffset_a_Pos1);		// Offset == how many bytes from START of buffer to the first value we will actually use?  (We start with position).
		              
  gl.vertexAttribPointer(this.a_ColrLoc, this.vboFcount_a_Colr1, 
                        gl.FLOAT, false, 
                        this.vboStride, this.vboOffset_a_Colr1);

  gl.vertexAttribPointer(
		this.a_NormalLoc,            
		this.vboFcount_a_Pos1,   
		gl.FLOAT,			            
		false,			             							
		this.vboStride,        
		this.vboOffset_a_Pos1);	                        
  							
  gl.enableVertexAttribArray(this.a_PosLoc);
  gl.enableVertexAttribArray(this.a_ColrLoc);
  gl.enableVertexAttribArray(this.a_NormalLoc);
}

VBObox2.prototype.isReady = function() 
{
  var isOK = true;

  if(gl.getParameter(gl.CURRENT_PROGRAM) != this.shaderLoc)  
  {
    console.log(this.constructor.name + 
    						'.isReady() false: shader program at this.shaderLoc not in use!');
    isOK = false;
  }
  
  if(gl.getParameter(gl.ARRAY_BUFFER_BINDING) != this.vboLoc) 
  {
      console.log(this.constructor.name + 
  						'.isReady() false: vbo at this.vboLoc not in use!');
    isOK = false;
  }
  return isOK;
}

VBObox2.prototype.adjust = function() 
{
  if(this.isReady()==false) 
  {
        console.log('ERROR! before' + this.constructor.name + '.adjust() call you needed to call this.switchToMe()!!');
  }  
}

VBObox2.prototype.draw = function() 
{
  if(this.isReady()==false) 
  {
        console.log('ERROR! before' + this.constructor.name + '.draw() call you needed to call this.switchToMe()!!');
  }
  
  // Set the light color (white)
  gl.uniform3f(this.u_LightColor, g_diffuseColor[0]*g_DiffuseSwitch, g_diffuseColor[1]*g_DiffuseSwitch, g_diffuseColor[2]*g_DiffuseSwitch);
  // Set the light position (in the world coordinate)
  gl.uniform3f(this.u_LightPosition, g_lightPosition[0], g_lightPosition[1], g_lightPosition[2]);
  // Set the ambient light
  gl.uniform3f(this.u_AmbientLight, g_ambientColor[0]*g_AmbientSwitch, g_ambientColor[1]*g_AmbientSwitch, g_ambientColor[2]*g_AmbientSwitch);
  // Set the specular color
  gl.uniform3f(this.u_SpecularColor, g_specularColor[0]*g_SpecularSwitch, g_specularColor[1]*g_SpecularSwitch, g_specularColor[2]*g_SpecularSwitch);
  // Set viewer pos
  gl.uniform3f(this.u_ViewerPos, g_eyeX, g_eyeY, g_eyeZ);
  // Set blinn
  gl.uniform1f(this.u_IsBlinn, g_IsBlinn);
  // Set shininess
  gl.uniform1f(this.u_Shininess, g_Shininess);


  var OtherModel = new Matrix4(); // Model view projection matrix
  this.ModelMat = new Matrix4();

  // perspective(angle, aspect ratio, near, far)
  this.ModelMat.perspective(angle, 1, near, far);        

  // utilizing spherical coordinates
  g_aimX = g_eyeX + Math.sin(g_aimPhi)*Math.cos(g_aimTheta);
  g_aimY = g_eyeY + Math.sin(g_aimPhi)*Math.sin(g_aimTheta);
  g_aimZ = g_eyeZ + Math.cos(g_aimPhi);

  // lookAt(eye, aim, up)
  this.ModelMat.lookAt(g_eyeX, g_eyeY, g_eyeZ,
                       g_aimX, g_aimY, g_aimZ,
                            0,      0,      1);
  
  // transformations
  this.ModelMat.translate(0.0, 0.0, 0.3);
  this.ModelMat.scale(0.2, 0.2, 0.2);
  this.ModelMat.rotate(-1 * g_sphereRotationAngle, 0, 0, 1);
  gl.uniformMatrix4fv(this.u_ModelMatLoc, false, this.ModelMat.elements);	

  OtherModel.translate(0.0, 0.0, 0.3);
  OtherModel.scale(0.2, 0.2, 0.2);
  OtherModel.rotate(-1 * g_sphereRotationAngle, 0, 0, 1);
  gl.uniformMatrix4fv(this.u_OtherModel, false, OtherModel.elements);

  // draw sphere
  gl.drawArrays(gl.TRIANGLES, 0, this.vboVerts);
}

VBObox2.prototype.reload = function() 
{
 gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vboContents); 

}

// VERTEX LIST MAKERS --------------------------------------
// ---------------------------------------------------------

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

function makeSphere()
{
  return new Float32Array
  ([0.0,-1.0,0.0,1.0,-1.306012939612e-06,-0.9999999999991471,7.024692550196524e-18,
    0.20318100000000006,-0.96795,0.14761800000000003,1.0,0.21095266289464853,-0.9654061618992498,0.15326420516420788,
    -0.07760699999999998,-0.96795,0.23885299999999998,1.0,-0.08057675620781352,-0.9654060832357604,0.2479888723519962,
    0.7236069999999999,-0.44721999999999995,0.525725,1.0,0.7236067216830413,-0.4472196513214831,0.5257260653677089,
    0.6095470000000001,-0.657519,0.4428559999999999,1.0,0.6042310408008547,-0.6649722006723842,0.43899524105124693,
    0.812729,-0.502301,0.2952379999999999,1.0,0.8151848055269568,-0.503817229437447,0.2857305236756347,
    0.0,-1.0,0.0,1.0,-1.306012939612e-06,-0.9999999999991471,7.024692550196524e-18,
    -0.07760699999999998,-0.96795,0.23885299999999998,1.0,-0.08057675620781352,-0.9654060832357604,0.2479888723519962,
    -0.251147,-0.967949,0.0,1.0,-0.26075247981128585,-0.965405688957526,8.4223782992918e-07,
    0.0,-1.0,0.0,1.0,-1.306012939612e-06,-0.9999999999991471,7.024692550196524e-18,
    -0.251147,-0.967949,0.0,1.0,-0.26075247981128585,-0.965405688957526,8.4223782992918e-07,
    -0.07760699999999998,-0.96795,-0.23885299999999998,1.0,-0.08057588379380852,-0.9654061724258667,-0.24798880860410688,
    0.0,-1.0,0.0,1.0,-1.306012939612e-06,-0.9999999999991471,7.024692550196524e-18,
    -0.07760699999999998,-0.96795,-0.23885299999999998,1.0,-0.08057588379380852,-0.9654061724258667,-0.24798880860410688,
    0.20318100000000006,-0.96795,-0.14761800000000003,1.0,0.21095286907952562,-0.9654060533326492,-0.15326460522832558,
    0.7236069999999999,-0.44721999999999995,0.525725,1.0,0.7236067216830413,-0.4472196513214831,0.5257260653677089,
    0.812729,-0.502301,0.2952379999999999,1.0,0.8151848055269568,-0.503817229437447,0.2857305236756347,
    0.860698,-0.251151,0.442858,1.0,0.864986890060841,-0.24306353018273283,0.4389963557001157,
    -0.2763880000000001,-0.44721999999999995,0.850649,1.0,-0.27638775259514803,-0.44721995820039745,0.8506492339399584,
    -0.02963899999999997,-0.502302,0.8641839999999998,1.0,-0.019838689717257413,-0.5038192559913451,0.8635812548235572,
    -0.155215,-0.25115200000000004,0.955422,1.0,-0.15021677729008256,-0.24306351370824936,0.9583084305819194,
    -0.894426,-0.44721600000000006,0.0,1.0,-0.8944264388330798,-0.44721509983046726,3.5123469383576465e-18,
    -0.831051,-0.502299,0.23885299999999998,1.0,-0.8274488479658778,-0.5038149789897272,0.24798965894876002,
    -0.956626,-0.25114900000000007,0.14761800000000003,1.0,-0.9578262170326509,-0.24306111405524763,0.1532652367601444,
    -0.2763880000000001,-0.44721999999999995,-0.850649,1.0,-0.2763877525951483,-0.44721995820039734,-0.8506492339399583,
    -0.48397099999999993,-0.502302,-0.716565,1.0,-0.4915461091474215,-0.5038186497816622,-0.7103162610515219,
    -0.43600700000000003,-0.25115200000000004,-0.864188,1.0,-0.4417472320955005,-0.24306420283334987,-0.8635850718006606,
    0.7236069999999999,-0.44721999999999995,-0.525725,1.0,0.7236067216830413,-0.4472196513214831,-0.525726065367709,
    0.531941,-0.502302,-0.681712,1.0,0.5236579140350146,-0.503818798851909,-0.6869854488938736,
    0.6871589999999999,-0.25115200000000004,-0.681715,1.0,0.6848117102472356,-0.2430639714860927,-0.6869882293559796,
    0.7236069999999999,-0.44721999999999995,0.525725,1.0,0.7236067216830413,-0.4472196513214831,0.5257260653677089,
    0.860698,-0.251151,0.442858,1.0,0.864986890060841,-0.24306353018273283,0.4389963557001157,
    0.6871589999999999,-0.25115200000000004,0.6817150000000001,1.0,0.6848111757491196,-0.24306484466307332,0.6869884532203029,
    -0.2763880000000001,-0.44721999999999995,0.850649,1.0,-0.27638775259514803,-0.44721995820039745,0.8506492339399584,
    -0.155215,-0.25115200000000004,0.955422,1.0,-0.15021677729008256,-0.24306351370824936,0.9583084305819194,
    -0.43600700000000003,-0.25115200000000004,0.864188,1.0,-0.4417470436660011,-0.2430638114471244,0.8635852783466985,
    -0.894426,-0.44721600000000006,0.0,1.0,-0.8944264388330798,-0.44721509983046726,3.5123469383576465e-18,
    -0.956626,-0.25114900000000007,0.14761800000000003,1.0,-0.9578262170326509,-0.24306111405524763,0.1532652367601444,
    -0.956626,-0.25114900000000007,-0.14761800000000003,1.0,-0.9578262170326509,-0.24306111405524766,-0.15326523676014436,
    -0.2763880000000001,-0.44721999999999995,-0.850649,1.0,-0.2763877525951483,-0.44721995820039734,-0.8506492339399583,
    -0.43600700000000003,-0.25115200000000004,-0.864188,1.0,-0.4417472320955005,-0.24306420283334987,-0.8635850718006606,
    -0.155215,-0.25115200000000004,-0.955422,1.0,-0.1502164527684422,-0.24306415178722385,-0.9583083196099383,
    0.7236069999999999,-0.44721999999999995,-0.525725,1.0,0.7236067216830413,-0.4472196513214831,-0.525726065367709,
    0.6871589999999999,-0.25115200000000004,-0.681715,1.0,0.6848117102472356,-0.2430639714860927,-0.6869882293559796,
    0.860698,-0.251151,-0.442858,1.0,0.8649868190167103,-0.2430628154105527,-0.4389968914377966,
    0.2763880000000001,0.44721999999999995,0.850649,1.0,0.27638775259514803,0.44721995820039745,0.8506492339399583,
    0.48397099999999993,0.502302,0.7165650000000001,1.0,0.4915465997259058,0.5038185159472155,0.7103160164931138,
    0.23282200000000008,0.657519,0.7165629999999998,1.0,0.2307912277766018,0.6649729391400707,0.7103142962047043,
    -0.723607,0.44721999999999995,0.525725,1.0,-0.7236067216830413,0.4472196513214834,0.5257260653677087,
    -0.531941,0.502302,0.6817120000000001,1.0,-0.5236576234680893,0.50381866852951,0.6869857659550921,
    -0.609547,0.657519,0.4428559999999999,1.0,-0.6042309075875276,0.6649723338191165,0.4389952227201456,
    -0.723607,0.44721999999999995,-0.525725,1.0,-0.7236067216830412,0.44721965132148317,-0.5257260653677089,
    -0.812729,0.5023010000000001,-0.295238,1.0,-0.8151846510833863,0.503817580270061,-0.2857303456913146,
    -0.609547,0.657519,-0.442856,1.0,-0.6042309075875275,0.6649723338191165,-0.43899522272014574,
    0.2763880000000001,0.44721999999999995,-0.850649,1.0,0.27638775259514836,0.44721995820039734,-0.8506492339399583,
    0.02963899999999997,0.502302,-0.864184,1.0,0.019838395348954305,0.5038189457553266,-0.8635814425796619,
    0.23282200000000008,0.657519,-0.716563,1.0,0.230791227776602,0.6649729391400707,-0.7103142962047043,
    0.8944260000000002,0.44721600000000006,0.0,1.0,0.8944264388330799,0.4472150998304671,-7.024693876715296e-18,
    0.831051,0.502299,-0.23885299999999998,1.0,0.8274486846864867,0.5038152762710822,-0.24798959979502425,
    0.753442,0.6575150000000001,0.0,1.0,0.746871320486886,0.6649685937201661,-3.519020267383579e-18,
    0.251147,0.967949,0.0,1.0,0.26075244445654044,0.9654056985070778,0.0,
    0.07760699999999998,0.9679500000000001,-0.23885299999999998,1.0,0.0805764015653053,0.9654061629757468,-0.24798867715932643,
    0.0,1.0,0.0,1.0,1.3060129397770804e-06,0.9999999999991471,0.0,
    0.52573,0.850652,0.0,1.0,0.5257289266852015,0.8506521590206104,-1.057645314374342e-17,
    0.3618000000000001,0.8944290000000001,-0.26286300000000007,1.0,0.36820620295749656,0.8904258595923642,-0.2675181875552053,
    0.251147,0.967949,0.0,1.0,0.26075244445654044,0.9654056985070778,0.0,
    0.753442,0.6575150000000001,0.0,1.0,0.746871320486886,0.6649685937201661,-3.519020267383579e-18,
    0.6381939999999999,0.7236099999999999,-0.262864,1.0,0.6317479702095651,0.7275492343102217,-0.2675193708700447,
    0.52573,0.850652,0.0,1.0,0.5257289266852015,0.8506521590206104,-1.057645314374342e-17,
    0.251147,0.967949,0.0,1.0,0.26075244445654044,0.9654056985070778,0.0,
    0.3618000000000001,0.8944290000000001,-0.26286300000000007,1.0,0.36820620295749656,0.8904258595923642,-0.2675181875552053,
    0.07760699999999998,0.9679500000000001,-0.23885299999999998,1.0,0.0805764015653053,0.9654061629757468,-0.24798867715932643,
    0.3618000000000001,0.8944290000000001,-0.26286300000000007,1.0,0.36820620295749656,0.8904258595923642,-0.2675181875552053,
    0.16245599999999993,0.850654,-0.49999499999999997,1.0,0.16245637815790648,0.8506538865776185,-0.49999589042931863,
    0.07760699999999998,0.9679500000000001,-0.23885299999999998,1.0,0.0805764015653053,0.9654061629757468,-0.24798867715932643,
    0.52573,0.850652,0.0,1.0,0.5257289266852015,0.8506521590206104,-1.057645314374342e-17,
    0.6381939999999999,0.7236099999999999,-0.262864,1.0,0.6317479702095651,0.7275492343102217,-0.2675193708700447,
    0.3618000000000001,0.8944290000000001,-0.26286300000000007,1.0,0.36820620295749656,0.8904258595923642,-0.2675181875552053,
    0.6381939999999999,0.7236099999999999,-0.262864,1.0,0.6317479702095651,0.7275492343102217,-0.2675193708700447,
    0.44720899999999997,0.7236120000000001,-0.525728,1.0,0.44964377423881924,0.7275512992269764,-0.5181598047720494,
    0.3618000000000001,0.8944290000000001,-0.26286300000000007,1.0,0.36820620295749656,0.8904258595923642,-0.2675181875552053,
    0.3618000000000001,0.8944290000000001,-0.26286300000000007,1.0,0.36820620295749656,0.8904258595923642,-0.2675181875552053,
    0.44720899999999997,0.7236120000000001,-0.525728,1.0,0.44964377423881924,0.7275512992269764,-0.5181598047720494,
    0.16245599999999993,0.850654,-0.49999499999999997,1.0,0.16245637815790648,0.8506538865776185,-0.49999589042931863,
    0.44720899999999997,0.7236120000000001,-0.525728,1.0,0.44964377423881924,0.7275512992269764,-0.5181598047720494,
    0.23282200000000008,0.657519,-0.716563,1.0,0.230791227776602,0.6649729391400707,-0.7103142962047043,
    0.16245599999999993,0.850654,-0.49999499999999997,1.0,0.16245637815790648,0.8506538865776185,-0.49999589042931863,
    0.753442,0.6575150000000001,0.0,1.0,0.746871320486886,0.6649685937201661,-3.519020267383579e-18,
    0.831051,0.502299,-0.23885299999999998,1.0,0.8274486846864867,0.5038152762710822,-0.24798959979502425,
    0.6381939999999999,0.7236099999999999,-0.262864,1.0,0.6317479702095651,0.7275492343102217,-0.2675193708700447,
    0.831051,0.502299,-0.23885299999999998,1.0,0.8274486846864867,0.5038152762710822,-0.24798959979502425,
    0.6881889999999999,0.525736,-0.499997,1.0,0.688189315323338,0.5257353070007666,-0.49999785324299634,
    0.6381939999999999,0.7236099999999999,-0.262864,1.0,0.6317479702095651,0.7275492343102217,-0.2675193708700447,
    0.6381939999999999,0.7236099999999999,-0.262864,1.0,0.6317479702095651,0.7275492343102217,-0.2675193708700447,
    0.6881889999999999,0.525736,-0.499997,1.0,0.688189315323338,0.5257353070007666,-0.49999785324299634,
    0.44720899999999997,0.7236120000000001,-0.525728,1.0,0.44964377423881924,0.7275512992269764,-0.5181598047720494,
    0.6881889999999999,0.525736,-0.499997,1.0,0.688189315323338,0.5257353070007666,-0.49999785324299634,
    0.48397099999999993,0.502302,-0.716565,1.0,0.4915463260698537,0.5038187053981455,-0.7103160714908299,
    0.44720899999999997,0.7236120000000001,-0.525728,1.0,0.44964377423881924,0.7275512992269764,-0.5181598047720494,
    0.44720899999999997,0.7236120000000001,-0.525728,1.0,0.44964377423881924,0.7275512992269764,-0.5181598047720494,
    0.48397099999999993,0.502302,-0.716565,1.0,0.4915463260698537,0.5038187053981455,-0.7103160714908299,
    0.23282200000000008,0.657519,-0.716563,1.0,0.230791227776602,0.6649729391400707,-0.7103142962047043,
    0.48397099999999993,0.502302,-0.716565,1.0,0.4915463260698537,0.5038187053981455,-0.7103160714908299,
    0.2763880000000001,0.44721999999999995,-0.850649,1.0,0.27638775259514836,0.44721995820039734,-0.8506492339399583,
    0.23282200000000008,0.657519,-0.716563,1.0,0.230791227776602,0.6649729391400707,-0.7103142962047043,
    0.07760699999999998,0.9679500000000001,-0.23885299999999998,1.0,0.0805764015653053,0.9654061629757468,-0.24798867715932643,
    -0.20318100000000006,0.9679500000000001,-0.14761800000000003,1.0,-0.21095224816685468,0.9654061955752871,-0.15326456386980095,
    0.0,1.0,0.0,1.0,1.3060129397770804e-06,0.9999999999991471,0.0,
    0.16245599999999993,0.850654,-0.49999499999999997,1.0,0.16245637815790648,0.8506538865776185,-0.49999589042931863,
    -0.13819700000000001,0.8944299999999998,-0.425319,1.0,-0.14064429309391377,0.8904261866643726,-0.4328514628858925,
    0.07760699999999998,0.9679500000000001,-0.23885299999999998,1.0,0.0805764015653053,0.9654061629757468,-0.24798867715932643,
    0.23282200000000008,0.657519,-0.716563,1.0,0.230791227776602,0.6649729391400707,-0.7103142962047043,
    -0.052790000000000004,0.7236120000000001,-0.688185,1.0,-0.059207598386989156,0.7275518109725035,-0.6834931035817958,
    0.16245599999999993,0.850654,-0.49999499999999997,1.0,0.16245637815790648,0.8506538865776185,-0.49999589042931863,
    0.07760699999999998,0.9679500000000001,-0.23885299999999998,1.0,0.0805764015653053,0.9654061629757468,-0.24798867715932643,
    -0.13819700000000001,0.8944299999999998,-0.425319,1.0,-0.14064429309391377,0.8904261866643726,-0.4328514628858925,
    -0.20318100000000006,0.9679500000000001,-0.14761800000000003,1.0,-0.21095224816685468,0.9654061955752871,-0.15326456386980095,
    -0.13819700000000001,0.8944299999999998,-0.425319,1.0,-0.14064429309391377,0.8904261866643726,-0.4328514628858925,
    -0.425323,0.850654,-0.3090109999999999,1.0,-0.4253228822840165,0.8506537460570991,-0.3090123785945165,
    -0.20318100000000006,0.9679500000000001,-0.14761800000000003,1.0,-0.21095224816685468,0.9654061955752871,-0.15326456386980095,
    0.16245599999999993,0.850654,-0.49999499999999997,1.0,0.16245637815790648,0.8506538865776185,-0.49999589042931863,
    -0.052790000000000004,0.7236120000000001,-0.688185,1.0,-0.059207598386989156,0.7275518109725035,-0.6834931035817958,
    -0.13819700000000001,0.8944299999999998,-0.425319,1.0,-0.14064429309391377,0.8904261866643726,-0.4328514628858925,
    -0.052790000000000004,0.7236120000000001,-0.688185,1.0,-0.059207598386989156,0.7275518109725035,-0.6834931035817958,
    -0.361804,0.7236120000000001,-0.587778,1.0,-0.3538539217412299,0.7275517393882928,-0.5877549392233308,
    -0.13819700000000001,0.8944299999999998,-0.425319,1.0,-0.14064429309391377,0.8904261866643726,-0.4328514628858925,
    -0.13819700000000001,0.8944299999999998,-0.425319,1.0,-0.14064429309391377,0.8904261866643726,-0.4328514628858925,
    -0.361804,0.7236120000000001,-0.587778,1.0,-0.3538539217412299,0.7275517393882928,-0.5877549392233308,
    -0.425323,0.850654,-0.3090109999999999,1.0,-0.4253228822840165,0.8506537460570991,-0.3090123785945165,
    -0.361804,0.7236120000000001,-0.587778,1.0,-0.3538539217412299,0.7275517393882928,-0.5877549392233308,
    -0.609547,0.657519,-0.442856,1.0,-0.6042309075875275,0.6649723338191165,-0.43899522272014574,
    -0.425323,0.850654,-0.3090109999999999,1.0,-0.4253228822840165,0.8506537460570991,-0.3090123785945165,
    0.23282200000000008,0.657519,-0.716563,1.0,0.230791227776602,0.6649729391400707,-0.7103142962047043,
    0.02963899999999997,0.502302,-0.864184,1.0,0.019838395348954305,0.5038189457553266,-0.8635814425796619,
    -0.052790000000000004,0.7236120000000001,-0.688185,1.0,-0.059207598386989156,0.7275518109725035,-0.6834931035817958,
    0.02963899999999997,0.502302,-0.864184,1.0,0.019838395348954305,0.5038189457553266,-0.8635814425796619,
    -0.262869,0.525738,-0.809012,1.0,-0.2628688830438233,0.5257372869737825,-0.8090119006619986,
    -0.052790000000000004,0.7236120000000001,-0.688185,1.0,-0.059207598386989156,0.7275518109725035,-0.6834931035817958,
    -0.052790000000000004,0.7236120000000001,-0.688185,1.0,-0.059207598386989156,0.7275518109725035,-0.6834931035817958,
    -0.262869,0.525738,-0.809012,1.0,-0.2628688830438233,0.5257372869737825,-0.8090119006619986,
    -0.361804,0.7236120000000001,-0.587778,1.0,-0.3538539217412299,0.7275517393882928,-0.5877549392233308,
    -0.262869,0.525738,-0.809012,1.0,-0.2628688830438233,0.5257372869737825,-0.8090119006619986,
    -0.531941,0.502302,-0.681712,1.0,-0.5236577408730431,0.5038188776590388,-0.6869855230921009,
    -0.361804,0.7236120000000001,-0.587778,1.0,-0.3538539217412299,0.7275517393882928,-0.5877549392233308,
    -0.361804,0.7236120000000001,-0.587778,1.0,-0.3538539217412299,0.7275517393882928,-0.5877549392233308,
    -0.531941,0.502302,-0.681712,1.0,-0.5236577408730431,0.5038188776590388,-0.6869855230921009,
    -0.609547,0.657519,-0.442856,1.0,-0.6042309075875275,0.6649723338191165,-0.43899522272014574,
    -0.531941,0.502302,-0.681712,1.0,-0.5236577408730431,0.5038188776590388,-0.6869855230921009,
    -0.723607,0.44721999999999995,-0.525725,1.0,-0.7236067216830412,0.44721965132148317,-0.5257260653677089,
    -0.609547,0.657519,-0.442856,1.0,-0.6042309075875275,0.6649723338191165,-0.43899522272014574,
    -0.20318100000000006,0.9679500000000001,-0.14761800000000003,1.0,-0.21095224816685468,0.9654061955752871,-0.15326456386980095,
    -0.20318100000000006,0.9679500000000001,0.14761800000000003,1.0,-0.21095224816685468,0.9654061955752871,0.15326456386980092,
    0.0,1.0,0.0,1.0,1.3060129397770804e-06,0.9999999999991471,0.0,
    -0.425323,0.850654,-0.3090109999999999,1.0,-0.4253228822840165,0.8506537460570991,-0.3090123785945165,
    -0.44721,0.8944290000000001,0.0,1.0,-0.4551286493768027,0.8904256917432513,3.526214980202345e-18,
    -0.20318100000000006,0.9679500000000001,-0.14761800000000003,1.0,-0.21095224816685468,0.9654061955752871,-0.15326456386980095,
    -0.609547,0.657519,-0.442856,1.0,-0.6042309075875275,0.6649723338191165,-0.43899522272014574,
    -0.670817,0.723611,-0.16245699999999996,1.0,-0.6683380216406349,0.7275501061976027,-0.15490362100783547,
    -0.425323,0.850654,-0.3090109999999999,1.0,-0.4253228822840165,0.8506537460570991,-0.3090123785945165,
    -0.20318100000000006,0.9679500000000001,-0.14761800000000003,1.0,-0.21095224816685468,0.9654061955752871,-0.15326456386980095,
    -0.44721,0.8944290000000001,0.0,1.0,-0.4551286493768027,0.8904256917432513,3.526214980202345e-18,
    -0.20318100000000006,0.9679500000000001,0.14761800000000003,1.0,-0.21095224816685468,0.9654061955752871,0.15326456386980092,
    -0.44721,0.8944290000000001,0.0,1.0,-0.4551286493768027,0.8904256917432513,3.526214980202345e-18,
    -0.425323,0.850654,0.3090109999999999,1.0,-0.4253228822840165,0.8506537460570992,0.3090123785945165,
    -0.20318100000000006,0.9679500000000001,0.14761800000000003,1.0,-0.21095224816685468,0.9654061955752871,0.15326456386980092,
    -0.425323,0.850654,-0.3090109999999999,1.0,-0.4253228822840165,0.8506537460570991,-0.3090123785945165,
    -0.670817,0.723611,-0.16245699999999996,1.0,-0.6683380216406349,0.7275501061976027,-0.15490362100783547,
    -0.44721,0.8944290000000001,0.0,1.0,-0.4551286493768027,0.8904256917432513,3.526214980202345e-18,
    -0.670817,0.723611,-0.16245699999999996,1.0,-0.6683380216406349,0.7275501061976027,-0.15490362100783547,
    -0.670817,0.723611,0.16245700000000007,1.0,-0.6683380216406349,0.7275501061976029,0.15490362100783564,
    -0.44721,0.8944290000000001,0.0,1.0,-0.4551286493768027,0.8904256917432513,3.526214980202345e-18,
    -0.44721,0.8944290000000001,0.0,1.0,-0.4551286493768027,0.8904256917432513,3.526214980202345e-18,
    -0.670817,0.723611,0.16245700000000007,1.0,-0.6683380216406349,0.7275501061976029,0.15490362100783564,
    -0.425323,0.850654,0.3090109999999999,1.0,-0.4253228822840165,0.8506537460570992,0.3090123785945165,
    -0.670817,0.723611,0.16245700000000007,1.0,-0.6683380216406349,0.7275501061976029,0.15490362100783564,
    -0.609547,0.657519,0.4428559999999999,1.0,-0.6042309075875276,0.6649723338191165,0.4389952227201456,
    -0.425323,0.850654,0.3090109999999999,1.0,-0.4253228822840165,0.8506537460570992,0.3090123785945165,
    -0.609547,0.657519,-0.442856,1.0,-0.6042309075875275,0.6649723338191165,-0.43899522272014574,
    -0.812729,0.5023010000000001,-0.295238,1.0,-0.8151846510833863,0.503817580270061,-0.2857303456913146,
    -0.670817,0.723611,-0.16245699999999996,1.0,-0.6683380216406349,0.7275501061976027,-0.15490362100783547,
    -0.812729,0.5023010000000001,-0.295238,1.0,-0.8151846510833863,0.503817580270061,-0.2857303456913146,
    -0.850648,0.525736,0.0,1.0,-0.850648504669507,0.5257348395374611,-2.2739670286765194e-07,
    -0.670817,0.723611,-0.16245699999999996,1.0,-0.6683380216406349,0.7275501061976027,-0.15490362100783547,
    -0.670817,0.723611,-0.16245699999999996,1.0,-0.6683380216406349,0.7275501061976027,-0.15490362100783547,
    -0.850648,0.525736,0.0,1.0,-0.850648504669507,0.5257348395374611,-2.2739670286765194e-07,
    -0.670817,0.723611,0.16245700000000007,1.0,-0.6683380216406349,0.7275501061976029,0.15490362100783564,
    -0.850648,0.525736,0.0,1.0,-0.850648504669507,0.5257348395374611,-2.2739670286765194e-07,
    -0.812729,0.5023010000000001,0.2952379999999999,1.0,-0.8151843815554107,0.5038178905016056,0.28573056763082694,
    -0.670817,0.723611,0.16245700000000007,1.0,-0.6683380216406349,0.7275501061976029,0.15490362100783564,
    -0.670817,0.723611,0.16245700000000007,1.0,-0.6683380216406349,0.7275501061976029,0.15490362100783564,
    -0.812729,0.5023010000000001,0.2952379999999999,1.0,-0.8151843815554107,0.5038178905016056,0.28573056763082694,
    -0.609547,0.657519,0.4428559999999999,1.0,-0.6042309075875276,0.6649723338191165,0.4389952227201456,
    -0.812729,0.5023010000000001,0.2952379999999999,1.0,-0.8151843815554107,0.5038178905016056,0.28573056763082694,
    -0.723607,0.44721999999999995,0.525725,1.0,-0.7236067216830413,0.4472196513214834,0.5257260653677087,
    -0.609547,0.657519,0.4428559999999999,1.0,-0.6042309075875276,0.6649723338191165,0.4389952227201456,
    -0.20318100000000006,0.9679500000000001,0.14761800000000003,1.0,-0.21095224816685468,0.9654061955752871,0.15326456386980092,
    0.07760699999999998,0.9679500000000001,0.23885299999999998,1.0,0.08057640156530528,0.9654061629757468,0.24798867715932643,
    0.0,1.0,0.0,1.0,1.3060129397770804e-06,0.9999999999991471,0.0,
    -0.425323,0.850654,0.3090109999999999,1.0,-0.4253228822840165,0.8506537460570992,0.3090123785945165,
    -0.13819700000000001,0.8944299999999998,0.425319,1.0,-0.1406442930939137,0.8904261866643726,0.4328514628858925,
    -0.20318100000000006,0.9679500000000001,0.14761800000000003,1.0,-0.21095224816685468,0.9654061955752871,0.15326456386980092,
    -0.609547,0.657519,0.4428559999999999,1.0,-0.6042309075875276,0.6649723338191165,0.4389952227201456,
    -0.361804,0.7236120000000001,0.5877780000000001,1.0,-0.35385392174123004,0.7275517393882929,0.5877549392233307,
    -0.425323,0.850654,0.3090109999999999,1.0,-0.4253228822840165,0.8506537460570992,0.3090123785945165,
    -0.20318100000000006,0.9679500000000001,0.14761800000000003,1.0,-0.21095224816685468,0.9654061955752871,0.15326456386980092,
    -0.13819700000000001,0.8944299999999998,0.425319,1.0,-0.1406442930939137,0.8904261866643726,0.4328514628858925,
    0.07760699999999998,0.9679500000000001,0.23885299999999998,1.0,0.08057640156530528,0.9654061629757468,0.24798867715932643,
    -0.13819700000000001,0.8944299999999998,0.425319,1.0,-0.1406442930939137,0.8904261866643726,0.4328514628858925,
    0.16245599999999993,0.850654,0.49999499999999997,1.0,0.16245637815790648,0.8506538865776185,0.49999589042931875,
    0.07760699999999998,0.9679500000000001,0.23885299999999998,1.0,0.08057640156530528,0.9654061629757468,0.24798867715932643,
    -0.425323,0.850654,0.3090109999999999,1.0,-0.4253228822840165,0.8506537460570992,0.3090123785945165,
    -0.361804,0.7236120000000001,0.5877780000000001,1.0,-0.35385392174123004,0.7275517393882929,0.5877549392233307,
    -0.13819700000000001,0.8944299999999998,0.425319,1.0,-0.1406442930939137,0.8904261866643726,0.4328514628858925,
    -0.361804,0.7236120000000001,0.5877780000000001,1.0,-0.35385392174123004,0.7275517393882929,0.5877549392233307,
    -0.052790000000000004,0.7236120000000001,0.688185,1.0,-0.0592075983869889,0.7275518109725035,0.6834931035817959,
    -0.13819700000000001,0.8944299999999998,0.425319,1.0,-0.1406442930939137,0.8904261866643726,0.4328514628858925,
    -0.13819700000000001,0.8944299999999998,0.425319,1.0,-0.1406442930939137,0.8904261866643726,0.4328514628858925,
    -0.052790000000000004,0.7236120000000001,0.688185,1.0,-0.0592075983869889,0.7275518109725035,0.6834931035817959,
    0.16245599999999993,0.850654,0.49999499999999997,1.0,0.16245637815790648,0.8506538865776185,0.49999589042931875,
    -0.052790000000000004,0.7236120000000001,0.688185,1.0,-0.0592075983869889,0.7275518109725035,0.6834931035817959,
    0.23282200000000008,0.657519,0.7165629999999998,1.0,0.2307912277766018,0.6649729391400707,0.7103142962047043,
    0.16245599999999993,0.850654,0.49999499999999997,1.0,0.16245637815790648,0.8506538865776185,0.49999589042931875,
    -0.609547,0.657519,0.4428559999999999,1.0,-0.6042309075875276,0.6649723338191165,0.4389952227201456,
    -0.531941,0.502302,0.6817120000000001,1.0,-0.5236576234680893,0.50381866852951,0.6869857659550921,
    -0.361804,0.7236120000000001,0.5877780000000001,1.0,-0.35385392174123004,0.7275517393882929,0.5877549392233307,
    -0.531941,0.502302,0.6817120000000001,1.0,-0.5236576234680893,0.50381866852951,0.6869857659550921,
    -0.262869,0.525738,0.8090120000000001,1.0,-0.26286917763817624,0.5257368727147139,0.8090120741472168,
    -0.361804,0.7236120000000001,0.5877780000000001,1.0,-0.35385392174123004,0.7275517393882929,0.5877549392233307,
    -0.361804,0.7236120000000001,0.5877780000000001,1.0,-0.35385392174123004,0.7275517393882929,0.5877549392233307,
    -0.262869,0.525738,0.8090120000000001,1.0,-0.26286917763817624,0.5257368727147139,0.8090120741472168,
    -0.052790000000000004,0.7236120000000001,0.688185,1.0,-0.0592075983869889,0.7275518109725035,0.6834931035817959,
    -0.262869,0.525738,0.8090120000000001,1.0,-0.26286917763817624,0.5257368727147139,0.8090120741472168,
    0.02963899999999997,0.502302,0.8641839999999998,1.0,0.01983839534895446,0.5038189457553266,0.8635814425796619,
    -0.052790000000000004,0.7236120000000001,0.688185,1.0,-0.0592075983869889,0.7275518109725035,0.6834931035817959,
    -0.052790000000000004,0.7236120000000001,0.688185,1.0,-0.0592075983869889,0.7275518109725035,0.6834931035817959,
    0.02963899999999997,0.502302,0.8641839999999998,1.0,0.01983839534895446,0.5038189457553266,0.8635814425796619,
    0.23282200000000008,0.657519,0.7165629999999998,1.0,0.2307912277766018,0.6649729391400707,0.7103142962047043,
    0.02963899999999997,0.502302,0.8641839999999998,1.0,0.01983839534895446,0.5038189457553266,0.8635814425796619,
    0.2763880000000001,0.44721999999999995,0.850649,1.0,0.27638775259514803,0.44721995820039745,0.8506492339399583,
    0.23282200000000008,0.657519,0.7165629999999998,1.0,0.2307912277766018,0.6649729391400707,0.7103142962047043,
    0.07760699999999998,0.9679500000000001,0.23885299999999998,1.0,0.08057640156530528,0.9654061629757468,0.24798867715932643,
    0.251147,0.967949,0.0,1.0,0.26075244445654044,0.9654056985070778,0.0,
    0.0,1.0,0.0,1.0,1.3060129397770804e-06,0.9999999999991471,0.0,
    0.16245599999999993,0.850654,0.49999499999999997,1.0,0.16245637815790648,0.8506538865776185,0.49999589042931875,
    0.3618000000000001,0.8944290000000001,0.26286300000000007,1.0,0.36820620295749656,0.8904258595923642,0.26751818755520523,
    0.07760699999999998,0.9679500000000001,0.23885299999999998,1.0,0.08057640156530528,0.9654061629757468,0.24798867715932643,
    0.23282200000000008,0.657519,0.7165629999999998,1.0,0.2307912277766018,0.6649729391400707,0.7103142962047043,
    0.44720899999999997,0.7236120000000001,0.525728,1.0,0.4496437742388191,0.7275512992269764,0.5181598047720494,
    0.16245599999999993,0.850654,0.49999499999999997,1.0,0.16245637815790648,0.8506538865776185,0.49999589042931875,
    0.07760699999999998,0.9679500000000001,0.23885299999999998,1.0,0.08057640156530528,0.9654061629757468,0.24798867715932643,
    0.3618000000000001,0.8944290000000001,0.26286300000000007,1.0,0.36820620295749656,0.8904258595923642,0.26751818755520523,
    0.251147,0.967949,0.0,1.0,0.26075244445654044,0.9654056985070778,0.0,
    0.3618000000000001,0.8944290000000001,0.26286300000000007,1.0,0.36820620295749656,0.8904258595923642,0.26751818755520523,
    0.52573,0.850652,0.0,1.0,0.5257289266852015,0.8506521590206104,-1.057645314374342e-17,
    0.251147,0.967949,0.0,1.0,0.26075244445654044,0.9654056985070778,0.0,
    0.16245599999999993,0.850654,0.49999499999999997,1.0,0.16245637815790648,0.8506538865776185,0.49999589042931875,
    0.44720899999999997,0.7236120000000001,0.525728,1.0,0.4496437742388191,0.7275512992269764,0.5181598047720494,
    0.3618000000000001,0.8944290000000001,0.26286300000000007,1.0,0.36820620295749656,0.8904258595923642,0.26751818755520523,
    0.44720899999999997,0.7236120000000001,0.525728,1.0,0.4496437742388191,0.7275512992269764,0.5181598047720494,
    0.6381939999999999,0.7236099999999999,0.262864,1.0,0.6317479702095651,0.7275492343102217,0.2675193708700447,
    0.3618000000000001,0.8944290000000001,0.26286300000000007,1.0,0.36820620295749656,0.8904258595923642,0.26751818755520523,
    0.3618000000000001,0.8944290000000001,0.26286300000000007,1.0,0.36820620295749656,0.8904258595923642,0.26751818755520523,
    0.6381939999999999,0.7236099999999999,0.262864,1.0,0.6317479702095651,0.7275492343102217,0.2675193708700447,
    0.52573,0.850652,0.0,1.0,0.5257289266852015,0.8506521590206104,-1.057645314374342e-17,
    0.6381939999999999,0.7236099999999999,0.262864,1.0,0.6317479702095651,0.7275492343102217,0.2675193708700447,
    0.753442,0.6575150000000001,0.0,1.0,0.746871320486886,0.6649685937201661,-3.519020267383579e-18,
    0.52573,0.850652,0.0,1.0,0.5257289266852015,0.8506521590206104,-1.057645314374342e-17,
    0.23282200000000008,0.657519,0.7165629999999998,1.0,0.2307912277766018,0.6649729391400707,0.7103142962047043,
    0.48397099999999993,0.502302,0.7165650000000001,1.0,0.4915465997259058,0.5038185159472155,0.7103160164931138,
    0.44720899999999997,0.7236120000000001,0.525728,1.0,0.4496437742388191,0.7275512992269764,0.5181598047720494,
    0.48397099999999993,0.502302,0.7165650000000001,1.0,0.4915465997259058,0.5038185159472155,0.7103160164931138,
    0.6881889999999999,0.525736,0.499997,1.0,0.6881896241859202,0.5257346676673482,0.49999810037193615,
    0.44720899999999997,0.7236120000000001,0.525728,1.0,0.4496437742388191,0.7275512992269764,0.5181598047720494,
    0.44720899999999997,0.7236120000000001,0.525728,1.0,0.4496437742388191,0.7275512992269764,0.5181598047720494,
    0.6881889999999999,0.525736,0.499997,1.0,0.6881896241859202,0.5257346676673482,0.49999810037193615,
    0.6381939999999999,0.7236099999999999,0.262864,1.0,0.6317479702095651,0.7275492343102217,0.2675193708700447,
    0.6881889999999999,0.525736,0.499997,1.0,0.6881896241859202,0.5257346676673482,0.49999810037193615,
    0.831051,0.502299,0.23885299999999998,1.0,0.8274487904509396,0.5038149163054394,0.24798997820359664,
    0.6381939999999999,0.7236099999999999,0.262864,1.0,0.6317479702095651,0.7275492343102217,0.2675193708700447,
    0.6381939999999999,0.7236099999999999,0.262864,1.0,0.6317479702095651,0.7275492343102217,0.2675193708700447,
    0.831051,0.502299,0.23885299999999998,1.0,0.8274487904509396,0.5038149163054394,0.24798997820359664,
    0.753442,0.6575150000000001,0.0,1.0,0.746871320486886,0.6649685937201661,-3.519020267383579e-18,
    0.831051,0.502299,0.23885299999999998,1.0,0.8274487904509396,0.5038149163054394,0.24798997820359664,
    0.8944260000000002,0.44721600000000006,0.0,1.0,0.8944264388330799,0.4472150998304671,-7.024693876715296e-18,
    0.753442,0.6575150000000001,0.0,1.0,0.746871320486886,0.6649685937201661,-3.519020267383579e-18,
    0.956626,0.25114900000000007,-0.14761800000000003,1.0,0.9578262483355788,0.24306118218022527,-0.15326493309476094,
    0.831051,0.502299,-0.23885299999999998,1.0,0.8274486846864867,0.5038152762710822,-0.24798959979502425,
    0.8944260000000002,0.44721600000000006,0.0,1.0,0.8944264388330799,0.4472150998304671,-7.024693876715296e-18,
    0.951058,0.0,-0.309013,1.0,0.9510575012112954,5.074933413732154e-07,-0.30901396309789836,
    0.861804,0.2763960000000001,-0.425322,1.0,0.8593175031254149,0.27241679196618035,-0.43285392487207186,
    0.956626,0.25114900000000007,-0.14761800000000003,1.0,0.9578262483355788,0.24306118218022527,-0.15326493309476094,
    0.860698,-0.251151,-0.442858,1.0,0.8649868190167103,-0.2430628154105527,-0.4389968914377966,
    0.8090190000000002,0.0,-0.587782,1.0,0.8089870842176278,0.008873212629478702,-0.5877594437069411,
    0.951058,0.0,-0.309013,1.0,0.9510575012112954,5.074933413732154e-07,-0.30901396309789836,
    0.956626,0.25114900000000007,-0.14761800000000003,1.0,0.9578262483355788,0.24306118218022527,-0.15326493309476094,
    0.861804,0.2763960000000001,-0.425322,1.0,0.8593175031254149,0.27241679196618035,-0.43285392487207186,
    0.831051,0.502299,-0.23885299999999998,1.0,0.8274486846864867,0.5038152762710822,-0.24798959979502425,
    0.861804,0.2763960000000001,-0.425322,1.0,0.8593175031254149,0.27241679196618035,-0.43285392487207186,
    0.6881889999999999,0.525736,-0.499997,1.0,0.688189315323338,0.5257353070007666,-0.49999785324299634,
    0.831051,0.502299,-0.23885299999999998,1.0,0.8274486846864867,0.5038152762710822,-0.24798959979502425,
    0.951058,0.0,-0.309013,1.0,0.9510575012112954,5.074933413732154e-07,-0.30901396309789836,
    0.8090190000000002,0.0,-0.587782,1.0,0.8089870842176278,0.008873212629478702,-0.5877594437069411,
    0.861804,0.2763960000000001,-0.425322,1.0,0.8593175031254149,0.27241679196618035,-0.43285392487207186,
    0.8090190000000002,0.0,-0.587782,1.0,0.8089870842176278,0.008873212629478702,-0.5877594437069411,
    0.6708210000000001,0.276397,-0.688189,1.0,0.6772151552047805,0.272417935232739,-0.6834969657024793,
    0.861804,0.2763960000000001,-0.425322,1.0,0.8593175031254149,0.27241679196618035,-0.43285392487207186,
    0.861804,0.2763960000000001,-0.425322,1.0,0.8593175031254149,0.27241679196618035,-0.43285392487207186,
    0.6708210000000001,0.276397,-0.688189,1.0,0.6772151552047805,0.272417935232739,-0.6834969657024793,
    0.6881889999999999,0.525736,-0.499997,1.0,0.688189315323338,0.5257353070007666,-0.49999785324299634,
    0.6708210000000001,0.276397,-0.688189,1.0,0.6772151552047805,0.272417935232739,-0.6834969657024793,
    0.48397099999999993,0.502302,-0.716565,1.0,0.4915463260698537,0.5038187053981455,-0.7103160714908299,
    0.6881889999999999,0.525736,-0.499997,1.0,0.688189315323338,0.5257353070007666,-0.49999785324299634,
    0.860698,-0.251151,-0.442858,1.0,0.8649868190167103,-0.2430628154105527,-0.4389968914377966,
    0.6871589999999999,-0.25115200000000004,-0.681715,1.0,0.6848117102472356,-0.2430639714860927,-0.6869882293559796,
    0.8090190000000002,0.0,-0.587782,1.0,0.8089870842176278,0.008873212629478702,-0.5877594437069411,
    0.6871589999999999,-0.25115200000000004,-0.681715,1.0,0.6848117102472356,-0.2430639714860927,-0.6869882293559796,
    0.5877859999999999,0.0,-0.809017,1.0,0.5877858829948915,-2.554691144635855e-08,-0.809016536142442,
    0.8090190000000002,0.0,-0.587782,1.0,0.8089870842176278,0.008873212629478702,-0.5877594437069411,
    0.8090190000000002,0.0,-0.587782,1.0,0.8089870842176278,0.008873212629478702,-0.5877594437069411,
    0.5877859999999999,0.0,-0.809017,1.0,0.5877858829948915,-2.554691144635855e-08,-0.809016536142442,
    0.6708210000000001,0.276397,-0.688189,1.0,0.6772151552047805,0.272417935232739,-0.6834969657024793,
    0.5877859999999999,0.0,-0.809017,1.0,0.5877858829948915,-2.554691144635855e-08,-0.809016536142442,
    0.43600700000000003,0.25115200000000004,-0.864188,1.0,0.44174743584464,0.2430637566759591,-0.8635850931525253,
    0.6708210000000001,0.276397,-0.688189,1.0,0.6772151552047805,0.272417935232739,-0.6834969657024793,
    0.6708210000000001,0.276397,-0.688189,1.0,0.6772151552047805,0.272417935232739,-0.6834969657024793,
    0.43600700000000003,0.25115200000000004,-0.864188,1.0,0.44174743584464,0.2430637566759591,-0.8635850931525253,
    0.48397099999999993,0.502302,-0.716565,1.0,0.4915463260698537,0.5038187053981455,-0.7103160714908299,
    0.43600700000000003,0.25115200000000004,-0.864188,1.0,0.44174743584464,0.2430637566759591,-0.8635850931525253,
    0.2763880000000001,0.44721999999999995,-0.850649,1.0,0.27638775259514836,0.44721995820039734,-0.8506492339399583,
    0.48397099999999993,0.502302,-0.716565,1.0,0.4915463260698537,0.5038187053981455,-0.7103160714908299,
    0.1552150000000001,0.25115200000000004,-0.955422,1.0,0.15021657377136222,0.24306347133980513,-0.9583084732301164,
    0.02963899999999997,0.502302,-0.864184,1.0,0.019838395348954305,0.5038189457553266,-0.8635814425796619,
    0.2763880000000001,0.44721999999999995,-0.850649,1.0,0.27638775259514836,0.44721995820039734,-0.8506492339399583,
    0.0,0.0,-1.0,1.0,8.386527000463054e-07,1.0350315843348408e-07,-0.999999999999643,
    -0.13819899999999996,0.276397,-0.951055,1.0,-0.14612907117205193,0.2724178643965829,-0.9510177715037708,
    0.1552150000000001,0.25115200000000004,-0.955422,1.0,0.15021657377136222,0.24306347133980513,-0.9583084732301164,
    -0.155215,-0.25115200000000004,-0.955422,1.0,-0.1502164527684422,-0.24306415178722385,-0.9583083196099383,
    -0.30901599999999996,0.0,-0.951057,1.0,-0.30900375318742496,0.00887256725174435,-0.9510194309615595,
    0.0,0.0,-1.0,1.0,8.386527000463054e-07,1.0350315843348408e-07,-0.999999999999643,
    0.1552150000000001,0.25115200000000004,-0.955422,1.0,0.15021657377136222,0.24306347133980513,-0.9583084732301164,
    -0.13819899999999996,0.276397,-0.951055,1.0,-0.14612907117205193,0.2724178643965829,-0.9510177715037708,
    0.02963899999999997,0.502302,-0.864184,1.0,0.019838395348954305,0.5038189457553266,-0.8635814425796619,
    -0.13819899999999996,0.276397,-0.951055,1.0,-0.14612907117205193,0.2724178643965829,-0.9510177715037708,
    -0.262869,0.525738,-0.809012,1.0,-0.2628688830438233,0.5257372869737825,-0.8090119006619986,
    0.02963899999999997,0.502302,-0.864184,1.0,0.019838395348954305,0.5038189457553266,-0.8635814425796619,
    0.0,0.0,-1.0,1.0,8.386527000463054e-07,1.0350315843348408e-07,-0.999999999999643,
    -0.30901599999999996,0.0,-0.951057,1.0,-0.30900375318742496,0.00887256725174435,-0.9510194309615595,
    -0.13819899999999996,0.276397,-0.951055,1.0,-0.14612907117205193,0.2724178643965829,-0.9510177715037708,
    -0.30901599999999996,0.0,-0.951057,1.0,-0.30900375318742496,0.00887256725174435,-0.9510194309615595,
    -0.4472149999999999,0.276397,-0.850649,1.0,-0.440777418602302,0.2724181414021976,-0.8552798509758447,
    -0.13819899999999996,0.276397,-0.951055,1.0,-0.14612907117205193,0.2724178643965829,-0.9510177715037708,
    -0.13819899999999996,0.276397,-0.951055,1.0,-0.14612907117205193,0.2724178643965829,-0.9510177715037708,
    -0.4472149999999999,0.276397,-0.850649,1.0,-0.440777418602302,0.2724181414021976,-0.8552798509758447,
    -0.262869,0.525738,-0.809012,1.0,-0.2628688830438233,0.5257372869737825,-0.8090119006619986,
    -0.4472149999999999,0.276397,-0.850649,1.0,-0.440777418602302,0.2724181414021976,-0.8552798509758447,
    -0.531941,0.502302,-0.681712,1.0,-0.5236577408730431,0.5038188776590388,-0.6869855230921009,
    -0.262869,0.525738,-0.809012,1.0,-0.2628688830438233,0.5257372869737825,-0.8090119006619986,
    -0.155215,-0.25115200000000004,-0.955422,1.0,-0.1502164527684422,-0.24306415178722385,-0.9583083196099383,
    -0.43600700000000003,-0.25115200000000004,-0.864188,1.0,-0.4417472320955005,-0.24306420283334987,-0.8635850718006606,
    -0.30901599999999996,0.0,-0.951057,1.0,-0.30900375318742496,0.00887256725174435,-0.9510194309615595,
    -0.43600700000000003,-0.25115200000000004,-0.864188,1.0,-0.4417472320955005,-0.24306420283334987,-0.8635850718006606,
    -0.587786,0.0,-0.809017,1.0,-0.5877863671165282,8.898111888585574e-08,-0.8090161844066818,
    -0.30901599999999996,0.0,-0.951057,1.0,-0.30900375318742496,0.00887256725174435,-0.9510194309615595,
    -0.30901599999999996,0.0,-0.951057,1.0,-0.30900375318742496,0.00887256725174435,-0.9510194309615595,
    -0.587786,0.0,-0.809017,1.0,-0.5877863671165282,8.898111888585574e-08,-0.8090161844066818,
    -0.4472149999999999,0.276397,-0.850649,1.0,-0.440777418602302,0.2724181414021976,-0.8552798509758447,
    -0.587786,0.0,-0.809017,1.0,-0.5877863671165282,8.898111888585574e-08,-0.8090161844066818,
    -0.687159,0.25115200000000004,-0.681715,1.0,-0.6848117463759701,0.2430639454016199,-0.6869882025706792,
    -0.4472149999999999,0.276397,-0.850649,1.0,-0.440777418602302,0.2724181414021976,-0.8552798509758447,
    -0.4472149999999999,0.276397,-0.850649,1.0,-0.440777418602302,0.2724181414021976,-0.8552798509758447,
    -0.687159,0.25115200000000004,-0.681715,1.0,-0.6848117463759701,0.2430639454016199,-0.6869882025706792,
    -0.531941,0.502302,-0.681712,1.0,-0.5236577408730431,0.5038188776590388,-0.6869855230921009,
    -0.687159,0.25115200000000004,-0.681715,1.0,-0.6848117463759701,0.2430639454016199,-0.6869882025706792,
    -0.723607,0.44721999999999995,-0.525725,1.0,-0.7236067216830412,0.44721965132148317,-0.5257260653677089,
    -0.531941,0.502302,-0.681712,1.0,-0.5236577408730431,0.5038188776590388,-0.6869855230921009,
    -0.860698,0.2511510000000001,-0.442858,1.0,-0.8649868290678857,0.2430624631623782,-0.43899706666505395,
    -0.812729,0.5023010000000001,-0.295238,1.0,-0.8151846510833863,0.503817580270061,-0.2857303456913146,
    -0.723607,0.44721999999999995,-0.525725,1.0,-0.7236067216830412,0.44721965132148317,-0.5257260653677089,
    -0.951058,0.0,-0.309013,1.0,-0.9510573479382253,-7.330831644240639e-07,-0.30901443482816815,
    -0.947213,0.2763960000000001,-0.162458,1.0,-0.9496281766536325,0.27241723641349325,-0.15490376176946866,
    -0.860698,0.2511510000000001,-0.442858,1.0,-0.8649868290678857,0.2430624631623782,-0.43899706666505395,
    -0.956626,-0.25114900000000007,-0.14761800000000003,1.0,-0.9578262170326509,-0.24306111405524766,-0.15326523676014436,
    -1.0,9.999999999177334e-07,0.0,1.0,-0.999960625461639,0.008873980299981307,-5.7641038767457417e-08,
    -0.951058,0.0,-0.309013,1.0,-0.9510573479382253,-7.330831644240639e-07,-0.30901443482816815,
    -0.860698,0.2511510000000001,-0.442858,1.0,-0.8649868290678857,0.2430624631623782,-0.43899706666505395,
    -0.947213,0.2763960000000001,-0.162458,1.0,-0.9496281766536325,0.27241723641349325,-0.15490376176946866,
    -0.812729,0.5023010000000001,-0.295238,1.0,-0.8151846510833863,0.503817580270061,-0.2857303456913146,
    -0.947213,0.2763960000000001,-0.162458,1.0,-0.9496281766536325,0.27241723641349325,-0.15490376176946866,
    -0.850648,0.525736,0.0,1.0,-0.850648504669507,0.5257348395374611,-2.2739670286765194e-07,
    -0.812729,0.5023010000000001,-0.295238,1.0,-0.8151846510833863,0.503817580270061,-0.2857303456913146,
    -0.951058,0.0,-0.309013,1.0,-0.9510573479382253,-7.330831644240639e-07,-0.30901443482816815,
    -1.0,9.999999999177334e-07,0.0,1.0,-0.999960625461639,0.008873980299981307,-5.7641038767457417e-08,
    -0.947213,0.2763960000000001,-0.162458,1.0,-0.9496281766536325,0.27241723641349325,-0.15490376176946866,
    -1.0,9.999999999177334e-07,0.0,1.0,-0.999960625461639,0.008873980299981307,-5.7641038767457417e-08,
    -0.947213,0.276397,0.162458,1.0,-0.9496280396827057,0.2724178616838374,0.1549035018454631,
    -0.947213,0.2763960000000001,-0.162458,1.0,-0.9496281766536325,0.27241723641349325,-0.15490376176946866,
    -0.947213,0.2763960000000001,-0.162458,1.0,-0.9496281766536325,0.27241723641349325,-0.15490376176946866,
    -0.947213,0.276397,0.162458,1.0,-0.9496280396827057,0.2724178616838374,0.1549035018454631,
    -0.850648,0.525736,0.0,1.0,-0.850648504669507,0.5257348395374611,-2.2739670286765194e-07,
    -0.947213,0.276397,0.162458,1.0,-0.9496280396827057,0.2724178616838374,0.1549035018454631,
    -0.812729,0.5023010000000001,0.2952379999999999,1.0,-0.8151843815554107,0.5038178905016056,0.28573056763082694,
    -0.850648,0.525736,0.0,1.0,-0.850648504669507,0.5257348395374611,-2.2739670286765194e-07,
    -0.956626,-0.25114900000000007,-0.14761800000000003,1.0,-0.9578262170326509,-0.24306111405524766,-0.15326523676014436,
    -0.956626,-0.25114900000000007,0.14761800000000003,1.0,-0.9578262170326509,-0.24306111405524763,0.1532652367601444,
    -1.0,9.999999999177334e-07,0.0,1.0,-0.999960625461639,0.008873980299981307,-5.7641038767457417e-08,
    -0.956626,-0.25114900000000007,0.14761800000000003,1.0,-0.9578262170326509,-0.24306111405524763,0.1532652367601444,
    -0.951058,0.0,0.309013,1.0,-0.951057331086145,-8.671557238488273e-07,0.3090144866936615,
    -1.0,9.999999999177334e-07,0.0,1.0,-0.999960625461639,0.008873980299981307,-5.7641038767457417e-08,
    -1.0,9.999999999177334e-07,0.0,1.0,-0.999960625461639,0.008873980299981307,-5.7641038767457417e-08,
    -0.951058,0.0,0.309013,1.0,-0.951057331086145,-8.671557238488273e-07,0.3090144866936615,
    -0.947213,0.276397,0.162458,1.0,-0.9496280396827057,0.2724178616838374,0.1549035018454631,
    -0.951058,0.0,0.309013,1.0,-0.951057331086145,-8.671557238488273e-07,0.3090144866936615,
    -0.860698,0.2511510000000001,0.442858,1.0,-0.8649867092922593,0.24306239483169045,0.43899734050040895,
    -0.947213,0.276397,0.162458,1.0,-0.9496280396827057,0.2724178616838374,0.1549035018454631,
    -0.947213,0.276397,0.162458,1.0,-0.9496280396827057,0.2724178616838374,0.1549035018454631,
    -0.860698,0.2511510000000001,0.442858,1.0,-0.8649867092922593,0.24306239483169045,0.43899734050040895,
    -0.812729,0.5023010000000001,0.2952379999999999,1.0,-0.8151843815554107,0.5038178905016056,0.28573056763082694,
    -0.860698,0.2511510000000001,0.442858,1.0,-0.8649867092922593,0.24306239483169045,0.43899734050040895,
    -0.723607,0.44721999999999995,0.525725,1.0,-0.7236067216830413,0.4472196513214834,0.5257260653677087,
    -0.812729,0.5023010000000001,0.2952379999999999,1.0,-0.8151843815554107,0.5038178905016056,0.28573056763082694,
    -0.687159,0.25115200000000004,0.6817150000000001,1.0,-0.6848115755465203,0.24306396103886968,0.6869883673262506,
    -0.531941,0.502302,0.6817120000000001,1.0,-0.5236576234680893,0.50381866852951,0.6869857659550921,
    -0.723607,0.44721999999999995,0.525725,1.0,-0.7236067216830413,0.4472196513214834,0.5257260653677087,
    -0.587786,0.0,0.8090169999999999,1.0,-0.5877858058415312,4.349631417008017e-07,0.8090165921976091,
    -0.44721600000000006,0.276397,0.8506480000000001,1.0,-0.440777780043386,0.2724176399428321,0.8552798244247329,
    -0.687159,0.25115200000000004,0.6817150000000001,1.0,-0.6848115755465203,0.24306396103886968,0.6869883673262506,
    -0.43600700000000003,-0.25115200000000004,0.864188,1.0,-0.4417470436660011,-0.2430638114471244,0.8635852783466985,
    -0.309017,-1.0000000000287557e-06,0.9510559999999999,1.0,-0.30900470758363174,0.008872576054985893,0.9510191207779699,
    -0.587786,0.0,0.8090169999999999,1.0,-0.5877858058415312,4.349631417008017e-07,0.8090165921976091,
    -0.687159,0.25115200000000004,0.6817150000000001,1.0,-0.6848115755465203,0.24306396103886968,0.6869883673262506,
    -0.44721600000000006,0.276397,0.8506480000000001,1.0,-0.440777780043386,0.2724176399428321,0.8552798244247329,
    -0.531941,0.502302,0.6817120000000001,1.0,-0.5236576234680893,0.50381866852951,0.6869857659550921,
    -0.44721600000000006,0.276397,0.8506480000000001,1.0,-0.440777780043386,0.2724176399428321,0.8552798244247329,
    -0.262869,0.525738,0.8090120000000001,1.0,-0.26286917763817624,0.5257368727147139,0.8090120741472168,
    -0.531941,0.502302,0.6817120000000001,1.0,-0.5236576234680893,0.50381866852951,0.6869857659550921,
    -0.587786,0.0,0.8090169999999999,1.0,-0.5877858058415312,4.349631417008017e-07,0.8090165921976091,
    -0.309017,-1.0000000000287557e-06,0.9510559999999999,1.0,-0.30900470758363174,0.008872576054985893,0.9510191207779699,
    -0.44721600000000006,0.276397,0.8506480000000001,1.0,-0.440777780043386,0.2724176399428321,0.8552798244247329,
    -0.309017,-1.0000000000287557e-06,0.9510559999999999,1.0,-0.30900470758363174,0.008872576054985893,0.9510191207779699,
    -0.13819899999999996,0.276397,0.951055,1.0,-0.14613018086329244,0.2724171419127992,0.9510178079473188,
    -0.44721600000000006,0.276397,0.8506480000000001,1.0,-0.440777780043386,0.2724176399428321,0.8552798244247329,
    -0.44721600000000006,0.276397,0.8506480000000001,1.0,-0.440777780043386,0.2724176399428321,0.8552798244247329,
    -0.13819899999999996,0.276397,0.951055,1.0,-0.14613018086329244,0.2724171419127992,0.9510178079473188,
    -0.262869,0.525738,0.8090120000000001,1.0,-0.26286917763817624,0.5257368727147139,0.8090120741472168,
    -0.13819899999999996,0.276397,0.951055,1.0,-0.14613018086329244,0.2724171419127992,0.9510178079473188,
    0.02963899999999997,0.502302,0.8641839999999998,1.0,0.01983839534895446,0.5038189457553266,0.8635814425796619,
    -0.262869,0.525738,0.8090120000000001,1.0,-0.26286917763817624,0.5257368727147139,0.8090120741472168,
    -0.43600700000000003,-0.25115200000000004,0.864188,1.0,-0.4417470436660011,-0.2430638114471244,0.8635852783466985,
    -0.155215,-0.25115200000000004,0.955422,1.0,-0.15021677729008256,-0.24306351370824936,0.9583084305819194,
    -0.309017,-1.0000000000287557e-06,0.9510559999999999,1.0,-0.30900470758363174,0.008872576054985893,0.9510191207779699,
    -0.155215,-0.25115200000000004,0.955422,1.0,-0.15021677729008256,-0.24306351370824936,0.9583084305819194,
    0.0,0.0,1.0,1.0,-6.802996438484687e-08,1.7058485892572035e-07,0.9999999999999832,
    -0.309017,-1.0000000000287557e-06,0.9510559999999999,1.0,-0.30900470758363174,0.008872576054985893,0.9510191207779699,
    -0.309017,-1.0000000000287557e-06,0.9510559999999999,1.0,-0.30900470758363174,0.008872576054985893,0.9510191207779699,
    0.0,0.0,1.0,1.0,-6.802996438484687e-08,1.7058485892572035e-07,0.9999999999999832,
    -0.13819899999999996,0.276397,0.951055,1.0,-0.14613018086329244,0.2724171419127992,0.9510178079473188,
    0.0,0.0,1.0,1.0,-6.802996438484687e-08,1.7058485892572035e-07,0.9999999999999832,
    0.1552150000000001,0.25115200000000004,0.955422,1.0,0.15021657377136222,0.24306347133980513,0.9583084732301164,
    -0.13819899999999996,0.276397,0.951055,1.0,-0.14613018086329244,0.2724171419127992,0.9510178079473188,
    -0.13819899999999996,0.276397,0.951055,1.0,-0.14613018086329244,0.2724171419127992,0.9510178079473188,
    0.1552150000000001,0.25115200000000004,0.955422,1.0,0.15021657377136222,0.24306347133980513,0.9583084732301164,
    0.02963899999999997,0.502302,0.8641839999999998,1.0,0.01983839534895446,0.5038189457553266,0.8635814425796619,
    0.1552150000000001,0.25115200000000004,0.955422,1.0,0.15021657377136222,0.24306347133980513,0.9583084732301164,
    0.2763880000000001,0.44721999999999995,0.850649,1.0,0.27638775259514803,0.44721995820039745,0.8506492339399583,
    0.02963899999999997,0.502302,0.8641839999999998,1.0,0.01983839534895446,0.5038189457553266,0.8635814425796619,
    0.43600700000000003,0.25115200000000004,0.864188,1.0,0.4417474635405354,0.24306379703966605,0.8635850676245875,
    0.48397099999999993,0.502302,0.7165650000000001,1.0,0.4915465997259058,0.5038185159472155,0.7103160164931138,
    0.2763880000000001,0.44721999999999995,0.850649,1.0,0.27638775259514803,0.44721995820039745,0.8506492339399583,
    0.5877859999999999,0.0,0.8090169999999999,1.0,0.5877853232201069,3.613410911975069e-08,0.8090169428429995,
    0.67082,0.2763960000000001,0.6881900000000001,1.0,0.6772144971664549,0.27241774977147326,0.6834976916106101,
    0.43600700000000003,0.25115200000000004,0.864188,1.0,0.4417474635405354,0.24306379703966605,0.8635850676245875,
    0.6871589999999999,-0.25115200000000004,0.6817150000000001,1.0,0.6848111757491196,-0.24306484466307332,0.6869884532203029,
    0.8090190000000002,-1.999999999946489e-06,0.5877829999999999,1.0,0.8089866848506967,0.008871945415033243,0.5877600125211242,
    0.5877859999999999,0.0,0.8090169999999999,1.0,0.5877853232201069,3.613410911975069e-08,0.8090169428429995,
    0.43600700000000003,0.25115200000000004,0.864188,1.0,0.4417474635405354,0.24306379703966605,0.8635850676245875,
    0.67082,0.2763960000000001,0.6881900000000001,1.0,0.6772144971664549,0.27241774977147326,0.6834976916106101,
    0.48397099999999993,0.502302,0.7165650000000001,1.0,0.4915465997259058,0.5038185159472155,0.7103160164931138,
    0.67082,0.2763960000000001,0.6881900000000001,1.0,0.6772144971664549,0.27241774977147326,0.6834976916106101,
    0.6881889999999999,0.525736,0.499997,1.0,0.6881896241859202,0.5257346676673482,0.49999810037193615,
    0.48397099999999993,0.502302,0.7165650000000001,1.0,0.4915465997259058,0.5038185159472155,0.7103160164931138,
    0.5877859999999999,0.0,0.8090169999999999,1.0,0.5877853232201069,3.613410911975069e-08,0.8090169428429995,
    0.8090190000000002,-1.999999999946489e-06,0.5877829999999999,1.0,0.8089866848506967,0.008871945415033243,0.5877600125211242,
    0.67082,0.2763960000000001,0.6881900000000001,1.0,0.6772144971664549,0.27241774977147326,0.6834976916106101,
    0.8090190000000002,-1.999999999946489e-06,0.5877829999999999,1.0,0.8089866848506967,0.008871945415033243,0.5877600125211242,
    0.861804,0.27639400000000003,0.4253230000000001,1.0,0.8593173212717677,0.2724158342746917,0.43285488861596255,
    0.67082,0.2763960000000001,0.6881900000000001,1.0,0.6772144971664549,0.27241774977147326,0.6834976916106101,
    0.67082,0.2763960000000001,0.6881900000000001,1.0,0.6772144971664549,0.27241774977147326,0.6834976916106101,
    0.861804,0.27639400000000003,0.4253230000000001,1.0,0.8593173212717677,0.2724158342746917,0.43285488861596255,
    0.6881889999999999,0.525736,0.499997,1.0,0.6881896241859202,0.5257346676673482,0.49999810037193615,
    0.861804,0.27639400000000003,0.4253230000000001,1.0,0.8593173212717677,0.2724158342746917,0.43285488861596255,
    0.831051,0.502299,0.23885299999999998,1.0,0.8274487904509396,0.5038149163054394,0.24798997820359664,
    0.6881889999999999,0.525736,0.499997,1.0,0.6881896241859202,0.5257346676673482,0.49999810037193615,
    0.6871589999999999,-0.25115200000000004,0.6817150000000001,1.0,0.6848111757491196,-0.24306484466307332,0.6869884532203029,
    0.860698,-0.251151,0.442858,1.0,0.864986890060841,-0.24306353018273283,0.4389963557001157,
    0.8090190000000002,-1.999999999946489e-06,0.5877829999999999,1.0,0.8089866848506967,0.008871945415033243,0.5877600125211242,
    0.860698,-0.251151,0.442858,1.0,0.864986890060841,-0.24306353018273283,0.4389963557001157,
    0.951058,0.0,0.309013,1.0,0.9510576790560566,4.844418859218338e-07,0.30901341574156965,
    0.8090190000000002,-1.999999999946489e-06,0.5877829999999999,1.0,0.8089866848506967,0.008871945415033243,0.5877600125211242,
    0.8090190000000002,-1.999999999946489e-06,0.5877829999999999,1.0,0.8089866848506967,0.008871945415033243,0.5877600125211242,
    0.951058,0.0,0.309013,1.0,0.9510576790560566,4.844418859218338e-07,0.30901341574156965,
    0.861804,0.27639400000000003,0.4253230000000001,1.0,0.8593173212717677,0.2724158342746917,0.43285488861596255,
    0.951058,0.0,0.309013,1.0,0.9510576790560566,4.844418859218338e-07,0.30901341574156965,
    0.956626,0.25114900000000007,0.14761800000000003,1.0,0.9578261805030606,0.24306129258052184,0.15326518192989683,
    0.861804,0.27639400000000003,0.4253230000000001,1.0,0.8593173212717677,0.2724158342746917,0.43285488861596255,
    0.861804,0.27639400000000003,0.4253230000000001,1.0,0.8593173212717677,0.2724158342746917,0.43285488861596255,
    0.956626,0.25114900000000007,0.14761800000000003,1.0,0.9578261805030606,0.24306129258052184,0.15326518192989683,
    0.831051,0.502299,0.23885299999999998,1.0,0.8274487904509396,0.5038149163054394,0.24798997820359664,
    0.956626,0.25114900000000007,0.14761800000000003,1.0,0.9578261805030606,0.24306129258052184,0.15326518192989683,
    0.8944260000000002,0.44721600000000006,0.0,1.0,0.8944264388330799,0.4472150998304671,-7.024693876715296e-18,
    0.831051,0.502299,0.23885299999999998,1.0,0.8274487904509396,0.5038149163054394,0.24798997820359664,
    0.43600700000000003,0.25115200000000004,-0.864188,1.0,0.44174743584464,0.2430637566759591,-0.8635850931525253,
    0.1552150000000001,0.25115200000000004,-0.955422,1.0,0.15021657377136222,0.24306347133980513,-0.9583084732301164,
    0.2763880000000001,0.44721999999999995,-0.850649,1.0,0.27638775259514836,0.44721995820039734,-0.8506492339399583,
    0.5877859999999999,0.0,-0.809017,1.0,0.5877858829948915,-2.554691144635855e-08,-0.809016536142442,
    0.3090169999999999,0.0,-0.951056,1.0,0.3090047066659712,-0.008872910630520342,-0.9510191179546391,
    0.43600700000000003,0.25115200000000004,-0.864188,1.0,0.44174743584464,0.2430637566759591,-0.8635850931525253,
    0.6871589999999999,-0.25115200000000004,-0.681715,1.0,0.6848117102472356,-0.2430639714860927,-0.6869882293559796,
    0.44721600000000006,-0.2763979999999999,-0.850648,1.0,0.4407780664296207,-0.27241829131158907,-0.8552794693627569,
    0.5877859999999999,0.0,-0.809017,1.0,0.5877858829948915,-2.554691144635855e-08,-0.809016536142442,
    0.43600700000000003,0.25115200000000004,-0.864188,1.0,0.44174743584464,0.2430637566759591,-0.8635850931525253,
    0.3090169999999999,0.0,-0.951056,1.0,0.3090047066659712,-0.008872910630520342,-0.9510191179546391,
    0.1552150000000001,0.25115200000000004,-0.955422,1.0,0.15021657377136222,0.24306347133980513,-0.9583084732301164,
    0.3090169999999999,0.0,-0.951056,1.0,0.3090047066659712,-0.008872910630520342,-0.9510191179546391,
    0.0,0.0,-1.0,1.0,8.386527000463054e-07,1.0350315843348408e-07,-0.999999999999643,
    0.1552150000000001,0.25115200000000004,-0.955422,1.0,0.15021657377136222,0.24306347133980513,-0.9583084732301164,
    0.5877859999999999,0.0,-0.809017,1.0,0.5877858829948915,-2.554691144635855e-08,-0.809016536142442,
    0.44721600000000006,-0.2763979999999999,-0.850648,1.0,0.4407780664296207,-0.27241829131158907,-0.8552794693627569,
    0.3090169999999999,0.0,-0.951056,1.0,0.3090047066659712,-0.008872910630520342,-0.9510191179546391,
    0.44721600000000006,-0.2763979999999999,-0.850648,1.0,0.4407780664296207,-0.27241829131158907,-0.8552794693627569,
    0.13819899999999996,-0.2763979999999999,-0.951055,1.0,0.14612974047217775,-0.27241779329109583,-0.9510176890299905,
    0.3090169999999999,0.0,-0.951056,1.0,0.3090047066659712,-0.008872910630520342,-0.9510191179546391,
    0.3090169999999999,0.0,-0.951056,1.0,0.3090047066659712,-0.008872910630520342,-0.9510191179546391,
    0.13819899999999996,-0.2763979999999999,-0.951055,1.0,0.14612974047217775,-0.27241779329109583,-0.9510176890299905,
    0.0,0.0,-1.0,1.0,8.386527000463054e-07,1.0350315843348408e-07,-0.999999999999643,
    0.13819899999999996,-0.2763979999999999,-0.951055,1.0,0.14612974047217775,-0.27241779329109583,-0.9510176890299905,
    -0.155215,-0.25115200000000004,-0.955422,1.0,-0.1502164527684422,-0.24306415178722385,-0.9583083196099383,
    0.0,0.0,-1.0,1.0,8.386527000463054e-07,1.0350315843348408e-07,-0.999999999999643,
    0.6871589999999999,-0.25115200000000004,-0.681715,1.0,0.6848117102472356,-0.2430639714860927,-0.6869882293559796,
    0.531941,-0.502302,-0.681712,1.0,0.5236579140350146,-0.503818798851909,-0.6869854488938736,
    0.44721600000000006,-0.2763979999999999,-0.850648,1.0,0.4407780664296207,-0.27241829131158907,-0.8552794693627569,
    0.531941,-0.502302,-0.681712,1.0,0.5236579140350146,-0.503818798851909,-0.6869854488938736,
    0.262869,-0.525738,-0.809012,1.0,0.26286895228372437,-0.5257372320187721,-0.8090119138767345,
    0.44721600000000006,-0.2763979999999999,-0.850648,1.0,0.4407780664296207,-0.27241829131158907,-0.8552794693627569,
    0.44721600000000006,-0.2763979999999999,-0.850648,1.0,0.4407780664296207,-0.27241829131158907,-0.8552794693627569,
    0.262869,-0.525738,-0.809012,1.0,0.26286895228372437,-0.5257372320187721,-0.8090119138767345,
    0.13819899999999996,-0.2763979999999999,-0.951055,1.0,0.14612974047217775,-0.27241779329109583,-0.9510176890299905,
    0.262869,-0.525738,-0.809012,1.0,0.26286895228372437,-0.5257372320187721,-0.8090119138767345,
    -0.02963899999999997,-0.502302,-0.864184,1.0,-0.019838720158978862,-0.5038191057760348,-0.8635813417608618,
    0.13819899999999996,-0.2763979999999999,-0.951055,1.0,0.14612974047217775,-0.27241779329109583,-0.9510176890299905,
    0.13819899999999996,-0.2763979999999999,-0.951055,1.0,0.14612974047217775,-0.27241779329109583,-0.9510176890299905,
    -0.02963899999999997,-0.502302,-0.864184,1.0,-0.019838720158978862,-0.5038191057760348,-0.8635813417608618,
    -0.155215,-0.25115200000000004,-0.955422,1.0,-0.1502164527684422,-0.24306415178722385,-0.9583083196099383,
    -0.02963899999999997,-0.502302,-0.864184,1.0,-0.019838720158978862,-0.5038191057760348,-0.8635813417608618,
    -0.2763880000000001,-0.44721999999999995,-0.850649,1.0,-0.2763877525951483,-0.44721995820039734,-0.8506492339399583,
    -0.155215,-0.25115200000000004,-0.955422,1.0,-0.1502164527684422,-0.24306415178722385,-0.9583083196099383,
    -0.687159,0.25115200000000004,-0.681715,1.0,-0.6848117463759701,0.2430639454016199,-0.6869882025706792,
    -0.860698,0.2511510000000001,-0.442858,1.0,-0.8649868290678857,0.2430624631623782,-0.43899706666505395,
    -0.723607,0.44721999999999995,-0.525725,1.0,-0.7236067216830412,0.44721965132148317,-0.5257260653677089,
    -0.587786,0.0,-0.809017,1.0,-0.5877863671165282,8.898111888585574e-08,-0.8090161844066818,
    -0.809018,0.0,-0.587783,1.0,-0.8089865397400394,-0.008873289185182267,-0.587760191964779,
    -0.687159,0.25115200000000004,-0.681715,1.0,-0.6848117463759701,0.2430639454016199,-0.6869882025706792,
    -0.43600700000000003,-0.25115200000000004,-0.864188,1.0,-0.4417472320955005,-0.24306420283334987,-0.8635850718006606,
    -0.670819,-0.276397,-0.688191,1.0,-0.6772137611074175,-0.2724178575158659,-0.6834983779594587,
    -0.587786,0.0,-0.809017,1.0,-0.5877863671165282,8.898111888585574e-08,-0.8090161844066818,
    -0.687159,0.25115200000000004,-0.681715,1.0,-0.6848117463759701,0.2430639454016199,-0.6869882025706792,
    -0.809018,0.0,-0.587783,1.0,-0.8089865397400394,-0.008873289185182267,-0.587760191964779,
    -0.860698,0.2511510000000001,-0.442858,1.0,-0.8649868290678857,0.2430624631623782,-0.43899706666505395,
    -0.809018,0.0,-0.587783,1.0,-0.8089865397400394,-0.008873289185182267,-0.587760191964779,
    -0.951058,0.0,-0.309013,1.0,-0.9510573479382253,-7.330831644240639e-07,-0.30901443482816815,
    -0.860698,0.2511510000000001,-0.442858,1.0,-0.8649868290678857,0.2430624631623782,-0.43899706666505395,
    -0.587786,0.0,-0.809017,1.0,-0.5877863671165282,8.898111888585574e-08,-0.8090161844066818,
    -0.670819,-0.276397,-0.688191,1.0,-0.6772137611074175,-0.2724178575158659,-0.6834983779594587,
    -0.809018,0.0,-0.587783,1.0,-0.8089865397400394,-0.008873289185182267,-0.587760191964779,
    -0.670819,-0.276397,-0.688191,1.0,-0.6772137611074175,-0.2724178575158659,-0.6834983779594587,
    -0.861803,-0.276396,-0.42532400000000004,1.0,-0.8593167049440582,-0.2724165069227901,-0.43285568883875336,
    -0.809018,0.0,-0.587783,1.0,-0.8089865397400394,-0.008873289185182267,-0.587760191964779,
    -0.809018,0.0,-0.587783,1.0,-0.8089865397400394,-0.008873289185182267,-0.587760191964779,
    -0.861803,-0.276396,-0.42532400000000004,1.0,-0.8593167049440582,-0.2724165069227901,-0.43285568883875336,
    -0.951058,0.0,-0.309013,1.0,-0.9510573479382253,-7.330831644240639e-07,-0.30901443482816815,
    -0.861803,-0.276396,-0.42532400000000004,1.0,-0.8593167049440582,-0.2724165069227901,-0.43285568883875336,
    -0.956626,-0.25114900000000007,-0.14761800000000003,1.0,-0.9578262170326509,-0.24306111405524766,-0.15326523676014436,
    -0.951058,0.0,-0.309013,1.0,-0.9510573479382253,-7.330831644240639e-07,-0.30901443482816815,
    -0.43600700000000003,-0.25115200000000004,-0.864188,1.0,-0.4417472320955005,-0.24306420283334987,-0.8635850718006606,
    -0.48397099999999993,-0.502302,-0.716565,1.0,-0.4915461091474215,-0.5038186497816622,-0.7103162610515219,
    -0.670819,-0.276397,-0.688191,1.0,-0.6772137611074175,-0.2724178575158659,-0.6834983779594587,
    -0.48397099999999993,-0.502302,-0.716565,1.0,-0.4915461091474215,-0.5038186497816622,-0.7103162610515219,
    -0.688189,-0.525736,-0.499997,1.0,-0.6881896629138985,-0.5257350598001616,-0.4999976347497809,
    -0.670819,-0.276397,-0.688191,1.0,-0.6772137611074175,-0.2724178575158659,-0.6834983779594587,
    -0.670819,-0.276397,-0.688191,1.0,-0.6772137611074175,-0.2724178575158659,-0.6834983779594587,
    -0.688189,-0.525736,-0.499997,1.0,-0.6881896629138985,-0.5257350598001616,-0.4999976347497809,
    -0.861803,-0.276396,-0.42532400000000004,1.0,-0.8593167049440582,-0.2724165069227901,-0.43285568883875336,
    -0.688189,-0.525736,-0.499997,1.0,-0.6881896629138985,-0.5257350598001616,-0.4999976347497809,
    -0.831051,-0.502299,-0.23885299999999998,1.0,-0.827448675299351,-0.503815221812631,-0.24798974175404667,
    -0.861803,-0.276396,-0.42532400000000004,1.0,-0.8593167049440582,-0.2724165069227901,-0.43285568883875336,
    -0.861803,-0.276396,-0.42532400000000004,1.0,-0.8593167049440582,-0.2724165069227901,-0.43285568883875336,
    -0.831051,-0.502299,-0.23885299999999998,1.0,-0.827448675299351,-0.503815221812631,-0.24798974175404667,
    -0.956626,-0.25114900000000007,-0.14761800000000003,1.0,-0.9578262170326509,-0.24306111405524766,-0.15326523676014436,
    -0.831051,-0.502299,-0.23885299999999998,1.0,-0.827448675299351,-0.503815221812631,-0.24798974175404667,
    -0.894426,-0.44721600000000006,0.0,1.0,-0.8944264388330798,-0.44721509983046726,3.5123469383576465e-18,
    -0.956626,-0.25114900000000007,-0.14761800000000003,1.0,-0.9578262170326509,-0.24306111405524766,-0.15326523676014436,
    -0.860698,0.2511510000000001,0.442858,1.0,-0.8649867092922593,0.24306239483169045,0.43899734050040895,
    -0.687159,0.25115200000000004,0.6817150000000001,1.0,-0.6848115755465203,0.24306396103886968,0.6869883673262506,
    -0.723607,0.44721999999999995,0.525725,1.0,-0.7236067216830413,0.4472196513214834,0.5257260653677087,
    -0.951058,0.0,0.309013,1.0,-0.951057331086145,-8.671557238488273e-07,0.3090144866936615,
    -0.809018,0.0,0.5877829999999999,1.0,-0.8089865397400394,-0.008873289185182359,0.5877601919647789,
    -0.860698,0.2511510000000001,0.442858,1.0,-0.8649867092922593,0.24306239483169045,0.43899734050040895,
    -0.956626,-0.25114900000000007,0.14761800000000003,1.0,-0.9578262170326509,-0.24306111405524763,0.1532652367601444,
    -0.861803,-0.276396,0.42532400000000004,1.0,-0.8593167049440582,-0.2724165069227901,0.43285568883875347,
    -0.951058,0.0,0.309013,1.0,-0.951057331086145,-8.671557238488273e-07,0.3090144866936615,
    -0.860698,0.2511510000000001,0.442858,1.0,-0.8649867092922593,0.24306239483169045,0.43899734050040895,
    -0.809018,0.0,0.5877829999999999,1.0,-0.8089865397400394,-0.008873289185182359,0.5877601919647789,
    -0.687159,0.25115200000000004,0.6817150000000001,1.0,-0.6848115755465203,0.24306396103886968,0.6869883673262506,
    -0.809018,0.0,0.5877829999999999,1.0,-0.8089865397400394,-0.008873289185182359,0.5877601919647789,
    -0.587786,0.0,0.8090169999999999,1.0,-0.5877858058415312,4.349631417008017e-07,0.8090165921976091,
    -0.687159,0.25115200000000004,0.6817150000000001,1.0,-0.6848115755465203,0.24306396103886968,0.6869883673262506,
    -0.951058,0.0,0.309013,1.0,-0.951057331086145,-8.671557238488273e-07,0.3090144866936615,
    -0.861803,-0.276396,0.42532400000000004,1.0,-0.8593167049440582,-0.2724165069227901,0.43285568883875347,
    -0.809018,0.0,0.5877829999999999,1.0,-0.8089865397400394,-0.008873289185182359,0.5877601919647789,
    -0.861803,-0.276396,0.42532400000000004,1.0,-0.8593167049440582,-0.2724165069227901,0.43285568883875347,
    -0.670819,-0.276397,0.688191,1.0,-0.6772137611074175,-0.2724178575158658,0.6834983779594588,
    -0.809018,0.0,0.5877829999999999,1.0,-0.8089865397400394,-0.008873289185182359,0.5877601919647789,
    -0.809018,0.0,0.5877829999999999,1.0,-0.8089865397400394,-0.008873289185182359,0.5877601919647789,
    -0.670819,-0.276397,0.688191,1.0,-0.6772137611074175,-0.2724178575158658,0.6834983779594588,
    -0.587786,0.0,0.8090169999999999,1.0,-0.5877858058415312,4.349631417008017e-07,0.8090165921976091,
    -0.670819,-0.276397,0.688191,1.0,-0.6772137611074175,-0.2724178575158658,0.6834983779594588,
    -0.43600700000000003,-0.25115200000000004,0.864188,1.0,-0.4417470436660011,-0.2430638114471244,0.8635852783466985,
    -0.587786,0.0,0.8090169999999999,1.0,-0.5877858058415312,4.349631417008017e-07,0.8090165921976091,
    -0.956626,-0.25114900000000007,0.14761800000000003,1.0,-0.9578262170326509,-0.24306111405524763,0.1532652367601444,
    -0.831051,-0.502299,0.23885299999999998,1.0,-0.8274488479658778,-0.5038149789897272,0.24798965894876002,
    -0.861803,-0.276396,0.42532400000000004,1.0,-0.8593167049440582,-0.2724165069227901,0.43285568883875347,
    -0.831051,-0.502299,0.23885299999999998,1.0,-0.8274488479658778,-0.5038149789897272,0.24798965894876002,
    -0.688189,-0.525736,0.499997,1.0,-0.6881895511641616,-0.5257349869564159,0.49999786515384953,
    -0.861803,-0.276396,0.42532400000000004,1.0,-0.8593167049440582,-0.2724165069227901,0.43285568883875347,
    -0.861803,-0.276396,0.42532400000000004,1.0,-0.8593167049440582,-0.2724165069227901,0.43285568883875347,
    -0.688189,-0.525736,0.499997,1.0,-0.6881895511641616,-0.5257349869564159,0.49999786515384953,
    -0.670819,-0.276397,0.688191,1.0,-0.6772137611074175,-0.2724178575158658,0.6834983779594588,
    -0.688189,-0.525736,0.499997,1.0,-0.6881895511641616,-0.5257349869564159,0.49999786515384953,
    -0.48397099999999993,-0.502302,0.7165650000000001,1.0,-0.49154612462755637,-0.503818632525199,0.7103162625789089,
    -0.670819,-0.276397,0.688191,1.0,-0.6772137611074175,-0.2724178575158658,0.6834983779594588,
    -0.670819,-0.276397,0.688191,1.0,-0.6772137611074175,-0.2724178575158658,0.6834983779594588,
    -0.48397099999999993,-0.502302,0.7165650000000001,1.0,-0.49154612462755637,-0.503818632525199,0.7103162625789089,
    -0.43600700000000003,-0.25115200000000004,0.864188,1.0,-0.4417470436660011,-0.2430638114471244,0.8635852783466985,
    -0.48397099999999993,-0.502302,0.7165650000000001,1.0,-0.49154612462755637,-0.503818632525199,0.7103162625789089,
    -0.2763880000000001,-0.44721999999999995,0.850649,1.0,-0.27638775259514803,-0.44721995820039745,0.8506492339399584,
    -0.43600700000000003,-0.25115200000000004,0.864188,1.0,-0.4417470436660011,-0.2430638114471244,0.8635852783466985,
    0.1552150000000001,0.25115200000000004,0.955422,1.0,0.15021657377136222,0.24306347133980513,0.9583084732301164,
    0.43600700000000003,0.25115200000000004,0.864188,1.0,0.4417474635405354,0.24306379703966605,0.8635850676245875,
    0.2763880000000001,0.44721999999999995,0.850649,1.0,0.27638775259514803,0.44721995820039745,0.8506492339399583,
    0.0,0.0,1.0,1.0,-6.802996438484687e-08,1.7058485892572035e-07,0.9999999999999832,
    0.3090169999999999,0.0,0.9510559999999999,1.0,0.30900470666597124,-0.008872910630520276,0.9510191179546391,
    0.1552150000000001,0.25115200000000004,0.955422,1.0,0.15021657377136222,0.24306347133980513,0.9583084732301164,
    -0.155215,-0.25115200000000004,0.955422,1.0,-0.15021677729008256,-0.24306351370824936,0.9583084305819194,
    0.13819899999999996,-0.2763979999999999,0.951055,1.0,0.14612974047217758,-0.2724177932910958,0.9510176890299905,
    0.0,0.0,1.0,1.0,-6.802996438484687e-08,1.7058485892572035e-07,0.9999999999999832,
    0.1552150000000001,0.25115200000000004,0.955422,1.0,0.15021657377136222,0.24306347133980513,0.9583084732301164,
    0.3090169999999999,0.0,0.9510559999999999,1.0,0.30900470666597124,-0.008872910630520276,0.9510191179546391,
    0.43600700000000003,0.25115200000000004,0.864188,1.0,0.4417474635405354,0.24306379703966605,0.8635850676245875,
    0.3090169999999999,0.0,0.9510559999999999,1.0,0.30900470666597124,-0.008872910630520276,0.9510191179546391,
    0.5877859999999999,0.0,0.8090169999999999,1.0,0.5877853232201069,3.613410911975069e-08,0.8090169428429995,
    0.43600700000000003,0.25115200000000004,0.864188,1.0,0.4417474635405354,0.24306379703966605,0.8635850676245875,
    0.0,0.0,1.0,1.0,-6.802996438484687e-08,1.7058485892572035e-07,0.9999999999999832,
    0.13819899999999996,-0.2763979999999999,0.951055,1.0,0.14612974047217758,-0.2724177932910958,0.9510176890299905,
    0.3090169999999999,0.0,0.9510559999999999,1.0,0.30900470666597124,-0.008872910630520276,0.9510191179546391,
    0.13819899999999996,-0.2763979999999999,0.951055,1.0,0.14612974047217758,-0.2724177932910958,0.9510176890299905,
    0.44721600000000006,-0.2763979999999999,0.8506480000000001,1.0,0.44077806642962053,-0.27241829131158873,0.8552794693627571,
    0.3090169999999999,0.0,0.9510559999999999,1.0,0.30900470666597124,-0.008872910630520276,0.9510191179546391,
    0.3090169999999999,0.0,0.9510559999999999,1.0,0.30900470666597124,-0.008872910630520276,0.9510191179546391,
    0.44721600000000006,-0.2763979999999999,0.8506480000000001,1.0,0.44077806642962053,-0.27241829131158873,0.8552794693627571,
    0.5877859999999999,0.0,0.8090169999999999,1.0,0.5877853232201069,3.613410911975069e-08,0.8090169428429995,
    0.44721600000000006,-0.2763979999999999,0.8506480000000001,1.0,0.44077806642962053,-0.27241829131158873,0.8552794693627571,
    0.6871589999999999,-0.25115200000000004,0.6817150000000001,1.0,0.6848111757491196,-0.24306484466307332,0.6869884532203029,
    0.5877859999999999,0.0,0.8090169999999999,1.0,0.5877853232201069,3.613410911975069e-08,0.8090169428429995,
    -0.155215,-0.25115200000000004,0.955422,1.0,-0.15021677729008256,-0.24306351370824936,0.9583084305819194,
    -0.02963899999999997,-0.502302,0.8641839999999998,1.0,-0.019838689717257413,-0.5038192559913451,0.8635812548235572,
    0.13819899999999996,-0.2763979999999999,0.951055,1.0,0.14612974047217758,-0.2724177932910958,0.9510176890299905,
    -0.02963899999999997,-0.502302,0.8641839999999998,1.0,-0.019838689717257413,-0.5038192559913451,0.8635812548235572,
    0.262869,-0.525738,0.8090120000000001,1.0,0.26286888259023233,-0.5257372188438393,0.8090119450836976,
    0.13819899999999996,-0.2763979999999999,0.951055,1.0,0.14612974047217758,-0.2724177932910958,0.9510176890299905,
    0.13819899999999996,-0.2763979999999999,0.951055,1.0,0.14612974047217758,-0.2724177932910958,0.9510176890299905,
    0.262869,-0.525738,0.8090120000000001,1.0,0.26286888259023233,-0.5257372188438393,0.8090119450836976,
    0.44721600000000006,-0.2763979999999999,0.8506480000000001,1.0,0.44077806642962053,-0.27241829131158873,0.8552794693627571,
    0.262869,-0.525738,0.8090120000000001,1.0,0.26286888259023233,-0.5257372188438393,0.8090119450836976,
    0.531941,-0.502302,0.6817120000000001,1.0,0.5236580515960895,-0.5038185204865161,0.6869855481837774,
    0.44721600000000006,-0.2763979999999999,0.8506480000000001,1.0,0.44077806642962053,-0.27241829131158873,0.8552794693627571,
    0.44721600000000006,-0.2763979999999999,0.8506480000000001,1.0,0.44077806642962053,-0.27241829131158873,0.8552794693627571,
    0.531941,-0.502302,0.6817120000000001,1.0,0.5236580515960895,-0.5038185204865161,0.6869855481837774,
    0.6871589999999999,-0.25115200000000004,0.6817150000000001,1.0,0.6848111757491196,-0.24306484466307332,0.6869884532203029,
    0.531941,-0.502302,0.6817120000000001,1.0,0.5236580515960895,-0.5038185204865161,0.6869855481837774,
    0.7236069999999999,-0.44721999999999995,0.525725,1.0,0.7236067216830413,-0.4472196513214831,0.5257260653677089,
    0.6871589999999999,-0.25115200000000004,0.6817150000000001,1.0,0.6848111757491196,-0.24306484466307332,0.6869884532203029,
    0.956626,0.25114900000000007,0.14761800000000003,1.0,0.9578261805030606,0.24306129258052184,0.15326518192989683,
    0.956626,0.25114900000000007,-0.14761800000000003,1.0,0.9578262483355788,0.24306118218022527,-0.15326493309476094,
    0.8944260000000002,0.44721600000000006,0.0,1.0,0.8944264388330799,0.4472150998304671,-7.024693876715296e-18,
    0.951058,0.0,0.309013,1.0,0.9510576790560566,4.844418859218338e-07,0.30901341574156965,
    1.0,0.0,0.0,1.0,0.9999606296359095,-0.00887350991183931,0.0,
    0.956626,0.25114900000000007,0.14761800000000003,1.0,0.9578261805030606,0.24306129258052184,0.15326518192989683,
    0.860698,-0.251151,0.442858,1.0,0.864986890060841,-0.24306353018273283,0.4389963557001157,
    0.9472130000000001,-0.276396,0.162458,1.0,0.9496282556409833,-0.27241716831043955,0.15490339730937155,
    0.951058,0.0,0.309013,1.0,0.9510576790560566,4.844418859218338e-07,0.30901341574156965,
    0.956626,0.25114900000000007,0.14761800000000003,1.0,0.9578261805030606,0.24306129258052184,0.15326518192989683,
    1.0,0.0,0.0,1.0,0.9999606296359095,-0.00887350991183931,0.0,
    0.956626,0.25114900000000007,-0.14761800000000003,1.0,0.9578262483355788,0.24306118218022527,-0.15326493309476094,
    1.0,0.0,0.0,1.0,0.9999606296359095,-0.00887350991183931,0.0,
    0.951058,0.0,-0.309013,1.0,0.9510575012112954,5.074933413732154e-07,-0.30901396309789836,
    0.956626,0.25114900000000007,-0.14761800000000003,1.0,0.9578262483355788,0.24306118218022527,-0.15326493309476094,
    0.951058,0.0,0.309013,1.0,0.9510576790560566,4.844418859218338e-07,0.30901341574156965,
    0.9472130000000001,-0.276396,0.162458,1.0,0.9496282556409833,-0.27241716831043955,0.15490339730937155,
    1.0,0.0,0.0,1.0,0.9999606296359095,-0.00887350991183931,0.0,
    0.9472130000000001,-0.276396,0.162458,1.0,0.9496282556409833,-0.27241716831043955,0.15490339730937155,
    0.9472130000000001,-0.276396,-0.162458,1.0,0.9496282556409833,-0.27241716831043955,-0.15490339730937153,
    1.0,0.0,0.0,1.0,0.9999606296359095,-0.00887350991183931,0.0,
    1.0,0.0,0.0,1.0,0.9999606296359095,-0.00887350991183931,0.0,
    0.9472130000000001,-0.276396,-0.162458,1.0,0.9496282556409833,-0.27241716831043955,-0.15490339730937153,
    0.951058,0.0,-0.309013,1.0,0.9510575012112954,5.074933413732154e-07,-0.30901396309789836,
    0.9472130000000001,-0.276396,-0.162458,1.0,0.9496282556409833,-0.27241716831043955,-0.15490339730937153,
    0.860698,-0.251151,-0.442858,1.0,0.8649868190167103,-0.2430628154105527,-0.4389968914377966,
    0.951058,0.0,-0.309013,1.0,0.9510575012112954,5.074933413732154e-07,-0.30901396309789836,
    0.860698,-0.251151,0.442858,1.0,0.864986890060841,-0.24306353018273283,0.4389963557001157,
    0.812729,-0.502301,0.2952379999999999,1.0,0.8151848055269568,-0.503817229437447,0.2857305236756347,
    0.9472130000000001,-0.276396,0.162458,1.0,0.9496282556409833,-0.27241716831043955,0.15490339730937155,
    0.812729,-0.502301,0.2952379999999999,1.0,0.8151848055269568,-0.503817229437447,0.2857305236756347,
    0.8506480000000001,-0.525736,0.0,1.0,0.8506487792762305,-0.5257343952185694,-1.551196823478276e-07,
    0.9472130000000001,-0.276396,0.162458,1.0,0.9496282556409833,-0.27241716831043955,0.15490339730937155,
    0.9472130000000001,-0.276396,0.162458,1.0,0.9496282556409833,-0.27241716831043955,0.15490339730937155,
    0.8506480000000001,-0.525736,0.0,1.0,0.8506487792762305,-0.5257343952185694,-1.551196823478276e-07,
    0.9472130000000001,-0.276396,-0.162458,1.0,0.9496282556409833,-0.27241716831043955,-0.15490339730937153,
    0.8506480000000001,-0.525736,0.0,1.0,0.8506487792762305,-0.5257343952185694,-1.551196823478276e-07,
    0.812729,-0.502301,-0.295238,1.0,0.8151846510833864,-0.5038175802700607,-0.2857303456913148,
    0.9472130000000001,-0.276396,-0.162458,1.0,0.9496282556409833,-0.27241716831043955,-0.15490339730937153,
    0.9472130000000001,-0.276396,-0.162458,1.0,0.9496282556409833,-0.27241716831043955,-0.15490339730937153,
    0.812729,-0.502301,-0.295238,1.0,0.8151846510833864,-0.5038175802700607,-0.2857303456913148,
    0.860698,-0.251151,-0.442858,1.0,0.8649868190167103,-0.2430628154105527,-0.4389968914377966,
    0.812729,-0.502301,-0.295238,1.0,0.8151846510833864,-0.5038175802700607,-0.2857303456913148,
    0.7236069999999999,-0.44721999999999995,-0.525725,1.0,0.7236067216830413,-0.4472196513214831,-0.525726065367709,
    0.860698,-0.251151,-0.442858,1.0,0.8649868190167103,-0.2430628154105527,-0.4389968914377966,
    0.6095470000000001,-0.657519,-0.442856,1.0,0.60423092704266,-0.6649723365238669,-0.4389951918451463,
    0.531941,-0.502302,-0.681712,1.0,0.5236579140350146,-0.503818798851909,-0.6869854488938736,
    0.7236069999999999,-0.44721999999999995,-0.525725,1.0,0.7236067216830413,-0.4472196513214831,-0.525726065367709,
    0.4253230000000001,-0.850654,-0.3090109999999999,1.0,0.42532286056333185,-0.8506540013904963,-0.3090117056044348,
    0.3618030000000001,-0.723612,-0.587779,1.0,0.3538531927575634,-0.727551553663659,-0.5877556080012123,
    0.6095470000000001,-0.657519,-0.442856,1.0,0.60423092704266,-0.6649723365238669,-0.4389951918451463,
    0.20318100000000006,-0.96795,-0.14761800000000003,1.0,0.21095286907952562,-0.9654060533326492,-0.15326460522832558,
    0.1381969999999999,-0.894429,-0.42532100000000006,1.0,0.14064406863988954,-0.890425561238057,-0.4328528223892147,
    0.4253230000000001,-0.850654,-0.3090109999999999,1.0,0.42532286056333185,-0.8506540013904963,-0.3090117056044348,
    0.6095470000000001,-0.657519,-0.442856,1.0,0.60423092704266,-0.6649723365238669,-0.4389951918451463,
    0.3618030000000001,-0.723612,-0.587779,1.0,0.3538531927575634,-0.727551553663659,-0.5877556080012123,
    0.531941,-0.502302,-0.681712,1.0,0.5236579140350146,-0.503818798851909,-0.6869854488938736,
    0.3618030000000001,-0.723612,-0.587779,1.0,0.3538531927575634,-0.727551553663659,-0.5877556080012123,
    0.262869,-0.525738,-0.809012,1.0,0.26286895228372437,-0.5257372320187721,-0.8090119138767345,
    0.531941,-0.502302,-0.681712,1.0,0.5236579140350146,-0.503818798851909,-0.6869854488938736,
    0.4253230000000001,-0.850654,-0.3090109999999999,1.0,0.42532286056333185,-0.8506540013904963,-0.3090117056044348,
    0.1381969999999999,-0.894429,-0.42532100000000006,1.0,0.14064406863988954,-0.890425561238057,-0.4328528223892147,
    0.3618030000000001,-0.723612,-0.587779,1.0,0.3538531927575634,-0.727551553663659,-0.5877556080012123,
    0.1381969999999999,-0.894429,-0.42532100000000006,1.0,0.14064406863988954,-0.890425561238057,-0.4328528223892147,
    0.052788999999999975,-0.723611,-0.688186,1.0,0.05920646379214723,-0.7275510143742654,-0.683494049811852,
    0.3618030000000001,-0.723612,-0.587779,1.0,0.3538531927575634,-0.727551553663659,-0.5877556080012123,
    0.3618030000000001,-0.723612,-0.587779,1.0,0.3538531927575634,-0.727551553663659,-0.5877556080012123,
    0.052788999999999975,-0.723611,-0.688186,1.0,0.05920646379214723,-0.7275510143742654,-0.683494049811852,
    0.262869,-0.525738,-0.809012,1.0,0.26286895228372437,-0.5257372320187721,-0.8090119138767345,
    0.052788999999999975,-0.723611,-0.688186,1.0,0.05920646379214723,-0.7275510143742654,-0.683494049811852,
    -0.02963899999999997,-0.502302,-0.864184,1.0,-0.019838720158978862,-0.5038191057760348,-0.8635813417608618,
    0.262869,-0.525738,-0.809012,1.0,0.26286895228372437,-0.5257372320187721,-0.8090119138767345,
    0.20318100000000006,-0.96795,-0.14761800000000003,1.0,0.21095286907952562,-0.9654060533326492,-0.15326460522832558,
    -0.07760699999999998,-0.96795,-0.23885299999999998,1.0,-0.08057588379380852,-0.9654061724258667,-0.24798880860410688,
    0.1381969999999999,-0.894429,-0.42532100000000006,1.0,0.14064406863988954,-0.890425561238057,-0.4328528223892147,
    -0.07760699999999998,-0.96795,-0.23885299999999998,1.0,-0.08057588379380852,-0.9654061724258667,-0.24798880860410688,
    -0.16245599999999993,-0.850654,-0.49999499999999997,1.0,-0.1624559605874681,-0.8506538252498717,-0.4999961304423903,
    0.1381969999999999,-0.894429,-0.42532100000000006,1.0,0.14064406863988954,-0.890425561238057,-0.4328528223892147,
    0.1381969999999999,-0.894429,-0.42532100000000006,1.0,0.14064406863988954,-0.890425561238057,-0.4328528223892147,
    -0.16245599999999993,-0.850654,-0.49999499999999997,1.0,-0.1624559605874681,-0.8506538252498717,-0.4999961304423903,
    0.052788999999999975,-0.723611,-0.688186,1.0,0.05920646379214723,-0.7275510143742654,-0.683494049811852,
    -0.16245599999999993,-0.850654,-0.49999499999999997,1.0,-0.1624559605874681,-0.8506538252498717,-0.4999961304423903,
    -0.23282199999999997,-0.657519,-0.716563,1.0,-0.23079127648765035,-0.664972933661906,-0.7103142855062675,
    0.052788999999999975,-0.723611,-0.688186,1.0,0.05920646379214723,-0.7275510143742654,-0.683494049811852,
    0.052788999999999975,-0.723611,-0.688186,1.0,0.05920646379214723,-0.7275510143742654,-0.683494049811852,
    -0.23282199999999997,-0.657519,-0.716563,1.0,-0.23079127648765035,-0.664972933661906,-0.7103142855062675,
    -0.02963899999999997,-0.502302,-0.864184,1.0,-0.019838720158978862,-0.5038191057760348,-0.8635813417608618,
    -0.23282199999999997,-0.657519,-0.716563,1.0,-0.23079127648765035,-0.664972933661906,-0.7103142855062675,
    -0.2763880000000001,-0.44721999999999995,-0.850649,1.0,-0.2763877525951483,-0.44721995820039734,-0.8506492339399583,
    -0.02963899999999997,-0.502302,-0.864184,1.0,-0.019838720158978862,-0.5038191057760348,-0.8635813417608618,
    -0.23282199999999997,-0.657519,-0.716563,1.0,-0.23079127648765035,-0.664972933661906,-0.7103142855062675,
    -0.48397099999999993,-0.502302,-0.716565,1.0,-0.4915461091474215,-0.5038186497816622,-0.7103162610515219,
    -0.2763880000000001,-0.44721999999999995,-0.850649,1.0,-0.2763877525951483,-0.44721995820039734,-0.8506492339399583,
    -0.16245599999999993,-0.850654,-0.49999499999999997,1.0,-0.1624559605874681,-0.8506538252498717,-0.4999961304423903,
    -0.447211,-0.723612,-0.525727,1.0,-0.4496452961078909,-0.7275509278708348,-0.5181590055594274,
    -0.23282199999999997,-0.657519,-0.716563,1.0,-0.23079127648765035,-0.664972933661906,-0.7103142855062675,
    -0.07760699999999998,-0.96795,-0.23885299999999998,1.0,-0.08057588379380852,-0.9654061724258667,-0.24798880860410688,
    -0.36180100000000004,-0.894429,-0.26286300000000007,1.0,-0.36820701052687826,-0.8904256400317344,-0.2675178068333686,
    -0.16245599999999993,-0.850654,-0.49999499999999997,1.0,-0.1624559605874681,-0.8506538252498717,-0.4999961304423903,
    -0.23282199999999997,-0.657519,-0.716563,1.0,-0.23079127648765035,-0.664972933661906,-0.7103142855062675,
    -0.447211,-0.723612,-0.525727,1.0,-0.4496452961078909,-0.7275509278708348,-0.5181590055594274,
    -0.48397099999999993,-0.502302,-0.716565,1.0,-0.4915461091474215,-0.5038186497816622,-0.7103162610515219,
    -0.447211,-0.723612,-0.525727,1.0,-0.4496452961078909,-0.7275509278708348,-0.5181590055594274,
    -0.688189,-0.525736,-0.499997,1.0,-0.6881896629138985,-0.5257350598001616,-0.4999976347497809,
    -0.48397099999999993,-0.502302,-0.716565,1.0,-0.4915461091474215,-0.5038186497816622,-0.7103162610515219,
    -0.16245599999999993,-0.850654,-0.49999499999999997,1.0,-0.1624559605874681,-0.8506538252498717,-0.4999961304423903,
    -0.36180100000000004,-0.894429,-0.26286300000000007,1.0,-0.36820701052687826,-0.8904256400317344,-0.2675178068333686,
    -0.447211,-0.723612,-0.525727,1.0,-0.4496452961078909,-0.7275509278708348,-0.5181590055594274,
    -0.36180100000000004,-0.894429,-0.26286300000000007,1.0,-0.36820701052687826,-0.8904256400317344,-0.2675178068333686,
    -0.638195,-0.723609,-0.26286300000000007,1.0,-0.6317494048790507,-0.7275484141008814,-0.2675182135374292,
    -0.447211,-0.723612,-0.525727,1.0,-0.4496452961078909,-0.7275509278708348,-0.5181590055594274,
    -0.447211,-0.723612,-0.525727,1.0,-0.4496452961078909,-0.7275509278708348,-0.5181590055594274,
    -0.638195,-0.723609,-0.26286300000000007,1.0,-0.6317494048790507,-0.7275484141008814,-0.2675182135374292,
    -0.688189,-0.525736,-0.499997,1.0,-0.6881896629138985,-0.5257350598001616,-0.4999976347497809,
    -0.638195,-0.723609,-0.26286300000000007,1.0,-0.6317494048790507,-0.7275484141008814,-0.2675182135374292,
    -0.831051,-0.502299,-0.23885299999999998,1.0,-0.827448675299351,-0.503815221812631,-0.24798974175404667,
    -0.688189,-0.525736,-0.499997,1.0,-0.6881896629138985,-0.5257350598001616,-0.4999976347497809,
    -0.07760699999999998,-0.96795,-0.23885299999999998,1.0,-0.08057588379380852,-0.9654061724258667,-0.24798880860410688,
    -0.251147,-0.967949,0.0,1.0,-0.26075247981128585,-0.965405688957526,8.4223782992918e-07,
    -0.36180100000000004,-0.894429,-0.26286300000000007,1.0,-0.36820701052687826,-0.8904256400317344,-0.2675178068333686,
    -0.251147,-0.967949,0.0,1.0,-0.26075247981128585,-0.965405688957526,8.4223782992918e-07,
    -0.52573,-0.850652,0.0,1.0,-0.5257291351746985,-0.8506520301675546,5.30161602573815e-07,
    -0.36180100000000004,-0.894429,-0.26286300000000007,1.0,-0.36820701052687826,-0.8904256400317344,-0.2675178068333686,
    -0.36180100000000004,-0.894429,-0.26286300000000007,1.0,-0.36820701052687826,-0.8904256400317344,-0.2675178068333686,
    -0.52573,-0.850652,0.0,1.0,-0.5257291351746985,-0.8506520301675546,5.30161602573815e-07,
    -0.638195,-0.723609,-0.26286300000000007,1.0,-0.6317494048790507,-0.7275484141008814,-0.2675182135374292,
    -0.52573,-0.850652,0.0,1.0,-0.5257291351746985,-0.8506520301675546,5.30161602573815e-07,
    -0.753442,-0.657515,0.0,1.0,-0.7468712183386028,-0.6649687084497966,-1.4345962018813593e-07,
    -0.638195,-0.723609,-0.26286300000000007,1.0,-0.6317494048790507,-0.7275484141008814,-0.2675182135374292,
    -0.638195,-0.723609,-0.26286300000000007,1.0,-0.6317494048790507,-0.7275484141008814,-0.2675182135374292,
    -0.753442,-0.657515,0.0,1.0,-0.7468712183386028,-0.6649687084497966,-1.4345962018813593e-07,
    -0.831051,-0.502299,-0.23885299999999998,1.0,-0.827448675299351,-0.503815221812631,-0.24798974175404667,
    -0.753442,-0.657515,0.0,1.0,-0.7468712183386028,-0.6649687084497966,-1.4345962018813593e-07,
    -0.894426,-0.44721600000000006,0.0,1.0,-0.8944264388330798,-0.44721509983046726,3.5123469383576465e-18,
    -0.831051,-0.502299,-0.23885299999999998,1.0,-0.827448675299351,-0.503815221812631,-0.24798974175404667,
    -0.753442,-0.657515,0.0,1.0,-0.7468712183386028,-0.6649687084497966,-1.4345962018813593e-07,
    -0.831051,-0.502299,0.23885299999999998,1.0,-0.8274488479658778,-0.5038149789897272,0.24798965894876002,
    -0.894426,-0.44721600000000006,0.0,1.0,-0.8944264388330798,-0.44721509983046726,3.5123469383576465e-18,
    -0.52573,-0.850652,0.0,1.0,-0.5257291351746985,-0.8506520301675546,5.30161602573815e-07,
    -0.638195,-0.723609,0.262864,1.0,-0.6317485209773642,-0.7275487814839495,0.2675193017412632,
    -0.753442,-0.657515,0.0,1.0,-0.7468712183386028,-0.6649687084497966,-1.4345962018813593e-07,
    -0.251147,-0.967949,0.0,1.0,-0.26075247981128585,-0.965405688957526,8.4223782992918e-07,
    -0.36180100000000004,-0.894428,0.262864,1.0,-0.3682072805368218,-0.8904250916957412,0.26751926031280254,
    -0.52573,-0.850652,0.0,1.0,-0.5257291351746985,-0.8506520301675546,5.30161602573815e-07,
    -0.753442,-0.657515,0.0,1.0,-0.7468712183386028,-0.6649687084497966,-1.4345962018813593e-07,
    -0.638195,-0.723609,0.262864,1.0,-0.6317485209773642,-0.7275487814839495,0.2675193017412632,
    -0.831051,-0.502299,0.23885299999999998,1.0,-0.8274488479658778,-0.5038149789897272,0.24798965894876002,
    -0.638195,-0.723609,0.262864,1.0,-0.6317485209773642,-0.7275487814839495,0.2675193017412632,
    -0.688189,-0.525736,0.499997,1.0,-0.6881895511641616,-0.5257349869564159,0.49999786515384953,
    -0.831051,-0.502299,0.23885299999999998,1.0,-0.8274488479658778,-0.5038149789897272,0.24798965894876002,
    -0.52573,-0.850652,0.0,1.0,-0.5257291351746985,-0.8506520301675546,5.30161602573815e-07,
    -0.36180100000000004,-0.894428,0.262864,1.0,-0.3682072805368218,-0.8904250916957412,0.26751926031280254,
    -0.638195,-0.723609,0.262864,1.0,-0.6317485209773642,-0.7275487814839495,0.2675193017412632,
    -0.36180100000000004,-0.894428,0.262864,1.0,-0.3682072805368218,-0.8904250916957412,0.26751926031280254,
    -0.447211,-0.72361,0.5257290000000001,1.0,-0.44964507698926237,-0.7275501699756488,0.5181602598692076,
    -0.638195,-0.723609,0.262864,1.0,-0.6317485209773642,-0.7275487814839495,0.2675193017412632,
    -0.638195,-0.723609,0.262864,1.0,-0.6317485209773642,-0.7275487814839495,0.2675193017412632,
    -0.447211,-0.72361,0.5257290000000001,1.0,-0.44964507698926237,-0.7275501699756488,0.5181602598692076,
    -0.688189,-0.525736,0.499997,1.0,-0.6881895511641616,-0.5257349869564159,0.49999786515384953,
    -0.447211,-0.72361,0.5257290000000001,1.0,-0.44964507698926237,-0.7275501699756488,0.5181602598692076,
    -0.48397099999999993,-0.502302,0.7165650000000001,1.0,-0.49154612462755637,-0.503818632525199,0.7103162625789089,
    -0.688189,-0.525736,0.499997,1.0,-0.6881895511641616,-0.5257349869564159,0.49999786515384953,
    -0.251147,-0.967949,0.0,1.0,-0.26075247981128585,-0.965405688957526,8.4223782992918e-07,
    -0.07760699999999998,-0.96795,0.23885299999999998,1.0,-0.08057675620781352,-0.9654060832357604,0.2479888723519962,
    -0.36180100000000004,-0.894428,0.262864,1.0,-0.3682072805368218,-0.8904250916957412,0.26751926031280254,
    -0.07760699999999998,-0.96795,0.23885299999999998,1.0,-0.08057675620781352,-0.9654060832357604,0.2479888723519962,
    -0.16245599999999993,-0.850654,0.49999499999999997,1.0,-0.16245708015289456,-0.8506538856343064,0.4999956639446509,
    -0.36180100000000004,-0.894428,0.262864,1.0,-0.3682072805368218,-0.8904250916957412,0.26751926031280254,
    -0.36180100000000004,-0.894428,0.262864,1.0,-0.3682072805368218,-0.8904250916957412,0.26751926031280254,
    -0.16245599999999993,-0.850654,0.49999499999999997,1.0,-0.16245708015289456,-0.8506538856343064,0.4999956639446509,
    -0.447211,-0.72361,0.5257290000000001,1.0,-0.44964507698926237,-0.7275501699756488,0.5181602598692076,
    -0.16245599999999993,-0.850654,0.49999499999999997,1.0,-0.16245708015289456,-0.8506538856343064,0.4999956639446509,
    -0.23282199999999997,-0.657519,0.7165629999999998,1.0,-0.23079124291012987,-0.6649730641972427,0.7103141742131627,
    -0.447211,-0.72361,0.5257290000000001,1.0,-0.44964507698926237,-0.7275501699756488,0.5181602598692076,
    -0.447211,-0.72361,0.5257290000000001,1.0,-0.44964507698926237,-0.7275501699756488,0.5181602598692076,
    -0.23282199999999997,-0.657519,0.7165629999999998,1.0,-0.23079124291012987,-0.6649730641972427,0.7103141742131627,
    -0.48397099999999993,-0.502302,0.7165650000000001,1.0,-0.49154612462755637,-0.503818632525199,0.7103162625789089,
    -0.23282199999999997,-0.657519,0.7165629999999998,1.0,-0.23079124291012987,-0.6649730641972427,0.7103141742131627,
    -0.2763880000000001,-0.44721999999999995,0.850649,1.0,-0.27638775259514803,-0.44721995820039745,0.8506492339399584,
    -0.48397099999999993,-0.502302,0.7165650000000001,1.0,-0.49154612462755637,-0.503818632525199,0.7103162625789089,
    0.812729,-0.502301,-0.295238,1.0,0.8151846510833864,-0.5038175802700607,-0.2857303456913148,
    0.6095470000000001,-0.657519,-0.442856,1.0,0.60423092704266,-0.6649723365238669,-0.4389951918451463,
    0.7236069999999999,-0.44721999999999995,-0.525725,1.0,0.7236067216830413,-0.4472196513214831,-0.525726065367709,
    0.8506480000000001,-0.525736,0.0,1.0,0.8506487792762305,-0.5257343952185694,-1.551196823478276e-07,
    0.670817,-0.723611,-0.16245699999999996,1.0,0.6683377704518599,-0.7275503751292589,-0.15490344165547704,
    0.812729,-0.502301,-0.295238,1.0,0.8151846510833864,-0.5038175802700607,-0.2857303456913148,
    0.812729,-0.502301,0.2952379999999999,1.0,0.8151848055269568,-0.503817229437447,0.2857305236756347,
    0.6708180000000001,-0.72361,0.162458,1.0,0.6683384936921797,-0.727549561234357,0.1549041438986152,
    0.8506480000000001,-0.525736,0.0,1.0,0.8506487792762305,-0.5257343952185694,-1.551196823478276e-07,
    0.812729,-0.502301,-0.295238,1.0,0.8151846510833864,-0.5038175802700607,-0.2857303456913148,
    0.670817,-0.723611,-0.16245699999999996,1.0,0.6683377704518599,-0.7275503751292589,-0.15490344165547704,
    0.6095470000000001,-0.657519,-0.442856,1.0,0.60423092704266,-0.6649723365238669,-0.4389951918451463,
    0.670817,-0.723611,-0.16245699999999996,1.0,0.6683377704518599,-0.7275503751292589,-0.15490344165547704,
    0.4253230000000001,-0.850654,-0.3090109999999999,1.0,0.42532286056333185,-0.8506540013904963,-0.3090117056044348,
    0.6095470000000001,-0.657519,-0.442856,1.0,0.60423092704266,-0.6649723365238669,-0.4389951918451463,
    0.8506480000000001,-0.525736,0.0,1.0,0.8506487792762305,-0.5257343952185694,-1.551196823478276e-07,
    0.6708180000000001,-0.72361,0.162458,1.0,0.6683384936921797,-0.727549561234357,0.1549041438986152,
    0.670817,-0.723611,-0.16245699999999996,1.0,0.6683377704518599,-0.7275503751292589,-0.15490344165547704,
    0.6708180000000001,-0.72361,0.162458,1.0,0.6683384936921797,-0.727549561234357,0.1549041438986152,
    0.447211,-0.894428,9.999999999177334e-07,1.0,0.4551295869979919,-0.8904252124903946,6.877146626628624e-07,
    0.670817,-0.723611,-0.16245699999999996,1.0,0.6683377704518599,-0.7275503751292589,-0.15490344165547704,
    0.670817,-0.723611,-0.16245699999999996,1.0,0.6683377704518599,-0.7275503751292589,-0.15490344165547704,
    0.447211,-0.894428,9.999999999177334e-07,1.0,0.4551295869979919,-0.8904252124903946,6.877146626628624e-07,
    0.4253230000000001,-0.850654,-0.3090109999999999,1.0,0.42532286056333185,-0.8506540013904963,-0.3090117056044348,
    0.447211,-0.894428,9.999999999177334e-07,1.0,0.4551295869979919,-0.8904252124903946,6.877146626628624e-07,
    0.20318100000000006,-0.96795,-0.14761800000000003,1.0,0.21095286907952562,-0.9654060533326492,-0.15326460522832558,
    0.4253230000000001,-0.850654,-0.3090109999999999,1.0,0.42532286056333185,-0.8506540013904963,-0.3090117056044348,
    0.812729,-0.502301,0.2952379999999999,1.0,0.8151848055269568,-0.503817229437447,0.2857305236756347,
    0.6095470000000001,-0.657519,0.4428559999999999,1.0,0.6042310408008547,-0.6649722006723842,0.43899524105124693,
    0.6708180000000001,-0.72361,0.162458,1.0,0.6683384936921797,-0.727549561234357,0.1549041438986152,
    0.6095470000000001,-0.657519,0.4428559999999999,1.0,0.6042310408008547,-0.6649722006723842,0.43899524105124693,
    0.4253230000000001,-0.850654,0.3090109999999999,1.0,0.42532325551188366,-0.8506538075846909,0.30901169551076946,
    0.6708180000000001,-0.72361,0.162458,1.0,0.6683384936921797,-0.727549561234357,0.1549041438986152,
    0.6708180000000001,-0.72361,0.162458,1.0,0.6683384936921797,-0.727549561234357,0.1549041438986152,
    0.4253230000000001,-0.850654,0.3090109999999999,1.0,0.42532325551188366,-0.8506538075846909,0.30901169551076946,
    0.447211,-0.894428,9.999999999177334e-07,1.0,0.4551295869979919,-0.8904252124903946,6.877146626628624e-07,
    0.4253230000000001,-0.850654,0.3090109999999999,1.0,0.42532325551188366,-0.8506538075846909,0.30901169551076946,
    0.20318100000000006,-0.96795,0.14761800000000003,1.0,0.21095266289464853,-0.9654061618992498,0.15326420516420788,
    0.447211,-0.894428,9.999999999177334e-07,1.0,0.4551295869979919,-0.8904252124903946,6.877146626628624e-07,
    0.447211,-0.894428,9.999999999177334e-07,1.0,0.4551295869979919,-0.8904252124903946,6.877146626628624e-07,
    0.20318100000000006,-0.96795,0.14761800000000003,1.0,0.21095266289464853,-0.9654061618992498,0.15326420516420788,
    0.20318100000000006,-0.96795,-0.14761800000000003,1.0,0.21095286907952562,-0.9654060533326492,-0.15326460522832558,
    0.20318100000000006,-0.96795,0.14761800000000003,1.0,0.21095266289464853,-0.9654061618992498,0.15326420516420788,
    0.0,-1.0,0.0,1.0,-1.306012939612e-06,-0.9999999999991471,7.024692550196524e-18,
    0.20318100000000006,-0.96795,-0.14761800000000003,1.0,0.21095286907952562,-0.9654060533326492,-0.15326460522832558,
    -0.23282199999999997,-0.657519,0.7165629999999998,1.0,-0.23079124291012987,-0.6649730641972427,0.7103141742131627,
    -0.02963899999999997,-0.502302,0.8641839999999998,1.0,-0.019838689717257413,-0.5038192559913451,0.8635812548235572,
    -0.2763880000000001,-0.44721999999999995,0.850649,1.0,-0.27638775259514803,-0.44721995820039745,0.8506492339399584,
    -0.16245599999999993,-0.850654,0.49999499999999997,1.0,-0.16245708015289456,-0.8506538856343064,0.4999956639446509,
    0.05278999999999989,-0.723612,0.688185,1.0,0.05920723925994218,-0.7275515145351986,0.6834934502369095,
    -0.23282199999999997,-0.657519,0.7165629999999998,1.0,-0.23079124291012987,-0.6649730641972427,0.7103141742131627,
    -0.07760699999999998,-0.96795,0.23885299999999998,1.0,-0.08057675620781352,-0.9654060832357604,0.2479888723519962,
    0.13819899999999996,-0.894429,0.42532100000000006,1.0,0.1406455146287707,-0.8904254422627637,0.4328525972960891,
    -0.16245599999999993,-0.850654,0.49999499999999997,1.0,-0.16245708015289456,-0.8506538856343064,0.4999956639446509,
    -0.23282199999999997,-0.657519,0.7165629999999998,1.0,-0.23079124291012987,-0.6649730641972427,0.7103141742131627,
    0.05278999999999989,-0.723612,0.688185,1.0,0.05920723925994218,-0.7275515145351986,0.6834934502369095,
    -0.02963899999999997,-0.502302,0.8641839999999998,1.0,-0.019838689717257413,-0.5038192559913451,0.8635812548235572,
    0.05278999999999989,-0.723612,0.688185,1.0,0.05920723925994218,-0.7275515145351986,0.6834934502369095,
    0.262869,-0.525738,0.8090120000000001,1.0,0.26286888259023233,-0.5257372188438393,0.8090119450836976,
    -0.02963899999999997,-0.502302,0.8641839999999998,1.0,-0.019838689717257413,-0.5038192559913451,0.8635812548235572,
    -0.16245599999999993,-0.850654,0.49999499999999997,1.0,-0.16245708015289456,-0.8506538856343064,0.4999956639446509,
    0.13819899999999996,-0.894429,0.42532100000000006,1.0,0.1406455146287707,-0.8904254422627637,0.4328525972960891,
    0.05278999999999989,-0.723612,0.688185,1.0,0.05920723925994218,-0.7275515145351986,0.6834934502369095,
    0.13819899999999996,-0.894429,0.42532100000000006,1.0,0.1406455146287707,-0.8904254422627637,0.4328525972960891,
    0.36180499999999993,-0.723611,0.587779,1.0,0.3538549988818572,-0.7275505518078368,0.5877557607803032,
    0.05278999999999989,-0.723612,0.688185,1.0,0.05920723925994218,-0.7275515145351986,0.6834934502369095,
    0.05278999999999989,-0.723612,0.688185,1.0,0.05920723925994218,-0.7275515145351986,0.6834934502369095,
    0.36180499999999993,-0.723611,0.587779,1.0,0.3538549988818572,-0.7275505518078368,0.5877557607803032,
    0.262869,-0.525738,0.8090120000000001,1.0,0.26286888259023233,-0.5257372188438393,0.8090119450836976,
    0.36180499999999993,-0.723611,0.587779,1.0,0.3538549988818572,-0.7275505518078368,0.5877557607803032,
    0.531941,-0.502302,0.6817120000000001,1.0,0.5236580515960895,-0.5038185204865161,0.6869855481837774,
    0.262869,-0.525738,0.8090120000000001,1.0,0.26286888259023233,-0.5257372188438393,0.8090119450836976,
    -0.07760699999999998,-0.96795,0.23885299999999998,1.0,-0.08057675620781352,-0.9654060832357604,0.2479888723519962,
    0.20318100000000006,-0.96795,0.14761800000000003,1.0,0.21095266289464853,-0.9654061618992498,0.15326420516420788,
    0.13819899999999996,-0.894429,0.42532100000000006,1.0,0.1406455146287707,-0.8904254422627637,0.4328525972960891,
    0.20318100000000006,-0.96795,0.14761800000000003,1.0,0.21095266289464853,-0.9654061618992498,0.15326420516420788,
    0.4253230000000001,-0.850654,0.3090109999999999,1.0,0.42532325551188366,-0.8506538075846909,0.30901169551076946,
    0.13819899999999996,-0.894429,0.42532100000000006,1.0,0.1406455146287707,-0.8904254422627637,0.4328525972960891,
    0.13819899999999996,-0.894429,0.42532100000000006,1.0,0.1406455146287707,-0.8904254422627637,0.4328525972960891,
    0.4253230000000001,-0.850654,0.3090109999999999,1.0,0.42532325551188366,-0.8506538075846909,0.30901169551076946,
    0.36180499999999993,-0.723611,0.587779,1.0,0.3538549988818572,-0.7275505518078368,0.5877557607803032,
    0.4253230000000001,-0.850654,0.3090109999999999,1.0,0.42532325551188366,-0.8506538075846909,0.30901169551076946,
    0.6095470000000001,-0.657519,0.4428559999999999,1.0,0.6042310408008547,-0.6649722006723842,0.43899524105124693,
    0.36180499999999993,-0.723611,0.587779,1.0,0.3538549988818572,-0.7275505518078368,0.5877557607803032,
    0.36180499999999993,-0.723611,0.587779,1.0,0.3538549988818572,-0.7275505518078368,0.5877557607803032,
    0.6095470000000001,-0.657519,0.4428559999999999,1.0,0.6042310408008547,-0.6649722006723842,0.43899524105124693,
    0.531941,-0.502302,0.6817120000000001,1.0,0.5236580515960895,-0.5038185204865161,0.6869855481837774,
    0.6095470000000001,-0.657519,0.4428559999999999,1.0,0.6042310408008547,-0.6649722006723842,0.43899524105124693,
    0.7236069999999999,-0.44721999999999995,0.525725,1.0,0.7236067216830413,-0.4472196513214831,0.5257260653677089,
    0.531941,-0.502302,0.6817120000000001,1.0,0.5236580515960895,-0.5038185204865161,0.6869855481837774]);
}