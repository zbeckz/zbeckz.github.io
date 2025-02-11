// returns a random hsl string using given specs
function getRandomColor(config)
{
    const hue = getRandomFloat(config.hue.min, config.hue.max);
    const sat = getRandomFloat(config.saturation.min, config.saturation.max);
    const light = getRandomFloat(config.lightness.min, config.lightness.max)
    return `hsl(${hue}, ${sat}%, ${light}%)`;
}

function staticCanvasUpdate()
{
    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // handle updating and drawing the stars, suns, sun spots, planets, and planet dots
    for (const star of stars)
    {
        updateStar(star);
        drawStar(star);
    }

    for (const sun of suns)
    {
        drawSun(sun);
    }

    // needs to be a loop that includes index because updating a sun spot may include replacing it in the array
    for (let i = 0, n = sunSpots.length; i < n; i++)
    {
        const sunSpot = sunSpots[i];
        updateSunSpot(sunSpot, i);
        drawSunSpot(sunSpot);
    }

    for (const planet of planets)
    {
        updatePlanet(planet);
        drawPlanet(planet);
    }

    for (const planetDot of planetDots)
    {
        drawPlanetDot(planetDot);
    }

    if (asteroid)
    {
        updateAsteroid();
        drawAsteroid();
    }
}

function startTransition()
{
    if (pageState == 1) return;
    pageState = 1;
    transitionSpeed = transitionConfig.speed.min;
    transitionState = 0;
}

function transitionObject(object)
{
    object.x -= transitionSpeed;

    // if off screen, loop back onto screen with a random height
    if (object.x + object.radius < 0)
    {
        object.x = canvas.width - object.x;
        object.y = getRandomFloat(0, canvas.height);
    }
}

function transitionCanvasUpdate()
{
    context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (transitionState == 0) 
    {
        if (transitionSpeed < transitionConfig.speed.max)
        {
            transitionSpeed += transitionConfig.acceleration;
        }
        else
        {
            transitionState = 1;
        }
        
    }
    else if (transitionState == 1)
    {
        if (!transitionWaiting) {
            setTimeout(() => {
                transitionWaiting = true;
                transitionState = 2;
            }, transitionConfig.loopTime)
        }
    }
    else
    {
        if (transitionSpeed > 0)
        {
            transitionSpeed -= transitionConfig.acceleration
        }
        else
        {
            pageState = 0;
            sunSpots = [];
            spawnSunSpots(suns);
            planets = []
            spawnPlanets(suns);
            planetDots = [];
            spawnPlanetDots(planets);
        }
    }

    for (const star of stars)
    {
        transitionObject(star);
        drawStar(star);
    }

    for (const sun of suns)
    {
        transitionObject(sun);
        drawSun(sun);
    }
}