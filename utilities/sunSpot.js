class SunSpot extends SpaceObject 
{
    constructor(sunRef, index)
    {
        const r = getRandomFloat(0, sunRef.radius);
        const theta = getRandomFloat(0, TwoPi);
        super(sunRef.x + r*Math.cos(theta), sunRef.y + r*Math.sin(theta), getRandomFromConfig(sunSpotConfig.radius), getRandomColorFromConfig(sunConfig));
        this.lifeSpan = getRandomFromConfig(sunSpotConfig.lifeSpan);
        this.growthRate = getRandomFromConfig(sunSpotConfig.growthrate);
        this.sunRef = sunRef;
        this.index = index;
    }

    update()
    {
        if (this.lifeSpan <= 0)
        {
            // replace this spot with a new one
           sunSpots[this.index] = new SunSpot(this.sunRef, this.index);
        }
        else
        {
            this.lifeSpan--;
            this.radius += this.growthRate;
        }
    }

    static Spawn(currSuns=suns)
    {
        // loop through all the suns that currently need new sun spots
        let num = 0;
        for (const sun of currSuns)
        {
            const amount = getRandomFromConfig(sunSpotConfig.amount);
            for (let i = 0; i < amount; i++)
            {
                sunSpots.push(new SunSpot(sun, num));
                num++;
            }
        }
    }
}