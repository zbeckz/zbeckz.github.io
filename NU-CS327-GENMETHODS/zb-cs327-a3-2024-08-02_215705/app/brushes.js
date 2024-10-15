const WIDTH = innerWidth * 0.6; // fits every screen...defaults didn't fit with my chrome settings
const HEIGHT = innerHeight * 0.6;
const DEFAULT_FRAME_RATE = 30;
const DEFAULT_LOOP_LENGTH_IN_FRAMES = 100;

const STARTING_COLOR0 = [255, 100, 50];
const STARTING_COLOR1 = [0, 100, 50];
const STARTING_BRUSH_SIZE = 1;

let brushes = [
  {
    label: "❌",
    hide: false,
    description: "Eraser: turns canvas completely white",

    setup(p, settings) 
    {
      
    },
    
    draw(p, settings)
    {
      // background between the two colors
      p.colorMode(p.HSL)
      let c0 = p.color(settings.color0)
      let c1 = p.color(settings.color1)
      p.colorMode(p.RGB)
      let backgroundColor = p.lerpColor(c0, c1, 0.5)
      p.background(backgroundColor);
      p.colorMode(p.HSL)
    },

    mouseDragged(p, settings) 
    {
      // nothing happens when they drag eraser  
    }
  },
  
////////////////////////////////////////////////////////////////////////////////
  
  {
    label: "👻",
    hide: false,
    description: "Discrete: Draws spooky emojis when dragged",    
    setup(p, settings) 
    {
      // use HSL color mode
      p.colorMode(p.HSL)
      
      // set the background to white
      p.background(0,0,100)
      
      // these are the possible emojis that can be drawn
      this.emojis = ["🎃", "👻", "🧟", "💀", "🦇", "🧛"]
      
      // draw text such that the center of each string drawn is at the x and y coordinates for the call to p.text
      p.textAlign(p.CENTER, p.CENTER)
    },

    mouseDragged(p, { color0, color1, brushSize }) 
    {
      // set the font size based on brush size from the controls
      p.textSize(brushSize * 5)
      
      // draw a random emoji at the mouse location
      p.text(p.random(this.emojis), p.mouseX, p.mouseY)
    }
  },
  
////////////////////////////////////////////////////////////////////////////////
  
  {
    label: "🌧️",
    hide: false,
    description: "Rain: Rain drops are created where the brush is dragged and fall to form a puddle, altering color",
    
    setup(p, settings) 
    {
      // use hsl scheme for colors
      p.colorMode(p.HSL)
      
      // setup empty arrays that will contain the active droplets and splashes to draw
      this.droplets = []
      this.splashes = []
      
      // initialize puddle to be small at first
      this.puddleAmount = 0 // the "amount" of rain that has fallen into the puddle
      this.puddleHeight = HEIGHT-30 // the actual y value of the puddle height in the canvas
      
      // set to white at first
      this.puddleColor = [0, 0, 100]
      
      // makes p.circle(x, y, size) draw such that the center is at (x, y)
      p.ellipseMode(p.CENTER)
      
      // no outline
      p.strokeWeight(0)
    },
    
    draw(p, settings)
    {
      // clear the screen to a white background
      p.background(0, 0, 100)
      
      // use the helper functions to draw the rain droplets, splashes, and puddle
      this.drawDroplets(p)
      this.drawSplashes(p)
      this.drawPuddle(p)
    },

    // called from app.js if this is the active brush
    mouseDragged(p, { color0, color1, brushSize }) 
    {
      // setup new droplet specs
      let size = p.map(brushSize, 0, 10, 4, 30)
      let x = p.mouseX;
      let y = p.mouseY;
      
      // draw the droplet
      p.fill(color0)
      p.circle(x, y, size)
      
      // add it to the droplets array for future use
      this.droplets.push({
        x: x,
        y: y,
        color: color0,
        size: size,
        velocity: 1
      })
    },
    
    // utility function used instead of repeating code
    getPuddleHeight(p, x)
    {
      let t = p.millis() * 0.001
      
      // this is the equation used for the wavyness of the puddle
      return this.puddleHeight + 50*p.noise(x*0.001+t, 1)
    },
    
    drawDroplets(p)
    {
      // loop through all the droplets
      for (let i = 0; i < this.droplets.length; i++)
      {
        // get one droplet
        let droplet = this.droplets[i]
        
        // move it down a bit
        droplet.y += droplet.velocity
        
        // accelerate it
        droplet.velocity += 0.5
        
        // if out of frame, remove and add to puddle. otherwise, draw
        if (droplet.y - droplet.size*0.5 > this.getPuddleHeight(p, droplet.x))
        {
          // update the puddle (puddleHeight decreased because a p5 canvas has an inverse y axis)
          this.puddleHeight -= droplet.size*0.01
          this.puddleAmount += droplet.size
          
          // get the current color of the puddle and of this droplet
          let rgbPuddle = p.color(this.puddleColor)
          let rgbDroplet = p.color(droplet.color)
          
          // change the puddle color by interpolating between the puddle color and droplet color, weighing by size of the droplet and puddle
          p.colorMode(p.RGB)
          this.puddleColor = p.lerpColor(rgbPuddle, rgbDroplet, (droplet.size*4 / this.puddleAmount))
          p.colorMode(p.HSL)
          
          // add a new splash at the location of the this droplet, moving right and up initially
          this.splashes.push({
            x: droplet.x,
            y: this.getPuddleHeight(p, droplet.x),
            vx: p.random()*3 + 1,
            vy: p.random() - 0.5 + droplet.size * -0.25,
            size: p.random()*4 + droplet.size*0.15
          })
          
          // add a new splash at the location of the this droplet, moving left and up initially
          this.splashes.push({
            x: droplet.x,
            y: this.getPuddleHeight(p, droplet.x),
            vx: p.random()*3 - 4,
            vy: p.random() - 0.5 + droplet.size * -0.25,
            size: p.random()*4 + droplet.size*0.15
          })
          
          // remove this droplet from the array
          this.droplets.splice(i, 1)
        }
        else
        {
          // draw main location of the droplet and some translucent tail droplets to look more like a falling raindrop
          p.fill(...droplet.color, 0.25)
          for (let j = 0; j < 5; j++)
          {
            p.circle(droplet.x, droplet.y-droplet.size*j*0.2, droplet.size-j*droplet.size*0.2)
          }
        }
      }
      
    },
    
    drawSplashes(p)
    {
      // the splashes will be whatever the current puddle color is
      p.fill(this.puddleColor)
      
      // loop through all the splashes
      for (let i = 0; i < this.splashes.length; i++)
      {
        let splash = this.splashes[i]
        
        // if splash gone, delete it. otherwise, draw it
        if (splash.y - splash.size > p.height)
        {
          this.splashes.splice(i, 1)
        }
        else
        {
          // move splash
          splash.x += splash.vx
          splash.y += splash.vy

          // accelerate splash
          splash.vy += 0.5
          
          // draw splash
          p.circle(splash.x, splash.y, splash.size)
        }
      }
    },
    
    drawPuddle(p)
    {
      // draw puddle
      p.fill(this.puddleColor)
      
      // begin the puddle shape by drawing a straight line up on the left
      p.beginShape()
      p.vertex(0, HEIGHT) // bottom left corner
      p.vertex(0, this.puddleHeight) // top left corner
    
      // use the puddle height function (which uses perlin noise) to draw the wavy top of the puddle
      for (let i = 0; i <= WIDTH; i++)
      {
        p.vertex(i, this.getPuddleHeight(p, i))
      }
      
      // draw a straight line down on the right
      p.vertex(WIDTH,this.puddleHeight) // top right corner
      p.vertex(WIDTH, HEIGHT) // bottom right corner
      
      // close at the bottom
      p.endShape(p.CLOSE)
    },
  },
  
/////////////////////////////////////////////////////////////////////////
  
  {
    label: "❓",
    hide: false,
    description: "Mystery: Draw to unveil a pattern",
    
    setup(p, settings) 
    {
      // all white background
      p.colorMode(p.RGB)
      p.background(255,255,255)
      
      // rect coords are center. No border.
      p.rectMode(p.CENTER)
      p.strokeWeight(0)
     
      // my own pixel arrays
      this.pixelMap = [] // the underlying pattern, which uses modulo to create a cool visual
      this.drawnMap = [] // which pixels have been drawn already. starts out as all false. used to avoid heavy computation later
      for (let j = 0; j < p.height; j++)
      {
        for (let i = 0; i < p.width; i++)
        {
          let r = p.map(i % 47, 0, 47, 0, 255)
          let g = p.map(j % 47, 0, 47, 0, 255)
          let b = p.map((i + j) % 91, 0, 91, 0, 255)
          this.pixelMap.push([r, g, b])
          this.drawnMap.push(false)
        }
      }
    },

    mouseDragged(p, { color0, color1, brushSize }) 
    {
      // if the mouse drag is outside of the screen, do nothing
      if (p.mouseX >= p.width || p.mouseX < 0 || p.mouseY < 0 || p.mouseY >= p.height)
      {
        return
      }
      
      // create p5 color objects with each color from the control panel
      p.colorMode(p.HSL)
      let c0 = p.color(color0)
      let c1 = p.color(color1)
      
      // switch to rgb color mode for more intuitive interpolation
      p.colorMode(p.RGB)
      
      // size variable determines the radius we will draw around the mouse position
      let size = brushSize * 5
      
      // loop through 0 to radius, essentially will be drawing concentric circles
      for (let r = 0; r < size; r++)
      {
        // loop through a circle using polar coordinates
        for (let theta = 0; theta < p.PI*2; theta+=p.PI/48)
        {
          // get current cartesian coord (integers to index into pixel array)
          let i = Math.round(p.mouseX + r * p.cos(theta))
          let j = Math.round(p.mouseY + r * p.sin(theta))
          
          // if outside the screen, skip
          if (i < 0 || j < 0 || i >= p.width || j >= p.height) { continue }
          
          // index into pixel and drawn map using the coordinates and the width
          let index = i + j * Math.round(p.width)
          
          // if this pixel has already been drawn, move on
          if (this.drawnMap[index][0] == color0 && this.drawnMap[index][1] == color1) { continue }
          
          // get the underlying pattern color
          let calcColor = p.color(this.pixelMap[index])
          
          // use the color from the controls to determine what color will we draw, dependent on where on the screen we are
          let color
          if ((i > p.width/2 && j > p.height/2) || (i < p.width/2 && j < p.height/2))
          {
            color = p.lerpColor(calcColor, c0, 0.5)
          }
          else
          {
            color = p.lerpColor(calcColor, c1, 0.5)
          }
          
          // update drawn map
          this.drawnMap[index] = [color0, color1]
          
          // draw pixel
          p.fill(color)
          p.rect(i, j, 1, 1)
        }
      }
    }
  },
  
  {
    label: "〰️",
    hide: false,
    description: "Continuous: Draws bezier curves with control points determined by previous points",    
    
    setup(p, settings) 
    {
      // white background to start
      p.colorMode(p.HSL)
      p.background(0,0,100)
      
      // initialize arrays. Shapes will keep track of squiggly things on the screen. points is used during the drawing process
      this.shapes = []
      this.points = []
      
      // used to keep track of which shapes to change
      this.shapeCount = 0
      
      // just using stroke for this brush
      p.noFill()
    },
    
    mousePressed(p, { color0, color1, brushSize })
    {
      // if outside of the screen, don't bother
      if (p.mouseX > p.width || p.mouseY > p.height || p.mouseX < 0 || p.mouseY < 0) { return }
      
      // reset the points being drawn, add new shape
      this.points = []
      this.shapeCount++
    },
    
    mouseReleased(p, { color0, color1, brushSize })
    {
      // complete drawing the shape currently being drawn
      this.shapes[this.shapeCount-1].doneDrawing = true
    },

    mouseDragged(p, { color0, color1, brushSize }) 
    {
      // if outside the screen, don't bother
      if (p.mouseX > p.width || p.mouseY > p.height || p.mouseX < 0 || p.mouseY < 0) { return }
      
      // add this point to the points array
      this.points.push({
        x: p.mouseX,
        y: p.mouseY,
      })
      
      // update the shapes array with the current points and randomized specs
      this.shapes[this.shapeCount-1] = { 
        points: this.points,
        color0: color0,
        color1: color1,
        colorFreq: p.random() * 3 + 1,
        waveFreq: p.random() * 5 + 2.5,
        waveAmp: p.random() * 10 + 5,
        size: brushSize,
        doneDrawing: false
      }
    },
    
    draw(p, settings)
    {
      // clear with a white background
      let t = p.millis() * 0.001
      p.background(0,0,100)
      
      // loop through all the shapes
      for (let s = 0; s < this.shapes.length; s++)
      {
        // get the shape object and some specs
        let shape = this.shapes[s]
        let points = shape.points
        let c0 = p.color(shape.color0)
        let c1 = p.color(shape.color1)
        
        // switch to rgb for interpolation
        p.colorMode(p.RGB)
        
        if (shape.doneDrawing)
        {
          // if shape has been fully drawn, vary the color over time between the c0 and c1
          p.stroke(p.lerpColor(c0, c1, p.map(p.sin(shape.colorFreq*t), -1, 1, 0, 1)))
        }
        else
        {
          // if the shape is still being drawn, color is halfway between the two
          p.stroke(p.lerpColor(c0, c1, 0.5))
        }
        
        // back to hsl
        p.colorMode(p.HSL)
        p.strokeWeight(shape.size)
        
        // loop through all the points in the sahpe
        p.beginShape()
        for (let i = 0; i < points.length; i++)
        {
          // get the point and the coords
          let point = points[i]
          let x = point.x
          let y = point.y
          
          // if the shape has been done, add the wavyness using sin curves
          if (shape.doneDrawing)
          {
            x += shape.waveAmp*p.sin(i*0.5 + shape.waveFreq*t)
            y += shape.waveAmp*p.sin(i*0.5 + shape.waveFreq*t)
          }
          p.curveVertex(x, y)
        }
        p.endShape()
      }
    }
  }
];
