// fires when DOM is loaded
window.addEventListener('load', () => {
    // set the project preview image element
    homePageProjectImg = document.getElementById('projectsImage');

    // get the transition duration from the css root. Will be formated like '0.1s', so need to extract the number and multiply by 1000 to get ms
    homePageImageTransitionDuration = 
        window.getComputedStyle(document.documentElement).getPropertyValue('--homePageImageTransitionDuration').split('s')[0] * 1000;

    // begin data load, start home page slide show upon completion
    getProjectInfo().then(() => setHomepageSlideshow());

    // get the canvas element and set to window size
    canvas = document.getElementById('backgroundScene');
    context = canvas.getContext('2d');
    maxWindowWidth = window.innerWidth;
    maxWindowHeight = window.innerHeight;
    resizeCanvas();

    // create stars for current window size
    createStars(0, maxWindowWidth, 0, maxWindowHeight);

    // set interval to update canvas background
    setInterval(() => {
        updateStars();

        // clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        drawStars();
    }, canvasUpdateDelta)
});

// fires when window is resized
window.addEventListener('resize', () => {
    // resize the canvas based on new window
    resizeCanvas();

    // if the new window is now wider than it has been before during this session, need to create new stars to account for that
    if (window.innerWidth > maxWindowWidth) 
    {
        createStars(maxWindowWidth, window.innerWidth, 0, maxWindowHeight)        
        maxWindowWidth = window.innerWidth;
    }

    // if the new window is now taller than it has been before during this session, need to create new stars to account for that
    if (window.innerHeight > maxWindowHeight) 
    {
        createStars(0, maxWindowWidth, maxWindowHeight, window.innerHeight)        
        maxWindowHeight = window.innerHeight;
    }
});