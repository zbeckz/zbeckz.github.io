/* GLOBAL VARIABLES */
let stars = [];
let canvas;
let maxWindowWidth;
let minWindowWidth;

/* FUNCTIONS */ 

// Fetches data from a csv file and formats it for usage on the page
async function getProjectInfo()
{
    // first, load project info csv data
    try 
    {
        // use built-in js fetch to grab csv data
        const projectData = await fetch('data/project-info.csv');

        // convert the response object to a text string
        const textString = await projectData.text();

        // use split the string into an array where each element is a row of the csv
        const csvRows = textString.split('\r\n');

        // alternatively, could use .then() like below. But above way looks more readable with comments
        /* 
            const projectData = await fetch('data/project-info.csv')
              .then(responseObject => responseObject.text())
              .then(textString => textString.split('\r\n'));
        */
    } 
    catch (error)
    {
        console.log('Error fetching project data:', error)
    }
};

// Sets the canvas to the size of the window
function resizeCanvas()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function setupStars()
{
    for (let i = 0; i < window.innerWidth; i++)
    {
        for (let j = 0; j < window.innerHeight; j++)
        {
            if (Math.random() > 0.9996)
            {
                stars.push({x: i, y: j});
            }
        }
    }
}

function drawStars()
{
    const context = canvas.getContext('2d');
    const radius = 1;

    stars.forEach((star) => {
        if (star.x > maxWindowWidth || star.y > maxWindowHeight) return;
        context.beginPath();
        context.arc(star.x, star.y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = 'white';
        context.stroke();
    })
}

/* CODE THAT RUNS IMMEDIATELY*/

// grab project data
getProjectInfo();

// fires when DOM is loaded
window.addEventListener('load', () => {
    canvas = document.getElementById('backgroundScene');
    maxWindowWidth = window.innerWidth;
    maxWindowHeight = window.innerHeight;
    resizeCanvas();
    setupStars();
    drawStars();
});

// fires when window is resized
window.addEventListener('resize', () => {
    resizeCanvas();
});

