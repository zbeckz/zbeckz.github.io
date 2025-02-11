// returns a single sun spot object
function createSunSpot(sunX, sunY, sunRadius)
{
    const r = getRandomFloat(0, sunRadius);
    const theta = getRandomFloat(0, TwoPi);
    return {
        sunX: sunX,
        sunY: sunY,
        sunRadius: sunRadius,
        x: r*Math.cos(theta),
        y: r*Math.sin(theta),
        radius: getRandomFloat(sunSpotConfig.radius.min, sunSpotConfig.radius.max),
        color: getRandomColor(sunConfig),
        lifeSpan: getRandomFloat(sunSpotConfig.lifeSpan.min, sunSpotConfig.lifeSpan.max) 
    }
}

function spawnSunSpots(currSuns)
{
    // loop through all the suns that currently need new sun spots
    for (const sun of currSuns)
    {
        const amount = getRandomFloat(sunSpotConfig.amount.min, sunSpotConfig.amount.max)
        for (let i = 0; i < amount; i++)
        {
            sunSpots.push(createSunSpot(sun.x, sun.y, sun.radius));
        }
    }
}

function updateSunSpot(sunSpot, index)
{
    if (sunSpot.lifeSpan <= 0)
    {
        // replace this spot with a new one
        sunSpots[index] = createSunSpot(sunSpot.sunX, sunSpot.sunY, sunSpot.sunRadius);
    }
    else
    {
        sunSpot.lifeSpan--;
        sunSpot.radius += sunSpotConfig.growthrate;
    }
}

function drawSunSpot(sunSpot)
{
    drawCircle(sunSpot.sunX + sunSpot.x, sunSpot.sunY + sunSpot.y, sunSpot.radius, sunSpot.color);
}