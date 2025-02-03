// Creates new stars for a given part of the canvas
function createStars(xMin, xMax, yMin, yMax)
{
    // loop through the given range
    for (let i = xMin; i < xMax; i++)
    {
        for (let j = yMin; j < yMax; j++)
        {
            // if the random number between 0 and 1 is bigger than the threshold, create new star at this location
            if (Math.random() > starConfig.threshold)
            {
                stars.push({
                    x: i, 
                    y: j, 
                    radius: getRandomFloat(starConfig.radius.min, starConfig.radius.max), 
                    radiusDelta: Math.random() < 0.5 ? -1 : 1,
                    brightness: getRandomFloat(starConfig.brightness.min, starConfig.brightness.max),
                    brightnessDelta: Math.random() < 0.5 ? -1 : 1,
                });
            }
        }
    }
}

// updates the brightness and radius of a single star to mimic twinkling
function updateStar(star)
{
    // add a random amount to the star radius and brightness
    star.radius += Math.random() * starConfig.radius.multiplier * star.radiusDelta;
    star.brightness += Math.random() * starConfig.brightness.multiplier * star.brightnessDelta;

    // if star radius is bigger than max or smaller than min, reset it to bounds and update the delta
    if (star.radius < starConfig.radius.min)
    {
        star.radius = starConfig.radius.min;
        star.radiusDelta = 1;
    } 
    else if (star.radius > starConfig.radius.max)
    {
        star.radius = starConfig.radius.max;
        star.radiusDelta = -1;
    }

    // if star brightness is bigger than max or smaller than min, reset it to bounds and update the delta
    if (star.brightness < starConfig.brightness.min)
    {
        star.brightness = starConfig.brightness.min;
        star.brightnessDelta = 1;
    } 
    else if (star.brightness > starConfig.brightness.max)
    {
        star.brightness = starConfig.brightness.max;
        star.brightnessDelta = -1;
    }
}

// returns a random hsl string using sun specs
function getSunColor()
{
    return `hsl(${getRandomFloat(sunConfig.hue.min, sunConfig.hue.max)}, ${getRandomFloat(sunConfig.saturation.min, sunConfig.saturation.max)}%, ${getRandomFloat(sunConfig.lightness.min, sunConfig.lightness.max)}%)`;
}

function getPlanetColor()
{
    return  `hsl(${getRandomFloat(planetConfig.hue.min, planetConfig.hue.max)}, ${getRandomFloat(planetConfig.saturation.min, planetConfig.saturation.max)}%, ${getRandomFloat(planetConfig.lightness.min, planetConfig.lightness.max)}%)`;
}

// returns a single sun spot object
// isInitial lowers the lifespan of first generation of sun spots so it looks more fluid upon page load
function createSunSpot(r, theta, isInitial=false)
{
    return {
        x: r*Math.cos(theta),
        y: r*Math.sin(theta),
        radius: getRandomFloat(sunConfig.spots.radius.min, sunConfig.spots.radius.max),
        color: getSunColor(),
        lifeSpan: getRandomFloat(isInitial ? 1 : sunConfig.spots.lifeSpan.min, sunConfig.spots.lifeSpan.max) 
    }
}

// Creates new suns for a given part of the canvas
function createSuns(xMin, xMax, yMin, yMax)
{
    // loop through the given range, but not edges where a sun could clip off screen
    for (let i = xMin + sunConfig.radius.max; i < xMax - sunConfig.radius.max; i++)
    {
        for (let j = yMin + sunConfig.radius.max; j < yMax - sunConfig.radius.max; j++)
        {
            // if the x and y are both divisible by the spread, generate new sun
            if (i % sunConfig.spread.horizontal.distance === 0 && j % sunConfig.spread.vertical.distance === 0)
            {
                const radius = getRandomFloat(sunConfig.radius.min, sunConfig.radius.max);
                    
                // use polar coordinates to loop throughout the suns area, create sun spots
                let spots = []
                for (let r = 0; r < radius; r++)
                {
                    for (let theta = 0; theta < TwoPi; theta += 0.1)
                    {
                        if (Math.random() > sunConfig.spots.threshold)
                        {
                            spots.push(createSunSpot(r, theta))
                        }
                    }
                }

                // create planets
                let planets = [];
                const numPlanets = getRandomFloat(planetConfig.amount.min, planetConfig.amount.max);
                for (let n = 0; n < numPlanets; n++)
                {
                    // create planet
                    let planet = {
                        theta: getRandomFloat(0, TwoPi),
                        orbitRadius: getRandomFloat(planetConfig.orbit.min, planetConfig.orbit.max),
                        radius: getRandomFloat(planetConfig.radius.min, planetConfig.radius.max),
                        color: getPlanetColor(),
                        speed: getRandomFloat(planetConfig.speed.min, planetConfig.speed.max),
                        rotationDirection: Math.random() < 0.5 ? 1 : -1,
                        rotationTheta: 0,
                        rotationSpeed: getRandomFloat(planetConfig.rotationSpeed.min, planetConfig.rotationSpeed.max)
                    };

                    // create dots for the planet
                    let dots = [];
                    const numDots = getRandomFloat(planetConfig.dots.amount.min, planetConfig.dots.amount.max);
                    const dotColor = getPlanetColor()
                    for (let d = 0; d < numDots; d++)
                    {
                        dots.push({
                            r: getRandomFloat(0, planet.radius*0.9),
                            theta: getRandomFloat(0, TwoPi),
                            color: dotColor,
                            radius: getRandomFloat(planetConfig.dots.radius.min, planetConfig.dots.radius.max)
                        })
                    }

                    // add the planet
                    planet.dots = dots;
                    planets.push(planet);
                }

                suns.push({
                    x: i + getRandomFloat(-1 * sunConfig.spread.horizontal.randomness, sunConfig.spread.horizontal.randomness),
                    y: j + getRandomFloat(-1 * sunConfig.spread.vertical.randomness, sunConfig.spread.vertical.randomness),
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

// updates a sun (spot lifespan and re-creation)
function updateSun(sun)
{
    // loop through all the spots
    for (let i = 0, n = sun.spots.length; i < n; i++)
    {
        const spot = sun.spots[i];
        if (spot.lifeSpan <= 0)
        {
            // replace this spot with a new one
            sun.spots[i] = createSunSpot(getRandomFloat(0, sun.radius), getRandomFloat(0, TwoPi));
        }
        else
        {
            spot.lifeSpan--;
            spot.radius += sunConfig.spots.growthrate;
        }
    }

    // loop through all the planets
    for (let i = 0, n = sun.planets.length; i < n; i++)
    {
        const planet = sun.planets[i];
        
        // move planet, reset theta to within 0-2pi if necessary to avoid exploding values
        planet.theta += planet.speed * sun.orbitDirection;
        if (planet.theta < 0) planet.theta += TwoPi
        if (planet.theta > TwoPi) planet.theta -= TwoPi

        // rotate planet, reset theta to within 0-2pi if necessary to avoid exploding values
        planet.rotationTheta += planet.rotationSpeed * planet.rotationDirection;
        if (planet.rotationTheta < 0) planet.rotationTheta += TwoPi
        if (planet.rotationTheta > TwoPi) planet.rotationTheta -= TwoPi
    }
}