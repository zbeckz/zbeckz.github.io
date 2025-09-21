class Sun extends SpaceObject 
{
    constructor(x, y)
    {
        super(x, y, getRandomFromConfig(sunConfig.radius), getRandomColorFromConfig(sunConfig));
    }

    static Spawn(xMin=0, xMax=canvas.width, yMin=0, yMax=canvas.height)
    {
        const spawnedSuns = [];

        // keeps entirely within screen
        const bufferDist = sunConfig.radius.max + sunConfig.spread.randomness
        for (let i = xMin + bufferDist; i < xMax - bufferDist; i += sunConfig.spread.distance)
        {
            const newSun = new Sun(
                    i + getRandomFloat(-1*sunConfig.spread.randomness, sunConfig.spread.randomness), 
                    getRandomFloat(yMin+sunConfig.radius.max, yMax-sunConfig.radius.max))
            suns.push(newSun);
            spawnedSuns.push(newSun)
        }

        return spawnedSuns;
    }
}