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

function startTransition(transition_direction)
{
    // if already transitioning, don't do anything
    if (pageState == PAGE_STATE.transition) return;

    // set transition in motion
    pageState = PAGE_STATE.transition;
    transitionSpeed = transitionConfig.speed.min;
    transitionState = TRANSITION_STATE.accel;
    transitionDirection = transition_direction;
}

function handleAccelTransition()
{
    // go up to max acceleration
    if (transitionSpeed < transitionConfig.speed.max)
    {
        transitionSpeed += transitionConfig.acceleration;
    }
    else // or, ste to coast for given amount of time
    {
        transitionState = TRANSITION_STATE.coast;
        setTimeout(() => {
            transitionState = TRANSITION_STATE.deccel;
        }, transitionConfig.loopTime)
    }
}

function handleDeccelTransition()
{
    // decelerate to 0
    if (transitionSpeed > 0)
    {
        transitionSpeed -= transitionConfig.acceleration
    }
    else // respawn other space objects and reset
    {
        pageState = PAGE_STATE.home;
        sunSpots = [];
        SunSpot.Spawn();
        planets = []
        Planet.Spawn();
        planetDots = [];
        PlanetDot.Spawn();
        showNewPage();
    }
}

function transitionCanvasUpdate()
{
    context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    switch (transitionState)
    {
        case TRANSITION_STATE.accel:
            handleAccelTransition();
            break;
        case TRANSITION_STATE.deccel:
            handleDeccelTransition();
    }

    for (const spaceObjArr of [stars, suns])
    {
        for (const spaceObj of spaceObjArr)
        {
            spaceObj.transition();
            spaceObj.draw();
        }
    }
}

function setQueryParam(k, v)
{
    const url = new URL(window.location.href);
    url.searchParams.set(k, v);
    window.history.pushState(null, '', url.toString());
}

function getQueryParam(k)
{
    const url = new URL(window.location.href);
    return url.searchParams.get(k);
}

function showNewPage()
{
    const newPage = getQueryParam(localStorageConfig.PAGE);
    
    if (newPage === "about-me")
    {
        document.getElementById('homePageTitle').textContent = 'Zach Becker\s Portfolio: About Me'
        document.getElementById('homePageContent').style.display = "none";
        document.getElementById('aboutMePageContent').style.display = "grid";
        resizeCanvas();
        Star.Spawn(0, window.innerWidth, window.innerHeight, document.body.scrollHeight);
        Sun.Spawn(0, window.innerWidth, window.innerHeight, document.body.scrollHeight);
        sunSpots = [];
        SunSpot.Spawn();
    }
}
