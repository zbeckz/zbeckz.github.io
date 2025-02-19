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

function handleAnimationToggle()
{
    animationState = !animationState;
    document.getElementById('animationToggle').dataset.on = animationState ? 'true' : 'false';
}

function goToSection(hideSectionId, transitionDirection)
{
    const hideSection = document.getElementById(hideSectionId);

    // hide all child elements
    hideSection.querySelectorAll("*").forEach(element => {
        element.style.display = "none";
    });

    // begin transition of shrinking
    hideSection.style.width = "0px";
    hideSection.style.height = "0px";
    
    // hide when shrinking is done
    setTimeout(() => {
        hideSection.style.display = "none";
        startTransition(transitionDirection);
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