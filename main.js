
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

// Safari/Chrome mobile sometimes override scrollTo, so delay it
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



function preloadImages() {
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        //img.src = getFrameFileName(i);
        img.src = getFrameFileName(i) + "?v=" + Date.now();
        images[i] = img;

        img.onload = () => {
            imagesLoaded++;

            // Update % text (smooth)
            const p = Math.round((imagesLoaded / frameCount) * 100);
            loaderProgress.textContent = p + "%";

            // Draw first frame immediately
            if (i === 1) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }

            // When ALL frames loaded
            if (imagesLoaded === frameCount) {
                // Fade out text slightly before overlay disappears
                document.querySelector(".loader-text").style.opacity = "0";

                setTimeout(() => {
                    loaderOverlay.classList.add("hidden");
                    startAutoScrollAfterDelay(); // auto scroll starts after delay
                }, 700); // small delay adds elegance
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


let inactivityTimer;
//console.log(window.innerHeight);
const maxScroll = document.body.scrollHeight - window.innerHeight;
const AUTO_SCROLL_SPEED = maxScroll * 0.00054; 

const INACTIVITY_DELAY = 4000;

let autoScroll = false;

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


