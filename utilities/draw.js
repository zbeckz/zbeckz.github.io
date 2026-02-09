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
}

function goToSection(hideSectionId, transitionDirection, newPath)
{
    // update query parameter of url to new path
    setQueryParam(localStorageConfig.PAGE, newPath);

    // Grab the element to hide
    const hideSection = document.getElementById(hideSectionId);

    // Hide the element
    hideSection.style.display = "none";

    // Start transition
    startTransition(transitionDirection);
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

function sortProjectList(newSort)
{
    projectListSort = newSort;

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
    }).forEach((p, index) => {
        // get project div
        const projectDiv = document.getElementById(`${p.title}-div`);

        // update sort order
        projectDiv.style.order = index;
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
            filterProjectList(tag);
        }
        container.appendChild(newFilterTag);
    })
}