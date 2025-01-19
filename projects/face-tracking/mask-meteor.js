

(function () 
{  
  let mask = 
  {
    //=========================================================================================

    hide: false,
    name: "meteor", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "fiery avatar that grows when it catches meteors",
    
    meteorFreq: 2,
    randomness: 50,
    size: 1,
    meteorSpeed: 5,

    //=========================================================================================

    setup({ p }) 
    {
      p.rectMode(p.CENTER)
      p.ellipseMode(p.CENTER)
      
      // meteors initialization
      this.meteors = []
      this.lastSpawn = p.millis() * 0.001
      
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

    drawBackground({ p }) 
    {
      // night background
      p.background(0,0,0)
          
      // draw stars
      p.strokeWeight(0)
      var t = p.millis() * 0.001
      var t2 = t * 0.01
      for (let i = 0; i < this.stars.length; i++)
      {
        let star = this.stars[i]
        let diameter = star.diameter + 2*(p.noise(t2*star.x, t2*star.y) - 0.5)
        let l = p.map(p.noise(t2*star.x, t2*star.y), 0, 1, 75, 100)
        p.fill(0, 100, l)
        p.circle(star.x, star.y, diameter*1)
      }
      
      // potentially spawn new meteor
      if (t - this.lastSpawn > (6 - this.meteorFreq))
      {
        this.lastSpawn = t
        this.spawnMeteor(p)
      }
    },

    drawHand({ p, hand }) 
    {
      p.strokeWeight(this.size)
      p.stroke(0, 100, 50)
      // draw each landmark
      for (let i = 0; i < hand.landmarks.length; i++)
      {        
        let l = hand.landmarks[i]
        
        // draw line between other landmarks
        for (let j = -1; j < 1; j++)
        {
          if (i + j < 0 || i + j >= hand.landmarks.length)
          {
            continue
          }
          let l2 = hand.landmarks[i+j]
          p.line(l.x, l.y, l2.x, l2.y)
        }
      }
    },

    drawFace({ p, face }) 
    {
      // draw each landmark
      p.stroke(23, 95, 52)
      p.strokeWeight(1)
      for (let i = 0; i < face.landmarks.length; i++)
      {
        let l = face.landmarks[i]
        this.drawLandmark(p, l.x, l.y, 5)
        
        // if mouth landmark, check if caught meteor
        if (CONTOURS.mouth[4].includes(i))
        {
          for (let j = 0; j < this.meteors.length; j++)
          {
            let m = this.meteors[j]
            let dist = (m.x - l.x)**2 + (m.y - l.y)**2
            if (dist < 25)
            {
              this.despawnMeteor(j)
              this.size+=2
            }
          }
        }
      }
      
      // draw meteors
      this.drawMeteors(p)
    },
    
    drawLandmark(p, x, y, size)
    {
      p.fill(0, 100, 50)
      p.circle(x, y, size)
    },
    
    drawMeteors(p)
    {
      p.fill(0, 70, 30)
      p.stroke(0, 0, 100)
      p.strokeWeight(0.5)
      for (let i = 0; i < this.meteors.length; i++)
      {
        let m = this.meteors[i]
        let mag = p.sqrt(m.vx**2 + m.vy**2)
        m.x += (m.vx / (mag / this.meteorSpeed))
        m.y += (m.vy / (mag / this.meteorSpeed))
        m.vx += p.random(-1 * this.randomness, this.randomness)
        m.vy += p.random(-1 * this.randomness, this.randomness)
        
        // if off of screen, despawn
        if (m.x > p.width + 45 || m.x < -45 || m.y < -45 || m.y > p.height + 45)
        {
          this.despawnMeteor(i)
        }
        
        p.circle(m.x, m.y, m.size)
      }
    },
    
    spawnMeteor(p)
    {
      let startingLoc = p.random()
      let x
      let y
      let vx
      let vy
      let mag
      if (startingLoc < 0.25) // left of screen
      {
        x = p.random(-40, -20)
        y = p.random(0, p.height)
        vx = p.width - x
        vy = 0
      }
      else if (startingLoc < 0.5) // right of screen
      {
        x = p.random(p.width + 20, p.width + 40)
        y = p.random(0, p.height)
        vx = 0 - x
        vy = p.random(0, p.height) - y
      }
      else if (startingLoc < 0.75) // below screen
      {
        x = p.random(0, p.width)
        y = p.random(p.height + 20, p.height + 40)
        vx = p.random(0, p.width) - x
        vy = 0 - y
      }
      else // above screen
      {
        x = p.random(0, p.width)
        y = p.random(-20, -40)
        vx = p.random(0, p.width) - x
        vy = p.height - y
      }
      this.meteors.push({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        size: p.random(5, 10)
      })
    },
    
    despawnMeteor(i)
    {
      this.meteors.splice(i, 1)
    }
  };

  //============================================================

  Vue.component(`input-${mask.name}`, {
    // Custom inputs for this bot
    template: 
    `
      <div>
        <div> Meteor Frequency: <input type="range" v-model="mask.meteorFreq" min="1" max="5" step="0.5" /></div>
        <div> Meteor Speed: <input type="range" v-model="mask.meteorSpeed" min="1" max="10" step="0.5" /></div>
        <div> Random Movement: <input type="range" v-model="mask.randomness" min="1" max="100" step="0.5" /></div>
      </div>
    `,

    // Custom data for these controls
    data() 
    {
      return {};
    },
    props: { mask: { required: true, type: Object } }, // We need to have bot
  });

  masks.push(mask);
})();
