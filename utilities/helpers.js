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

    // If there is a value to set, set it
    if (v)
    {
        url.searchParams.set(k, v);
    }
    else
    {
        // Otherwise, delete the param
        url.searchParams.delete(k);
    }
    window.history.pushState(null, '', url.toString());
}

function getQueryParam(k)
{
    const url = new URL(window.location.href);
    return url.searchParams.get(k);
}

function showNewPage()
{
    // Get the new page param
    const newPage = getQueryParam(localStorageConfig.PAGE);

    if (!newPage)
    {
        document.getElementById('homePageTitle').textContent = 'Zach Becker\'s Portfolio (WORK IN PROGRESS)!';
        resizeCanvas(true);
        document.getElementById('homePageContent').style.display = "flex";
        clearOffScreenObjects();
    }
    else if (newPage === "about-me")
    {
        document.getElementById('homePageTitle').textContent = 'Zach Becker\'s Portfolio: About Me (WORK IN PROGRESS)!'
        document.getElementById('aboutMePageContent').style.display = "grid";
        resizeCanvas();
        spawnObjectsNewScreen();
        clearOffScreenObjects();
    }
    else if (newPage === "project-list")
    {
        document.getElementById('homePageTitle').textContent = "Zach Becker's Portfolio: Projects (WORK IN PROGRESS)!"
        document.getElementById('projectListPageContent').style.display = "flex";
        resizeCanvas();
        spawnObjectsNewScreen();
        clearOffScreenObjects();
    }
}

function isOnScreen(s)
{
    if (s.x < 0) return false;
    if (s.x > canvas.width) return false;
    if (s.y < 0) return false;
    if (s.y > canvas.height) return false;
    return true;
}

// given a min and max number, returns a random decimal number within that range. [min, max)
function getRandomFloat(min, max)
{
    return Math.random() * (max - min) + min;
}

function spawnObjectsNewScreen()
{
    Star.Spawn(0, window.innerWidth, window.innerHeight, document.body.scrollHeight);
    const newSuns = Sun.Spawn(0, window.innerWidth, window.innerHeight, document.body.scrollHeight);
    sunSpots = [];
    SunSpot.Spawn();
    Planet.Spawn(newSuns);
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

function handleAnimationToggle(newState)
{
    // use given state or just toggle if none is passed in
    animationState = newState !== undefined ? newState : !animationState;
    const newString = animationState ? 'true' : 'false';

    // update html toggle element and stored cookie accordingly
    document.getElementById('animationToggle').dataset.on = newString;

    // update the cookie
    localStorage.setItem(localStorageConfig.ANIMATION, newString);

    // update the animated borders
    document.querySelectorAll(".line").forEach(element => {
        element.dataset.animate = newString;
    })

    // if turning animation off, and transition currently happening, switch to next page immediately
    if (!newState && (pageState !== PAGE_STATE.home))
    {
        showNewPage();
        pageState = PAGE_STATE.home;
        transitionSpeed = 0;
    }
}

function goToSection(hideSectionId, transitionDirection, newPath)
{
    // update query parameter of url to new path
    setQueryParam(localStorageConfig.PAGE, newPath);

    // Grab the element to hide
    const hideSection = document.getElementById(hideSectionId);

    // Hide the element
    hideSection.style.display = "none";

    // Start transition if animation is on, otherwise just jump straight to new page
    animationState ? startTransition(transitionDirection) : showNewPage();
}

// Sets the canvas to the size of the window
function resizeCanvas(forceWindow=false)
{
    canvas.width = window.innerWidth;
    canvas.height = forceWindow ? window.innerHeight : Math.max(document.body.scrollHeight, window.innerHeight);
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

function clearOffScreenObjects()
{
    stars = stars.filter(isOnScreen);
    suns = suns.filter(isOnScreen);
}

function populateProjectList()
{
    // Grab container
    const container = document.getElementById("projectListContainer");

    // Clear current container contents
    while (container.firstChild) 
    {
        container.removeChild(container.firstChild);
    }

    // create each project
    projectData.forEach(p => {
        // Create the overall container for the project
        const newProjectDiv = document.createElement("div");
        newProjectDiv.className = "projectDiv"
        newProjectDiv.id = `${p.title}-div`
        newProjectDiv.style.viewTransitionName = `${p.title.replace(/\d/g, '').replaceAll(' ', '-').toLowerCase()}-view-transition`
        container.appendChild(newProjectDiv);

        // Add the title of the project as a span
        const newProjectTitle = document.createElement("span");
        newProjectTitle.textContent = p.title;
        newProjectDiv.appendChild(newProjectTitle);

        // Add the image of the project
        const newProjectImage = document.createElement("img");
        newProjectImage.src = p.previewImg;
        newProjectDiv.appendChild(newProjectImage);

        // Add a link to the project
        const newProjectLink = document.createElement("a");
        newProjectLink.href = p.url;
        newProjectLink.textContent = "Project";
        newProjectLink.className = "linkButton";
        newProjectDiv.appendChild(newProjectLink);
    })
}

function startProjectListSort(newSort)
{
    if (!document.startViewTransition) {
        sortProjectList(newSort);
        return;
    }
    document.startViewTransition(() => sortProjectList(newSort));
}

function sortProjectList(newSort)
{
    projectListSort = newSort;

    // get parent
    const parent = document.getElementById("projectListContainer");

    // update order based on new sort
    projectData.toSorted((a, b) => {
        switch (projectListSort)
        {
            case "atoz":
                return a.title.localeCompare(b.title);
            case "ztoa":
                return b.title.localeCompare(a.title);
            case "newest":
                return a.date < b.date ? 1 : -1;
            case "oldest":    
                return a.date < b.date ? -1 : 1;
            case "default":
            default:
                return 0;
        }
    }).forEach(p => {
        // get project div
        const projectDiv = document.getElementById(`${p.title}-div`);

        // remove it from parent, then re-append so it will be in correct order
        // doing this instead of order style so view transitions look nicer
        projectDiv.remove();
        parent.appendChild(projectDiv);
    });
}

function filterProjectList(newFilter)
{
    // if new filter is not in list, add it. Otherwise, remove it
    if (projectListFilters.includes(newFilter))
    {
        projectListFilters.splice(projectListFilters.indexOf(newFilter), 1)
        document.getElementById(`${newFilter}-filter-button`).dataset.selected = "false";
    }
    else
    {
        projectListFilters.push(newFilter);
        document.getElementById(`${newFilter}-filter-button`).dataset.selected = "true";
    } 

    // update project style based on new filter list
    projectData.forEach(p => {
        // get the project div
        const projectDiv = document.getElementById(`${p.title}-div`);

        // if there are no filters, or any project tag is in the filter list, show it. Otherwise hide
        if (projectListFilters.length === 0 || p.tags.some(t => projectListFilters.includes(t)))
        {
            projectDiv.style.display = "flex";
        }
        else
        {
            projectDiv.style.display = "none";
        }
    })
}

function populateTags()
{
    // Loop through project data to create an array of unique tags
    const uniqueTags = projectData.reduce((accumulator, project) => {
        project.tags.forEach(tag => {
            if (!accumulator.includes(tag)) accumulator.push(tag);
        })
        return accumulator;
    }, [])

    // Grab container
    const container = document.getElementById("filter-tag-container");

    // Add styles to container for tag grid to always have 2 rows and as many columns as needed
    const numTagCols = Math.round(uniqueTags.length / 2);
    let colString = "";
    for (let i = 0; i < numTagCols; i++)
    {
        colString += "1fr "
    }
    container.style.gridTemplate = `1fr 1fr / ${colString}`

    // Sort tags alphabetically and add each to tag container
    uniqueTags.sort().forEach(tag => {
        // Create the overall span for the tag
        const newFilterTag = document.createElement("button");
        newFilterTag.id = `${tag}-filter-button`
        newFilterTag.className = "filterTag"
        newFilterTag.textContent = tag;
        newFilterTag.onclick = () => {
            if (!document.startViewTransition) {
                filterProjectList(tag);
                return;
            }
            document.startViewTransition(() => filterProjectList(tag));
        }
        container.appendChild(newFilterTag);
    })
}