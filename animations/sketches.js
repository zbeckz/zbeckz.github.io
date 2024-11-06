const WIDTH = 300;
const HEIGHT = 300;
const DEFAULT_FRAME_RATE = 30;
const DEFAULT_LOOP_LENGTH_IN_FRAMES = 100;

const sketches = [
  {
    name: "Self Portrait",
    show: true,
    pause: false,
    description: "Spooky emojis to represent Halloween, the most important holiday to me and my family",
    emojis: ["🦇", "🎃", "👻", "💀"],
    count: 0,
    setup(p) 
    {
      // black background
      p.background(19, 83, 0)
      
      // text formatting
      p.textSize(60);
      p.textAlign(p.CENTER, p.CENTER);
    },

    draw(p) 
    {
      if (this.pause) return;
      
      // transparent to cause fading
      p.background(19, 83, 0, 0.05)
      
      // count to ensure an emoji is drawn every 15 frames, or 2 per sec
      if (this.count == 0)
      {
        let emoji = p.random(this.emojis)
        p.text(emoji, p.random(0, WIDTH), p.random(0, HEIGHT))
      }

      this.count++

      if (this.count == 15) this.count = 0
    }
  },
  
  {
    name: "MOD (not pizza)",
    show: true,
    pause: false,
    description: "Using MOD (the mathematical operation modulo), and randomness, to determine colors throughout the screen",
    layer: [0, 37, 75, 113],
    divisor: [0, 0, 0, 0],
    setup(p) 
    {
      // white background
      p.background(0, 0, 100)
      
      // no borders
      p.strokeWeight(0)
      
      // random divisor for color
      this.divisor[0] = parseInt(p.random(1, WIDTH/2))
      this.divisor[1] = parseInt(p.random(1, WIDTH/2))
      this.divisor[2] = parseInt(p.random(1, WIDTH/2))
      this.divisor[3] = parseInt(p.random(1, WIDTH/2))
    },

    draw(p) 
    {
      if (this.pause) return;
      
      for (let pass = 0; pass < 4; pass++)
      {
        // range for the square perimeters of pixels we will draw this frame
        var min = WIDTH/2 - this.layer[pass]
        var max = HEIGHT/2 + this.layer[pass]
        var div = this.divisor[pass]

        // draw left and right side
        for (let y = min; y <= max; y++)
        {
          let x = min
          let h = p.map(x % div, 0, x, 0, 255)
          let l = p.map(y % div, 0, y, 35, 65)
          p.fill(h, 100, l)
          p.rect(x, y, 1, 1)

          x = max
          p.fill(h, 100, l)
          p.rect(x, y, 1, 1)
        }

        // draw top and bottom side
        for (let x = min; x <= max; x++)
        {
          let y = min
          let h = p.map(y % div, 0, y, 0, 255)
          let l = p.map(x % div, 0, x, 35, 65)
          p.fill(h, 100, l)
          p.rect(x, y, 1, 1)

          y = max
          p.fill(h, 100, l)
          p.rect(x, y, 1, 1)
        }
        
        // increment layer, randomize divisor for new colors
        this.layer[pass]++;
        if (this.layer[pass] > WIDTH/2)
        {
          this.divisor[pass] = parseInt(p.random(1, WIDTH/2))
          this.layer[pass] = 0;
        }
      }
    }
  },
  
  {
    name: "Solar System",
    show: true,
    pause: false,
    description: "Planets orbiting a sun with twinkling stars",
    planets: [],
    stars: [],
    setup(p) 
    {
      // black background
      p.background(0, 0, 0)
      
      // no borders
      p.strokeWeight(0)
      
      // draw the circles with the center at the given x and y
      p.ellipseMode(p.CENTER)
      
      // stars initialization
      let starCount = 0
      for (let i = 0; i < 7; i++)
      {
        for (let j = 0; j < 7; j++)
        {
          this.stars[starCount] = {
            x: 50 * i + (p.random() - 0.5)*50,
            y: 50 * j + (p.random() - 0.5)*50,
            diameter: p.random() + 1.5,
            color: {
              h: 0,
              s: 100,
              l: 100
            }
          }
          starCount++
        }
      }
      
      // planets intialization
      for (let i = 0; i < 8; i++)
      {
        this.planets[i] = {
          diameter: p.random(5, 10),
          orbitRadius: p.random(50, 140),
          color: {
            h: p.random(0, 255),
            s: 100,
            l: p.random(35, 65)
          },
          theta: p.random(0, 2 * p.PI),
          speed: p.random(4, 10),
          direction: 1
        }
        
        if (p.random() < 0.5) { this.planets[i].direction = -1}
      }
    },

    draw(p)
    {
      if (this.pause) return;
      
      var t = p.millis() * 0.0005
      
      // black background
      p.background(0, 0, 0, 0.2)
      
      // stars
      for (let i = 0; i < this.stars.length; i++)
      {
        let star = this.stars[i]
        let diameter = star.diameter + 2*(p.noise(t*star.x, t*star.y) - 0.5)
        let l = p.map(p.noise(t*star.x, t*star.y), 0, 1, 75, 100)
        p.fill(star.color.h, star.color.s, l)
        p.circle(star.x, star.y, diameter*1)
      }
      
      // sun
      p.fill(36, 100, 57)
      p.circle(WIDTH/2, HEIGHT/2, 30)
      
      // planets
      for (let i = 0; i < this.planets.length; i++)
      {
        let planet = this.planets[i]
        let x = WIDTH/2 + planet.orbitRadius * p.cos(planet.theta)
        let y = WIDTH/2 + planet.orbitRadius * p.sin(planet.theta)
        p.fill(planet.color.h, planet.color.s, planet.color.l)
        p.circle(x, y, planet.diameter)
        planet.theta += planet.speed * 0.005 * planet.direction
      }
    }
  },
  
  {
    name: "Neon (Loop)",
    show: true,
    pause: false,
    description: "Using sequential colors to draw neon lines (saves as a loop)",
    loopLength: 30,
    t: 0,
    setup(p) 
    {
      // black background
      p.background(19, 83, 0)
      
      // no borders
      p.strokeWeight(0)
      
      // draw the circles with the center at the given x and y
      p.ellipseMode(p.CENTER)
    },

    draw(p)
    {
      if (this.pause) return;
      
      // black background
      p.background(19, 83, 0)
      
      // outer loop determines color (and size), inner loop draws across the screen
      for (let color = 0; color < 5; color++)
      {
        for (let x = 0; x <= 300; x++)
        {
          let y = 150 + 50*p.sin(2*p.PI+p.map(x, 0, 300, 0, p.PI * 4))
          p.fill(p.map((x+10*this.t)%300, 0, 300, 0, 255), 100, 50+color*10)
          p.circle(x, y, 20-color*4)
        }
      }
      
      // increment t
      this.t++
      if (this.t >= 30)
      {
        this.t = 0
      }
    }
  },
  
  {
    name: "Billiard Balls",
    show: true,
    pause: false,
    description: "Billiard balls are given a random starting direction and bounce around",
    balls: [],
    setup(p) 
    {
      p.ellipseMode(p.CENTER)
      p.textAlign(p.CENTER, p.CENTER)
      
      // pool table background
      p.background(110, 96, 21)
      
      // set up pool balls
      let ballCount = 0;
      for (let i = 0; i < 3; i++)
      {
        for (let j = 0; j < 3; j++)
        {
          this.balls[ballCount] = {
            i: ballCount,
            x: 75 + 75*i,
            y: 75 + 75*j,
            h: p.map(ballCount, 0, 9, 0, 255),
            l: 50,
            vx: p.random(1,3),
            vy: p.random(1,3),
            
            move: function() {
              this.x += this.vx;
              this.y += this.vy;
            },
            
            display: function() {
              // ball
              p.fill(this.h, 100, this.l)
              p.strokeWeight(1)
              p.circle(this.x, this.y, 20)

              // number
              p.fill(0, 0, 100)
              p.strokeWeight(2)
              p.stroke(0,0,0)
              p.text(this.i + 1, this.x, this.y)
            },
            
            collideWall: function() {
              if (this.x + 10 >= WIDTH || this.x - 10 <= 0)
              {
                this.vx *= -1
              }
              if (this.y + 10 >= HEIGHT || this.y - 10 <= 0)
              {
                this.vy *= -1
              }
            },
            
            collideBall: function(otherX, otherY) {
              let returnVal = false
              let dist = p.sqrt((this.x - otherX)*(this.x-otherX) + (this.y-otherY)*(this.y-otherY))
              if (dist < 20)
              {
                this.vx *= -1
                this.vy *= -1
                returnVal = true
              }
              return returnVal
            }
          }
          
          if (p.random() < 0.5) { this.balls[ballCount].vx = this.balls[ballCount].vx * -1}
          if (p.random() < 0.5) { this.balls[ballCount].vy = this.balls[ballCount].vy * -1}
          
          ballCount++
        }
      }
      
      this.balls[2].l = 0
    },

    draw(p)
    {
      if (this.pause) return;
      
      // draw the background
      p.background(110, 96, 21)
      
      // draw the balls
      for (let i = 0; i < this.balls.length; i++)
      {
        let ball = this.balls[i]
        ball.move()
        ball.display()
        ball.collideWall()
        for (let j = i; j < this.balls.length; j++)
        {
          if (i != j)
          {
            let otherBall = this.balls[j]
            if (ball.collideBall(otherBall.x, otherBall.y))
            {
              otherBall.vx *= -1
              otherBall.vy *= -1
            }
          }
        }
      }
    }
  },
  
  {
    name: "Spiral",
    show: true,
    pause: false,
    description: "Color and thickness changing spiral",
    h: 0,
    hDir: 1,
    setup(p) 
    {
      // black background
      p.background(19, 83, 0)
      
      // no borders
      p.strokeWeight(0)
      
      // draw the circles with the center at the given x and y
      p.ellipseMode(p.CENTER)
      
    },

    draw(p)
    {
      if (this.pause) return;
      
      p.background(19, 83, 0)
      let r = 0
      let startingTheta = (p.millis()*0.005) % (p.PI*2)
      p.fill(this.h, 100, 50)
      for (let theta = startingTheta; theta < p.PI * 14; theta+=p.PI/120)
      {
        p.circle(150+r*p.cos(theta), 150+r*p.sin(theta), p.map(this.h, 0, 255, 5, 15))
        r += 0.15
      }
      
      this.h += this.hDir*2
      if (this.h > 255)
      {
        this.h = 254
        this.hDir = -1
      }
      else if (this.h < 0)
      {
        this.h = 1
        this.hDir = 1
      }
    }
  }
];
