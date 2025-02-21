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

    // spawn the types of space objects
    Star.Spawn()
    Sun.Spawn();
    SunSpot.Spawn();
    Planet.Spawn();
    PlanetDot.Spawn();

    pageState = PAGE_STATE.home;

    // set interval to update canvas background
    setInterval(() => {
        if (!animationState) return;

        switch (pageState)
        {
            case PAGE_STATE.home:
                staticCanvasUpdate();
                break;
            case PAGE_STATE.transition:
                transitionCanvasUpdate();
        }
        
    }, canvasUpdateDelta)

    // create dummy asteroid
    asteroid = new Asteroid(-1 * asteroidConfig.radius.max, -1 * asteroidConfig.radius.max, 0, 0, 0);
    setAsteroidTimeout();

    // begin animation state from cookie
    handleAnimationToggle(localStorage.getItem('animation') === 'true' ? true : false);
    
    // if the animation state is already off (from cookie), make sure animation toggle matches and draw 1 frame of background
    if (!animationState)
    {
        staticCanvasUpdate();
    }
});

// fires when window is resized
window.addEventListener('resize', () => {
    // resize the canvas based on new window
    resizeCanvas();

    // if the new window is now wider than it has been before during this session, need to create new stars
    if (window.innerWidth > maxWindowWidth) 
    {
        Star.Spawn(maxWindowWidth, window.innerWidth, 0, maxWindowHeight);
        maxWindowWidth = window.innerWidth;
    }

    // if the new window is now taller than it has been before during this session, need to create new stars
    if (window.innerHeight > maxWindowHeight) 
    {
        Star.Spawn(0, maxWindowWidth, maxWindowHeight, window.innerHeight);      
        maxWindowHeight = window.innerHeight;
    }
});