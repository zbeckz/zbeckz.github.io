/* globals Vue, systems, Vector2D */

(function() {
	
	let system = {
		hide: false,
		name: "Bubbles",
		description: "Color bubbles randomly spawn. They can break when clicked, and join together on impact",
    attractiveForce: 0.0,
    idCount: 0,
		setup(p, {}) 
    {
      // drawing setup
      p.colorMode(p.RGB)
      p.background(255,255,255)
      p.ellipseMode(p.CENTER)
      p.strokeWeight(0)
      
      // physics
      this.attractiveForce = 0.0
      
      // create particles
      this.particles = []
      
      for (let i = 0; i < 30; i++)
      {
        this.createParticle(p, p.random(0, p.width), p.random(0, p.height), i)
      }
		},
    
    mousePressed(p, x, y)
    {
      let pt = findClosestParticle([this], x, y)
      if (pt == null) {return}
      
      // break the particle into 2 smaller ones
      // choose a percentage between 50-80 for the biggest of the 2 (pt2)
      let pct2 = p.random(0.5, 0.8)
      let pct1 = 1-pct2
      
      // calculate area for the 2 new particles
      let ptArea = (pt.size/2) ** 2
      let area2 = pct2 * ptArea
      let area1 = pct1 * ptArea
      
      // calculate size (diameter) for the 2 new particles
      let size2 = Math.sqrt(area2) * 2
      let size1 = Math.sqrt(area1) * 2
      
      // calculate color for the 2 new particles
      let c = pt.color
      let c1 = [c[0]*p.random(), c[1]*p.random(), c[2]*p.random()]
      let c2 = [(c[0]-c1[0]*pct1)/pct2, (c[1]-c1[1]*pct1)/pct2, (c[2]-c1[2]*pct1)/pct2]
      
      // calculate starting position for the 2 new particles
      let offsetAngle = p.random(0, p.PI*2)
      let offsetSize = size1/2
      let offsetX = offsetSize * p.cos(offsetAngle)
      let offsetY = offsetSize * p.sin(offsetAngle)
      let x2 = pt.x + offsetX
      let y2 = pt.y + offsetY
      let x1 = pt.x - offsetX
      let y1 = pt.y - offsetY
      
      // calculate starting velocity for the 2 new particles
      let v2 = new Vector2D(offsetX, offsetY)
      let v1 = new Vector2D(-1*offsetX, -1*offsetY)
      v2.normalize()
      v1.normalize()
      v2.mult(20)
      v1.mult(20)
      
      // create the two new particles
      let pt2 = new Vector2D(x2, y2)
      pt2.size = size2
      pt2.color = c2
      pt2.id = pt.id
      pt2.velocity = v2
			pt2.force = new Vector2D(0,0)
      pt2.perlinForce = new Vector2D(0,0)
      pt2.attractionForce = new Vector2D(0,0)
      
      let pt1 = new Vector2D(x1, y1)
      pt1.size = size1
      pt1.color = c1
      pt1.id = this.idCount++
      pt1.velocity = v1
			pt1.force = new Vector2D(0,0)
      pt1.perlinForce = new Vector2D(0,0)
      pt1.attractionForce = new Vector2D(0,0)
      
      // remove old particle, add new ones
      this.particles.splice(this.particles.indexOf(pt), 1)
      this.particles.push(pt1)
      this.particles.push(pt2)
    },
    
    draw(p, { time, deltaTime, drawDebugInfo }) 
    {
      p.background(255,255,255)
      this.drawBubbles(p)
      this.drawDebug(p, drawDebugInfo, time)
		},
    
    update(p, {deltaTime, time}) 
    {
      let merges = []
      
      for (let i = 0; i < this.particles.length; i++)
      {
        let pt = this.particles[i]
        
        // check if any particles need to merge with this one
        for (let j = i+1; j < this.particles.length; j++)
        {
          let pt2 = this.particles[j]
          let dist = Math.sqrt((pt.x-pt2.x)**2 + (pt.y-pt2.y)**2)
          let criteria1 = pt.size/2 - pt2.size/2 + pt.size*0.2
          let criteria2 = pt2.size/2 - pt.size/2 + pt2.size*0.2
          if ((dist < criteria1) || (dist < criteria2))
          {
            if (!merges.includes(i) && !merges.includes(j)) 
            {
              merges.push(i)
              merges.push(j)
            }
          }
        }
        
        // helper functions to apply forces and check if a bubble is off screen
        this.applyForces(p, pt, time, deltaTime)
        this.offScreen(p, pt)
      }
      
      this.doMerges(p, merges)
		},
    
    drawDebug(p, shouldDraw, time)
    {
      if (!shouldDraw) {return}
      
      // draw perlin noise field
      for (let i = 5; i < p.width; i += 25)
      {
        for (let j = 5; j < p.height; j += 25)
        {
          let fx = p.noise(i*0.02, time*0.5)-0.5
          let fy = p.noise(j*0.02, time*0.5)-0.5
          let pt = new Vector2D(i, j)
          pt.drawArrow(p, {
            multiplyLength: 1,
            v: new Vector2D(fx, fy),
            color: [0, 0, 0],
            startOffset: 0,
          });
          
        }
      }
    },
    
    doMerges(p, merges)
    {
      for (let i = 0; i < merges.length; i+=2)
      {
        // get the marticles that will merge
        let pt1 = this.particles[merges[i]]
        let pt2 = this.particles[merges[i+1]]
        
        // math to calculate new radius
        let area1 = (pt1.size/2)**2
        let area2 = (pt2.size/2)**2
        let newSize = ((area1 + area2) ** 0.5) * 2 // such that new area is pt1 area + pt2 area
        
        // math to calculate the new color
        let ratio = area2/(area2+area1)
        let c1 = pt1.color
        let c2 = pt2.color
        let newR = (c1[0]*area1 + c2[0]*area2)/(area1+area2)
        let newG = (c1[1]*area1 + c2[1]*area2)/(area1+area2)
        let newB = (c1[2]*area1 + c2[2]*area2)/(area1+area2)
        
        // velocity of the new partcile
        let newVelocity = new Vector2D()
        newVelocity.setToLerp(pt1.velocity, pt2.velocity, ratio)

        // new particle
        let pt
        if (ratio > 0.5) // area 2 bigger
        {
          pt = new Vector2D(pt2.x, pt2.y)
          pt.id = pt2.id
        }
        else
        {
          pt = new Vector2D(pt1.x, pt1.y)
          pt.id = pt1.id
        }
        
        // new particle physics
        pt.velocity = newVelocity
        pt.force = new Vector2D(0,0)
        pt.perlinForce = new Vector2D(0,0)
        pt.attractionForce = new Vector2D(0,0)

        // properties
        pt.color = [newR, newG, newB]
        pt.size = newSize

        // add to array
        this.particles.push(pt)
      }
      
      // delete all previous bubbles. have to sort by biggest index in particles so splicing works
      merges.sort(function compareNumbers(a, b) {
                    return b - a;
                  })

      for (let i = 0; i < merges.length; i++)
      {
        this.particles.splice(merges[i], 1)
      }
    },
    
    offScreen(p, pt)
    {
      // if off screen, reappear on the other side
      if (pt.x - pt.size/2 > p.width) // off screen right
      {
        pt.x = 0 - pt.size/2
      }
      else if (pt.x + pt.size/2 < 0) // off screen left
      {
        pt.x = p.width + pt.size/2
      }
      else if (pt.y - pt.size/2 > p.height) // off screen down
      {
        pt.y = 0 - pt.size/2
      }
      else if (pt.y + pt.size/2 < 0) // off screen up
      {
        pt.y = p.height + pt.size/2
      }
    },
    
    applyForces(p, pt, time, deltaTime)
    {
      // Calculate perlin Force
      let fx = p.map(p.noise(pt.x*0.02, time*0.5), 0, 1, -80, 80)
      let fy = p.map(p.noise(pt.y*0.02, time*0.5), 0, 1, -80, 80)
      pt.perlinForce.setTo(fx, fy)
      
      // Calculate attractive force
      pt.attractionForce.setTo(0, 0)
      for (let i = 0; i < this.particles.length; i++)
      {
        let pt2 = this.particles[i]
        if (pt.id == pt2.id) { continue }
        
        let vector = Vector2D.sub(pt2, pt)
        vector.normalize()
        vector.mult(this.attractiveForce * pt2.size*0.05)
        pt.attractionForce.add(vector)
      }

      // Add it to the particle
      pt.force.setToAdd(pt.perlinForce, pt.attractionForce)

      // Apply the force to the velocity
      pt.velocity.addMultiple(pt.force, deltaTime)

      // Apply the velocity to the position
      pt.addMultiple(pt.velocity, deltaTime)

      // Constrain velocity
      pt.velocity.constrain(0, 40)
    },
    
    drawBubbles(p)
    {
      let t = p.millis() * 0.001
      for (let i = 0; i < this.particles.length; i++)
      {
        let bubble = this.particles[i]
        p.fill(...bubble.color, 200)
        
        // loop using polar coordinates and perlin noise to create bubbly looking outline
        p.beginShape()
        let r
        for (let theta = p.PI/48; theta < p.PI*2; theta+=p.PI/48)
        {
          r = bubble.size*0.5 + bubble.size*0.25*p.noise(bubble.id+t+p.sin(theta),bubble.id+3*theta+1, t)
          p.vertex(bubble.x + r*p.cos(theta),bubble.y + r*p.sin(theta))
        }
        p.endShape(p.CLOSE)
      }
    },
    
    createParticle(p, x, y, i)
    {
      // physics
			let pt = new Vector2D(x, y)
      pt.velocity = new Vector2D(0, 0)
			pt.force = new Vector2D(0,0)
      pt.perlinForce = new Vector2D(0,0)
      pt.attractionForce = new Vector2D(0,0)
			
      // properties
      pt.color = [p.random(0, 255), p.random(0, 255), p.random(0, 255)]
      pt.size = p.random(20, 50)
      pt.id = i
      this.idCount++
      
      // add to array
			this.particles.push(pt)
    }
	}

	Vue.component(`controls-${system.name}`, {
		template: `<div>
      <table>
          <tr>
            <td>Attraction Force</td>
            <td>
              <input 
                type="range" min="-10" max="10" step="0.1"  
                v-model.number="system.attractiveForce">
              </input>
            </td>
          </tr>
          <tr>
            <td> Value: </td>
            <td> <label>{{system.attractiveForce}}</label> </td>
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
