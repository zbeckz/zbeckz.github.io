class PlanetDot extends SpaceObject
{
    constructor(planetRef, color)
    {
        const radius = getRandomFromConfig(planetDotConfig.radius);
        const theta = getRandomFloat(0, TwoPi);
        const r = getRandomFloat(0, planetRef.radius - radius);
        super(planetRef.x + r*Math.cos(planetRef.rotationTheta + theta), planetRef.y + r*Math.sin(planetRef.rotationTheta + theta), radius, color);
        this.planetRef = planetRef;
        this.theta = theta;
        this.r = r;
    }

    update()
    {
        this.x = this.planetRef.x + this.r*Math.cos(this.planetRef.rotationTheta + this.theta);
        this.y = this.planetRef.y + this.r*Math.sin(this.planetRef.rotationTheta + this.theta);
    }

    static Spawn(currPlanets=planets)
    {
        for (const planet of currPlanets)
        {
            const amount = getRandomFromConfig(planetDotConfig.amount);
            const color = getRandomColorFromConfig(planetDotConfig);
    
            for (let i = 0; i < amount; i++)
            {
                planetDots.push(new PlanetDot(planet, color));
            }
        }
    }
}