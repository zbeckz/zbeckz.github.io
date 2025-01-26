// Sets the canvas to the size of the window
function resizeCanvas()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createStars(xMin, xMax, yMin, yMax)
{
    for (let i = xMin; i < xMax; i++)
    {
        for (let j = yMin; j < yMax; j++)
        {
            if (Math.random() > star_threshold)
            {
                stars.push({x: i, y: j});
            }
        }
    }
}

function drawStars()
{
    const context = canvas.getContext('2d');

    stars.forEach((star) => {
        if (star.x > maxWindowWidth || star.y > maxWindowHeight) return;
        drawCircle(context, star.x, star.y, 1.5, '#ffffff')
    })
}

// fires when DOM is loaded
window.addEventListener('load', () => {
    canvas = document.getElementById('backgroundScene');
    maxWindowWidth = window.innerWidth;
    maxWindowHeight = window.innerHeight;
    resizeCanvas();
    createStars(0, maxWindowWidth, 0, maxWindowHeight);
    drawStars();
});

// fires when window is resized
window.addEventListener('resize', () => {
    resizeCanvas();

    if (window.innerWidth > maxWindowWidth) 
    {
        createStars(maxWindowWidth, window.innerWidth, 0, maxWindowHeight)        
        maxWindowWidth = window.innerWidth;
    }

    if (window.innerHeight > maxWindowHeight) 
    {
        createStars(0, maxWindowWidth, maxWindowHeight, window.innerHeight)        
        maxWindowHeight = window.innerHeight;
    }

    drawStars();
});

