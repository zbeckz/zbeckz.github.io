// returns a random hsl string using given specs
function getRandomColorFromConfig(config)
{
    const hue = getRandomFloat(config.hue.min, config.hue.max);
    const sat = getRandomFloat(config.saturation.min, config.saturation.max);
    const light = getRandomFloat(config.lightness.min, config.lightness.max)
    return `hsl(${hue}, ${sat}%, ${light}%)`;
}

// returns a random float from a config object with min and max properties
function getRandomFromConfig(config)
{
    return getRandomFloat(config.min, config.max)
}

function staticCanvasUpdate()
{
    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // loop through all the space object arrays
    for (const arr of [stars, suns, sunSpots, planets, planetDots, [asteroid]])
    {
        for (const spaceObj of arr)
        {
            spaceObj.update();
            spaceObj.draw();
        }
    }
}

function startTransition()
{
    if (pageState == 1) return;
    pageState = 1;
    transitionSpeed = transitionConfig.speed.min;
    transitionState = 0;
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
            transitionWaiting = true;
            setTimeout(() => {
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
            SunSpot.Spawn();
            planets = []
            Planet.Spawn();
            planetDots = [];
            PlanetDot.Spawn();
        }
    }

    for (const star of stars)
    {
        star.transition();
        star.draw();
    }

    for (const sun of suns)
    {
        sun.transition();
        sun.draw();
    }
}