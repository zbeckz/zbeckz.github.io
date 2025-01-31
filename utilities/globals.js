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
        distance: 350,
        randomness: 100
    },
    radius: {
        min: 20,
        max: 30
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
    spots: { 
        threshold: 0.975,
        radius: {
            min: 1,
            max: 2
        },
        lifeSpan: {
            min: 12,
            max: 32
        }
    }
}

const planetConfig = {
    amount: {
        min: 1,
        max: 5,
    },
    orbit: {
        min: 40,
        max: 70
    },
    radius: {
        min: 5,
        max: 10
    },
    speed: {
        min: 0.00075,
        max: 0.0075,
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
    dots: {
        amount: {
            min: 0,
            max: 10
        },
        radius: {
            min: 0.5,
            max: 1.5
        }
    },
    rotationSpeed: {
        min: 0.01,
        max: 0.05,
    }
}


// GLOBAL VARS
let projectData; // array of project data fetched from the project-info.json

let canvas; // canvas element
let context; // context part of canvas element

let homePageProjectImg; // image element
let currentProjectPreview = -1; // current index into the projectData array (-1 means the code image)
let homePageImageTransitionDuration; // will get from css root config to ensure it matches the css transition time

let maxWindowWidth; // used for background generation upon bigger canvas sizes
let minWindowWidth; // used for background generation upon bigger canvas sizes

let stars = []; // array of stars to draw and stuff
let suns = []; // array of suns