// Draws a circle on the canvas at a given location, with given radius and color
function drawCircle(x, y, radius, color)
{
    // start a path element
    context.beginPath();

    // draw an arc at position (x, y) with given radius, start angle 0, end angle 2pi.
    context.arc(x, y, radius, 0, 2 * Math.PI);

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

// Creates new stars for a given part of the canvas
function createStars(xMin, xMax, yMin, yMax)
{
    // loop through the given range
    for (let i = xMin; i < xMax; i++)
    {
        for (let j = yMin; j < yMax; j++)
        {
            // if the random number between 0 and 1 is bigger than the threshold, create new star at this location
            if (Math.random() > starThreshold)
            {
                stars.push({
                    x: i, 
                    y: j, 
                    radius: getRandomFloat(starRadius.min, starRadius.max), 
                    radiusDelta: Math.random() < 0.5 ? -1 : 1,
                    brightness: getRandomFloat(starBrightness.min, starBrightness.max),
                    brightnessDelta: Math.random() < 0.5 ? -1 : 1,
                });
            }
        }
    }
}

// updates the brightness and radius of each star to mimic twinkling
function updateStars()
{
    stars.forEach(star => {
        // add a random amount to the star radius and brightness
        star.radius += Math.random() * starRadius.multiplier * star.radiusDelta;
        star.brightness += Math.random() * starBrightness.multiplier * star.brightnessDelta;

        // if star radius is bigger than max or smaller than min, reset it to bounds and update the delta
        if (star.radius < starRadius.min)
        {
            star.radius = starRadius.min;
            star.radiusDelta = 1;
        } 
        else if (star.radius > starRadius.max)
        {
            star.radius = starRadius.max;
            star.radiusDelta = -1;
        }

        // if star brightness is bigger than max or smaller than min, reset it to bounds and update the delta
        if (star.brightness < starBrightness.min)
        {
            star.brightness = starBrightness.min;
            star.brightnessDelta = 1;
        } 
        else if (star.brightness > starBrightness.max)
        {
            star.brightness = starBrightness.max;
            star.brightnessDelta = -1;
        }
    })
}

function drawStars()
{
    // loop through all stars
    stars.forEach(star => {
        // if the star is outside the current window dimensions, don't bother to draw
        if (star.x > window.innerWidth || star.y > window.innerHeight) return;

        // draw a cicle with the star's specs
        drawCircle(star.x, star.y, star.radius, `rgba(255, 255, 255, ${star.brightness})`)
    })
}