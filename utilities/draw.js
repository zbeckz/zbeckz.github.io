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

function goToProjects()
{
    const aboutMeSection = document.getElementById("aboutMeContainer");

    // hide all child elements
    aboutMeSection.querySelectorAll("*").forEach(element => {
        element.style.display = "none";
    });

    // begin transition of shrinking
    aboutMeSection.style.width = "0px";
    aboutMeSection.style.height = "0px";
    
    // hide when shrinking is done
    setTimeout(() => {
        aboutMeSection.style.display = "none";
    }, homePageSectionTransitionDuration);
}

// Sets the canvas to the size of the window
function resizeCanvas()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

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

// draws a single star
function drawStar(star)
{
    drawCircle(star.x, star.y, star.radius, `rgba(255, 255, 255, ${star.brightness})`)
}

// draws a sun, its spots, and its planets
function drawSun(sun)
{
    drawCircle(sun.x, sun.y, sun.radius, sun.color);
}

function drawSunSpot(sunSpot)
{
    drawCircle(sunSpot.sunX + sunSpot.x, sunSpot.sunY + sunSpot.y, sunSpot.radius, sunSpot.color);
}

function drawPlanet(planet)
{
    drawCircle(planet.x, planet.y, planet.radius, planet.color);
}

function drawPlanetDot(planetDot)
{
    const newTheta = planetDot.theta + planetDot.planetRef.rotationTheta
    drawCircle(
        planetDot.planetRef.x + planetDot.r*Math.cos(newTheta),
        planetDot.planetRef.y + planetDot.r*Math.sin(newTheta),
        planetDot.radius,
        planetDot.color
    )
}

function drawAsteroid()
{
    // draw trailing fire
    const trail = 10;
    for (let i = 2; i <= trail; i++)
    {
        drawCircle(
            asteroid.x - asteroid.velocity.x*i*asteroid.radius*0.05, 
            asteroid.y - asteroid.velocity.y*i*asteroid.radius*0.05, 
            asteroid.radius - asteroid.radius*(i/trail), 
            `rgba(255, 165, 0, ${1 - i/trail})`
        )
    }

    // draw main asteroid
    drawCircle(asteroid.x, asteroid.y, asteroid.radius, asteroid.color);
}