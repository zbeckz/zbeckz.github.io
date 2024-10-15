/* globals Vue, p5, masks, CONTOURS, Vector2D */
(function () 
{
  let mask = 
  {
    //=========================================================================================
    // TODO: custom data

    hide: false,
    name: "lightning", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "a mask with a stormy body and lightning shooting out of the hands",
    
    cloudSize: 20,
    lightningSize: 2,
    lightningColor: [255, 100, 50],
    backgroundClouds: [],

    //=========================================================================================

    setup({ p }) 
    {
      p.rectMode(p.CENTER)
      p.ellipseMode(p.CENTER)
      
      let cols = 3
      let rows = 2
      let xgap = (p.width*0.9)/(cols)
      let ygap = (p.height*0.9)/(rows)
      for (let i = 0; i < cols; i++)
      {
        for (let j = 0; j < rows; j++)
        {
          this.backgroundClouds.push({
            x: (i * xgap) + p.random(xgap*-0.25, xgap*0.25) + p.width*0.2,
            y: (j * ygap) + p.random(ygap*-0.25, ygap*0.25) + p.height*0.2,
            seed: p.random(1, 10000),
            speed: p.random(1, 4)
          })
        }
      }
    },

    drawBackground({ p }) 
    {
      p.background(197, 71, 73)
      
      // draw the background clouds
      p.fill(0, 0, 100)
      p.strokeWeight(0)
      let cloud
      for (let i = 0; i < this.backgroundClouds.length; i++)
      {
        // get cloud
        cloud = this.backgroundClouds[i]
        
        // draw cloud
        p.beginShape()
        for (let theta = 0; theta < p.TWO_PI; theta += p.PI/24)
        {
          let x = cloud.x + 50 * p.cos(theta) + 50*(p.noise(theta, cloud.seed)-0.5)
          let y = cloud.y + 50 * p.sin(theta) + 50*(p.noise(theta, cloud.seed)-0.5)
          p.vertex(x, y)
        }
        p.endShape(p.CLOSE)
        
        // update cloud
        cloud.x = cloud.x - cloud.speed
        if (cloud.x + 50 < 0)
        {
          cloud.x = p.width + 50 + p.random(1, 50)
          cloud.speed = p.random(1, 4)
          cloud.y = cloud.y + p.random(-20, 20)
          cloud.seed = p.random(1, 10000)
        }
      }
    },

    setupHand({ p, hand }) 
    {
      
    },

    setupFace({ p, face }) 
    {
      
    },

    drawHand({ p, hand }) 
    {
      // draw clouds for each landmark
      let landmark
      for (let i = 0; i < hand.landmarks.length; i++)
      {
        // get landmark
        landmark = hand.landmarks[i]
               
        // draw cloud - essentially a circle with perlin noise
        this.drawCloud(p, landmark.x, landmark.y, i * 1000)
        
        // if fingertip is in upper half draw lightning
        if (i !=0 && i % 4 == 0 && landmark.y < p.height/2)
        {
          this.drawLightning(p, landmark.x, landmark.y)
        }
      }
      
    },

    drawFace({ p, face }) 
    {
      // draw clouds for each landmark
      let landmark
      for (let i = 0; i < face.landmarks.length; i++)
      {
        // get landmark
        landmark = face.landmarks[i]
        p.randomSeed(landmark.x * landmark.y - landmark.x - landmark.y)
               
        // draw cloud - essentially a circle with perlin noise
        p.fill(255, 5, 50 + p.random(-5, 5))
        p.stroke(0, 0, 0)
        p.strokeWeight(1)
        p.circle(landmark.x, landmark.y, p.random(this.cloudSize * 0.5, this.cloudSize * 1.5))
      }

      // Draw the mouth lines
      p.noFill();
      CONTOURS.mouth.slice(2).forEach((mouthLine, mouthIndex) => {
        
        p.fill(255, 100, 50, 0.2);
          face.drawContour({
            p,
            contour: mouthLine.slice(0),
            close: true
          });
      });
      
      // Draw the eye on either side
      face.forEachSide((sideContours, sideIndex) => {
        // Draw the eye lines
        sideContours.eyeRings.forEach((eyeRing, eyeIndex) => {
          face.drawContour({
                p,
                contour: eyeRing,
                close: true,
              });
        });
      });
    },
    
    drawLightning(p, x, y)
    {
      p.randomSeed(x * y - x - y)
      p.noFill()
      p.stroke(this.lightningColor)
      p.strokeWeight(this.lightningSize)
      let currPoint = {
        x: x,
        y: y
      }
      let nextPoint = {
        x: x,
        y: y
      }
      let count = 0;
      while (true)
      {
        // update current point
        currPoint.x = nextPoint.x
        currPoint.y = nextPoint.y
        
        // if above screen now, stop
        if (currPoint.y < 0)
        {
          break
        }
        
        // calculate next point
        if (count % 2 == 0)
        {
          nextPoint.x = currPoint.x + p.random(0, 20)
        }
        else
        {
          nextPoint.x = currPoint.x - p.random(0, 20)
        }
        
        nextPoint.y = currPoint.y - p.random(0, 20)
        
        // draw line
        p.line(currPoint.x, currPoint.y, nextPoint.x, nextPoint.y)
        
        count++
      }
      
    },
    
    drawCloud(p, x, y, seed)
    {
      p.randomSeed(seed)
      let t = p.millis() * 0.001;
      if (p.random() < 0.5) {t = t*-1}
      p.fill(255, 5, 50 + p.random(-5, 5))
      p.stroke(0, 0, 0)
      p.strokeWeight(1)
      let r
      p.beginShape()
      for (let theta = 0; theta < p.TWO_PI; theta += p.PI/24)
      {
        r = p.map(p.noise(seed + t + p.sin(theta), seed + 3* theta + t, t), 0, 1, this.cloudSize * 0.5, this.cloudSize * 1.5)
        p.vertex(x + r * p.cos(theta), y + r * p.sin(theta))
      }
      p.endShape(p.CLOSE)
    }
  };

  //============================================================
  /**
   * Input controls for this bot.
   * Do we just need a chat input? Do we need anything else?
   * What about game controls, useful buttons, sliders?
   **/

  Vue.component(`input-${mask.name}`, {
    // Custom inputs for this bot
    template: `
    <div>
			<div> Cloud Size: <input type="range" v-model="mask.cloudSize" min="10" max="30" step="0.5" /></div>
      <div> Lightning Size: <input type="range" v-model="mask.lightningSize" min="1" max="10" step="0.5" /></div>
      <div> Lightning Color: <color-picker v-model="mask.lightningColor" /> </div>
		</div>
    `,

    // Custom data for these controls
    data() {
      return {};
    },
    props: { mask: { required: true, type: Object } }, // We need to have bot
  });

  masks.push(mask);
})();
