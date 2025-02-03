// Draws a circle on the canvas at a given location, with given radius and color
function drawCircle(x, y, radius, color)
{
    // start a path element
    context.beginPath();

    // draw an arc at position (x, y) with given radius, start angle 0, end angle 2pi.
    context.arc(x, y, radius, 0, TwoPi);

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

// draws a single star
function drawStar(star)
{
    drawCircle(star.x, star.y, star.radius, `rgba(255, 255, 255, ${star.brightness})`)
}

// draws a sun, its spots, and its planets
function drawSun(sun)
{
    // draw a cicle with the sun's specs
    drawCircle(sun.x, sun.y, sun.radius, sun.color);

    // loop through all the sun spots and draw each one
    sun.spots.forEach(spot => {
        drawCircle(sun.x + spot.x, sun.y + spot.y, spot.radius, spot.color);
    })

    // loop through all planets and draw each one
    sun.planets.forEach(planet => {
        let planetX = sun.x + planet.orbitRadius*Math.cos(planet.theta)
        let planetY = sun.y + planet.orbitRadius*Math.sin(planet.theta)
        drawCircle(planetX, planetY, planet.radius, planet.color);

        planet.dots.forEach(dot => {
            drawCircle(planetX + dot.r*Math.cos(dot.theta + planet.rotationTheta), planetY + dot.r*Math.sin(dot.theta + planet.rotationTheta), dot.radius, dot.color);
        })
    })
}