// Draws a circle on the canvas at a given location, with given radius and color
function drawCircle(x, y, radius, color)
{
    // start a path element
    context.beginPath();

    // draw an arc at position (x, y) with given radius, start angle 0, end angle 2pi.
    context.arc(x, y, radius, 0, 2 * Math.PI);

    // fill in the circle
    context.fillStyle = color;
    context.fill();
}

// Sets the canvas to the size of the window
function resizeCanvas()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Starts an interval for the home page project preview image slideshow
function setHomepageSlideshow()
{
    // set an interval
    setInterval(() => {
        // either move to next index, or to negative 1 if at end
        currentProjectPreview === projectData.length - 1 ? currentProjectPreview = -1 : currentProjectPreview++;

        // begin transition to fade out
        homePageProjectImg.style.opacity = '0%';
        
        // once transition is over, update the source image and begin faded in
        setTimeout(() => {
            homePageProjectImg.src = currentProjectPreview === -1 ? 'assets/code-snippet.png' : projectData[currentProjectPreview].previewImg;
            homePageProjectImg.style.opacity = '100%';
        }, homePageImageTransitionDuration);
    }, homePageSlideshowDelta)
}

// Creates new stars for a given part of the canvas
function createStars(xMin, xMax, yMin, yMax)
{
    // loop through the given range
    for (let i = xMin; i < xMax; i++)
    {
        for (let j = yMin; j < yMax; j++)
        {
            // if the random number between 0 and 1 is bigger than the threshold, create new star at this location
            if (Math.random() > starThreshold)
            {
                stars.push({
                    x: i, 
                    y: j, 
                    radius: getRandomFloat(starRadius.min, starRadius.max), 
                    radiusDelta: Math.random() < 0.5 ? -1 : 1,
                    brightness: getRandomFloat(starBrightness.min, starBrightness.max),
                    brightnessDelta: Math.random() < 0.5 ? -1 : 1,
                });
            }
        }
    }
}

// loops through all stars, updates and draws. This allows for one pass of the stars array
function handleStars()
{
    stars.forEach(star => {
        updateStar(star);
        drawStar(star)
    })
}

// updates the brightness and radius of a single star to mimic twinkling
function updateStar(star)
{
    // add a random amount to the star radius and brightness
    star.radius += Math.random() * starRadius.multiplier * star.radiusDelta;
    star.brightness += Math.random() * starBrightness.multiplier * star.brightnessDelta;

    // if star radius is bigger than max or smaller than min, reset it to bounds and update the delta
    if (star.radius < starRadius.min)
    {
        star.radius = starRadius.min;
        star.radiusDelta = 1;
    } 
    else if (star.radius > starRadius.max)
    {
        star.radius = starRadius.max;
        star.radiusDelta = -1;
    }

    // if star brightness is bigger than max or smaller than min, reset it to bounds and update the delta
    if (star.brightness < starBrightness.min)
    {
        star.brightness = starBrightness.min;
        star.brightnessDelta = 1;
    } 
    else if (star.brightness > starBrightness.max)
    {
        star.brightness = starBrightness.max;
        star.brightnessDelta = -1;
    }
}

// draws all the stars in the stars array
function drawStar(star)
{
    // if the star is outside the current window dimensions, don't bother to draw
    if (star.x > window.innerWidth || star.y > window.innerHeight) return;

    // draw a cicle with the star's specs
    drawCircle(star.x, star.y, star.radius, `rgba(255, 255, 255, ${star.brightness})`)
}

// returns a random hsl string using sun specs
function getSunColor()
{
    return `hsl(${getRandomFloat(sunHue.min, sunHue.max)}, ${getRandomFloat(sunSaturation.min, sunSaturation.max)}%, ${getRandomFloat(sunLightness.min, sunLightness.max)}%)`
}

// returns a single sun spot object
function createSunSpot(r, theta)
{
    return {
        x: r*Math.cos(theta),
        y: r*Math.sin(theta),
        radius: getRandomFloat(sunSpots.minRadius, sunSpots.maxRadius),
        color: getSunColor(),
        lifeSpan: getRandomFloat(sunSpots.minLifeSpan, sunSpots.maxLifeSpan)
    }
}

// Creates new suns for a given part of the canvas
function createSuns(xMin, xMax, yMin, yMax)
{
    // loop through the given range
    for (let i = xMin; i < xMax; i++)
    {
        for (let j = yMin; j < yMax; j++)
        {
            // if the x and y are both divisible by the spread, generate new sun
            if (i % sunSpreadDistance === 0 && j % sunSpreadDistance === 0)
            {
                const radius = getRandomFloat(sunRadius.min, sunRadius.max);
                    
                // use polar coordinates to loop throughout the suns area, create sun spots
                let spots = []
                for (let r = 0; r < radius; r++)
                {
                    for (let theta = 0; theta < 2 * Math.PI; theta += 0.1)
                    {
                        if (Math.random() > sunSpots.threshold)
                        {
                            spots.push(createSunSpot(r, theta))
                        }
                    }
                }

                // create planets
                let planets = [];
                const numPlanets = getRandomFloat(planetGeneration.minAmount, planetGeneration.maxAmount);
                for (let n = 0; n < numPlanets; n++)
                {
                    planets.push({
                        theta: getRandomFloat(0, 2*Math.PI),
                        orbitRadius: getRandomFloat(planetGeneration.minOrbitRadius, planetGeneration.maxOrbitRadius),
                        radius: getRandomFloat(planetGeneration.minRadius, planetGeneration.maxRadius),
                        color: `hsl(${getRandomFloat(planetGeneration.minHue, planetGeneration.maxHue)}, ${getRandomFloat(planetGeneration.minSaturation, planetGeneration.maxSaturation)}%, ${getRandomFloat(planetGeneration.minLightness, planetGeneration.maxLightness)}%)`,
                        speed: getRandomFloat(planetGeneration.minSpeed, planetGeneration.maxSpeed)
                    })
                }

                suns.push({
                    x: i + getRandomFloat(-1 * sunSpreadRandomness, sunSpreadRandomness),
                    y: j + getRandomFloat(-1 * sunSpreadRandomness, sunSpreadRandomness),
                    radius: radius,
                    color: getSunColor(),
                    spots: spots,
                    planets: planets,
                    orbitDirection: Math.random(0, 1) < 0.5 ? 1 : -1
                })
            }
        }
    }
}

// loop through the suns array, update and draw each. One pass of the suns array
function handleSuns()
{
    suns.forEach(sun => {
        updateSun(sun);
        drawSun(sun);
    })
}

// updates a sun (spot lifespan and re-creation)
function updateSun(sun)
{
    // loop through all the spots
    sun.spots.forEach((spot, index) => {
        if (spot.lifeSpan <= 0)
        {
            // delete this spot, add new one at a random location within the star
            sun.spots.splice(index, 1);
            sun.spots.push(createSunSpot(getRandomFloat(0, sun.radius), getRandomFloat(0, 2*Math.PI)));
        }
        else
        {
            spot.lifeSpan--;
        }
    })

    // loop through all the planets
    sun.planets.forEach(planet => {
        // move planet, reset theta to within 0-2pi if necessary to avoid exploding values
        planet.theta += planet.speed * sun.orbitDirection;
        if (planet.theta < 0) planet.theta += 2*Math.PI
        if (planet.theta > 2*Math.PI) planet.theta -= 2*Math.PI
    })
}

// draws a sun, its spots, and its planets
function drawSun(sun)
{
    // if the star is outside the current window dimensions, don't bother to draw
    if (sun.x > window.innerWidth || sun.y > window.innerHeight) return;

    // draw a cicle with the sun's specs
    drawCircle(sun.x, sun.y, sun.radius, sun.color);

    // loop through all the sun spots and draw each one
    sun.spots.forEach(spot => {
        drawCircle(sun.x + spot.x, sun.y + spot.y, spot.radius, spot.color);
    })

    // loop through all planets and draw each one
    sun.planets.forEach(planet => {
        drawCircle(sun.x + planet.orbitRadius*Math.cos(planet.theta), sun.y + planet.orbitRadius*Math.sin(planet.theta), planet.radius, planet.color);
    })
}