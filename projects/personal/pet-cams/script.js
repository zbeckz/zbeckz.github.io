// GLOBAL IMAGE URLS
var currentBackgroundIndex = 1;
var backgroundUrls = 
[   
    'assets/TeddyFreddy0.jpg',
    'assets/TeddyFreddy1.jpg',
    'assets/TeddyFreddy2.jpg',
    'assets/TeddyFreddy3.jpg',
    'assets/TeddyFreddy4.jpg',
    'assets/TeddyFreddy5.jpg',
    'assets/TeddyFreddy6.jpg',
    'assets/TeddyFreddy7.jpg',
    'assets/Gus0.jpg',
    'assets/Gus1.jpg',
    'assets/Gus2.jpg',
    'assets/Gus3.jpg',
    'assets/Elphie0.jpeg',
    'assets/Elphie1.jpg',
    'assets/Elphie2.jpeg',
    'assets/Elphie3.jpeg',
]

// OPEN OR CLOSED TRACKING
let linksOpen = 
{
    FF: false,
    DM: false,
    SV: false,
    DC: false,
    DD: false,
    PP: false,
    YP: false,
    BZ: false
}

// Takes in a string id that represents which links to now display. Handles name onclicks
function openName(id)
{
    // setup links var for later
    let links;
    let newClass;
    let newName;

    // check if name is currently opened or closed
    if (linksOpen[id])
    {
        linksOpen[id] = false;
        links = document.getElementsByClassName("linkOpen");
        newClass = "link";
        newName = "name"
    }
    else
    {
        linksOpen[id] = true;
        links = document.getElementsByClassName("link");
        newClass = "linkOpen"
        newName="nameOpen"
    }

    // loop through the links, open the ones that match the id
    for (let i = links.length-1; i >= 0; i--)
    {
        let link = links[i];
        if (link.id.includes(id))
        {
            link.className = newClass;
        }
    }

    // change class of name itself
    document.getElementById(id).className = newName;
}

// handles background change button
function changeBackground(n)
{
    // update to next picture
    currentBackgroundIndex += n;

    if (currentBackgroundIndex < 0) // if its less than 0, loop too top of array
    {
        currentBackgroundIndex = backgroundUrls.length - 1;
    }
    else if (currentBackgroundIndex >= backgroundUrls.length) // if greater than bound, loop to start of array
    {
        currentBackgroundIndex = 0;
    }

    document.getElementById("content").style.backgroundImage = `url(${backgroundUrls[currentBackgroundIndex]})`
}