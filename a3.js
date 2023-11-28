// data schema and plot specs
let teamPlotSpecs =
{
    type: "scatter",

    fields: 
    {
        nominative: ["lgID", "teamID", "divID", "franchName"],
        boolean: ["DivWin", "WCWin", "LgWin", "WSWin"],
        quantitative: ["yearID", "G", "W", "L", "R", "PA", "AB", "H", "2B", "3B", "HR", "TB", "BB", "SO", "SB", "CS", "SB%", "HBP", "SF", "AVG", "OBP", "SLG", "OPS", "RA", "ER", "ERA", "CG", "SHO", "SV", "HA", "HRA", "BBA", "SOA", "DP", "Rank"]
    },

    selector: "teams",

    margin: 
    {
        top: 20, 
        right: 20, 
        bottom: 20, 
        left: 40
    },

    width: 300,
    height: 300,

    XAxis: "R",
    YAxis: "RA",
    Color: "W",

    tooltipDisplay: [{name: "Team: ", stat: "franchName"}, {name:"Year: ", stat:"yearID"}],

    filters: [],

    data: [],

    selected: null,

    sliderStat: "W",

    positions: []
}

let hitterPlotSpecs =
{
    type: "scatter",
    
    fields:
    {
        nominative: ["playerID", "teamID", "nameFirst", "nameLast", "bats", "throws", "birthCountry", "position"],
        boolean: ["allstar"],
        quantitative: ["yearID", "G", "PA", "AB", "R", "H", "2B", "3B", "HR", "RBI", "SB", "CS", "SB%", "BB", "SO", "TB", "AVG", "OBP", "SLG", "OPS", "IBB", "HBP", "SF", "weight", "height"]
    },

    selector: "hitters",

    margin: 
    {
        top: 20, 
        right: 20, 
        bottom: 20, 
        left: 40
    },

    width: 300,
    height: 300,

    XAxis: "HR",
    YAxis: "RBI",
    Color: "OPS",

    tooltipDisplay: [{name: "First Name: ", stat: "nameFirst"}, {name:"Last Name: ", stat:"nameLast"}, {name:"Team: ", stat:"teamID"}, {name:"Year: ", stat:"yearID"}],

    filters: [],

    data: [],

    sliderStat: "PA",

    positions: ["All", "1B", "2B", "3B", "SS", "C", "LF", "RF", "CF"]
}

let pitcherPlotSpecs =
{
    type: "scatter",
    
    fields:
    {
        nominative: ["playerID", "teamID", "nameFirst", "nameLast", "bats", "throws", "birthCountry", "position"],
        boolean: ["allstar"],
        quantitative: ["yearID", "W", "L", "G", "GS", "CG", "SHO", "SV", "H", "ER", "HR", "BB", "SO", "BAOpp", "ERA", "HBP", "GF", "R", "weight", "height", "IP"]
    },

    selector: "pitchers",

    margin: 
    {
        top: 20, 
        right: 20, 
        bottom: 20, 
        left: 40
    },

    width: 300,
    height: 300,

    XAxis: "BAOpp",
    YAxis: "ERA",
    Color: "W",

    tooltipDisplay: [{name: "First Name: ", stat: "nameFirst"}, {name:"Last Name: ", stat:"nameLast"}, {name:"Team: ", stat:"teamID"}, {name:"Year: ", stat:"yearID"}],

    filters: [],

    data: [],

    sliderStat: "IP",

    positions: ["All", "SP", "RP"]
}

let teamTimelineSpecs = 
{
    type: "timeline",

    selector: "teamTimeline",

    idField: "teamID",

    margin: 
    {
        top: 20, 
        right: 20, 
        bottom: 20, 
        left: 40
    },

    width: 350,
    height: 300,

    fields: ["G", "W", "L", "R", "PA", "AB", "H", "2B", "3B", "HR", "TB", "BB", "SO", "SB", "CS", "SB%", "HBP", "SF", "AVG", "OBP", "SLG", "OPS", "RA", "ER", "ERA", "CG", "SHO", "SV", "HA", "HRA", "BBA", "SOA", "DP", "Rank"],

    rateFields: [],

    YAxis: "W",

    selected: null,

    data: [],

    averages: [],

    tooltipDisplay: [{name: "Team: ", stat: "teamID"}],
}

let hitterTimelineSpecs = 
{
    type: "timeline",

    selector: "hitterTimeline",

    idField: "playerID",

    margin: 
    {
        top: 20, 
        right: 20, 
        bottom: 20, 
        left: 40
    },

    width: 350,
    height: 300,

    fields: ["G", "PA", "AB", "R", "H", "2B", "3B", "HR", "RBI", "SB", "CS", "SB%", "BB", "SO", "TB", "AVG", "OBP", "SLG", "OPS", "IBB", "HBP", "SF"],

    rateFields: ["SB%", "AVG", "OBP", "SLG", "OPS"],

    rateWeightField: ["PA"],

    YAxis: "HR",

    selected: null,

    data: [],

    averages: [],

    tooltipDisplay: [{name: "First Name: ", stat: "nameFirst"}, {name: "Last Name: ", stat: "nameLast"}],
}

let pitcherTimelineSpecs = 
{
    type: "timeline",

    selector: "pitcherTimeline",

    idField: "playerID",

    margin: 
    {
        top: 20, 
        right: 20, 
        bottom: 20, 
        left: 40
    },

    width: 350,
    height: 300,

    fields: ["W", "L", "G", "GS", "CG", "SHO", "SV", "H", "ER", "HR", "BB", "SO", "BAOpp", "ERA", "HBP", "GF", "R", "IP"],

    rateFields: ["BAOpp", "ERA"],

    rateWeightField: ["IP"],

    YAxis: "W",

    selected: null,

    data: [],

    averages: [],

    tooltipDisplay: [{name: "First Name: ", stat: "nameFirst"}, {name: "Last Name: ", stat: "nameLast"}],
}

initialize()

// load data, set up plots
async function initialize() 
{
  // read in the data
  let hitters = await d3.csv("data/Hitters2010s.csv");
  let pitchers = await d3.csv("data/Pitchers2010s.csv");
  let teams = await d3.csv("data/Teams2010s.csv");

  // now that we have the data, clean it for scatterplots
  hitterPlotSpecs.data = cleanData(hitters, hitterPlotSpecs, "yes")
  pitcherPlotSpecs.data = cleanData(pitchers, pitcherPlotSpecs, "yes")
  teamPlotSpecs.data = cleanData(teams, teamPlotSpecs, "Y")

  // set up scatter plots
  plotSetup(teamPlotSpecs)
  plotSetup(hitterPlotSpecs)
  plotSetup(pitcherPlotSpecs)

  // add intial data to the scatter plots with no filters
  scatterplotData(teamPlotSpecs)
  scatterplotData(hitterPlotSpecs)
  scatterplotData(pitcherPlotSpecs)

  // setup timeline data
  teamTimelineSpecs.data = teamPlotSpecs.data
  hitterTimelineSpecs.data = hitterPlotSpecs.data
  pitcherTimelineSpecs.data = pitcherPlotSpecs.data

  // calculate averages for timelines
  calculateAverage(teamTimelineSpecs)
  calculateAverage(hitterTimelineSpecs)
  calculateAverage(pitcherTimelineSpecs)

  // set up timeline plots
  plotSetup(teamTimelineSpecs)
  plotSetup(hitterTimelineSpecs)
  plotSetup(pitcherTimelineSpecs)

  // add initial data to timeline plots (should be blank to start)
  timelineData(teamTimelineSpecs)
  timelineData(hitterTimelineSpecs)
  timelineData(pitcherTimelineSpecs)
}

// can set up any of the plots given specs
function plotSetup(specs)
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
function timelineData(specs)
{
    // get the chart
    let svg = d3.select(`#${specs.selector}Plot svg g`)

    // remove existing axes
    svg.selectAll(".axis").remove()

    // remove existing path
    svg.selectAll("path").remove()

    // remove existing circles
    svg.selectAll("circle").remove()

    // scale based on all teams
    let xScale = d3.scaleLinear()
                    .domain(d3.extent(specs.data, function (d) { return d.yearID }))
                    .range([0, specs.width - specs.margin.left - specs.margin.right])

    let yScale = d3.scaleLinear()
                    .domain(d3.extent(specs.data, function (d) { return d[specs.YAxis] }))
                    .range([specs.height - specs.margin.top - specs.margin.bottom, 0])

    // add x axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${specs.height - specs.margin.top - specs.margin.bottom})`)
        .call(d3.axisBottom(xScale));

    // add y axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale));

    // if no team is selected, don't actually plot anything
    if (specs.selected === null) { return }

    // filter data down to only the selected entity
    let data = specs.data.filter(d => d[specs.idField] === specs.selected) 

    // sort by year
    data.sort((a, b) => a.yearID - b.yearID)

    // ensure players who played for mulitple teams in a given year have combined stats
    if (specs.rateFields.length > 0)
    {
        data = combineYears(specs, data)
    }

    // add the average timeline
    let avg = specs.averages.filter(d => d.field === specs.YAxis)
    svg.append("path")
      .datum(avg)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
                    .x(function(d) { return xScale(d.yearID) })
                    .y(function(d) { return yScale(d.value) }))

    // add the average points
    svg.append("g").selectAll("circle")
        .data(avg)
        .enter()
        .append("circle")
        .attr("cx", function(d) {return xScale(d.yearID)})
        .attr("cy", function(d) {return yScale(d.value)})
        .attr("r", 4)
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
              .attr("r", 5)
              .attr("stroke-width", 0.5)
              .append("svg:title")
              .text(t)
        })
        .on('mouseout', function(d, i) 
        {
            // revert back to previous appearance, remove title
            d3.select(this)
                .attr("r", 4)
                .attr("stroke-width", 0)
                .selectAll("*").remove()
        })

    // add the selected timeline
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
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
        .attr("r", 4)
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
              .attr("r", 5)
              .attr("stroke-width", 0.5)
              .append("svg:title")
              .text(t)
        })
        .on('mouseout', function(d, i) 
        {
            // revert back to previous appearance, remove title
            d3.select(this)
                .attr("r", 4)
                .attr("stroke-width", 0)
                .selectAll("*").remove()
        })
}

// given specs, makes the appropriate scatterplot
function scatterplotData(specs)
{
    // get filtered data
    let data = getFilteredData(specs)

    // get the chart
    let svg = d3.select(`#${specs.selector}Plot svg g`)

    // remove existing axes
    svg.selectAll(".axis").remove()

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

                    
    // add x axis
    svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${specs.height - specs.margin.top - specs.margin.bottom})`)
    .call(d3.axisBottom(xScale));

    // add y axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale));

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
        .attr("r", 4)
        .attr("fill", function(d) {return d.id === specs.selected ? "yellow" : colorScale(d[specs.Color])})
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)

    // add circles for the data that was not connected via id
    circle.enter().append("circle")
        .attr("cx", function(d) {return xScale(d[specs.XAxis])})
        .attr("cy", function(d) {return yScale(d[specs.YAxis])})
        .attr("r", 4)
        .attr("fill", function(d) {return d.id === specs.selected ? "yellow" : colorScale(d[specs.Color])})
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)

    // add interactions for the points
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
              .attr("r", 5)
              .attr("stroke", "yellow")
              .append("svg:title")
              .text(t)
        })
        .on('mouseout', function(d, i) 
        {
            // revert back to previous appearance, remove title
            d3.select(this)
                .attr("r", 4)
                .attr("stroke", "black")
                .selectAll("*").remove()
        })
        .on("click", function(d, i) 
        {
            if (i.id == specs.selected)
            {
                // turn back to normal, unselect
                d3.select(this).attr("fill", function(d) {return colorScale(d[specs.Color])})
                specs.selected = null

                unselect(specs)
            }
            else
            {
                // unselect whichever is currently selected
                svg.selectAll("circle").each(function(d1, i1) 
                {
                    if (d1.id == specs.selected)
                    {
                        d3.select(this).attr("fill", function(d2) {return colorScale(d2[specs.Color])})
                    }
                })

                // turn yellow, select
                d3.select(this).attr("fill","yellow")
                specs.selected = i.id

                select(specs, i)
            }
        })
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
function calculateAverage(specs)
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
    if (specs.selector === teamPlotSpecs.selector)
    {
        d.id = `${d.teamID}-${d.yearID}`
    }
    else if (specs.selector === hitterPlotSpecs.selector || specs.selector === pitcherPlotSpecs.selector)
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
                timelineData(specs)
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
                    scatterplotData(specs)
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
                scatterplotData(specs)
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
                scatterplotData(specs)
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
        addFilter(teamPlotSpecs, "boolean", "WSWin", [true])
    }
    else
    {
        // otherwise, remove
        removeFilter(teamPlotSpecs, "WSWin")
    }

    // redraw the data
    scatterplotData(teamPlotSpecs)
}

// handle the hitters view checkbox
function hittersCheckbox(cb)
{
    if (cb.checked)
    {
        // if checked on, add the filter
        addFilter(hitterPlotSpecs, "boolean", "allstar", [true])
    }
    else
    {
        // otherwise, remove
        removeFilter(hitterPlotSpecs, "allstar")
    }

    // redraw the data
    scatterplotData(hitterPlotSpecs)
}

// handle the pitchers view checkbox
function pitchersCheckbox(cb)
{
    if (cb.checked)
    {
        // if checked on, add the filter
        addFilter(pitcherPlotSpecs, "boolean", "allstar", [true])
    }
    else
    {
        // otherwise, remove
        removeFilter(pitcherPlotSpecs, "allstar")
    }

    // redraw the data
    scatterplotData(pitcherPlotSpecs)
}

// takes in data for a timeline, combines it for display when a player played for diff teams during the same year
function combineYears(specs, data)
{
    let init = data.shift()
    return data.reduce(function(acc, d)
    {
        let prevData = acc[acc.length - 1]
        let newData = d

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

// behavior for selecting a point in a scatterplot
function select(specs, i)
{
    if (specs.selector === teamPlotSpecs.selector)
    {
        // since a team has been selected, add team filter to hitter and pitcher
        addFilter(hitterPlotSpecs, "equal", "teamID", [i.teamID])
        addFilter(pitcherPlotSpecs, "equal", "teamID", [i.teamID])

        // since this is a team AND a year, also add the year
        addFilter(hitterPlotSpecs, "equal", "yearID", [i.yearID])
        addFilter(pitcherPlotSpecs, "equal", "yearID", [i.yearID])

        // redraw the hitter and pitcher views with the filtered data
        scatterplotData(hitterPlotSpecs)
        scatterplotData(pitcherPlotSpecs)

        // update hitter and pitcher plot titles
        document.getElementById("hittersPlotTitle").innerHTML = `Hitter Statistics: ${i.yearID} ${i.teamID}`
        document.getElementById("pitchersPlotTitle").innerHTML = `Pitcher Statistics: ${i.yearID} ${i.teamID}`

        // update team timeline plot title
        document.getElementById("teamTimelinePlotTitle").innerHTML = `Team Timeline: ${i.teamID}`

        // select on timeline, redraw
        teamTimelineSpecs.selected = i.teamID
        timelineData(teamTimelineSpecs)
    }
    else if (specs.selector === hitterPlotSpecs.selector)
    {
        // update timeline title
        document.getElementById("hitterTimelinePlotTitle").innerHTML = `Hitter Timeline: ${i.nameFirst} ${i.nameLast}`

        // select on hitter timeline, redraw
        hitterTimelineSpecs.selected = i.playerID
        timelineData(hitterTimelineSpecs)
    }
    else 
    {
        // update timeline title
        document.getElementById("pitcherTimelinePlotTitle").innerHTML = `Hitter Timeline: ${i.nameFirst} ${i.nameLast}`

        // select on pitcher timeline, redraw
        pitcherTimelineSpecs.selected = i.playerID
        timelineData(pitcherTimelineSpecs)
    }
}
// behavior for unselecting a point in a scatterplot
function unselect(specs)
{
    if (specs.selector === teamPlotSpecs.selector)
    {
        // since a team has been unselected, remove team filter from hitter and pitcher
        removeFilter(hitterPlotSpecs, "teamID")
        removeFilter(pitcherPlotSpecs, "teamID")

        // since this is a team AND a year, also remove the year
        removeFilter(hitterPlotSpecs, "yearID")
        removeFilter(pitcherPlotSpecs, "yearID")

        // redraw the hitter and pitcher views with the filtered data
        scatterplotData(hitterPlotSpecs)
        scatterplotData(pitcherPlotSpecs)

        // update hitter and pitcher plot titles
        document.getElementById("hittersPlotTitle").innerHTML = `Hitter Statistics`
        document.getElementById("pitchersPlotTitle").innerHTML = `Pitcher Statistics`

        // update team timeline plot title
        document.getElementById("teamTimelinePlotTitle").innerHTML = `Team Timeline`

        // remove team timeline and redraw
        teamTimelineSpecs.selected = null
        timelineData(teamTimelineSpecs)
    }
    else if (specs.selector === hitterPlotSpecs.selector)
    {
        // update timeline title
        document.getElementById("hitterTimelinePlotTitle").innerHTML = `Hitter Timeline`

        // remove hitter timeline and redraw
        hitterTimelineSpecs.selected = null
        timelineData(hitterTimelineSpecs)
    }
    else 
    {
        // update timeline title
        document.getElementById("pitcherTimelinePlotTitle").innerHTML = `Pitcher Timeline`

        // remove pitcher timeline and redraw
        pitcherTimelineSpecs.selected = null
        timelineData(pitcherTimelineSpecs)
    }
}