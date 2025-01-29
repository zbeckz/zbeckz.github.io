// GLOBAL CONSTS
const canvasUpdateDelta = 10; // in ms, how frequently canvas gets redrawn
const starThreshold = 0.9996; // determines density of stars that are generated. Higher number = LESS stars
const homePageSlideshowDelta = 10000; // in ms, how long between each picture transition for project preview\

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


// GLOBAL VARS
let projectData; // array of project data fetched from the project-info.json

let canvas; // canvas element
let context; // context part of canvas element

let homePageProjectImg; // image element
let currentProjectPreview = -1; // current index into the projectData array (-1 means the code image)
let homePageImageTransitionDuration; // will get from css root config to ensure it matches the css transition time

let maxWindowWidth; // used for star generation upon bigger canvas sizes
let minWindowWidth; // used for star generation upon bigger canvas sizes

let stars = []; // array of stars to draw and stuff