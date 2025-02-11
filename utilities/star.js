// returns a new star object at a given location
function createStar(x, y)
{
    return {
        x: x, 
        y: y, 
        radius: getRandomFloat(starConfig.radius.min, starConfig.radius.max), 
        radiusDelta: Math.random() < 0.5 ? -1 : 1,
        brightness: getRandomFloat(starConfig.brightness.min, starConfig.brightness.max),
        brightnessDelta: Math.random() < 0.5 ? -1 : 1,
    }
}

// Creates new stars for a given part of the canvas
function spawnStars(xMin, xMax, yMin, yMax)
{
    // loop through the given range
    for (let i = xMin; i < xMax; i++)
    {
        for (let j = yMin; j < yMax; j++)
        {
            // if the random number between 0 and 1 is bigger than the threshold, create new star at this location
            if (Math.random() > starConfig.threshold)
            {
                stars.push(createStar(i, j));
            }
        }
    }
}

// updates the brightness and radius of a single star to mimic twinkling
function updateStar(star)
{
    // add a random amount to the star radius and brightness
    star.radius += Math.random() * starConfig.radius.multiplier * star.radiusDelta;
    star.brightness += Math.random() * starConfig.brightness.multiplier * star.brightnessDelta;

    // if star radius is bigger than max or smaller than min, reset it to bounds and update the delta
    if (star.radius < starConfig.radius.min)
    {
        star.radius = starConfig.radius.min;
        star.radiusDelta = 1;
    } 
    else if (star.radius > starConfig.radius.max)
    {
        star.radius = starConfig.radius.max;
        star.radiusDelta = -1;
    }

    // if star brightness is bigger than max or smaller than min, reset it to bounds and update the delta
    if (star.brightness < starConfig.brightness.min)
    {
        star.brightness = starConfig.brightness.min;
        star.brightnessDelta = 1;
    } 
    else if (star.brightness > starConfig.brightness.max)
    {
        star.brightness = starConfig.brightness.max;
        star.brightnessDelta = -1;
    }
}

// draws a single star
function drawStar(star)
{
    drawCircle(star.x, star.y, star.radius, `rgba(255, 255, 255, ${star.brightness})`)
}