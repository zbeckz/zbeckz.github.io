// returns a random hsl string using given specs
function getRandomColor(config)
{
    const hue = getRandomFloat(config.hue.min, config.hue.max);
    const sat = getRandomFloat(config.saturation.min, config.saturation.max);
    const light = getRandomFloat(config.lightness.min, config.lightness.max)
    return `hsl(${hue}, ${sat}%, ${light}%)`;
}

// returns a new star object at a given location
function createStar(x, y)
{
    return {
        x: x, 
        y: y, 
        radius: getRandomFloat(starConfig.radius.min, starConfig.radius.max), 
        radiusDelta: Math.random() < 0.5 ? -1 : 1,
        brightness: getRandomFloat(starConfig.brightness.min, starConfig.brightness.max),
        brightnessDelta: Math.random() < 0.5 ? -1 : 1,
    }
}

// Creates new stars for a given part of the canvas
function spawnStars(xMin, xMax, yMin, yMax)
{
    // loop through the given range
    for (let i = xMin; i < xMax; i++)
    {
        for (let j = yMin; j < yMax; j++)
        {
            // if the random number between 0 and 1 is bigger than the threshold, create new star at this location
            if (Math.random() > starConfig.threshold)
            {
                stars.push(createStar(i, j));
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

// returns a single sun object
function createSun(x, y)
{
    return {
        x: x,
        y: y,
        radius: getRandomFloat(sunConfig.radius.min, sunConfig.radius.max),
        color: getRandomColor(sunConfig),
    }
}

function spawnSuns(xMin, xMax, yMin, yMax)
{
    // keeps entirely within screen
    const bufferDist =  sunConfig.radius.max + sunConfig.spread.randomness
    for (let i = xMin + bufferDist; i < xMax - bufferDist; i += sunConfig.spread.distance)
    {
        suns.push(
            createSun(
                i + getRandomFloat(-1*sunConfig.spread.randomness, sunConfig.spread.randomness), 
                getRandomFloat(yMin+sunConfig.radius.max, yMax-sunConfig.radius.max))
        )
    }
}

// returns a single sun spot object
function createSunSpot(sunX, sunY, sunRadius)
{
    const r = getRandomFloat(0, sunRadius);
    const theta = getRandomFloat(0, TwoPi);
    return {
        sunX: sunX,
        sunY: sunY,
        sunRadius: sunRadius,
        x: r*Math.cos(theta),
        y: r*Math.sin(theta),
        radius: getRandomFloat(sunSpotConfig.radius.min, sunSpotConfig.radius.max),
        color: getRandomColor(sunConfig),
        lifeSpan: getRandomFloat(sunSpotConfig.lifeSpan.min, sunSpotConfig.lifeSpan.max) 
    }
}

function spawnSunSpots(currSuns)
{
    // loop through all the suns that currently need new sun spots
    for (const sun of currSuns)
    {
        const amount = getRandomFloat(sunSpotConfig.amount.min, sunSpotConfig.amount.max)
        for (let i = 0; i < amount; i++)
        {
            sunSpots.push(createSunSpot(sun.x, sun.y, sun.radius));
        }
    }
}

function updateSunSpot(sunSpot, index)
{
    if (sunSpot.lifeSpan <= 0)
    {
        // replace this spot with a new one
        sunSpots[index] = createSunSpot(sunSpot.sunX, sunSpot.sunY, sunSpot.sunRadius);
    }
    else
    {
        sunSpot.lifeSpan--;
        sunSpot.radius += sunSpotConfig.growthrate;
    }
}

function createPlanet(sunX, sunY, sunRadius, orbitDirection)
{
    return {
        sunX: sunX,
        sunY: sunY,
        theta: getRandomFloat(0, TwoPi),
        orbitRadius: sunRadius + getRandomFloat(planetConfig.orbit.min, planetConfig.orbit.max),
        radius: getRandomFloat(planetConfig.radius.min, planetConfig.radius.max),
        color: getRandomColor(planetConfig),
        speed: orbitDirection * getRandomFloat(planetConfig.speed.min, planetConfig.speed.max),
        rotationDirection: Math.random() < 0.5 ? 1 : -1,
        rotationTheta: 0,
        rotationSpeed: getRandomFloat(planetConfig.rotationSpeed.min, planetConfig.rotationSpeed.max)
    };
};

function spawnPlanets(currSuns)
{
    // loop through all the suns that currently need planets
    for (const sun of currSuns)
    {
        const amount = getRandomFloat(planetConfig.amount.min, planetConfig.amount.max)

        // planets orbiting around the same sun should have the same orbit direction
        const orbitDirection = Math.random() < 0.5 ? 1 : -1
        for (let i = 0; i < amount; i++)
        {
            planets.push(createPlanet(sun.x, sun.y, sun.radius, orbitDirection))
        }
    }
}

function updatePlanet(planet)
{
   // move planet, reset theta to within 0-2pi if necessary to avoid exploding values
   planet.theta += planet.speed;
   if (planet.theta < 0) planet.theta += TwoPi
   if (planet.theta > TwoPi) planet.theta -= TwoPi

   // update x and y value. This is stored so that planet dots can access it in their reference
   planet.x = planet.sunX + planet.orbitRadius*Math.cos(planet.theta);
   planet.y = planet.sunY + planet.orbitRadius*Math.sin(planet.theta);

   // rotate planet, reset theta to within 0-2pi if necessary to avoid exploding values
   planet.rotationTheta += planet.rotationSpeed * planet.rotationDirection;
   if (planet.rotationTheta < 0) planet.rotationTheta += TwoPi
   if (planet.rotationTheta > TwoPi) planet.rotationTheta -= TwoPi
}

function createPlanetDot(planet, color)
{
    const radius = getRandomFloat(planetDotConfig.radius.min, planetDotConfig.radius.max)
    return {
        planetRef: planet,
        r: getRandomFloat(0, planet.radius - radius),
        theta: getRandomFloat(0, TwoPi),
        color: color,
        radius: radius
    }
}

function spawnPlanetDots(currPlanets)
{
    for (const planet of currPlanets)
    {
        const amount = getRandomFloat(planetDotConfig.amount.min, planetDotConfig.amount.max);
        const color = getRandomColor(planetDotConfig);

        for (let i = 0; i < amount; i++)
        {
            planetDots.push(createPlanetDot(planet, color));
        }
    }
}

// set timeout to recursively send asteroid
function setAsteroidTimeout()
{
    setTimeout(() => {
        spawnAsteroid();
        setAsteroidTimeout();
    }, getRandomFloat(asteroidConfig.time.min, asteroidConfig.time.max))
}

function spawnAsteroid()
{
    const ran = Math.random();
    let x, y, targetX, targetY;
    
    // left of screen
    if (ran < 0.25)
    {
        x = -1 * asteroidConfig.radius.max;
        y = getRandomFloat(0, canvas.height);
        targetX = getRandomFloat(canvas.width/2, canvas.width);
        targetY = getRandomFloat(0, canvas.height);
        
    }
    
    // above screen
    else if (ran < 0.5)
    {
        x = getRandomFloat(0, canvas.width);
        y = -1 * asteroidConfig.radius.max;
        targetX = getRandomFloat(0, canvas.width);
        targetY = getRandomFloat(canvas.height/2, canvas.height);
    }

    // right of screen
    else if (ran < 0.75)
    {
        x = canvas.width + asteroidConfig.radius.max;
        y = getRandomFloat(0, canvas.height);
        targetX = getRandomFloat(0, canvas.width/2);
        targetY = getRandomFloat(0, canvas.height);
    }

    // below screen
    else
    {
        x = getRandomFloat(0, canvas.width);
        y = canvas.height + asteroidConfig.radius.max;
        targetX = getRandomFloat(0, canvas.width);
        targetY = getRandomFloat(0, canvas.height/2);
    }

    const vx = targetX - x;
    const vy = targetY - y;
    const scale = getRandomFloat(asteroidConfig.speed.min, asteroidConfig.speed.max)/Math.sqrt(vx*vx + vy*vy);
    asteroid = {
        x: x,
        y: y,
        velocity: {
            x: vx * scale,
            y: vy * scale,
        },
        radius: getRandomFloat(asteroidConfig.radius.min, asteroidConfig.radius.max),
        color: "brown"
    };
}

function updateAsteroid()
{
    asteroid.x += asteroid.velocity.x;
    asteroid.y += asteroid.velocity.y;
}