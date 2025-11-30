
const canvas = document.getElementById("animCanvas");
const ctx = canvas.getContext("2d");

const frameCount = 631;

canvas.width = 1920;
canvas.height = 1080;

const images = [];
let imagesLoaded = 0;

function getFrameFileName(index) {
    return `RenderFrames/${String(index).padStart(4, "0")}.jpg`;
} 

function preloadImages() {
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = getFrameFileName(i);
        images[i] = img;

        img.onload = () => {
            imagesLoaded++;
            if (i === 1) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        };
    }
}

preloadImages();


function getScrollFrame() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const maxScrollTop =
        (document.documentElement.scrollHeight || document.body.scrollHeight)
        - window.innerHeight;

    const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;

    return Math.min(frameCount, Math.max(1, Math.floor(scrollFraction * frameCount)));
}

let currentFrameIndex = 1;

// RENDER LOOP (draws frames)
function render() {
    const targetFrame = getScrollFrame();

    if (targetFrame !== currentFrameIndex && images[targetFrame]) {
        ctx.drawImage(images[targetFrame], 0, 0, canvas.width, canvas.height);
        currentFrameIndex = targetFrame;
    }

    requestAnimationFrame(render);
}

requestAnimationFrame(render);

// AUTO-SCROLL + USER INTERRUPTION 

let autoScroll = true;
let inactivityTimer;
//console.log(window.innerHeight);
const maxScroll = document.body.scrollHeight - window.innerHeight;
const AUTO_SCROLL_SPEED = maxScroll * 0.0005; 

const INACTIVITY_DELAY = 4000;

function resetInactivityTimer() {
    autoScroll = false;

    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        autoScroll = true;
    }, INACTIVITY_DELAY);
}

// Detect some user interaction
["wheel", "keydown", "touchstart", "touchmove", "click"].forEach(event => {
    window.addEventListener(event, resetInactivityTimer, { passive: true });
});

// AUTO-SCROLL LOOP
function autoScrollTick() {
    if (autoScroll) {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        if (window.scrollY < maxScroll) {
            window.scrollTo(0, window.scrollY + AUTO_SCROLL_SPEED);
        }
    }
    requestAnimationFrame(autoScrollTick);
}

autoScrollTick();


