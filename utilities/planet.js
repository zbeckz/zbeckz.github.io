function createPlanet(sunX, sunY, sunRadius, orbitDirection)
{
    return {
        sunX: sunX,
        sunY: sunY,
        theta: getRandomFloat(0, TwoPi),
        orbitRadius: sunRadius + getRandomFloat(planetConfig.orbit.min, planetConfig.orbit.max),
        radius: getRandomFloat(planetConfig.radius.min, planetConfig.radius.max),
        color: getRandomColor(planetConfig),
        speed: orbitDirection * getRandomFloat(planetConfig.speed.min, planetConfig.speed.max),
        rotationDirection: Math.random() < 0.5 ? 1 : -1,
        rotationTheta: 0,
        rotationSpeed: getRandomFloat(planetConfig.rotationSpeed.min, planetConfig.rotationSpeed.max)
    };
};

function spawnPlanets(currSuns)
{
    // loop through all the suns that currently need planets
    for (const sun of currSuns)
    {
        const amount = getRandomFloat(planetConfig.amount.min, planetConfig.amount.max)

        // planets orbiting around the same sun should have the same orbit direction
        const orbitDirection = Math.random() < 0.5 ? 1 : -1
        for (let i = 0; i < amount; i++)
        {
            planets.push(createPlanet(sun.x, sun.y, sun.radius, orbitDirection))
        }
    }
}

function updatePlanet(planet)
{
   // move planet, reset theta to within 0-2pi if necessary to avoid exploding values
   planet.theta += planet.speed;
   if (planet.theta < 0) planet.theta += TwoPi
   if (planet.theta > TwoPi) planet.theta -= TwoPi

   // update x and y value. This is stored so that planet dots can access it in their reference
   planet.x = planet.sunX + planet.orbitRadius*Math.cos(planet.theta);
   planet.y = planet.sunY + planet.orbitRadius*Math.sin(planet.theta);

   // rotate planet, reset theta to within 0-2pi if necessary to avoid exploding values
   planet.rotationTheta += planet.rotationSpeed * planet.rotationDirection;
   if (planet.rotationTheta < 0) planet.rotationTheta += TwoPi
   if (planet.rotationTheta > TwoPi) planet.rotationTheta -= TwoPi
}

function drawPlanet(planet)
{
    drawCircle(planet.x, planet.y, planet.radius, planet.color);
}