function createPlanetDot(planet, color)
{
    const radius = getRandomFloat(planetDotConfig.radius.min, planetDotConfig.radius.max)
    return {
        planetRef: planet,
        r: getRandomFloat(0, planet.radius - radius),
        theta: getRandomFloat(0, TwoPi),
        color: color,
        radius: radius
    }
}

function spawnPlanetDots(currPlanets)
{
    for (const planet of currPlanets)
    {
        const amount = getRandomFloat(planetDotConfig.amount.min, planetDotConfig.amount.max);
        const color = getRandomColor(planetDotConfig);

        for (let i = 0; i < amount; i++)
        {
            planetDots.push(createPlanetDot(planet, color));
        }
    }
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