// returns a single sun object
function createSun(x, y)
{
    return {
        x: x,
        y: y,
        radius: getRandomFloat(sunConfig.radius.min, sunConfig.radius.max),
        color: getRandomColor(sunConfig),
    }
}

function spawnSuns(xMin, xMax, yMin, yMax)
{
    // keeps entirely within screen
    const bufferDist =  sunConfig.radius.max + sunConfig.spread.randomness
    for (let i = xMin + bufferDist; i < xMax - bufferDist; i += sunConfig.spread.distance)
    {
        suns.push(
            createSun(
                i + getRandomFloat(-1*sunConfig.spread.randomness, sunConfig.spread.randomness), 
                getRandomFloat(yMin+sunConfig.radius.max, yMax-sunConfig.radius.max))
        )
    }
}

// draws a sun, its spots, and its planets
function drawSun(sun)
{
    drawCircle(sun.x, sun.y, sun.radius, sun.color);
}