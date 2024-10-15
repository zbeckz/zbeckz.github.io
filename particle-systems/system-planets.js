/* globals Vue, systems, Vector2D */

(function() {
	
	let system = {
		hide: false,
		name: "Planets",
		description: "Randomly spawns stars and planets. Stars unaffected by gravity",
    spawnSpecs: {
      color: [100,100,50],
      size: 7.5,
      vx: 0,
      vy: 0
    },
    
		setup(p, {}) 
    {
      // drawing setup
      p.colorMode(p.HSL)
      p.background(0,0,0)
      p.ellipseMode(p.CENTER)
      p.strokeWeight(0)
      
      // physics
      this.gravConstant = 150
      
      // Create the stars
      let starCount = Math.round(p.random(2, 5))
      let starGap = p.width / (starCount+1)
      this.stars = []
      for (let i = 0; i < starCount; i++)
      {
        this.createStar
        (
          p, 
          starGap * (i+1) + p.random(-0.2*starGap, 0.2*starGap), 
          p.random(20, p.height-20)
        )
      }
      
      // Create the planets (particles)
      let planetCount = Math.round(p.random(10,20)) * 2
      let planetGapHorz = p.width / (planetCount/2)
      let planetGapVert = p.height / 3
			this.particles = []
			for (let i = 0; i < planetCount/2; i++) 
      {
        for (let j = 0; j < 2; j++)
        {
           this.createParticle
           (
             p, 
             planetGapHorz * (i+1) + p.random(-0.5*planetGapHorz, 0.5*planetGapHorz), 
             (j+1)*planetGapVert + p.random(-0.5*planetGapVert, 0.5*planetGapVert)
           )
        }
			}    
		},
    
    draw(p, { time, deltaTime, drawDebugInfo }) 
    {
      let opacity = 0.05
      if (drawDebugInfo) {opacity = 1}
      p.background(0,0,0,opacity)
			this.drawStars(p)
      this.drawPlanets(p)
      this.drawDebug(p, drawDebugInfo)
		},
    
    update(p, {deltaTime, time}) 
    {
      for (let i = 0; i < this.particles.length; i++)
      {
        let pt = this.particles[i]
        
        // Calculate gravity
        pt.gravityForce.mult(0)
        for (let j = 0; j < this.stars.length; j++)
        {
          let star = this.stars[j]
          let dist = (star.x - pt.x)**2 + (star.y-pt.y)**2
          
          // if collided with star, remove particle
          if (Math.sqrt(dist) < (star.size*0.9/2 + pt.size/2))
          {
            this.particles.splice(i, 1)
            continue;
          }
          
          let magnitude = this.gravConstant * star.size *pt.size / dist
          let grav = new Vector2D(star.x-pt.x, star.y-pt.y)
          grav.normalize()
          grav.mult(magnitude)
          pt.gravityForce.add(grav)
        }
				
				// Add it to the particle
				pt.force.setToAdd(pt.gravityForce)
        
        // Apply the force to the velocity
				pt.velocity.addMultiple(pt.force, deltaTime)

				// Apply the velocity to the position
				pt.addMultiple(pt.velocity, deltaTime)
      }
		},
    
    mousePressed(p, x, y)
    {
      this.createParticle(p, x, y, this.spawnSpecs.vx, -1*this.spawnSpecs.vy, this.spawnSpecs.size, this.spawnSpecs.color)
    },
    
    createStar(p, x, y)
    {
      this.stars.push
      ({
        size: p.random(25,50),
        x: x,
        y: y
      })
    },

		// Helper function
		createParticle(p, x, y, vx=p.random(-20,20), vy=p.random(-20,20), size=p.random(5,10), color=[p.random(0, 360), 100, 50]) 
    {
			// physics
			let pt = new Vector2D(x, y)
      pt.velocity = new Vector2D(vx, vy)
			pt.force = new Vector2D(0,0)
			pt.gravityForce  = new Vector2D(0, 0)
			
      // properties
      pt.color = color
      pt.size = size
      
      // add to array
			this.particles.push(pt)
		},
    
    drawDebug(p, shouldDraw)
    {
      if (!shouldDraw) { return }
      
      let t = p.millis()*.001
      for (let i = 0; i < this.particles.length; i++)
      {
        let pt = this.particles[i]
        
        // force vector
        pt.drawArrow(p, { 
					multiplyLength: .2,
					v: pt.force,
					color: [200,100, 50],
					startOffset: 20,
					normalOffset: 10*Math.sin(t)
				})
        
        // velocity vector
				pt.drawArrow(p, { 
					multiplyLength: .2,
					v: pt.velocity,
					color: [300,100, 50],
					startOffset: 20,
					normalOffset: 5,
				})
      }
    },
    
    drawStars(p)
    {
      p.fill(0,0,100,1)
      for (let i = 0; i < this.stars.length; i++)
      {
        let star = this.stars[i]
        p.circle(star.x, star.y, star.size)
        
        // glow effect
        for (let j = 1.5; j > 1; j-=0.05)
        {
          p.fill(0,0,50 + (1.5-j)*100, 0.2 + (1.5-j)*1.6)
          p.circle(star.x, star.y, star.size*j)
        }
      }
    },
    
    drawPlanets(p) 
    {
      for (let i = 0; i < this.particles.length; i++)
      {
        let planet = this.particles[i]        
        p.fill(planet.color)
        p.circle(planet.x, planet.y, planet.size)
      }
    }
	}

	Vue.component(`controls-${system.name}`, {
		template: `<div>
			<table>
				<tr>
					<td>Size</td>
					<td>
            <input 
						  type="range" min="5" max="10" step="0.5"  
						  v-model.number="system.spawnSpecs.size">
            </input>
					</td>
				</tr>

        <tr>
					<td>X-Velocity</td>
					<td>
            <input 
						  type="range" min="-40" max="40" step="1"  
						  v-model.number="system.spawnSpecs.vx">
            </input>
					</td>
				</tr>
        
        <tr>
					<td>Y-Velocity</td>
					<td>
            <input 
						  type="range" min="-40" max="40" step="1"  
						  v-model.number="system.spawnSpecs.vy">
            </input>
					</td>
				</tr>
        
        <tr>
          <td>Color:</td>
          <td>
            <color-picker v-model="system.spawnSpecs.color">
          </td>
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
