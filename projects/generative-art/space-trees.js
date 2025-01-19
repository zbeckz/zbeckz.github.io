/* globals Vue, systems, Vector2D */

(function () {

  let space = {
    dimensions:["leafColor", "leafColorVariance", "leafSizeVariance", "leftOdds", "rightOdds", "depth", "randomSeed", "angle"],
    hide: false,
    name: "trees", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "kind of trees",

    landmarks: 
    [
      {
        name: "Colorful",
        dna: [0.49,1.00,0.24,1.00,1.00,0.67,0.00,0.00]
      },
      
      {
        name: "Grid",
        dna: [0.21,0.00,1.00,1.00,1.00,0.49,0.00,1.00]
      },
      
      {
        name: "Natural",
        dna: [0.38,0.09,1.00,0.70,0.68,0.75,0.83,0.05]
      },
      
      {
        name: "Curve",
        dna: [0.40,0.72,0.00,1.00,0.00,1.00,0.88,0.00]
      },
      
      {
        name: "Hexagonal",
        dna: [0.47,1.00,1.00,0.99,0.93,0.43,0.80,0.62]
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
      p.translate(0, -15)
      p.scale(individual.baseScale)
      
      // map the dna from 0 to 1 to meaningful values if needed
      this.lc = p.map(dim.leafColor, 0, 1, 0, 360)
      this.lcv = p.map(dim.leafColorVariance, 0, 1, 0, 180)
      this.lsv = p.map(dim.leafSizeVariance, 0, 1, 0, 3)
      this.lo = dim.leftOdds
      this.ro = dim.rightOdds
      this.d = p.round(p.map(dim.depth, 0, 1, 1, 10))
      this.rs = p.round(p.map(dim.randomSeed, 0, 1, 0, 100))
      this.a = p.map(dim.angle, 0, 1, p.PI/16, p.PI/2)
      
      // begin the recursive drawing process
      p.randomSeed(this.rs*1000)
      this.drawBranch(p, this.d, 0)
      
      p.pop()
    },  
    
    drawBranch(p, depth, angle)
    {
      // draw branch
      p.stroke(0,0,0)
      p.strokeWeight(2)
      p.noFill()
      p.beginShape()
      p.vertex(0, 0)
      p.vertex(0, 10)
      p.endShape()
      
      
      // if we reached max depth, draw leaf. otherwise, probabilistically draw other branches
      if (depth == 0)
      {
        p.strokeWeight(1)
        p.fill(this.lc + this.lcv * p.random(-1, 1), 100, 50)
        p.circle(0,0,5 + this.lsv*p.random(-1, 1))
      }
      else
      {
        if (p.random() < this.lo) // left branch drawn
        {
          p.push()
          p.rotate(-1 * this.a)
          p.translate(0, -10)
          this.drawBranch(p, depth - 1)
          p.pop()
        }
        
        if (p.random() < this.ro) // right branch drawn
        {
          p.push()
          p.rotate(this.a)
          p.translate(0, -10)
          this.drawBranch(p, depth - 1)
          p.pop()
        }
      }
    }
  };

  latentSpaces.push(space);
})();
