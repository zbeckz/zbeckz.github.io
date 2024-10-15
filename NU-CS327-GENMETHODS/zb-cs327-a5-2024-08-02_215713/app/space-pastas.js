/* globals Vue, systems, Vector2D */

(function () {

  let space = {
    dimensions:["bendFrequency", "bendHeight", "noodleHue", "noodleSaturation", "sauceHue", "sauceLightness"],
    hide: false,
    name: "pastas", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "noodles with sauce",

    landmarks: 
    [
      {
        name:"mac and cheese",
        dna: [0.11,1.00,0.47,0.45,0.42,0.26],
      },
      
      {
        name:"fettucine alfredo",
        dna:[0.00,1.00,0.33,1.00,0.42,1.00]
      },
      
      {
        name:"fusilli pesto",
        dna:[1.00,1.00,0.48,0.48,0.65,0.00]
      },
      
      {
        name:"cavatappi vodka sauce",
        dna: [0.41,0.72,0.59,0.64,0.21,0.34]
      },
      
      {
        name:"spinach pasta with red sauce",
        dna: [0.91,0.26,1.00,0.47,0.00,0.22]
      }
    ],

    //==================================================================
    // POPULATION  AS A WHOLE

    setup({p, individuals, deltaTime, time}) 
    {
      
    },

    draw({p, individuals, deltaTime, time}) 
    {
      p.background(190, 90, 50)
    },

   
    //==================================================================
    // INDIVIDUAL
    
    setupIndividual(individual, {p}) 
    {
      let angles = []
      for (let i = 0; i < 16; i++)
      {
        angles[i] = p.random(-1 * p.PI/8, p.PI/8)
      }
      individual.angles = angles
    },


    updateIndividual(individual, {p, time, deltaTime}) 
    {

    },  

    drawIndividual(individual, {p, time, deltaTime}) 
    {
      // setup dictionary of dimensions
      let dim = {}
      for (let i = 0; i < this.dimensions.length; i++)
      {
        dim[this.dimensions[i]] = individual.dna[i]
      }
     
      // translate and scale each individual to its display position on screen
      p.push()
      p.translate(...individual.basePosition)
      p.scale(individual.baseScale * 0.5)
      
      // map the dna from 0 to 1 to meaningful values if needed
      let bendFrequency = p.map(dim.bendFrequency, 0, 1, 0, 0.5)
      let bendHeight = p.map(dim.bendHeight, 0, 1, 0, 5)
      let noodleSaturation = p.map(dim.noodleSaturation, 0, 1, 30, 100)
      let noodleHue = p.map(dim.noodleHue, 0, 1, 40, 80)
      let sauceHue = p.map(dim.sauceHue, 0, 1, 0, 115)
      let sauceLightness = p.map(dim.sauceLightness, 0, 1, 40, 90)
      
      // setup to draw the noodle
      p.fill(noodleHue, noodleSaturation, 76)
      p.stroke(0,0,0)
      p.strokeWeight(1)
      
      // draw 16 noodles in a grid
      for (let t1 = 0; t1 < 4; t1++)
      {
        for (let t2 = 0; t2 < 4; t2++)
        {
          let t = t1*3 + t2
          let theta = individual.angles[t]
          p.push()
          p.translate((t1%4)*10, (t2%4)*10)
          p.translate(20, 0)
          p.rotate(theta)
          p.translate(-20, 0)
          p.beginShape()

          // draw the top half, save points to draw bottom in reverse order
          let topHalf = []
          for (let i = 0; i < p.PI*2; i+=p.PI/48)
          {
            let x = i*10
            let y = bendHeight * p.sin(bendFrequency*x)
            topHalf.push({x: x, y: y})
            p.vertex(x, y)
          }

          // draw the bottom half
          for (let i = topHalf.length - 1; i >= 0; i--)
          {
            p.vertex(topHalf[i].x, topHalf[i].y - 10)
          }

          p.endShape(p.CLOSE)
          p.pop()
        }
      }
      
      // draw sauce on top of pasta
      p.stroke(sauceHue, 100, sauceLightness, 0.75)
      p.strokeWeight(7.5)
      p.beginShape()
      for (let x = 0; x < 80; x++)
      {
        p.vertex(x+5, 10+20*p.sin(x*0.4))
      }
      p.endShape()
      p.pop()
    },  

  };

  latentSpaces.push(space);
})();
