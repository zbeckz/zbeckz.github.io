class Planet extends SpaceObject 
{
    constructor(sunRef, orbitDirection)
    {
        const orbitRadius = sunRef.radius + getRandomFromConfig(planetConfig.orbit);
        const theta = getRandomFloat(0, TwoPi);
        super(sunRef.x +orbitRadius*Math.cos(theta), sunRef.y + orbitRadius*Math.sin(theta), getRandomFromConfig(planetConfig.radius), getRandomColorFromConfig(planetConfig));
        this.sunRef = sunRef;
        this.theta = theta
        this.orbitRadius = orbitRadius;
        this.speed = orbitDirection * getRandomFromConfig(planetConfig.speed);
        this.rotationDirection = Math.random() < 0.5 ? 1 : -1;
        this.rotationTheta = 0;
        this.rotationSpeed = getRandomFromConfig(planetConfig.rotationSpeed);
    }

    update()
    {
        // move planet, reset theta to within 0-2pi if necessary to avoid exploding values
        this.theta += this.speed;
        if (this.theta < 0) this.theta += TwoPi
        if (this.theta > TwoPi) this.theta -= TwoPi

        // update x and y value. This is stored so that planet dots can access it in their reference
        this.x = this.sunRef.x + this.orbitRadius*Math.cos(this.theta);
        this.y = this.sunRef.y + this.orbitRadius*Math.sin(this.theta);

        // rotate planet, reset theta to within 0-2pi if necessary to avoid exploding values
        this.rotationTheta += this.rotationSpeed * this.rotationDirection;
        if (this.rotationTheta < 0) this.rotationTheta += TwoPi
        if (this.rotationTheta > TwoPi) this.rotationTheta -= TwoPi
    }

    static Spawn(currSuns=suns)
    {
        // loop through all the suns that currently need planets
        for (const sun of currSuns)
        {
            const amount = getRandomFloat(planetConfig.amount.min, planetConfig.amount.max)
    
            // planets orbiting around the same sun should have the same orbit direction
            const orbitDirection = Math.random() < 0.5 ? 1 : -1
            for (let i = 0; i < amount; i++)
            {
                planets.push(new Planet(sun, orbitDirection));
            }
        }
    }
}