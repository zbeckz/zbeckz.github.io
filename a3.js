// plot specifications for the team scatter plot
let teamScatterplotSpecs =
{
    // either scatter or timeline, used for setup
    type: "scatter",

    // data schema used to setup the sliders / dropdowns
    fields: 
    {
        nominative: ["lgID", "teamID", "divID", "franchName"],
        boolean: ["DivWin", "WCWin", "LgWin", "WSWin"],
        quantitative: ["yearID", "G", "W", "L", "R", "PA", "AB", "H", "2B", "3B", "HR", "TB", "BB", "SO", "SB", "CS", "SB%", "HBP", "SF", "AVG", "OBP", "SLG", "OPS", "RA", "ER", "ERA", "CG", "SHO", "SV", "HA", "HRA", "BBA", "SOA", "DP", "Rank"]
    },

    // prefix to html id for elements within this plot
    selector: "teams",

    // svg size specs
    margin: 
    {
        top: 20, 
        right: 20, 
        bottom: 20, 
        left: 40
    },
    width: 300,
    height: 300,

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

    // here but empty to not break code later
    positions: [],

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
        nominative: ["playerID", "teamID", "nameFirst", "nameLast", "bats", "throws", "birthCountry", "position"],
        boolean: ["allstar"],
        quantitative: ["yearID", "G", "PA", "AB", "R", "H", "2B", "3B", "HR", "RBI", "SB", "CS", "SB%", "BB", "SO", "TB", "AVG", "OBP", "SLG", "OPS", "IBB", "HBP", "SF", "weight", "height"]
    },

    // prefix to html id for elements within this plot
    selector: "hitters",

    // svg size specs
    margin: 
    {
        top: 20, 
        right: 20, 
        bottom: 20, 
        left: 40
    },
    width: 300,
    height: 300,

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

    // for the position dropdown
    positions: ["All", "1B", "2B", "3B", "SS", "C", "LF", "RF", "CF"],

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
        nominative: ["playerID", "teamID", "nameFirst", "nameLast", "bats", "throws", "birthCountry", "position"],
        boolean: ["allstar"],
        quantitative: ["yearID", "W", "L", "G", "GS", "CG", "SHO", "SV", "H", "ER", "HR", "BB", "SO", "BAOpp", "ERA", "HBP", "GF", "R", "weight", "height", "IP"]
    },

    // prefix to html id for elements within this plot
    selector: "pitchers",

    // svg size specs
    margin: 
    {
        top: 20, 
        right: 20, 
        bottom: 20, 
        left: 40
    },
    width: 300,
    height: 300,

    // which stats are being encoded to the scatterplot
    XAxis: "BAOpp",
    YAxis: "ERA",
    Color: "W",

    // stats to display on tooltip
    tooltipDisplay: [{name: "First Name: ", stat: "nameFirst"}, {name:"Last Name: ", stat:"nameLast"}, {name:"Team: ", stat:"teamID"}, {name:"Year: ", stat:"yearID"}, {name: "IP: ", stat:"IP"}],

    // filters to apply to pitching data before plotting
    filters: [],

    // all the pitching data
    data: [],

    // what stat does the slider control
    sliderStat: "IP",

    // for the position dropdown
    positions: ["All", "SP", "RP"],

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

    // svg size specs
    margin: 
    {
        top: 20, 
        right: 20, 
        bottom: 20, 
        left: 40
    },
    width: 350,
    height: 300,

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

    // average for each field for each year
    averages: [],

    // which stats to display on the tooltip
    tooltipDisplay: [{name: "Team: ", stat: "teamID"}],

    // svg element specs
    pathSize: 2,
    markSize: 3
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

    // svg size specs
    margin: 
    {
        top: 20, 
        right: 20, 
        bottom: 20, 
        left: 40
    },
    width: 350,
    height: 300,

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

    // average for each field for each year
    averages: [],

    // what to display on the tooltip
    tooltipDisplay: [{name: "First Name: ", stat: "nameFirst"}, {name: "Last Name: ", stat: "nameLast"}, {name: "Team: ", stat:"teamID"}],

    // svg element specs
    pathSize: 2,
    markSize: 3
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

    // svg size specs
    margin: 
    {
        top: 20, 
        right: 20, 
        bottom: 20, 
        left: 40
    },
    width: 350,
    height: 300,

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

    // average for each field for each year
    averages: [],

    // what fields to display on the tooltip
    tooltipDisplay: [{name: "First Name: ", stat: "nameFirst"}, {name: "Last Name: ", stat: "nameLast"}, {name: "Team: ", stat:"teamID"}],

    // sizes for svg elements
    pathSize: 2,
    markSize: 3
}

// this is the only code that gets run on start. sets everything up!
initialize()

// load data, set up plots
async function initialize() 
{
  // read in the data
  let hitters = await d3.csv("data/Hitters2010s.csv");
  let pitchers = await d3.csv("data/Pitchers2010s.csv");
  let teams = await d3.csv("data/Teams2010s.csv");

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

// can set up any of the plots given specs
function setupPlot(specs)
{
    // setup the svg
    d3.select(`#${specs.selector}Plot`)
        .append("svg")
            .attr("width", specs.width)
            .attr("height", specs.height)
        .append("g")
            .attr("transform", `translate(${specs.margin.left}, ${specs.margin.top})`);

    if (specs.type === "scatter")
    {
        // setup the dropdown menus
        setupScatterplotDropdowns(specs)

        // setup the slider range (function handles whether or not it happens depending on spec input)
        setupScatterplotSlider(specs)
    }
    else if (specs.type === "timeline")
    {
        // setup the dropdown menu
        setupTimelineDropdown(specs)
    }
}

// given specs, makes the appropriate timeline plot
function drawTimelineData(specs)
{
    // get the chart
    let svg = d3.select(`#${specs.selector}Plot svg g`)

    // remove existing circles
    svg.selectAll("circle").remove()

    // remove existing path
    svg.selectAll("path").remove()

    // scale based on all teams
    let xScale = d3.scaleLinear()
                    .domain(d3.extent(specs.data, function (d) { return d.yearID }))
                    .range([0, specs.width - specs.margin.left - specs.margin.right])

    let yScale = d3.scaleLinear()
                    .domain(d3.extent(specs.data, function (d) { return d[specs.YAxis] }))
                    .range([specs.height - specs.margin.top - specs.margin.bottom, 0])

    // create the axes
    drawAxes(svg, specs, xScale, yScale)

    // create the average timeline and points
    drawAverageTimeline(svg, specs, xScale, yScale)

    // if no team is selected, don't actually plot any data
    if (specs.selected.length == 0) { return }

    // setup array to contain each individual array for each selected entity
    let paths = getPaths(specs)

    // draw all of the paths
    for (let i = 0; i < paths.length; i++)
    {
        let data = paths[i]

        drawDataTimeline(svg, specs, data, xScale, yScale)
    }
}

// given specs, makes the appropriate scatterplot
function drawScatterplotData(specs)
{
    // get filtered data
    let data = getFilteredData(specs)

    // get the chart
    let svg = d3.select(`#${specs.selector}Plot svg g`)

    // remove existing titles
    svg.selectAll("title").remove()

    // scale the data
    let xScale = d3.scaleLinear()
                    .domain(d3.extent(data, function (d) { return d[specs.XAxis] }))
                    .range([0, specs.width - specs.margin.left - specs.margin.right])
    let yScale = d3.scaleLinear()
                    .domain(d3.extent(data, function (d) { return d[specs.YAxis] }))
                    .range([specs.height - specs.margin.top - specs.margin.bottom, 0])
    let colorScale = d3.scaleLinear()
                    .domain(d3.extent(data, function(d) { return d[specs.Color] }))
                    .range(["blue", "red"])

    // draw axes
    drawAxes(svg, specs, xScale, yScale)

    // draw circles
    drawScatterplotCircles(svg, specs, data, xScale, yScale, colorScale)

    // add interactions to the circles
    interactScatterplotCircles(svg, specs, colorScale)
}

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

// calculate averages of every stat per year for given timeline specs
function calculateTimelineAverages(specs)
{
    // loop through all the possible fields to show
    for (let i = 0; i < specs.fields.length; i++)
    {
        // get the field
        let f = specs.fields[i]

        // loop through each year
        for (let y = 2010; y <= 2019; y++)
        {
            // filter by year
            let yearData = specs.data.filter(d => d.yearID === y)

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

    // setup position dropdown
    d3.select(`#${specs.selector}Pos`)
        .selectAll("option")
        .data(specs.positions)
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
         $(`#${specs.selector}Pos`).selectmenu(
         {
             change: function( event, data ) 
             {
                // if all, remove filter, otherwise add it
                data.item.value === "All" ? removeFilter(specs, "position") : addFilter(specs, "equal", "position", [data.item.value])
                drawScatterplotData(specs)
             }
         })
     })
}

// sets up slider range for plot given spec input
function setupScatterplotSlider(specs)
{
    // use jquery to set up slider range for plate appearances for hitters
    let extent = d3.extent(specs.data, d => d[specs.sliderStat])
    $(function () 
    {
        // initialize min and max labels
        $(`#${specs.selector}${specs.sliderStat}Min`).text(extent[0])
        $(`#${specs.selector}${specs.sliderStat}Max`).text(extent[1])

        // slider itself
        $(`#${specs.selector}${specs.sliderStat}`).slider(
        {
            range: true,
            min: extent[0],
            max: extent[1],
            values: extent,
            slide: function (event, ui) 
            {
                // slider min and max labels change when slid
                $(`#${specs.selector}${specs.sliderStat}Min`).text(ui.values[0])
                $(`#${specs.selector}${specs.sliderStat}Max`).text(ui.values[1])

                // add filter to data
                addFilter(specs, "range", specs.sliderStat, ui.values)

                // redraw data
                drawScatterplotData(specs)
            }
        });
    })
}

// returns data from specs filtered based on filters from specs
function getFilteredData(specs)
{
    // filter the data from specs
    let data = specs.data.filter(function (d) 
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

    return data
}

// handle the team view checkbox
function worldSeriesCheckbox(cb)
{
    if (cb.checked)
    {
        // if checked on, add the filter
        addFilter(teamScatterplotSpecs, "boolean", "WSWin", [true])
    }
    else
    {
        // otherwise, remove
        removeFilter(teamScatterplotSpecs, "WSWin")
    }

    // redraw the data
    drawScatterplotData(teamScatterplotSpecs)
}

// handle the hitters view checkbox
function hittersCheckbox(cb)
{
    if (cb.checked)
    {
        // if checked on, add the filter
        addFilter(hitterScatterplotSpecs, "boolean", "allstar", [true])
    }
    else
    {
        // otherwise, remove
        removeFilter(hitterScatterplotSpecs, "allstar")
    }

    // redraw the data
    drawScatterplotData(hitterScatterplotSpecs)
}

// handle the pitchers view checkbox
function pitchersCheckbox(cb)
{
    if (cb.checked)
    {
        // if checked on, add the filter
        addFilter(pitcherScatterplotSpecs, "boolean", "allstar", [true])
    }
    else
    {
        // otherwise, remove
        removeFilter(pitcherScatterplotSpecs, "allstar")
    }

    // redraw the data
    drawScatterplotData(pitcherScatterplotSpecs)
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

// make axes given svg and specs and scales
function drawAxes(svg, specs, xScale, yScale)
{
    // remove existing axes
    svg.selectAll(".axis").remove()

    // add x axis
    svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${specs.height - specs.margin.top - specs.margin.bottom})`)
    .call(d3.axisBottom(xScale));

    // add y axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale));
}

// helper for the scatter plot creation, draws the points
function drawScatterplotCircles(svg, specs, data, xScale, yScale, colorScale)
{
    // add circles for each point
    let circle = svg.selectAll("circle")
                .data(data, d => d.id)

    // remove circles that were not connected via id
    circle.exit().remove()

    // transition the circles that were connected via id
    circle.transition()
        .duration(1000)
        .ease(d3.easeQuadInOut)
        .attr("cx", function(d) {return xScale(d[specs.XAxis])})
        .attr("cy", function(d) {return yScale(d[specs.YAxis])})
        .attr("r", specs.markSize)
        .attr("fill", function(d) {return specs.selected.includes(d.id) ? "yellow" : colorScale(d[specs.Color])})
        .attr("stroke", "black")
        .attr("stroke-width", specs.strokeWidth)

    // add circles for the data that was not connected via id
    circle.enter().append("circle")
        .attr("cx", function(d) {return xScale(d[specs.XAxis])})
        .attr("cy", function(d) {return yScale(d[specs.YAxis])})
        .attr("r", specs.markSize)
        .attr("fill", function(d) {return specs.selected.includes(d.id) ? "yellow" : colorScale(d[specs.Color])})
        .attr("stroke", "black")
        .attr("stroke-width", specs.strokeWidth)
}

// helper for the scatter plot creation, adds interactive behavior to the points
function interactScatterplotCircles(svg, specs, colorScale)
{
    svg.selectAll("circle")
        .on('mouseover', function(d, i) 
        {
            // create tooltip text
            let t = ""
            for (let j = 0; j < specs.tooltipDisplay.length; j++)
            {
                t += specs.tooltipDisplay[j].name
                t += i[specs.tooltipDisplay[j].stat]
                t += "\n"
            }
            t += `${specs.XAxis}: ${i[specs.XAxis]}\n`
            t += `${specs.YAxis}: ${i[specs.YAxis]}\n`
            t += `${specs.Color}: ${i[specs.Color]}`

            // add new tooltip
            d3.select(this)
              .raise()
              .attr("r", specs.markSize*1.5)
              .attr("stroke", "yellow")
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

// helper for timeline plot creation, makes path and squares for the average
function drawAverageTimeline(svg, specs, xScale, yScale)
{
    // remove existing rects
    svg.selectAll("rect").remove()

    // add the average timeline
    let avg = specs.averages.filter(d => d.field === specs.YAxis)
    svg.append("path")
      .datum(avg)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", specs.pathSize)
      .attr("d", d3.line()
                    .x(function(d) { return xScale(d.yearID) })
                    .y(function(d) { return yScale(d.value) }))

    // add the average points
    svg.append("g").selectAll("rect")
        .data(avg)
        .enter()
        .append("rect")
        .attr("x", function(d) {return xScale(d.yearID) - specs.markSize})
        .attr("y", function(d) {return yScale(d.value) - specs.markSize})
        .attr("width", specs.markSize * 2)
        .attr("height", specs.markSize * 2)
        .attr("fill", "orange")
        .attr("stroke", "black")
        .attr("stroke-width", 0)
        .on('mouseover', function(d, i) 
        {
            // create tooltip text
            let t = `Year: ${i.yearID}\nAverage ${specs.YAxis}: ${i.value}`

            // add new tooltip
            d3.select(this)
              .raise()
              .attr("x", function(d) {return xScale(d.yearID) - specs.markSize * 1.25})
              .attr("y", function(d) {return yScale(d.value) - specs.markSize * 1.25})
              .attr("width", specs.markSize * 2.5)
              .attr("height", specs.markSize * 2.5)
              .attr("stroke-width", 0.5)
              .append("svg:title")
              .text(t)
        })
        .on('mouseout', function(d, i) 
        {
            // revert back to previous appearance, remove title
            d3.select(this)
                .attr("x", function(d) {return xScale(d.yearID) - specs.markSize})
                .attr("y", function(d) {return yScale(d.value) - specs.markSize})
                .attr("width", specs.markSize * 2)
                .attr("height", specs.markSize * 2)
                .attr("stroke-width", 0)
                .selectAll("*").remove()
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

// helper for timeline plot creation, draws path and circles for an entity
function drawDataTimeline(svg, specs, data, xScale, yScale)
{
    // add the selected timeline
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", specs.pathSize)
        .attr("d", d3.line()
                    .x(function(d) { return xScale(d.yearID) })
                    .y(function(d) { return yScale(d[specs.YAxis]) }))

    // add the selected points
    svg.append("g").selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {return xScale(d.yearID)})
        .attr("cy", function(d) {return yScale(d[specs.YAxis])})
        .attr("r", specs.markSize)
        .attr("fill", "steelblue")
        .attr("stroke", "black")
        .attr("stroke-width", 0)
        .on('mouseover', function(d, i) 
        {
            // create tooltip text
            let t = `Year: ${i.yearID}\n`
            for (let j = 0; j < specs.tooltipDisplay.length; j++)
            {
                t += specs.tooltipDisplay[j].name
                t += i[specs.tooltipDisplay[j].stat]
                t += "\n"
            }
            t += `${specs.YAxis}: ${i[specs.YAxis]}`

            // add new tooltip
            d3.select(this)
                .raise()
                .attr("r", specs.markSize * 1.5)
                .attr("stroke-width", 0.5)
                .append("svg:title")
                .text(t)
        })
        .on('mouseout', function(d, i) 
        {
            // revert back to previous appearance, remove title
            d3.select(this)
                .attr("r", specs.markSize)
                .attr("stroke-width", 0)
                .selectAll("*").remove()
        })
}
