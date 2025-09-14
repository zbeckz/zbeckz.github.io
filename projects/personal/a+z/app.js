// globals
var hearts = []
var numhearts = 12
var heartSpeed = 1.22
var firstClick = true;
var heartMedia = 
[
    {
        url: "https://cdn.glitch.global/d1251a0b-6f61-44a4-ad38-39cd5020f740/AZ0.jpg",
        date: "2/16/23",
        description: "The first photo that we took together! I remember wanting to take photos with you and we kept saying we would and forgetting. I was always so caught up in the moment enjoying our time together that I wouldn't remember to take a photo. That's a pretty good problem to have! :)"
    },

    {
        url: "https://cdn.glitch.global/d1251a0b-6f61-44a4-ad38-39cd5020f740/AZ1.jpg",
        date: "3/8/23",
        description: "The first formal we went to! SHPE formal at norris. You looked so stunning. It was really really fun getting to go an event with a date <3"
    },

    {
        url: "https://cdn.glitch.global/d1251a0b-6f61-44a4-ad38-39cd5020f740/AZ2.jpg",
        date: "5/19/23",
        description: "SHPE formal number 2! Again you are STUNNING. Gorgeous. Beautiful. I should just copy all the synonyms from the thesauraus in here. I had a blast with you"
    },

    {
        url: "https://cdn.glitch.global/d1251a0b-6f61-44a4-ad38-39cd5020f740/AZ3.jpg",
        date: "6/11/23",
        description: "Dinner at The Barn with your mom to celebrate your birthday! Albeit 1 week early. It was nice getting to spend time with you and your mother, seeing as I was already madly in love with you and hoping she would be my mother in law one day"
    },

    {
        url: "https://cdn.glitch.global/d1251a0b-6f61-44a4-ad38-39cd5020f740/AZ4.jpg",
        date: "7/3/23",
        description: "The Wilmette fireworks! It was so special for me to get to take you to this event I'd go to as a child in the place I grew up in. I had so much fun walking around with you, eating yummy food, and just experiencing life with my love"
    },

    {
        url: "https://cdn.glitch.global/d1251a0b-6f61-44a4-ad38-39cd5020f740/AZ5.jpg",
        date: "8/6/23",
        description: "Maine with the girl!!! Best vacation I've ever been on. So fun to meet Elphie bear (and your aunt lol) and explore the east coast with my princess. Looking forward to many more vacations with you lovey"
    },

    {
        url: "https://cdn.glitch.global/d1251a0b-6f61-44a4-ad38-39cd5020f740/AZ6.jpg",
        date: "8/8/23",
        description: "Maine part 2! The photogenic picture! You truly are so photogenic. It was nice that someone else recognized that, and it was fun getting recognized as a couple!!!"
    },

    {
        url: "https://cdn.glitch.global/d1251a0b-6f61-44a4-ad38-39cd5020f740/AZ7.jpg",
        date: "9/23/23",
        description: "Shopping at old orchard mall! It was so exciting getting to explore stores with you - you make everything so much more interesting and I love hearing your thoughts. We weill be back!"
    },

    {
        url: "https://cdn.glitch.global/d1251a0b-6f61-44a4-ad38-39cd5020f740/AZ8.jpg",
        date: "9/29/23",
        description: "Dinner at Maggiano's for our 8 month anniversary! Yummy food with my snack ;) I love enjoying good food with you, the best company in the world"
    },

    {
        url: "https://cdn.glitch.global/d1251a0b-6f61-44a4-ad38-39cd5020f740/AZ9.jpg",
        date: "12/8/23",
        description: "1st date anniversary dinner at Valley Lodge! God I love those pretzel bites. God I love you! What a great time. Looking forward to another anniversary dinner tonight!"
    },

    {
        url: "https://cdn.glitch.global/d1251a0b-6f61-44a4-ad38-39cd5020f740/AZ10.jpg",
        date: "12/22/23",
        description: "Eating Ted Drewes together! I am so thrilled I got to spend time with you in St. Louis, and grateful you indulged me in my obsession with eating ted drewes and imos while I am there. It was so special getting to share that with you!"
    },

    {
        url: "https://cdn.glitch.global/d1251a0b-6f61-44a4-ad38-39cd5020f740/AZ11.jpg",
        date: "1/1/24",
        description: "Christmas celebration at botanical gardens! I know how much you enjoy the festive vibes, and it truly is contagious. I love seeing you happy and enjoying it and it makes it even more enjoyable for me as well. Love you so much <3"
    },
]

// immediately setup the p5 behavior
window.onload = function()
{
    while (localStorage.getItem("isLoggedIn") !== "True")
    {
        let password = prompt("Please Enter The Password (Hint - it is the location of our first date, case does not matter):", "")
        if (password.toUpperCase().includes("COLECTIVO"))
        {
            localStorage.setItem("isLoggedIn", "True")
        }
    }
    
    // create p5 instance with canvas to display hearts
    new p5(p => 
    {
        p.setup = () => 
        {
            // create the canvas
            p.createCanvas(innerWidth*0.9, innerHeight*0.9)

            // setup the drawing modes
            p.colorMode(p.RGB)

            // setup the hearts
            for (let i = 0; i < numhearts; i++)
            {
                let angle = p.random(0, p.TWO_PI)

                hearts.push({
                    x: p.random(20, p.width),
                    y: p.random(20, p.height),
                    size: 40,
                    vx: heartSpeed * p.cos(angle),
                    vy: heartSpeed * p.sin(angle),
                    n: i,
                })
            }
        }

        p.draw = () => 
        {
            // redrwaw light pink background
            p.background(255, 222, 222)

            // drawing modes setup
            p.strokeWeight(1)
            p.stroke(0, 0, 0)

            // get mouse position
            let mouseX = p.mouseX
            let mouseY = p.mouseY

            // flags to ensure only one heart is activated by the mouse at a time
            let heartActivated = false;
            
            // draw the hearts
            for (let i = 0; i < hearts.length; i++)
            {
                // get heart
                let h = hearts[i]

                // update position based on velocity
                updateheart(p, h)

                // set fill color based on if mouse is within bounds of heart and draw accordingly
                if (!h.clicked && !heartActivated && isInheartBounds(mouseX, mouseY, h))
                {
                    p.fill(255, 0, 0, 255)
                    heartActivated = true
                    drawheart(p, h.x, h.y, h.size * 1.22)
                }
                else
                {
                    p.fill(255, 0, 0, 50)
                    drawheart(p, h.x, h.y, h.size)
                }

            }
            
        }

        p.mouseClicked = () => 
        {
            // get mouse position
            let mouseX = p.mouseX
            let mouseY = p.mouseY
            
            // loop through all the hearts to see if one needs to be activated
            for (let i = 0; i < hearts.length; i++)
            {
                // get heart
                let h = hearts[i]

                // if this heart has been clicked, send to handler, delete, and stop looping through
                if (isInheartBounds(mouseX, mouseY, h))
                {
                    hearts.splice(i, 1)
                    handleClick(h)
                    break
                }

            }
        }
    })
}

// given center coordinate, draws heart at that position with whatever stroke and fill settings are active
// modified from https://editor.p5js.org/Mithru/sketches/Hk1N1mMQg
function drawheart(p, cx, cy, r)
{
    p.beginShape();
    p.vertex(cx, cy);
    p.bezierVertex(cx - r / 2, cy - r / 2, cx - r, cy + r / 3, cx, cy + r);
    p.bezierVertex(cx + r, cy + r / 3, cx + r / 2, cy - r / 2, cx, cy);
    p.endShape(p.CLOSE);
}

// given a heart object, update its position based on velocity and potentially bounce it
function updateheart(p, h)
{
    // apply velocity to position
    h.x += h.vx
    h.y += h.vy

    // get bounds of heart
    let left, top, right, bottom
    [left, top, right, bottom] = getheartBounds(h)

    // bounce off walls
    if (left < 0) // left wall
    {
        h.x = h.size/2
        h.vx *= -1
    }
    else if (right > p.width) // right wall
    {
        h.x = p.width - h.size/2
        h.vx *= -1
    }

    if (top < 0) // top wall
    {
        h.y = h.size/5
        h.vy *= -1
    }
    else if (bottom > p.height) // bottom wall
    {
        h.y = p.height - h.size
        h.vy *= -1
    }
}

// given a heart object, return an array of bounds like [left, top, right, bottom]
function getheartBounds(h)
{
    return [h.x - h.size/2, h.y - h.size/5, h.x + h.size/2, h.y + h.size]
}

// checks if a coordinate is within the bounds of a heart object
function isInheartBounds(x, y, h)
{
    let l, t, r, b
    [l, t, r, b] = getheartBounds(h)
    
    return !(x < l || x > r || y < t || y > b)
}

// given a heart object, handles the response of clicking it
function handleClick(h)
{
    // if this is the first time a heart has been clicked, display table header
    if (firstClick)
    {
        firstClick = false
        addTableHeader()   
    }

    // get the description object to display
    let o = heartMedia[h.n]

    // add row
    addTableRow(o)

    // if no hearts are left, display final image!
    if (hearts.length == 0)
    {
        displayFinalImage()
    }
}

// display final image in place of canvas
function displayFinalImage()
{
    // remove canvas
    let canvas = document.getElementById("defaultCanvas0")
    canvas.remove()

    // creatu photo
    let photo = document.createElement('img')
    photo.src = "https://cdn.glitch.global/d1251a0b-6f61-44a4-ad38-39cd5020f740/AZFinale.jpg"
    photo.id = "finale" 

    // add it to body
    let body = document.body
    body.appendChild(photo)
}

// given the media object, add the row to the table
function addTableRow(o)
{
    let body = document.getElementById("mediaTableBody")
    let row = body.insertRow(0)

    // photo
    let cell = row.insertCell(0)
    cell.className = "mediaTablePhoto"
    let photo = document.createElement('img');
    photo.src = o.url;
    cell.appendChild(photo);

    // date
    cell = row.insertCell(1)
    cell.className = "mediaTableDate"
    cell.innerHTML = o.date

    // description
    cell = row.insertCell(2)
    cell.className = "mediaTableDescription"
    cell.innerHTML = o.description
}

function addTableHeader()
{
    let header = document.getElementById("mediaTableHead")
    let row = header.insertRow(0)

    let contents = ["abcde", "abcd", "abcdefgtijk"]
    for (let i = 0; i < contents.length; i++)
    {
        let cell = row.insertCell(i)
        cell.className = "mediaTableHeadCell"
        cell.innerHTML = contents[i]
    }
}