// GLOBAL CONSTS
const canvasUpdateDelta = 10; // in ms, how frequently canvas gets redrawn
const homePageSlideshowDelta = 10000; // in ms, how long between each picture transition for project preview\

const starThreshold = 0.9996; // determines density of stars that are generated. Higher number = LESS stars
const starRadius = { // config for radius twinkling
    min: 1.25,
    max: 1.75,
    multiplier: 0.03,
};
const starBrightness = { // config for brightness twinkling
    min: 0.75,
    max: 1,
    multiplier: 0.03,
}

const sunSpreadDistance = 350; // pixels between suns on average
const sunSpreadRandomness = 100; // pixel randomness
const sunRadius = { // config for sun generation radii
    min: 20,
    max: 30
}
const sunHue = { // config for sun hue generation, typically yellow orange red
    min: 22,
    max: 60,
}
const sunSaturation = { // config for sun saturation, pretty saturated
    min: 75,
    max: 100
}
const sunLightness = { // config for sun lightness, pretty middle
    min: 40,
    max: 60
}
const sunSpots = { // config for how many sun spots there are, threshold for creating new one spontaneously, threshold for re-creation
    threshold: 0.95,
    minRadius: 1,
    maxRadius: 5,
    minLifeSpan: 10,
    maxLifeSpan: 20
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