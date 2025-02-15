class Star extends SpaceObject 
{
    constructor(x, y) 
    {
        const brightness = getRandomFromConfig(starConfig.brightness);
        super(x, y, getRandomFromConfig(starConfig.radius), `rgba(255, 255, 255, ${brightness})`);
        this.radiusDelta = Math.random() < 0.5 ? -1 : 1;
        this.brightness = brightness;
        this.brightnessDelta = Math.random() < 0.5 ? -1 : 1;
    }

    update() 
    {
        // add a random amount to the star radius and brightness
        this.radius += Math.random() * starConfig.radius.multiplier * this.radiusDelta;
        this.brightness += Math.random() * starConfig.brightness.multiplier * this.brightnessDelta;
        this.color = `rgba(255, 255, 255, ${this.brightness})`;

        // if star radius is bigger than max or smaller than min, reset it to bounds and update the delta
        if (this.radius < starConfig.radius.min)
        {
            this.radius = starConfig.radius.min;
            this.radiusDelta = 1;
        } 
        else if (this.radius > starConfig.radius.max)
        {
            this.radius = starConfig.radius.max;
            this.radiusDelta = -1;
        }

        // if star brightness is bigger than max or smaller than min, reset it to bounds and update the delta
        if (this.brightness < starConfig.brightness.min)
        {
            this.brightness = starConfig.brightness.min;
            this.brightnessDelta = 1;
        } 
        else if (this.brightness > starConfig.brightness.max)
        {
            this.brightness = starConfig.brightness.max;
            this.brightnessDelta = -1;
        }
    }

    static Spawn(xMin=0, xMax=canvas.width, yMin=0, yMax=canvas.height)
    {
        // loop through the given range
        for (let i = xMin; i < xMax; i++)
        {
            for (let j = yMin; j < yMax; j++)
            {
                // if the random number between 0 and 1 is bigger than the threshold, create new star at this location
                if (Math.random() > starConfig.threshold)
                {
                    stars.push(new Star(i, j));
                }
            }
        }
    } 
}