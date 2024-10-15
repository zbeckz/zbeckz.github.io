/* globals Vue, systems, Vector2D */

(function () {

  let space = {
    dimensions:["amplitude", "frequency", "noise", "color", "thickness", "colorVariance"],
    hide: false,
    name: "squiggles", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "sin waves with varying features",

    landmarks: 
    [
      {
        name: "Sin Wave",
        dna: [1.00,0.57,0.00,0.66,0.50,0.50]
      },
      
      {
        name: "Perlin Noise",
        dna: [0.00,0.00,1.00,0.00,0.50,0.50]
      },
      
      {
        name: "Bouncing Line",
        dna: [1.00,0.00,0.00,0.25,1.00,0.50]
      },
      
      {
        name: "Jiggling Sin",
        dna: [1.00,1.00,0.44,0.82,1.00,0.00]
      },
      
      {
        name: "Jiggling Noise",
        dna: [1.00,0.00,1.00,0.72,0.00,1.00]
      },
      
      {
        name: "Ocean Wave",
        dna: [0.32,0.16,0.00,0.56,1.00,0.00]
      }
    ],

    //==================================================================
    // POPULATION  AS A WHOLE

    setup({p, individuals, deltaTime, time}) 
    {
      
    },

    draw({p, individuals, deltaTime, time}) 
    {
      p.background(0,0,100)
    },

   
    //==================================================================
    // INDIVIDUAL
    
    setupIndividual(individual, {p}) 
    {
      
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
      p.scale(individual.baseScale)
      
      // map the dna from 0 to 1 to meaningful values if needed
      let a = p.map(dim.amplitude, 0, 1, 0, 10)
      let f = p.map(dim.frequency, 0, 1, 0, 3)
      let n = p.map(dim.noise, 0, 1, 0, 50)
      let c = p.map(dim.color, 0, 1, 0, 360)
      let cv = p.map(dim.colorVariance, 0, 1, 0, 40)
      let t = p.map(dim.thickness, 0, 1, 1, 4)
      
      // draw squiggle
      p.strokeWeight(t)
      p.noFill()
      for (let x = 0; x < p.TWO_PI; x += p.TWO_PI/128)
      {
        p.beginShape()
        p.stroke(p.map(p.sin(x+t), -1, 1, c-cv, c+cv), 100, 50)
        p.vertex(x*7 - 22, a*p.sin(f*x + time*4) + n*(p.noise(x + time*4)-0.5))
        let x1 = x + p.TWO_PI/128
        p.vertex(x1*7 - 22, a*p.sin(f*x1 + time*4) + n*(p.noise(x1 + time*4)-0.5))
        p.endShape()
      }
      
      p.pop()
    },  

  };

  latentSpaces.push(space);
})();
