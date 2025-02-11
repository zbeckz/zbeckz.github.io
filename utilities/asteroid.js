// set timeout to recursively send asteroid
function setAsteroidTimeout()
{
    setTimeout(() => {
        spawnAsteroid();
        setAsteroidTimeout();
    }, getRandomFloat(asteroidConfig.time.min, asteroidConfig.time.max))
}

function spawnAsteroid()
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
    const scale = getRandomFloat(asteroidConfig.speed.min, asteroidConfig.speed.max)/Math.sqrt(vx*vx + vy*vy);
    asteroid = {
        x: x,
        y: y,
        velocity: {
            x: vx * scale,
            y: vy * scale,
        },
        radius: getRandomFloat(asteroidConfig.radius.min, asteroidConfig.radius.max),
        color: "brown"
    };
}

function updateAsteroid()
{
    asteroid.x += asteroid.velocity.x;
    asteroid.y += asteroid.velocity.y;
}

function drawAsteroid()
{
    // draw trailing fire
    const trail = 10;
    for (let i = 2; i <= trail; i++)
    {
        drawCircle(
            asteroid.x - asteroid.velocity.x*i*asteroid.radius*0.05, 
            asteroid.y - asteroid.velocity.y*i*asteroid.radius*0.05, 
            asteroid.radius - asteroid.radius*(i/trail), 
            `rgba(255, 165, 0, ${1 - i/trail})`
        )
    }

    // draw main asteroid
    drawCircle(asteroid.x, asteroid.y, asteroid.radius, asteroid.color);
}