/* globals Vue, systems, Vector2D */

(function() {
	
	let system = {
		hide: false,
		name: "Fireworks",
		description: "Spawns fireworks which explode into smaller particles",
    spawnRate: 2,
    mountainGenerator: 0,
		setup(p, {}) 
    {
      // drawing setup
      p.colorMode(p.HSL)
      p.background(0,0,0)
      p.rectMode(p.CENTER)
      p.strokeWeight(0)
      p.textSize(10)
      p.textAlign(p.CENTER, p.CENTER)
      this.mountainGenerator = p.random(0, 100)
      
      // particle array and spawn system setup
      this.particles = []
      this.timeSinceSpawn = 0
      this.createParticle(p)
      
      // stars initialization
      this.stars = []
      let starCount = 0
      for (let i = 0; i < p.width/60; i++)
      {
        for (let j = 0; j < p.height/60; j++)
        {
          this.stars[starCount] = {
            x: 60 * i + (p.random() - 0.5)*60,
            y: 60 * j + (p.random() - 0.5)*60,
            diameter: p.random() + 1,
            color: [0, 100, 100]
          }
          starCount++
        }
      }
		},
    
    draw(p, { time, deltaTime, drawDebugInfo }) 
    {
      // night background
      p.background(0,0,0)
          
      // draw stars
      var t = p.millis() * 0.00001
      for (let i = 0; i < this.stars.length; i++)
      {
        let star = this.stars[i]
        let diameter = star.diameter + 2*(p.noise(t*star.x, t*star.y) - 0.5)
        let l = p.map(p.noise(t*star.x, t*star.y), 0, 1, 75, 100)
        p.fill(0, 100, l)
        p.circle(star.x, star.y, diameter*1)
      }
      
      // draw fireworks
      for (let i = 0; i < this.particles.length; i++)
      {
        let pt = this.particles[i]
        
        p.push()
        p.translate(pt.x, pt.y)
        p.rotate(pt.rotation)      
        p.fill(pt.color)
        p.rect(0, 0, pt.width, pt.height)
        p.pop()
      }
      
      // draw mountains
      p.fill(0, 0, 100)
      p.beginShape()
      p.vertex(0, p.height) // bottom left corner
      p.vertex(0, p.height * 0.1) // top left corner
      for (let i = 0; i <= p.width; i++)
      {
        p.vertex(i, p.height * 0.93 - p.height*0.2*p.noise(20*t+this.mountainGenerator + i*0.03))
      }
      p.vertex(p.width, p.height * 0.1) // top right corner
      p.vertex(p.width, p.height) // bottom right corner
      p.endShape(p.CLOSE)
      
      p.fill(0, 0, 50)
      p.beginShape()
      p.vertex(0, p.height) // bottom left corner
      p.vertex(0, p.height * 0.1) // top left corner
      for (let i = 0; i <= p.width; i++)
      {
        p.vertex(i, p.height * 0.95 - p.height*0.2*p.noise(20*t+this.mountainGenerator + i*0.03) + p.height*0.1*(p.noise(20*t+i*0.05)-0.5))
      }
      p.vertex(p.width, p.height * 0.1) // top right corner
      p.vertex(p.width, p.height) // bottom right corner
      p.endShape(p.CLOSE)
      
      p.fill(158, 96, 35)
      p.beginShape()
      p.vertex(0, p.height) // bottom left corner
      p.vertex(0, p.height * 0.1) // top left corner
      for (let i = 0; i <= p.width; i++)
      {
        p.vertex(i, p.height - p.height*0.1*p.noise(t*40+this.mountainGenerator + i*0.01))
      }
      p.vertex(p.width, p.height * 0.1) // top right corner
      p.vertex(p.width, p.height) // bottom right corner
      p.endShape(p.CLOSE)
      
      // debug info
      this.drawDebug(p, drawDebugInfo)      
		},
    
    update(p, {deltaTime, time}) 
    {
      this.maybeSpawn(p, deltaTime)
      
      let toExplode = []
      for (let i = 0; i < this.particles.length; i++)
      {
        let pt = this.particles[i]
        
        if (pt.initial)
        {
          // if reached peak, explode!
          if (pt.velocity.y > 0)
          {
            this.explode(p, pt)
            this.particles.splice(i, 1)
            continue
          }
          
          // Add force to the particle
          pt.gravityForce = new Vector2D(0, 100)
          pt.force.setToAdd(pt.gravityForce)

          // Apply the force to the velocity
          pt.velocity.addMultiple(pt.force, deltaTime)
        }
        else
        {
          pt.timeSinceExplode += deltaTime
          if (pt.timeSinceExplode > 1)
          {
            this.particles.splice(i, 1)
            continue
          }
        }
                
        // Apply the velocity to the position
        pt.addMultiple(pt.velocity, deltaTime)
      }
		},
    
    explode(p, pt)
    {
      // create particles moving away from exploded particle in a ring
      for (let theta = 0; theta < p.PI*2; theta+=p.PI/10)
      {
        let newPt = new Vector2D(pt.x, pt.y)
        newPt.color = pt.color
        newPt.width = pt.width
        newPt.height = pt.height*0.75
        newPt.initial = false
        newPt.velocity = new Vector2D(100*p.cos(theta), 100*p.sin(theta))
			  newPt.force = new Vector2D(0,0)
			  newPt.gravityForce  = new Vector2D(0, 0)
        newPt.rotation = theta + p.PI/2
        newPt.timeSinceExplode = 0
        this.particles.push(newPt)
      }
    },
    
    maybeSpawn(p, deltaTime)
    {
      this.timeSinceSpawn += deltaTime
      if (this.spawnRate <= 0 || this.timeSinceSpawn < this.spawnRate) { return }
      
      // if we reach here, time to spawn!
      this.timeSinceSpawn = 0
      this.createParticle(p)
    },
    
		// Helper function
		createParticle(p)
    {    
      // setup
      let height = 20
      let width = 5
      
      // physics
			let pt = new Vector2D(p.random(0+width/2, p.width-width/2), p.height + height/2)
      pt.velocity = new Vector2D(0, p.random(-270, -200))
			pt.force = new Vector2D(0,0)
			pt.gravityForce  = new Vector2D(0, 0)
      
      // properties
      pt.color = [p.random(0, 255), 100, 50]
      pt.height = height
      pt.width = width
      pt.initial = true
      pt.rotation = 0
      
      // add to array
			this.particles.push(pt)
		},
    
    drawDebug(p, shouldDraw)
    {
      p.fill(255,255,255)
      if (!shouldDraw) { return }
      
      for (let i = 0; i < this.particles.length; i++)
      {
        let pt = this.particles[i]
        
        if (pt.initial)
        {
          p.text(p.nf(pt.velocity.y * -1, 3, 1), pt.x, pt.y)
        }
        else
        {
          p.text(p.nf(1 - pt.timeSinceExplode, 1, 3), pt.x, pt.y)
        }
      }
    },
    
	}
	Vue.component(`controls-${system.name}`, {
		template: `<div>
			<table>
				<tr>
					New firework every
            <input 
						  type="number" min=0
						  v-model.number="system.spawnRate">
            </input>
					seconds
				</tr>
			</table>
		</div>`,
		data() {
			return {
				system
			}
		}
	})

	systems.push(system)
})();
