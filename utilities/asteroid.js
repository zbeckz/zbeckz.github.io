class Asteroid extends SpaceObject
{
    constructor(x, y, vx, vy, scale)
    {
        super(x, y, getRandomFromConfig(asteroidConfig.radius), "brown");
        this.v = {x: vx * scale,y: vy * scale}
    }

    update()
    {
        this.x += this.v.x;
        this.y += this.v.y;
    }

    draw()
    {
        // draw trailing fire
        const trail = 10;
        for (let i = 2; i <= trail; i++)
        {
            drawCircle(
                this.x - this.v.x*i*this.radius*0.05, 
                this.y - this.v.y*i*this.radius*0.05, 
                this.radius - this.radius*(i/trail), 
                `rgba(255, 165, 0, ${1 - i/trail})`
            )
        }

        // draw main asteroid
        super.draw();
    }

    static Spawn()
    {
        const ran = Math.random();
        let x, y, targetX, targetY;
        
        // left of screen
        if (ran < 0.25)
        {
            x = -1 * asteroidConfig.radius.max;
            y = getRandomFloat(0, canvas.height);
            targetX = getRandomFloat(canvas.width/2, canvas.width);
            targetY = getRandomFloat(0, canvas.height);
            
        }
        
        // above screen
        else if (ran < 0.5)
        {
            x = getRandomFloat(0, canvas.width);
            y = -1 * asteroidConfig.radius.max;
            targetX = getRandomFloat(0, canvas.width);
            targetY = getRandomFloat(canvas.height/2, canvas.height);
        }

        // right of screen
        else if (ran < 0.75)
        {
            x = canvas.width + asteroidConfig.radius.max;
            y = getRandomFloat(0, canvas.height);
            targetX = getRandomFloat(0, canvas.width/2);
            targetY = getRandomFloat(0, canvas.height);
        }

        // below screen
        else
        {
            x = getRandomFloat(0, canvas.width);
            y = canvas.height + asteroidConfig.radius.max;
            targetX = getRandomFloat(0, canvas.width);
            targetY = getRandomFloat(0, canvas.height/2);
        }

        const vx = targetX - x;
        const vy = targetY - y;
        const scale = getRandomFromConfig(asteroidConfig.speed)/Math.sqrt(vx*vx + vy*vy);
        asteroid = new Asteroid(x, y, vx, vy, scale);
    }
}

// set timeout to recursively send asteroid
function setAsteroidTimeout()
{
    setTimeout(() => {
        Asteroid.Spawn();
        setAsteroidTimeout();
    }, getRandomFromConfig(asteroidConfig.time))
}