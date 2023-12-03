/* ----------------------------- PLOT SPECS -------------------------------------------------------------------- */

// svg size specs
let svgSpecs = 
{
    margin: 
    {
        top: 20, 
        right: 20, 
        bottom: 20, 
        left: 40
    },
    width: 300,
    height: 300,
}

// legend svg specs
let legendSvgSpecs =
{
    margin: 
    {
        top: 0, 
        right: 0, 
        bottom: 0, 
        left: 0
    },

    width: 80,
    height: 200,
}

// plot specifications for the team scatter plot
let teamScatterplotSpecs =
{
    // either scatter or timeline, used for setup
    type: "scatter",

    // data schema used to setup the sliders / dropdowns
    fields: 
    {
        nominative: ["lgID", "teamID", "franchName"],
        boolean: ["WSWin"],
        quantitative: ["yearID", "W", "L", "R", "H", "2B", "3B", "HR", "TB", "BB", "SO", "SB", "CS", "SB%", "HBP", "SF", "AVG", "OBP", "SLG", "OPS", "RA", "ERA", "CG", "SHO", "SV", "HA", "HRA", "BBA", "SOA", "Rank"]
    },

    // prefix to html id for elements within this plot
    selector: "teams",

    // which stats are being encoded to the scatterplot
    XAxis: "R",
    YAxis: "RA",
    Color: "W",

    // what stats to display on tooltip
    tooltipDisplay: [{name: "Team: ", stat: "franchName"}, {name:"Year: ", stat:"yearID"}],

    // filters to apply to data before drawing
    filters: [],

    // overall team data
    data: [],

    // which teams are currently selected
    selected: [],

    // what is slider controlling
    sliderStat: "W",

    // for the plot specific dropdown
    dropdownOptions: ["All", "STL", "CHC", "PIT", "CIN", "MIL", "SFG", "SDP", "LAD", "ARI", "COL", "MIA", "WAS", "ATL", "PHI", "NYM", "NYY", "TOR", "BOS", "BAL", "TBR", "LAA", "HOU", "TEX", "SEA", "OAK", "CHW", "CLE", "KCR", "MIN", "DET"],
    dropdownStat: "teamID",

    // svg element specs
    markSize: 4,
    strokeWidth: 0.5
}

// plot specifications for the hitter scatter plot
let hitterScatterplotSpecs =
{
    // either scatter or timeline, used for setup
    type: "scatter",
    
    // data schema used to setup the sliders / dropdowns
    fields:
    {
        nominative: ["playerID", "teamID", "nameFirst", "nameLast", "position"],
        boolean: ["allstar"],
        quantitative: ["yearID", "G", "PA", "AB", "R", "H", "2B", "3B", "HR", "RBI", "SB", "CS", "SB%", "BB", "SO", "TB", "AVG", "OBP", "SLG", "OPS", "IBB", "HBP", "SF", "weight", "height"]
    },

    // prefix to html id for elements within this plot
    selector: "hitters",

    // which stats are being encoded to the scatterplot
    XAxis: "HR",
    YAxis: "RBI",
    Color: "OPS",

    // what stats to display on tooltip
    tooltipDisplay: [{name: "First Name: ", stat: "nameFirst"}, {name:"Last Name: ", stat:"nameLast"}, {name:"Team: ", stat:"teamID"}, {name:"Year: ", stat:"yearID"}, {name:"PA: ", stat:"PA"}],

    // filters to apply to data before drawing
    filters: [],

    // all the hitter data
    data: [],

    // what is the slider controlling
    sliderStat: "PA",

    // for the plot specific dropdown
    dropdownOptions: ["All", "1B", "2B", "3B", "SS", "C", "LF", "RF", "CF"],
    dropdownStat: ["position"],

    // which hitters are selected
    selected: [],

    // svg element specs
    markSize: 4,
    strokeWidth: 0.5
}

// plot specifications for the pitcher scatter plot
let pitcherScatterplotSpecs =
{
    // either scatter or timeline, used for setup
    type: "scatter",
    
    // data schema used to setup the sliders / dropdowns
    fields:
    {
        nominative: ["playerID", "teamID", "nameFirst", "nameLast", "position"],
        boolean: ["allstar"],
        quantitative: ["yearID", "W", "L", "G", "GS", "CG", "SHO", "SV", "H", "ER", "HR", "BB", "SO", "BAOpp", "ERA", "HBP", "GF", "R", "weight", "height", "IP"]
    },

    // prefix to html id for elements within this plot
    selector: "pitchers",

    // which stats are being encoded to the scatterplot
    XAxis: "BB",
    YAxis: "SO",
    Color: "ERA",

    // stats to display on tooltip
    tooltipDisplay: [{name: "First Name: ", stat: "nameFirst"}, {name:"Last Name: ", stat:"nameLast"}, {name:"Team: ", stat:"teamID"}, {name:"Year: ", stat:"yearID"}, {name: "IP: ", stat:"IP"}],

    // filters to apply to pitching data before plotting
    filters: [],

    // all the pitching data
    data: [],

    // what stat does the slider control
    sliderStat: "IP",

    // for the plot specific dropdown
    dropdownOptions: ["All", "SP", "RP"],
    dropdownStat: ["position"],

    // currently selected pitchers
    selected: [],

    // svg element specs
    markSize: 4,
    strokeWidth: 0.5
}

// plot specifications for the team timeline plot
let teamTimelineSpecs = 
{
    // either scatter or timeline, used for setup
    type: "timeline",

    // prefix to html id for elements within this plot
    selector: "teamTimeline",

    // used to connect to selected data in team scatterplot
    idField: "teamID",

    // possible stats to display on timeline
    fields: ["G", "W", "L", "R", "PA", "AB", "H", "2B", "3B", "HR", "TB", "BB", "SO", "SB", "CS", "SB%", "HBP", "SF", "AVG", "OBP", "SLG", "OPS", "RA", "ER", "ERA", "CG", "SHO", "SV", "HA", "HRA", "BBA", "SOA", "DP", "Rank"],

    // which fields to weight and what to weight it by when calculating averages (empty instead of null to not break code that uses it)
    rateFields: [],

    // which stats are being encoded to the scatterplot
    YAxis: "W",

    // which teams are selected to be drawn
    selected: [],

    // overall team data
    data: [],

    // filters to calculate the averages
    filters: [],

    sliderStat: "W",

    // for the plot specific dropdown
    dropdownOptions: ["All", "NL", "AL"],
    dropdownStat: ["lgID"],

    // average for each field for each year
    averages: [],

    // which stats to display on the tooltip
    tooltipDisplay: [{name: "Team: ", stat: "teamID"}],

    // svg element specs
    pathSize: 4,
    markSize: 4,

    labelText: ["teamID"], 

    // for the legend
    entityTitle: "Teams",

    // for scrolling
    legendStart: 0,

    // for settuing up the legend
    legendSpecs: {}
}

// plot specifications for the hitter timeline plot
let hitterTimelineSpecs = 
{
    // either scatter or timeline, used for setup
    type: "timeline",

    // prefix to html id for elements within this plot
    selector: "hitterTimeline",

    // used to connect to selected data in hitter scatterplot
    idField: "playerID",

    // possible stats to display on timeline
    fields: ["G", "PA", "AB", "R", "H", "2B", "3B", "HR", "RBI", "SB", "CS", "SB%", "BB", "SO", "TB", "AVG", "OBP", "SLG", "OPS", "IBB", "HBP", "SF"],

    // which fields to weight and what to weight it by when calculating averages
    rateFields: ["SB%", "AVG", "OBP", "SLG", "OPS"],
    rateWeightField: ["PA"],

    // which stats are being encoded to the scatterplot
    YAxis: "HR",

    // which hitters are selected
    selected: [],

    // overall hitter data
    data: [],

    // filters to calculate the averages
    filters: [],

    sliderStat: "PA",

    // for the plot specific dropdown
    dropdownOptions: ["All", "1B", "2B", "3B", "SS", "C", "LF", "RF", "CF"],
    dropdownStat: ["position"],

    // average for each field for each year
    averages: [],

    // what to display on the tooltip
    tooltipDisplay: [{name: "First Name: ", stat: "nameFirst"}, {name: "Last Name: ", stat: "nameLast"}, {name: "Team: ", stat:"teamID"}],

    // svg element specs
    pathSize: 4,
    markSize: 4,

    labelText: ["nameFirst", "nameLast"], 

    // for the legend
    entityTitle: "Hitters",

    // for scrolling
    legendStart: 0,

    // for setting up the legend
    legendSpecs: {}
}

// plot specifications for the pitcher timeline plot
let pitcherTimelineSpecs = 
{
    // either scatter or timeline, used for setup
    type: "timeline",

    // prefix to html id for elements within this plot
    selector: "pitcherTimeline",

    // used to connect to selected data in pitcher scatterplot
    idField: "playerID",

    // possible stats to display on timeline
    fields: ["W", "L", "G", "GS", "CG", "SHO", "SV", "H", "ER", "HR", "BB", "SO", "BAOpp", "ERA", "HBP", "GF", "R", "IP"],

    // which fields to weight and what to weight it by when calculating averages
    rateFields: ["BAOpp", "ERA"],
    rateWeightField: ["IP"],

    // which stats are being encoded to the scatterplot
    YAxis: "W",

    // which pitchers are currently selected and should be drawn
    selected: [],

    // overall pitcher data
    data: [],

    // filters to calculate the averages
    filters: [],

    sliderStat: "IP",

    // for the plot specific dropdown
    dropdownOptions: ["All", "SP", "RP"],
    dropdownStat: ["position"],

    // average for each field for each year
    averages: [],

    // what fields to display on the tooltip
    tooltipDisplay: [{name: "First Name: ", stat: "nameFirst"}, {name: "Last Name: ", stat: "nameLast"}, {name: "Team: ", stat:"teamID"}],

    // sizes for svg elements
    pathSize: 4,
    markSize: 4,

    // what to display as title for the path
    labelText: ["nameFirst", "nameLast"], 

    // for the legend
    entityTitle: "Pitchers",

    // for scrolling
    legendStart: 0,

    // for setting up the legend
    legendSpecs: {}
}



/* ----------------------------- INITIALIZATION  -------------------------------------------------------------------- */



// this is the only code that gets run on start. sets everything up!
initialize()

// load data, set up plots
async function initialize() 
{
  // read in the data
  let hitters = await d3.csv("data/Hitters2010s.csv");
  let pitchers = await d3.csv("data/Pitchers2010s.csv");
  let teams = await d3.csv("data/Teams2010s.csv");

  // read in the abbreviation data
  let teamTableData = await d3.csv("data/TeamAbbreviations.csv");
  let hitterTableData = await d3.csv("data/HitterAbbreviations.csv");
  let pitcherTableData = await d3.csv("data/PitcherAbbreviations.csv");

  console.log(pitcherTableData)

  // setup the tables for abbreivations
  setupTable(teamTableData, "team")
  setupTable(hitterTableData, "hitter")
  setupTable(pitcherTableData, "pitcher")

  // now that we have the data, clean it for scatterplots
  hitterScatterplotSpecs.data = cleanData(hitters, hitterScatterplotSpecs, "yes")
  pitcherScatterplotSpecs.data = cleanData(pitchers, pitcherScatterplotSpecs, "yes")
  teamScatterplotSpecs.data = cleanData(teams, teamScatterplotSpecs, "Y")

  // set up scatter plots
  setupPlot(teamScatterplotSpecs)
  setupPlot(hitterScatterplotSpecs)
  setupPlot(pitcherScatterplotSpecs)

  // add intial data to the scatter plots with no filters
  drawScatterplotData(teamScatterplotSpecs)
  drawScatterplotData(hitterScatterplotSpecs)
  drawScatterplotData(pitcherScatterplotSpecs)

  // setup timeline data
  teamTimelineSpecs.data = teamScatterplotSpecs.data
  hitterTimelineSpecs.data = hitterScatterplotSpecs.data
  pitcherTimelineSpecs.data = pitcherScatterplotSpecs.data

  // calculate averages for timelines
  calculateTimelineAverages(teamTimelineSpecs)
  calculateTimelineAverages(hitterTimelineSpecs)
  calculateTimelineAverages(pitcherTimelineSpecs)

  // set up timeline plots
  setupPlot(teamTimelineSpecs)
  setupPlot(hitterTimelineSpecs)
  setupPlot(pitcherTimelineSpecs)

  // add initial data to timeline plots (should be blank to start)
  drawTimelineData(teamTimelineSpecs)
  drawTimelineData(hitterTimelineSpecs)
  drawTimelineData(pitcherTimelineSpecs)
}



/* ----------------------------- SETUP FUNCTIONS FOR ANY PLOT -------------------------------------------------------------------- */



// can set up any of the plots given specs
function setupPlot(specs)
{
    // setup the svg
    d3.select(`#${specs.selector}Plot`)
        .attr("width", svgSpecs.width)
        .attr("height", svgSpecs.height)
        .append("g")
            .attr("transform", `translate(${svgSpecs.margin.left}, ${svgSpecs.margin.top})`);

    // setup the legend
    d3.select(`#${specs.selector}Legend`)
        .attr("width", legendSvgSpecs.width)
        .attr("height", legendSvgSpecs.height)
        .append("g")
            .attr("transform", `translate(${legendSvgSpecs.margin.left}, ${legendSvgSpecs.margin.top})`);

    // setup controls (specs handles what type)
    setupDropdowns(specs)
    setupSlider(specs)
}

// make axes given svg and specs and scales
function drawAxes(svg, xScale, yScale)
{
    // remove existing axes
    svg.selectAll(".axis").remove()

    // add x axis
    svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${svgSpecs.height - svgSpecs.margin.top - svgSpecs.margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(5));

    // add y axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).ticks(5));
}

// get tooltip text given specs
function getTooltipText(specs, d)
{
    let t = ""
    for (let j = 0; j < specs.tooltipDisplay.length; j++)
    {
        t += specs.tooltipDisplay[j].name
        t += d[specs.tooltipDisplay[j].stat]
        t += "\n"
    }

    return t
}


/* ----------------------------- TIMELINE SPECIFIC -------------------------------------------------------------------- */



// given specs, makes the appropriate timeline plot
function drawTimelineData(specs)
{
    // get the chart
    let svg = d3.select(`#${specs.selector}Plot g`)

    // remove existing circles
    svg.selectAll("circle").remove()

    // remove existing path
    svg.selectAll("path").remove()

    // remove existing gs
    svg.selectAll("g").remove()

    // setup array to contain each individual array for each selected entity
    let paths = getPaths(specs)

    // get filtered data
    let data = getFilteredData(specs)

    // get averages
    calculateTimelineAverages(specs)
    let avgs = specs.averages.filter(d => d.field === specs.YAxis)

    // if data has NaN, do not draw
    let drawAvg = true
    for (let i = 0; i < avgs.length; i++)
    {
        if (isNaN(avgs[i].value))
        {
            drawAvg = false
            break
        }
    }

    // get domain for YAxis stat based on all paths and filtered data
    let yDomain = getYDomain(paths, data, specs.YAxis)

    let xScale = d3.scaleLinear()
                    .domain([2010, 2019])
                    .range([0, svgSpecs.width - svgSpecs.margin.left - svgSpecs.margin.right])

    let yScale = d3.scaleLinear()
                    .domain(yDomain)
                    .range([svgSpecs.height - svgSpecs.margin.top - svgSpecs.margin.bottom, 0])

    // create the axes
    drawAxes(svg, xScale, yScale)

    // draw the average timeline
    if (drawAvg)
    {
        drawTimeline(svg, 
            specs, 
            avgs,
            d => xScale(d.yearID),
            d => yScale(d.value),
            "orange",
            d => `Year: ${d.yearID}\nAverage ${specs.YAxis}: ${d.value}`,
            `Average ${specs.YAxis}`)
    }
    
    let legendLabels = []

    // draw all of the paths
    for (let i = 0; i < paths.length; i++)
    {
        // get data for this path
        let data = paths[i]

        // make the label and save it for legend use later
        let label = specs.labelText.reduce((acc, d) => acc + data[0][d] + " ", "")
        legendLabels.push(label)

        drawTimeline(svg, 
                     specs, 
                     data, 
                     d => xScale(d.yearID), 
                     d => yScale(d[specs.YAxis]), 
                     "steelblue",
                     d =>  `Year: ${d.yearID}\n` + getTooltipText(specs, d) + `${specs.YAxis}: ${d[specs.YAxis]}`,
                     label)
    }

    // draw legend
    let legendSvg = d3.select(`#${specs.selector}Legend g`)
    drawTimelineLegend(legendSvg, svg, legendLabels, specs)
}

function getYDomain(paths, filteredData, stat)
{
    // setup [min, max] to return later
    let domain = d3.extent(filteredData, d => d[stat])
    if (isNaN(domain[0])) { domain[0] = 0 }
    if (isNaN(domain[1])) { domain[1] = 0 }

    // loop through all the paths
    for (let i = 0; i < paths.length; i++)
    {
        // check if this path contains vals outside the current min and max
        let data = paths[i]
        let testDomain = d3.extent(data, d => d[stat])
        if (testDomain[0] < domain[0]) { domain[0] = testDomain[0] }
        if (testDomain[1] > domain[1]) { domain[1] = testDomain[1] }
    }

    return domain
}

// draws the whole legend using heleprs
function drawTimelineLegend(svg, scatterSvg, labels, specs)
{
    // remove existing legend
    svg.selectAll("rect").remove()
    svg.selectAll("text").remove()
    svg.selectAll("path").remove()

    // setup layout
    specs.legendSpecs.rectWidth = legendSvgSpecs.width * 0.2
    specs.legendSpecs.rectHeight = specs.legendSpecs.rectWidth
    specs.legendSpecs.yGap = legendSvgSpecs.height * 0.05
    specs.legendSpecs.selectionWindowStart = specs.legendSpecs.yGap*3 + specs.legendSpecs.rectHeight*2
    specs.legendSpecs.selectionWindowHeight = legendSvgSpecs.height - specs.legendSpecs.selectionWindowStart - 5
    specs.legendSpecs.selectionWindowWidth = legendSvgSpecs.width * 0.7
    specs.legendSpecs.arrowX = 1 + specs.legendSpecs.selectionWindowWidth + 9
    specs.legendSpecs.arrowY = [specs.legendSpecs.selectionWindowStart + 10, specs.legendSpecs.selectionWindowStart + specs.legendSpecs.selectionWindowHeight - 10]
    specs.legendSpecs.arrowTranslate = [`translate(${specs.legendSpecs.arrowX}, ${specs.legendSpecs.arrowY[0]})`, `translate(${specs.legendSpecs.arrowX}, ${specs.legendSpecs.arrowY[1]}) rotate(180)`]
    specs.legendSpecs.indicatorSize = labels.length > 7 ? 92 / (labels.length - 6) : 0

    // draw the average color square and label
    drawAverageLegend(svg, scatterSvg, specs)

    // draw the all entities color and label
    drawEntityLegend(svg, scatterSvg, specs)

    // draw the entity selection window including selectors and scrollbar
    drawEntitySelectionWindow(svg, scatterSvg, labels, specs)    
}

// helper for drawTimelineLegend, draws the selection window and scrollbar
function drawEntitySelectionWindow(svg, scatterSvg, labels, specs)
{
    // setup entity selection window
    svg.append("rect")
        .attr("x", 1)
        .attr("y", specs.legendSpecs.selectionWindowStart)
        .attr("width", specs.legendSpecs.selectionWindowWidth)
        .attr("height", specs.legendSpecs.selectionWindowHeight)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 1)

    // setup the enitity selectors in the window
    drawEntitySelectors(svg, scatterSvg, labels, specs)

    // setup bounding box for arrows
    svg.append("rect")
        .attr("x", 1 + specs.legendSpecs.selectionWindowWidth)
        .attr("y", specs.legendSpecs.selectionWindowStart)
        .attr("width", legendSvgSpecs.width * 0.22)
        .attr("height", specs.legendSpecs.selectionWindowHeight)
        .attr("fill", "white")
        .attr("stroke", "black")

    // setup location indicator within the bounding box
    if (labels.length > 7)
    {
        svg.append("rect")
            .attr("x", 1 + specs.legendSpecs.selectionWindowWidth + legendSvgSpecs.width * 0.03)
            .attr("y", specs.legendSpecs.selectionWindowStart + 20 + specs.legendSpecs.indicatorSize*specs.legendStart)
            .attr("width", legendSvgSpecs.width * 0.16)
            .attr("height", specs.legendSpecs.indicatorSize)
            .attr("fill", "lightgray")
            .attr("stroke", "black")
            .on('mouseover', function(d)
            {
                d3.select(this).attr("fill", "gray")
            })
            .on('mouseout', function(d)
            {
                d3.select(this).attr("fill", "lightgray")
            })
            .call(d3.drag().on("drag", function(e)
            {
                // get current position
                let pt = d3.select(this)
                let y = pt.attr("y")
                
                // update position based on drag
                let newY = +y + e.dy

                // constrain within the bounds of the scrollbar
                if (newY < specs.legendSpecs.selectionWindowStart + 20 ) { newY = specs.legendSpecs.selectionWindowStart + 20}
                if (newY > specs.legendSpecs.selectionWindowStart + 20 + specs.legendSpecs.indicatorSize*(labels.length-7)) {newY = specs.legendSpecs.selectionWindowStart + 20 + specs.legendSpecs.indicatorSize*(labels.length-7)}
                
                // set the new position
                pt.attr("y", newY)

                // update selection window accordingly
                specs.legendStart = Math.round((newY - (specs.legendSpecs.selectionWindowStart + 20)) / specs.legendSpecs.indicatorSize)
                drawEntitySelectors(svg, scatterSvg, labels, specs)
            }))
    }

    // acts as arrow symbol to scroll legend menu
    let triangle = d3.symbol()
                    .type(d3.symbolTriangle)
                    .size(legendSvgSpecs.width)

    // up and down buttons via looping
    for (let i = 0; i < 2; i++)
    {
        svg.append("path")
        .attr("d", triangle)
        .attr("stroke", "black")
        .attr("fill", "lightgray")
        .attr("transform", specs.legendSpecs.arrowTranslate[i])
    }
}

// helper for drawTimelineLegend, draws the overall entity selector and label
function drawEntityLegend(svg, scatterSvg, specs)
{
    // setup entity rect
    svg.append("rect")
        .attr("x", 1)
        .attr("y", specs.legendSpecs.yGap * 2 + specs.legendSpecs.rectHeight)
        .attr("width", specs.legendSpecs.rectWidth)
        .attr("height", specs.legendSpecs.rectHeight)
        .attr("fill", "steelblue")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .on('mouseover', function(d)
        {
            // highlight every path and circle that is not the "average" timeline
            scatterSvg.selectAll("g")
                .each(function (d) 
                {
                    let el = d3.select(this)
                    // if its not the average one, highlight it
                    if (el.attr("id") !== null && !el.attr("id").includes("Average"))
                    {
                        el.selectAll("path").attr("opacity", 1)
                        el.selectAll("circle").attr("opacity", 1)
                    }
                })
            
            // bold label
            svg.select("#entityLabel").attr("font-weight", "bold")

        })
        .on('mouseout', function(d)
        {
            // fade every path and circle that is not the "average" timeline
            scatterSvg.selectAll("g")
                .each(function (d) 
                {
                    let el = d3.select(this)

                    // if its not the average one, fade it
                    if (el.attr("id") !== null && !el.attr("id").includes("Average"))
                    {
                        el.selectAll("path").attr("opacity", 0.2)
                        el.selectAll("circle").attr("opacity", 0.2)
                    }
                })
            
            // unbold label
            svg.select("#entityLabel").attr("font-weight", "normal")

        })

    // setup entity label
    svg.append("text")
        .attr("x", specs.legendSpecs.rectWidth + 10)
        .attr("y", specs.legendSpecs.yGap*2 + specs.legendSpecs.rectHeight*1.5)
        .text(specs.entityTitle)
        .attr("class", "legendTick")
        .style("alignment-baseline", "middle")
        .attr("id", "entityLabel")
}

// helper for drawTimelineLegend, draws the average selector and label
function drawAverageLegend(svg, scatterSvg, specs)
{
    // setup the average rect
    svg.append("rect")
        .attr("x", 1)
        .attr("y", specs.legendSpecs.yGap)
        .attr("width", specs.legendSpecs.rectWidth)
        .attr("height", specs.legendSpecs.rectHeight)
        .attr("fill", "orange")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .on('mouseover', function(d, i)
        {
            // highlight average path
            scatterSvg.selectAll("g")
                .each(function (d) 
                {
                    let el = d3.select(this)

                    // if its the average one, highlight it
                    if (el.attr("id") === `Average ${specs.YAxis}`)
                    {
                        el.selectAll("path").attr("opacity", 1)
                        el.selectAll("circle").attr("opacity", 1)
                    }
                })
            
            // bold label
            svg.select("#avgLabel").attr("font-weight", "bold")
        })
        .on('mouseout', function(d, i)
        {
            // unhighlight average path
            scatterSvg.selectAll("g")
                .each(function (d) 
                {
                    let el = d3.select(this)

                    // if its the average one, highlight it
                    if (el.attr("id") === `Average ${specs.YAxis}`)
                    {
                        el.selectAll("path").attr("opacity", 0.2)
                        el.selectAll("circle").attr("opacity", 0.2)
                    }
                })

            // unbold label
            svg.select("#avgLabel").attr("font-weight", "normal")
        })

    // setup average label
    svg.append("text")
        .attr("x", specs.legendSpecs.rectWidth + 10)
        .attr("y", specs.legendSpecs.yGap + specs.legendSpecs.rectHeight*0.5)
        .text("Average")
        .attr("class", "legendTick")
        .style("alignment-baseline", "middle")
        .attr("id", "avgLabel")

}

// helper for drawTimelineLegend, draws the entity selectors in the window
function drawEntitySelectors(legendSvg, scatterSvg, labels, specs)
{
    // remove old g
    legendSvg.selectAll("g").remove()
    
    // make g for the selectors
    let svg = legendSvg.append("g").attr("id", "entitySelectors")

    // setup entity selectors
    let length = Math.min(7, labels.length - specs.legendStart)
    for (let i = 0; i < length; i++)
    {
        let yPos = specs.legendSpecs.selectionWindowStart + specs.legendSpecs.rectHeight*1.2*i
        let label = labels[i + specs.legendStart]

        // selector entity name label
        svg.append("text")
            .attr("x", 5)
            .attr("y", yPos + specs.legendSpecs.rectHeight*0.6)
            .text(label.substring(0, 8)) // truncated
            .attr("class", "legendTick")
            .style("alignment-baseline", "middle")

        // selector rectangle
        svg.append("rect")
            .attr("x", 1)
            .attr("y", yPos)
            .attr("width", specs.legendSpecs.selectionWindowWidth)
            .attr("height", specs.legendSpecs.rectHeight*1.2)
            .attr("opacity", 0.1)
            .attr("fill", "steelblue")
            .on('mouseover', function(d)
            {
                // highlight, add title
                d3.select(this)
                    .attr("opacity", 0.4)
                    .append("svg:title")
                    .text(label)

                // highlight associated timeline
                scatterSvg.selectAll("g")
                        .each(function (d) 
                        {
                            let el = d3.select(this)

                            // if its not the average one, fade it
                            if (el.attr("id") === label)
                            {
                                el.selectAll("path").attr("opacity", 1)
                                el.selectAll("circle").attr("opacity", 1)
                            }
                        })
            })
            .on('mouseout', function(d)
            {
                // unhighlight, remove title
                d3.select(this)
                    .attr("opacity", 0.1)
                    .selectAll("*").remove()

                // unhighlight associated timeline
                scatterSvg.selectAll("g")
                        .each(function (d) 
                        {
                            let el = d3.select(this)

                            // if its not the average one, fade it
                            if (el.attr("id") === label)
                            {
                                el.selectAll("path").attr("opacity", 0.2)
                                el.selectAll("circle").attr("opacity", 0.2)
                            }
                        })
            })
    }
}

// helper for timeline plot creation, draws path and points
function drawTimeline(svg, specs, data, xFunc, yFunc, colorFunc, tooltipFunc, label)
{
    // add it
    let newSvg = svg.append("g").attr("id", label)

    // add the selected timeline
    newSvg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", colorFunc)
        .attr("stroke-width", specs.pathSize)
        .attr("opacity", 0.2)
        .attr("d", d3.line()
                    .x(xFunc)
                    .y(yFunc))
        .on('mouseover', function(d, i)
        {
            // highlight, add tooltip
            d3.select(this)
                .raise()
                .attr("opacity", 1)
                .append("svg:title")
                .text(label)

            // highlight all the circles on this path
            newSvg.selectAll("circle")
                .raise()
                .attr("opacity", 1)

        })
        .on('mouseout', function(d, i)
        {
            // remove tooltip
            d3.select(this)
                .attr("opacity", 0.2)
                .selectAll("*").remove()

            // fade all the circles too
            newSvg.selectAll("circle")
                .raise()
                .attr("opacity", 0.2)
        })

    // add the selected points
    newSvg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", xFunc)
            .attr("cy", yFunc)
            .attr("r", specs.markSize)
            .attr("opacity", 0.2)
            .attr("fill",colorFunc)
            .attr("stroke", "black")
            .attr("stroke-width", 0)
            .on('mouseover', function(d, i) 
            {
                // add new tooltip
                d3.select(this)
                    .raise()
                    .attr("opacity", 1)
                    .attr("r", specs.markSize * 1.5)
                    .attr("stroke-width", 0.5)
                    .append("svg:title")
                    .text(tooltipFunc(i))

                // highlight path
                newSvg.select("path")
                    .attr("opacity", 1)

                // highlight other circles
                newSvg.selectAll("circle")
                    .attr("opacity", 1)
            })
            .on('mouseout', function(d, i) 
            {
                // revert back to previous appearance, remove title
                d3.select(this)
                    .attr("opacity", 0.2)
                    .attr("r", specs.markSize)
                    .attr("stroke-width", 0)
                    .selectAll("*").remove()

                // unhighlight path
                newSvg.select("path")
                    .attr("opacity", 0.2)

                // unhighlight all circles
                newSvg.selectAll("circle")
                    .attr("opacity", 0.2)
            })
}

// helper for timeline plot creation, gets each selected entity path data
function getPaths(specs)
{
    // reduce to unique values
    let selected = specs.selected.reduce(function(acc, d) 
    {
        if (!acc.includes(d)) {acc.push(d)}

        return acc
    }, [])

    let paths = []

    // get individual arrays by looping through the selected entities
    for (let i = 0; i < selected.length; i++)
    {
        // filter to only that selection
        let data = specs.data.filter(d => d[specs.idField] === selected[i])
  
        // sort by year
        data.sort((a, b) => a.yearID - b.yearID)
        
        // ensure players who played for mulitple teams in a given year have combined stats
        if (specs.rateFields.length > 0)
        {
            data = combineYears(specs, data)
        }

        paths.push(data)
    }

    return paths
}

// calculate averages of every stat per year for given timeline specs
function calculateTimelineAverages(specs)
{
    // get data from filters and reset averages
    let data = getFilteredData(specs)
    specs.averages = []

    // loop through all the possible fields to show
    for (let i = 0; i < specs.fields.length; i++)
    {
        // get the field
        let f = specs.fields[i]

        // loop through each year
        for (let y = 2010; y <= 2019; y++)
        {
            // filter by year
            let yearData = data.filter(d => d.yearID === y)

            // to keep track of nan amounts to not incorporate
            let nanAmount = 0

            // get average
            let value = yearData.reduce(function(acc, d) 
            {
                if (isNaN(d[f])) 
                {
                    nanAmount++
                    return acc
                }
                return acc + d[f]

            }, 0) / (yearData.length - nanAmount)

            // truncate
            if (!Number.isInteger(value)) { value = +value.toFixed(3)}

            // figure out the average for this stat for this year
            specs.averages.push
            ({
                field: f,
                yearID: y,
                value: value
            })
        }
    }
}

// takes in data for a timeline, combines it for display when a player played for diff teams during the same year
function combineYears(specs, data)
{
    let init = data.shift()
    return data.reduce(function(acc, d)
    {
        let prevData = acc[acc.length - 1]
        let newData = JSON.parse(JSON.stringify(d)) // to prevent any changes to newData affecting d

        // if still same year, need to combine stats
        if (prevData.yearID === d.yearID)
        {
            // loop through all the fields in this data
            for (let i = 0; i < specs.fields.length; i++)
            {
                // get the field
                let f = specs.fields[i]

                // if its a rate stat, need to do weighted average
                if (specs.rateFields.includes(f))
                {
                    newData[f] = (prevData[f]*prevData[specs.rateWeightField] + d[f]*d[specs.rateWeightField]) / (prevData[specs.rateWeightField] + d[specs.rateWeightField])
                }
                else // if not, can add as normal
                {
                    newData[f] = prevData[f] + d[f]
                }
            }

            // now that fields are updated, replace prev obj with this new one
            acc[acc.length - 1] = newData
            return acc
        }
        else // not same year, can add as normal
        {
            acc.push(d)
            return acc
        }
    }, [init])
}



/* ----------------------------- SCATTERPLOT SPECIFIC -------------------------------------------------------------------- */



// given specs, makes the appropriate scatterplot
function drawScatterplotData(specs)
{
    // get filtered data
    let data = getFilteredData(specs)

    // get the chart
    let svg = d3.select(`#${specs.selector}Plot g`)

    // remove existing titles
    svg.selectAll("title").remove()

    // scale the data
    let colorData = data.map(d => d[specs.Color]) // doing this here because we need to pass it to legend later
    let xScale = d3.scaleLinear()
                    .domain(d3.extent(data, d => d[specs.XAxis]))
                    .range([0, svgSpecs.width - svgSpecs.margin.left - svgSpecs.margin.right])
    let yScale = d3.scaleLinear()
                    .domain(d3.extent(data, d => d[specs.YAxis]))
                    .range([svgSpecs.height - svgSpecs.margin.top - svgSpecs.margin.bottom, 0])
    let colorScale = d3.scaleQuantile()
                        .domain(colorData)
                        .range(d3.schemeRdBu[5].toReversed())

    // draw legend
    let legendSvg = d3.select(`#${specs.selector}Legend g`)
    drawScatterplotLegend(legendSvg, colorData, colorScale, specs.Color, svg)

    // draw axes
    drawAxes(svg, xScale, yScale)

    // draw circles
    drawScatterplotCircles(svg, specs, data, xScale, yScale, colorScale)

    // add interactions to the circles
    interactScatterplotCircles(svg, specs, colorScale)
}

// helper for the scatter plot crea,tion, draws the points
function drawScatterplotCircles(svg, specs, data, xScale, yScale, colorScale)
{
    // add circles for each point, give color group
    let circle = svg.selectAll("circle")
                .data(data, function(d) 
                {
                    // setup color groupings for legend behavior
                    let myColor = colorScale(d[specs.Color])
                    let colors = colorScale.range()
                    for (let i = 0; i < colors.length; i++)
                    {
                        if (myColor === colors[i])
                        {
                            d.colorGroup = i;
                            return d.id // give identifier
                        }
                    }
                })

    // remove circles that were not connected via id
    circle.exit().remove()

    for (let i = 0; i < 2; i++)
    {
        let elements

        // transition circles that were connected via id, add new ones
        i == 0 ? elements = circle.transition().duration(1000).ease(d3.easeQuadInOut) : elements = circle.enter().append("circle")

        // setup for all elements
        elements.attr("cx", function(d) {return xScale(d[specs.XAxis])})
                .attr("cy", function(d) {return yScale(d[specs.YAxis])})
                .attr("r", specs.markSize)
                .attr("fill", function(d) {return specs.selected.includes(d.id) ? "yellow" : colorScale(d[specs.Color])})
                .attr("stroke", "black")
                .attr("stroke-width", specs.strokeWidth)        
    }
}

// helper for the scatter plot creation, adds interactive behavior to the points
function interactScatterplotCircles(svg, specs, colorScale)
{
    svg.selectAll("circle")
        .on('mouseover', function(d, i) 
        {
            // create tooltip text
            let t = getTooltipText(specs, i)

            t += `${specs.XAxis}: ${i[specs.XAxis]}\n`
            t += `${specs.YAxis}: ${i[specs.YAxis]}\n`
            t += `${specs.Color}: ${i[specs.Color]}`

            // add new tooltip
            d3.select(this)
              .raise()
              .attr("r", specs.markSize*1.5)
              .attr("stroke", "yellow")
              .attr("stroke-width", specs.strokeWidth * 1.5)
              .append("svg:title")
              .text(t)
        })
        .on('mouseout', function(d, i) 
        {
            // revert back to previous appearance, remove title
            d3.select(this)
                .attr("r", specs.markSize)
                .attr("stroke", "black")
                .selectAll("*").remove()
        })
        .on("click", function(d, i) 
        {
            // if selected
            if (specs.selected.includes(i.id))
            {
                // turn back to normal color
                d3.select(this).attr("fill", function(d) {return colorScale(d[specs.Color])})

                // remove from selected
                specs.selected.splice(specs.selected.indexOf(i.id) ,1)

                if (specs.selector === teamScatterplotSpecs.selector)
                {
                    // redraw the hitter and pitcher views with the filtered data
                    drawScatterplotData(hitterScatterplotSpecs)
                    drawScatterplotData(pitcherScatterplotSpecs)

                    // remove team timeline and redraw
                    teamTimelineSpecs.selected.splice(teamTimelineSpecs.selected.indexOf(i.teamID), 1)
                    drawTimelineData(teamTimelineSpecs)
                }
                else if (specs.selector === hitterScatterplotSpecs.selector)
                {
                    // remove hitter timeline and redraw
                    hitterTimelineSpecs.selected.splice(hitterTimelineSpecs.selected.indexOf(i.playerID), 1)
                    drawTimelineData(hitterTimelineSpecs)
                }
                else 
                {
                    // remove pitcher timeline and redraw
                    pitcherTimelineSpecs.selected.splice(pitcherTimelineSpecs.selected.indexOf(i.playerID), 1)
                    drawTimelineData(pitcherTimelineSpecs)
                }
            }
            else // if not selected
            {
                // turn yellow
                d3.select(this).attr("fill","yellow")
 
                // add to selected
                specs.selected.push(i.id)

                if (specs.selector === teamScatterplotSpecs.selector)
                {
                    // redraw the hitter and pitcher views
                    drawScatterplotData(hitterScatterplotSpecs)
                    drawScatterplotData(pitcherScatterplotSpecs)

                    // select on timeline and redraw
                    teamTimelineSpecs.selected.push(i.teamID)
                    drawTimelineData(teamTimelineSpecs)
                }
                else if (specs.selector === hitterScatterplotSpecs.selector)
                {
                    // select on hitter timeline, redraw
                    hitterTimelineSpecs.selected.push(i.playerID)
                    drawTimelineData(hitterTimelineSpecs)
                }
                else 
                {
                    // select on pitcher timeline, redraw
                    pitcherTimelineSpecs.selected.push(i.playerID)
                    drawTimelineData(pitcherTimelineSpecs)
                }
            }
        })
}

// draws the scatter plot legend
function drawScatterplotLegend(svg, data, scale, stat, scatterSvg)
{
    // remove existing legend
    svg.selectAll("rect").remove()
    svg.selectAll("text").remove()

    // some setup
    let min = d3.min(data)
    let max = d3.max(data)
    let titleMargin = legendSvgSpecs.height * 0.05
    let rectWidth = legendSvgSpecs.width * 0.22
    let rectHeight = legendSvgSpecs.height * 0.15 // to make room for 5 color rects and labels
    let labelMargin = 0.5 * (legendSvgSpecs.height - 5 * rectHeight)
    let widthMargin = 0.2 * legendSvgSpecs.width

    // calculate the cutoffs including min and max
    let cutoffs = scale.quantiles()
    cutoffs.push(max)
    cutoffs.reverse()
    cutoffs.push(min)

    // make title
    svg.append("text")
        .attr("x", widthMargin)
        .attr("y", + titleMargin)
        .text(stat)
        .attr("class", "legendTitle")

    // loop through every color, make swatch
    let colors = scale.range().toReversed()
    for (let i = 0; i < colors.length; i++)
    {
        // put rect
        svg.append("rect")
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .attr("x", widthMargin)
            .attr("y", labelMargin + rectHeight*i)
            .attr("fill", colors[i])
            .attr("stroke", "black")
            .on('mouseover', function(d) 
            {
                // make all colors swatches faded
                svg.selectAll("rect").attr("opacity", 0.2)

                // add new tooltip
                d3.select(this)
                    .attr("opacity", 1) // unfade this one
                    .append("svg:title")
                    .text(`${stat}: ${cutoffs[i+1]}-${cutoffs[i]}`)

                // make all other colors faded
                scatterSvg.selectAll("circle")
                            .each(function(d)
                            {
                                if (d.colorGroup != (colors.length - 1 - i))
                                {
                                    d3.select(this).attr("opacity", 0.1)
                                }
                            })             
            })
            .on('mouseout', function(d) 
            {
                // remove tooltip
                d3.select(this).selectAll("*").remove()

                // make everything not faded
                svg.selectAll("rect").attr("opacity", 1)
                scatterSvg.selectAll("circle").attr("opacity", 1)  
            })
    }

    // loop through cutoffs and make labels
    for (let i = 0; i < cutoffs.length; i++)
    {
        svg.append("text")
            .attr("x", widthMargin + rectWidth + 5)
            .attr("y", labelMargin + rectHeight*i)
            .text(cutoffs[i])
            .attr("class", "legendTick")
            .style("alignment-baseline", "middle")
    }
}



/* ----------------------------- DATA FILTERING / CLEANING -------------------------------------------------------------------- */



// remove a filter from specs
function removeFilter(specs, field)
{
    // loop through existing filters
    for (let i = 0; i < specs.filters.length; i++)
    {
        // if the filter has been found, remove it and return
        if (specs.filters[i].field === field)
        {
            specs.filters[i].type = null
            return
        }
    }
}

// takes specs and adds a filter to it
function addFilter(specs, type, field, values)
{
    // loop through existing filters
    for (let i = 0; i < specs.filters.length; i++)
    {
        // if the filter exists, update type and value and return
        if (specs.filters[i].field === field)
        {
            specs.filters[i].values = values
            specs.filters[i].type = type
            return
        }
    }

    // if we reach here in the code, a filter for this field doesn't exist. need to add it
    specs.filters.push(
    {
        field: field,
        type: type,
        values: values
    })
}

// returns data from specs filtered based on filters from specs
function getFilteredData(specs)
{
    // filter the data from specs
    return specs.data.filter(function (d) 
    {
        // if we are in hitter or pitcher plot, gotta check for teams if any are selected
        if (teamScatterplotSpecs.selected.length > 0 && (specs.selector === hitterScatterplotSpecs.selector || specs.selector === pitcherScatterplotSpecs.selector))
        {
            let inTeams = false

            // loop through all the selected teams
            for (let i = 0; i < teamScatterplotSpecs.selected.length; i++)
            {
                // check if player was on team
                let f = teamScatterplotSpecs.selected[i]
                if (`${d.teamID}-${d.yearID}` === f)
                {
                    // if player was, we good
                    inTeams = true
                    break
                }
            }

            // if false at this point, player was not on any selected teams
            if (!inTeams) { return false }
        }

        // loop through every filter in the filters
        for (let i = 0; i < specs.filters.length; i++)
        {
            let f = specs.filters[i]
            if (f.type === "equal" || f.type === "boolean")
            {
                // if not equal, this data gets filtered out
                if (d[f.field] != f.values[0]) { return false }
            }
            else if (f.type === "range")
            {
                // if outside the range, this data gets filtered out
                if (d[f.field] < f.values[0] || d[f.field] > f.values[1]) { return false }
            }
        }

        // if made it through all the filters, data stays in
        return true
    })
}

// takes a raw dataset and cleans it according to the specs
function cleanData(dataset, specs, yesString)
{
// read and format team data
  let data = dataset
  for (let i = 0; i < data.length; i++)
  {
    let d = data[i]
    
    // make the quantitative variables numeric
    for (let j = 0; j < specs.fields.quantitative.length; j++)
    {
        let num = +d[specs.fields.quantitative[j]]
        if (!Number.isInteger(num)) { num = +num.toFixed(3)}
        d[specs.fields.quantitative[j]] = +num
    }

    // make the booleans a real boolean
    for (let j = 0; j < specs.fields.boolean.length; j++)
    {
        d[specs.fields.boolean[j]] == yesString ? d[specs.fields.boolean[j]] = true : d[specs.fields.boolean[j]] = false
    }

    // add id field
    if (specs.selector === teamScatterplotSpecs.selector)
    {
        d.id = `${d.teamID}-${d.yearID}`
    }
    else if (specs.selector === hitterScatterplotSpecs.selector || specs.selector === pitcherScatterplotSpecs.selector)
    {
        d.id = `${d.nameFirst}${d.nameLast}-${d.teamID}-${d.yearID}`
    }
  }
  return data
}



/* ----------------------------- CONTROLS -------------------------------------------------------------------- */

// sets up dropdown menu for specs depending on type
function setupDropdowns(specs)
{
    // setup the axis dropdowns depending on type
    specs.type === "scatter" ? setupScatterplotDropdowns(specs) : setupTimelineDropdown(specs)

    // setup the other dropdown
    d3.select(`#${specs.selector}Dropdown`)
    .selectAll("option")
    .data(specs.dropdownOptions)
    .enter()
    .append("option")
    .attr("value", function(d) 
    {
        // if this is the initial selected field for this encoding, select it!
        if (d === "All") 
        {
            d3.select(this).attr("selected", true)
        }

        return d
    })
    .text(d => d)

    // use jquery to format and setup filtering on change
    $(function ()
    {
        $(`#${specs.selector}Dropdown`).selectmenu(
        {
            change: function( event, data ) 
            {
                // if all, remove filter, otherwise add it
                data.item.value === "All" ? removeFilter(specs, specs.dropdownStat) : addFilter(specs, "equal", specs.dropdownStat, [data.item.value])
                specs.type === "scatter" ? drawScatterplotData(specs) : drawTimelineData(specs)
            }
        })
    })
}

// sets up the dropdown menu for a timeline plot
function setupTimelineDropdown(specs)
{
    // use d3 to put the options in
    d3.select(`#${specs.selector}YAxis`)
        .selectAll("option")
        .data(specs.fields)
        .enter()
        .append("option")
        .attr("value", function(d) 
        {
            // if this is the initial selected field for this encoding, select it!
            if (d === specs.YAxis) 
            {
                d3.select(this).attr("selected", true)
            }

            return d
        })
        .text(d => d)

    // use jquery to control selection
    $(function ()
    {
        $(`#${specs.selector}YAxis`).selectmenu(
        {
            change: function( event, data ) 
            {
                specs.YAxis = data.item.value
                drawTimelineData(specs)
            }
        })
    })
}

// handles checkboxes
function checkboxHandler(cb, specs, field)
{
    if (cb.checked)
    {
        // if checked on, add the filter
        addFilter(specs, "boolean", field, [true])
    }
    else
    {
        // otherwise, remove
        removeFilter(specs, field)
    }

    // redraw the data
    specs.type === "scatter" ? drawScatterplotData(specs) : drawTimelineData(specs)
}

// sets up the dropdown menus for a plot using jquery
function setupScatterplotDropdowns(specs)
{
    // setup the encoded variable dropdown menus
    let encodings = ["XAxis", "YAxis", "Color"]
    for (let i = 0; i < encodings.length; i++)
    {
        // use d3 to put all the options in!
        d3.select(`#${specs.selector}${encodings[i]}`)
            .selectAll("option")
            .data(specs.fields.quantitative)
            .enter()
            .append("option")
            .attr("value", function(d) 
            {
                // if this is the initial selected field for this encoding, select it!
                if (d === specs[encodings[i]]) 
                {
                    d3.select(this).attr("selected", true)
                }

                return d
            })
            .text(d => d)

        // use jquery to format and setup filtering on change
        $(function ()
        {
            $(`#${specs.selector}${encodings[i]}`).selectmenu(
            {
                change: function( event, data ) 
                {
                    specs[encodings[i]] = data.item.value
                    drawScatterplotData(specs)
                }
            })
        })
    }
}

// sets up slider range for plot given spec input
function setupSlider(specs)
{
    // use jquery to set up slider range for plate appearances for hitters
    let extent = d3.extent(specs.data, d => d[specs.sliderStat])
    $(function () 
    {
        // initialize min and max labels
        $(`#${specs.selector}SliderMin`).text(extent[0])
        $(`#${specs.selector}SliderMax`).text(extent[1])

        // slider itself
        $(`#${specs.selector}Slider`).slider(
        {
            range: true,
            min: extent[0],
            max: extent[1],
            values: extent,
            slide: function (event, ui) 
            {
                // slider min and max labels change when slid
                $(`#${specs.selector}SliderMin`).text(ui.values[0])
                $(`#${specs.selector}SliderMax`).text(ui.values[1])

                // add filter to data
                addFilter(specs, "range", specs.sliderStat, ui.values)

                // redraw data
                specs.type === "scatter" ? drawScatterplotData(specs) : drawTimelineData(specs)
            }
        });
    })
}

// handles reset buttons for scatterplots
function scatterplotReset(scatterSpecArr, timelineSpec)
{
    // get the scatterplot this was clicked from
    let specs = scatterSpecArr[0]

    // reset controls
    controlsReset(specs)

    // reset the selected and filters for this scatterplot
    specs.filters = []
    specs.selected = []

    // redraw whichever scatterplots need to be redrawn
    scatterSpecArr.forEach(s => drawScatterplotData(s))

    // reset selected and filters for associated timeline
    timelineSpec.selected = []
    timelineSpec.legendStart = 0

    // redraw timeline
    drawTimelineData(timelineSpec)
}

// handles reset buttons for timelines
function timelineReset(specs)
{
    controlsReset(specs)
    specs.filters = []
    drawTimelineData(specs)
}

// helper for both reset buttons, resets the controls displayed on screen (slider, dropdown, checkbox)
function controlsReset(specs)
{
    // reset the splider
    let extent = d3.extent(specs.data, d => d[specs.sliderStat])
    $(function () 
    {
        // reset min and max labels
        $(`#${specs.selector}SliderMin`).text(extent[0])
        $(`#${specs.selector}SliderMax`).text(extent[1])

        // reset slider values itself itself
        $(`#${specs.selector}Slider`).slider("values", 0, extent[0])
        $(`#${specs.selector}Slider`).slider("values", 1, extent[1])

    })

    // reset the dropdown
    $(function ()
    {
        $(`#${specs.selector}Dropdown`).val('All');
        $(`#${specs.selector}Dropdown`).selectmenu("refresh");
    })

    // reset the checkbox
    document.getElementById(`${specs.selector}Checkbox`).checked = false

}



/* ----------------------------- STAT KEY TABLES  -------------------------------------------------------------------- */



function setupTable(data, selector)
{
    // get table
    let tbl = document.getElementById(`${selector}Table`)

    // setup table header
    let tr = tbl.insertRow()
    let td = tr.insertCell()
    td.appendChild(document.createTextNode("Abbreviation"))
    td = tr.insertCell()
    td.appendChild(document.createTextNode("Full"))

    // add data
    for (let i = 0; i < data.length; i++)
    {
        tr = tbl.insertRow()
        let td = tr.insertCell()
        td.appendChild(document.createTextNode(data[i].abbreviation))
        td = tr.insertCell()
        td.appendChild(document.createTextNode(data[i].full))
    }
}
