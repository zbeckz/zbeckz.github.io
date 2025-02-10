// fires when DOM is loaded
window.addEventListener('load', () => {
    // set the project preview image element
    homePageProjectImg = document.getElementById('projectsImage');

    // get the transition duration from the css root. Will be formated like '0.1s', so need to extract the number and multiply by 1000 to get ms
    homePageImageTransitionDuration = 
        window.getComputedStyle(document.documentElement).getPropertyValue('--homePageImageTransitionDuration').split('s')[0] * 1000;
    homePageSectionTransitionDuration = 
        window.getComputedStyle(document.documentElement).getPropertyValue('--homePageTransitionDuration').split('s')[0] * 1000;

    // begin data load, start home page slide show upon completion
    getProjectInfo().then(() => setHomepageSlideshow());

    // get the canvas element and set to window size
    canvas = document.getElementById('backgroundScene');
    context = canvas.getContext('2d');
    maxWindowWidth = window.innerWidth;
    maxWindowHeight = window.innerHeight;
    resizeCanvas();

    // create stars and suns for current window size
    spawnStars(0, maxWindowWidth, 0, maxWindowHeight);
    spawnSuns(0, maxWindowWidth, 0, maxWindowHeight);

    // create sun spots and planets for the newly created suns
    spawnSunSpots(suns);
    spawnPlanets(suns);

    // create planet dots for the newly crated planets
    spawnPlanetDots(planets);

    // set interval to update canvas background
    setInterval(() => {
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
    }, canvasUpdateDelta)

    setAsteroidTimeout();
});

// fires when window is resized
window.addEventListener('resize', () => {
    // resize the canvas based on new window
    resizeCanvas();

    // if the new window is now wider than it has been before during this session, need to create new stars
    if (window.innerWidth > maxWindowWidth) 
    {
        spawnStars(maxWindowWidth, window.innerWidth, 0, maxWindowHeight);
        maxWindowWidth = window.innerWidth;
    }

    // if the new window is now taller than it has been before during this session, need to create new stars
    if (window.innerHeight > maxWindowHeight) 
    {
        spawnStars(0, maxWindowWidth, maxWindowHeight, window.innerHeight);      
        maxWindowHeight = window.innerHeight;
    }
});