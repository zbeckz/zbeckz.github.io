/* globals Vue, systems, Vector2D */

(function() {
	
	let system = {
		hide: false,
		name: "Snakes",
		description: "Like the game snake. Trails grow when get food. Attracted to food",
    foodAffinity: 10,
		setup(p, {}) 
    {
      // drawing setup
      p.colorMode(p.HSL)
      p.ellipseMode(p.CENTER)
      p.stroke(0,0,0)
      
      // food setup
      this.food = []
      this.timeSinceSpawn = 4
      
      // snake (particle) setup
      this.particles = []
      for (let i = 0; i < 5; i++)
      {
        this.createParticle(p, p.map(i, 0, 4, 0, 255))
      }
    },
    
    draw(p, { time, deltaTime, drawDebugInfo }) 
    {
      p.background(0,0,100)
      this.drawFood(p)
      this.drawSnakes(p)
      this.drawDebug(p, drawDebugInfo)
		},
    
    update(p, {deltaTime, time}) 
    {
      // spawn food if needed
      this.timeSinceSpawn += deltaTime
      if (this.timeSinceSpawn > 4)
      {
        this.timeSinceSpawn = 0
        this.food.push(new Vector2D(p.random(0, p.width/2), p.random(0, p.height/2))) // quad 1
        this.food.push(new Vector2D(p.random(p.width/2, p.width), p.random(0, p.height/2))) // quad 2
        this.food.push(new Vector2D(p.random(p.width/2, p.width), p.random(p.height/2, p.height))) // quad 3
        this.food.push(new Vector2D(p.random(0, p.width/2), p.random(p.height/2, p.height))) // quad 4
      }
      
      // move snakes
      for (let i = 0; i < this.particles.length; i++)
      {
        let pt = this.particles[i]
        
        // if there's food, find the one closest to us
        let closestFood
        let closestIndex = null
        let closestDistance = Infinity
        pt.foodForce.mult(0)
        if (this.food.length != 0)
        {
          for (let j = 0; j < this.food.length; j++)
          {
            let food = this.food[j]
            let dist = (food.x-pt.x)**2 + (food.y-pt.y)**2
            if (dist < closestDistance)
            {
              closestIndex = j
              closestDistance = dist
            }
          }
          
          // calculate food force
          closestFood = this.food[closestIndex]
          pt.foodForce.setTo(closestFood.x-pt.x, closestFood.y-pt.y)
          pt.foodForce.normalize()
          let subtract = pt.trailLength*0.5
          if (subtract > 50) {subtract = 50}
          pt.foodForce.mult(20*this.foodAffinity - subtract)
        }
        
				// Add it to the particle
				pt.force.setToAdd(pt.foodForce)
        
        // Apply the force to the velocity
				pt.velocity.addMultiple(pt.force, deltaTime)
        
        // Set velocity speed
        pt.velocity.normalize()
        pt.velocity.mult(50)
        
        // save previous position to trail
        pt.trail.splice(0, 1)
        pt.trail.push({x: pt.x, y: pt.y})
        console.log(pt.trail)

				// Apply the velocity to the position
				pt.addMultiple(pt.velocity, deltaTime)
        
        // if collided with food, eat it!
        if (closestDistance < 225)
        {
          let end = pt.trail[0]
          pt.trailLength+=20
          for (let c = 0; c < 20; c++)
          {
            pt.trail.unshift({x: end.x, y: end.y})
          }
          this.food.splice(closestIndex, 1)
        }
        
      }
		},
    
    mousePressed(p, x, y)
    {
     
    },
    
		createParticle(p, hue) 
    {
      let x = p.random(0, p.width)
      let y = p.random(0, p.height)
			let pt = new Vector2D(x, y)
      pt.hue = hue
      pt.trailLength = 5
      pt.trail = [{x:x, y:y},{x:x, y:y},{x:x, y:y},{x:x, y:y},{x:x, y:y}]
      pt.velocity = new Vector2D(0, 0)
			pt.force = new Vector2D(0,0)
			pt.foodForce = new Vector2D(0, 0)
      
      this.particles.push(pt)
		},
    
    drawFood(p)
    {
      p.strokeWeight(1.5)
      for (let i = 0; i < this.food.length; i++)
      {
        let food = this.food[i]  
        p.fill(0, 100, 50)
        p.circle(food.x, food.y, 20)
      }
    },
    
    drawSnakes(p)
    {
      p.strokeWeight(0)
      for (let i = 0; i < this.particles.length; i++)
      {
        let pt = this.particles[i]  
        p.fill(pt.hue, 100, 50)
        p.circle(pt.x, pt.y, 10)
        
        // trail
        for (let j = 0; j < pt.trailLength; j++)
        {
          let t = pt.trail[j]
          p.circle(t.x, t.y, 7)
        }
      }
    },
    
    drawDebug(p, shouldDraw)
    {
      if (!shouldDraw) { return }
      
      for (let i = 0; i < this.particles.length; i++)
      {
        let pt = this.particles[i]
        
        // foodForce vector
        pt.drawArrow(p, { 
					multiplyLength: .2,
					v: pt.foodForce,
					color: [pt.hue,100, 50],
					startOffset: 20,
					normalOffset: 0
				})
      }
    }
    
	}

	Vue.component(`controls-${system.name}`, {
		template: `<div>
			<table>
				<tr>
					<td>Food Affinity</td>
					<td>
            <input 
						  type="range" min="5" max="20" step="0.5"  
						  v-model.number="system.foodAffinity">
            </input>
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
