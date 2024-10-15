// Component for the baseball essay
Vue.component("essay-baseball", 
{
  template: 
  `	
    <section>
      <div :id="this.paragraphID" v-html="this.paragraph"></div>
    
      <div :id="this.vizID"></div>
      
      <label>X Axis:</label>
      <select v-model="x">
        <option v-for="stat in this.stats" :value="stat">{{stat}}</option>
      </select>
      
      <label>Y Axis:</label>
      <select v-model="y">
        <option v-for="stat in this.stats" :value="stat">{{stat}}</option>
      </select>
      
      <label>Color:</label>
      <select v-model="c">
        <option v-for="stat in this.stats" :value="stat">{{stat}}</option>
      </select>
      
    </section>
  `,
  
  mounted() 
  {
    // LOAD SOME LOCAL JSON DATA
    // Fetch the JSON data from the URL
    var baseballURL = "data/batting_2023_data.json"

    fetch(baseballURL)
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => 
      {
        // get the data into the vue instance
        this.battingData = data
        this.setupScales()
        this.vizSetup()
        this.vizChange()
      })
      .catch((error) => 
      {
        console.error("Error loading JSON data:", error);
      });
  },
  
  methods: 
  {
    setupScales()
    {
      
    },
    
    vizChange()
    {      
      let x = this.x
      let y = this.y
      let c = this.c
      
      // scale the data
      let xScale = d3.scaleLinear()
                      .domain(d3.extent(this.battingData, function (d) { return d[x] }))
                      .range([0, this.width])
      let yScale = d3.scaleLinear()
                      .domain(d3.extent(this.battingData, function (d) { return d[y] }))
                      .range([this.height, 0])
      let cScale = d3.scaleLinear()
                      .domain(d3.extent(this.battingData, function(d) { return d[c] }))
                      .range(["blue", "red"])
      
      // select svg
      var svg = d3.select(`#${this.vizID} svg g`)

      // transition circles to new place
      svg.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", function(d) {return xScale(d[x])})
        .attr("cy", function(d) {return yScale(d[y])})
        .attr("fill", function(d) {return cScale(d[c])})
      
      // alter interactions for the points
      svg.selectAll("circle")
        .on('mouseover', function(d, i) 
          {
            d3.select(this)
              .raise()
              .attr("r", 6)
              .attr("stroke-width", 1)
              .append("svg:title")
              .text(`Player: ${i.Name}\nTeam: ${i.Team}\n${x}: ${i[x]}\n${y}: ${i[y]}\n${c}: ${i[c]}`)
          })
        .on('mouseout', function(d, i) 
          {
            d3.select(this)
              .attr("r", 5)
              .attr("stroke-width", 0)
          })
      
      // remove existing axes
      svg.selectAll(".axis").remove()
      
      // remove existing titles
      svg.selectAll("title").remove()
      
      // add x axis
      svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(xScale));

      // add y axis
      svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale));
    },
    
    vizSetup()
    { 
      let x = this.x
      let y = this.y
      let c = this.c
      
      // scale the data
      let xScale = d3.scaleLinear()
                      .domain(d3.extent(this.battingData, function (d) { return d[x] }))
                      .range([0, this.width])
      let yScale = d3.scaleLinear()
                      .domain(d3.extent(this.battingData, function (d) { return d[y] }))
                      .range([this.height, 0])
      let cScale = d3.scaleLinear()
                      .domain(d3.extent(this.battingData, function(d) { return d[c] }))
                      .range(["blue", "red"])
      
      // set up new one
      var svg = d3.select(`#${this.vizID}`)
                  .append("svg")
                    .attr("width", this.width + this.margin.left + this.margin.right)
                    .attr("height", this.height + this.margin.top + this.margin.bottom)
                  .append("g")
                    .attr("transform",
                          "translate(" + this.margin.left + "," + this.margin.top + ")");
      
      svg.selectAll("circle")
        .data(this.battingData)
        .enter()
        .append("circle")
        .attr("cx", function(d) {return xScale(d[x])})
        .attr("cy", function(d) {return yScale(d[y])})
        .attr("r", 5)
        .attr("fill", function(d) {return cScale(d[c])})
        .attr("stroke", "yellow")
        .attr("stroke-width", 0)
    }
  },
  
  watch: 
  {
    x: function (newVal) 
    {
      this.vizChange()
    },
    
    y: function (newVal) 
    {
      this.vizChange()
    },
    
    c: function (newVal) 
    {
      this.vizChange()
    },
  },

  data() 
  {  
    return { 
      margin: {top: 20, right: 30, bottom: 20, left: 30},
      width: 360,
      height: 360
    }
  },
  
  props: ['vizID', 'paragraphID', 'num','paragraph', 'stats', 'x', 'y', 'c']
});
