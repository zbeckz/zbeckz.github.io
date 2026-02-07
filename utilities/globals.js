const projectData = 
[
    {
        title: "Data Visualization",
        url: "/projects/data-visualization",
        previewImg: "/assets/data-visualization.png",
        date: "12/05/23",
        tags: ["Javascript", "HTML", "CSS", "D3.js"]
    },
    {
        title: "Simulated Evolution",
        url: "https://github.com/zbeckz/cs396-ludobots",
        previewImg: "/assets/simulated-evolution.png",
        date: "03/14/23",
        tags: ["Python", "AI/ML"]
    },
    {
        title: "Computational Lighting",
        url: "/projects/computational-lighting-webgl",
        previewImg: "/assets/computational-lighting-webgl.png",
        date: "06/14/22",
        tags: ["Javascript", "HTML", "WebGL"]
    },
    {
        title: "Generative Art",
        url: "/projects/generative-art",
        previewImg: "/assets/generative-art.png",
        date: "10/25/23",
        tags: ["Javascript", "HTML", "CSS", "Vue.js"]
    },
    {
        title: "Particle Systems",
        url: "/projects/particle-systems",
        previewImg: "/assets/particle-systems.png",
        date: "10/19/23",
        tags: ["Javascript", "HTML", "CSS", "Vue.js"]
    },
    {
        title: "Brushes",
        url: "/projects/brushes",
        previewImg: "/assets/brushes.png",
        date: "10/15/23",
        tags: ["Javascript", "HTML", "CSS", "Vue.js"]
    },
        {
        title: "Virtual Reality Game",
        url: "/projects/virtual-reality-game",
        previewImg: "/assets/virtual-reality-game.png",
        date: "06/04/23",
        tags: ["Javascript", "HTML", "CSS", "Vue.js"]
    },
    {
        title: "3D Animation",
        url: "/projects/3d-animation-webgl",
        previewImg: "/assets/3d-animation-webgl.png",
        date: "04/20/22",
        tags: ["Javascript", "HTML", "WebGL"]
    },
    {
        title: "Animations",
        url: "/projects/animations",
        previewImg: "/assets/animations.png",
        date: "10/09/23",
        tags: ["Javascript", "HTML", "CSS", "Vue.js"]
    },
    {
        title:"Chat Bots",
        url: "/projects/chat-bots",
        previewImg: "/assets/chat-bots.png",
        date: "11/03/23",
        tags: ["Javascript", "HTML", "CSS", "Vue.js"]
    },
    {
        title: "Face Tracking",
        url: "/projects/face-tracking",
        previewImg: "/assets/face-tracking.png",
        date: "11/15/23",
        tags: ["Javascript", "HTML", "CSS", "Vue.js"]
    },
    {
        title: "Idle Game",
        url: "/projects/idle-game",
        previewImg: "/assets/idle-game.png",
        date: "04/09/23",
        tags: ["Javascript", "HTML", "CSS", "Vue.js"]
    },
    {
        title: "Interactive World",
        url: "/projects/interactive-world-webgl",
        previewImg: "/assets/interactive-world-webgl.png",
        date: "05/13/22",
        tags: ["Javascript", "HTML", "WebGL"]
    },
    {
        title: "Machine Learning",
        url: "/projects/machine-learning",
        previewImg: "/assets/machine-learning.png",
        date: "11/26/23",
        tags: ["Javascript", "HTML", "CSS", "Vue.js", "AI/ML"]
    },
    {
        title: "Virtual Reality Space",
        url: "/projects/virtual-reality-space",
        previewImg: "/assets/virtual-reality-space.png",
        date: "05/21/23",
        tags: ["Javascript", "HTML", "CSS", "Vue.js"]
    },
]

let projectListSort = "default";
let projectListFilters = [];

// GLOBAL CONSTS
const TwoPi = 2 * Math.PI;

const canvasUpdateDelta = 1000 / 60; // in ms, how frequently canvas gets redrawn. 60 FPS
const homePageSlideshowDelta = 10000; // in ms, how long between each picture transition for project preview

const starConfig = {
    threshold: 0.9996,
    radius: {
        min: 1.25,
        max: 1.75,
        multiplier: 0.04,
    },
    brightness: {
        min: 0.75,
        max: 1,
        multiplier: 0.04,
    }
}

const sunConfig = {
    spread: {
       distance: 300,
       randomness: 100
    },
    radius: {
        min: 40,
        max: 70
    },
    hue: {
        min: 22,
        max: 60,
    },
    saturation: {
        min: 75,
        max: 100
    },
    lightness: {
        min: 40,
        max: 60
    },
}

const sunSpotConfig = {
    amount: {
        min: 50,
        max: 100
    },
    radius: {
        min: 1,
        max: 2
    },
    lifeSpan: {
        min: 12,
        max: 42
    },
    growthrate: {
        min: 0.01,
        max: 0.09,
    }

}

const planetConfig = {
    amount: {
        min: 1,
        max: 5,
    },
    orbit: {
        min: 10,
        max: 50
    },
    radius: {
        min: 8,
        max: 18
    },
    speed: {
        min: 0.00075,
        max: 0.0025,
    },
    hue: {
        min: 100,
        max: 335
    },
    saturation: {
        min: 75,
        max: 100
    },
    lightness: {
        min: 40,
        max: 60
    },
    rotationSpeed: {
        min: 0.01,
        max: 0.03,
    }
}

const planetDotConfig = {
    amount: {
        min: 0,
        max: 10
    },
    radius: {
        min: 0.5,
        max: 2.5
    },
    hue: {
        min: 0,
        max: 360
    },
    saturation: {
        min: 75,
        max: 100
    },
    lightness: {
        min: 40,
        max: 60
    },
}

const asteroidConfig = {
    time: {
        min: 5000, // 5 seconds
        max: 20000 // 20 seconds
    },
    radius: {
        min: 5,
        max: 15
    },
    speed: {
        min: 10,
        max: 15
    }
}

const transitionConfig = {
    speed: {
        min: 0,
        max: 15,
    },
    acceleration: 0.1,
    loopTime: 2000 // 2 seconds
}

const localStorageConfig = {
    ANIMATION: "animation",
    PAGE: "page"
}


// GLOBAL VARS
let canvas; // canvas element
let context; // context part of canvas element

let homePageProjectImg; // image element
let currentProjectPreview = -1; // current index into the projectData array (-1 means the code image)
let homePageImageTransitionDuration; // will get from css root config to ensure it matches the css transition time
let homePageSectionTransitionDuration; // will also get from css root config

let maxWindowWidth; // used for background generation upon bigger canvas sizes
let minWindowWidth; // used for background generation upon bigger canvas sizes

// SPACE OBJECTS
let stars = [];
let suns = [];
let sunSpots = []; 
let planets = [];
let planetDots = [];
let asteroid;

// Page and transition states
let pageState;
const PAGE_STATE = {
    home: 0,
    transition: 1,
}

let transitionState;
const TRANSITION_STATE = {
    accel: 0,
    coast: 1,
    deccel: 2
}
let transitionSpeed;
let transitionAcceleration;

let transitionDirection;
const TRANSITION_DIRECTION = {
    left: -1,
    right: 1,
}

// boolean, either on or off
let animationState;

// GLOBAL CLASSES

// Represents common functionality accross all space objects (asteroid, star, sun, sunSpot, planet, planetDot)
class SpaceObject {
    constructor(x, y, radius, color) 
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    // this function can be overriden by sub classes, but some may not
    update() 
    {
        return;
    }

    // this function can be overriden by sub classes, but some may not
    draw() 
    {
        drawCircle(this.x, this.y, this.radius, this.color);
    }

    transition()
    {
        this.x += transitionSpeed * transitionDirection;

        // if off screen, loop back onto screen with a random height
        if (transitionDirection === TRANSITION_DIRECTION.left ? (this.x + this.radius < 0) : (this.x - this.radius > canvas.width))
        {
            this.x = canvas.width - this.x;
            this.y = getRandomFloat(0, canvas.height);
        }
    }

    static Spawn()
    {
        throw new Error('Spawn() Must be overriden by subclass!')
    }
}