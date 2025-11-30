
window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
        window.location.reload();
    }
});

if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {

    window.location.href = window.location.pathname + "?reload=" + Date.now();
}

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

window.addEventListener("load", () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 50);
});


const canvas = document.getElementById("animCanvas");
const ctx = canvas.getContext("2d");

const frameCount = 631;

canvas.width = 1920;
canvas.height = 1080;

const images = [];
let imagesLoaded = 0;

const loaderOverlay = document.getElementById("loading-overlay");
const loaderProgress = document.getElementById("loader-progress");

function getFrameFileName(index) {
    return `RenderFrames/${String(index).padStart(4, "0")}.jpg`;
}

const MIN_FRAMES_TO_START = 365; // adjust as needed
let firstFramesReady = false;

function preloadImages() {
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = getFrameFileName(i);
        images[i] = img;

        img.onload = () => {
            imagesLoaded++;

<<<<<<< HEAD
            let p = Math.round((imagesLoaded / MIN_FRAMES_TO_START) * 100);
            p = Math.min(p, 100);
=======
            const p = Math.round((imagesLoaded / (MIN_FRAMES_TO_START+25)) * 100);
>>>>>>> 2d3653b41e7b0785f956ec36b64cd7ca4b73f92e
            loaderProgress.textContent = p + "%";

            // Draw first frame immediately
            if (i === 1) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }

            // As soon as FIRST N frames load → start animation
            if (!firstFramesReady && imagesLoaded >= MIN_FRAMES_TO_START) {
                firstFramesReady = true;
                document.querySelector(".loader-text").style.opacity = "0";

                setTimeout(() => {
                    loaderOverlay.classList.add("hidden");
                    startAutoScrollAfterDelay(); // auto start after 5 sec
                }, 300);
            }

            // When really 100% loaded — optional callback
            if (imagesLoaded === frameCount) {
                console.log("Full sequence loaded.");
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

function render() {
    const targetFrame = getScrollFrame();

    if (targetFrame !== currentFrameIndex && images[targetFrame]) {
        ctx.drawImage(images[targetFrame], 0, 0, canvas.width, canvas.height);
        currentFrameIndex = targetFrame;
    }

    requestAnimationFrame(render);
}

requestAnimationFrame(render);

let autoScroll = false;
let inactivityTimer;
//console.log(window.innerHeight);
const maxScroll = document.body.scrollHeight - window.innerHeight;
const AUTO_SCROLL_SPEED = maxScroll * 0.00054; 
const INACTIVITY_DELAY = 4000;


const countdownElement = document.getElementById("countdown-timer");
let countdownValue = INACTIVITY_DELAY / 1000; // e.g. 4 seconds
let countdownInterval;
const playButton = document.getElementById("play-button");
let isCountingDown = false;

function resetInactivityTimer() {
    autoScroll = false;

    clearInterval(countdownInterval);

    countdownValue = INACTIVITY_DELAY / 1000;
    countdownElement.textContent = countdownValue;

    countdownElement.style.opacity = "1";
    playButton.style.opacity = "0";

    countdownInterval = setInterval(() => {
        countdownValue--;
        countdownElement.textContent = countdownValue;

        if (countdownValue <= 0) {
            clearInterval(countdownInterval);

            // Hide countdown
            countdownElement.style.opacity = "0";
            playButton.style.opacity = "1";

            // Reactivate auto-scroll
            autoScroll = true;
        }
    }, 1000);
}


// Detect some user interaction
["wheel", "keydown", "touchstart", "touchmove", "click"].forEach(event => {
    window.addEventListener(event, resetInactivityTimer, { passive: true });
});


// Wait 5 seconds *after loading completes*
function startAutoScrollAfterDelay() {
    setTimeout(() => {
        autoScroll = true;
    }, 100);
}

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


