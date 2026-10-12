
/* =========================================
   COSMIC LIVE WALLPAPER
========================================= */

const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");

let width;
let height;

let mouseX = 0;
let mouseY = 0;

let targetMouseX = 0;
let targetMouseY = 0;


/* =========================================
   CANVAS SIZE
========================================= */

function resizeCanvas() {

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


/* =========================================
   STAR CLASS
========================================= */

class Star {

    constructor() {

        this.reset();

    }

    reset() {

        this.x = Math.random() * width;

        this.y = Math.random() * height;

        this.z = Math.random() * width;

        this.size = Math.random() * 1.8 + 0.3;

        this.speed = Math.random() * 0.8 + 0.15;

        this.opacity = Math.random() * 0.8 + 0.2;

    }

    update() {

        this.z -= this.speed;

        if (this.z <= 0) {

            this.reset();

            this.z = width;

        }

    }

    draw() {

        const centerX = width / 2;
        const centerY = height / 2;

        const scale = 180 / this.z;

        const x =
            (this.x - centerX) * scale +
            centerX +
            mouseX * 25;

        const y =
            (this.y - centerY) * scale +
            centerY +
            mouseY * 25;

        const radius =
            this.size * scale;

        if (
            x < 0 ||
            x > width ||
            y < 0 ||
            y > height
        ) {

            return;

        }

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            Math.max(radius, 0.4),
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,255,255,${this.opacity})`;

        ctx.fill();

    }

}


/* =========================================
   CREATE STARS
========================================= */

const stars = [];

for (let i = 0; i < 500; i++) {

    stars.push(
        new Star()
    );

}


/* =========================================
   GALAXY PARTICLES
========================================= */

const galaxyParticles = [];

for (let i = 0; i < 350; i++) {

    galaxyParticles.push({

        angle:
            Math.random() *
            Math.PI *
            2,

        radius:
            Math.random() *
            Math.min(width, height) *
            0.7,

        speed:
            Math.random() *
            0.0008 +
            0.0002,

        size:
            Math.random() *
            1.5 +
            0.3,

        opacity:
            Math.random() *
            0.6 +
            0.1

    });

}


/* =========================================
   DRAW GALAXY
========================================= */

function drawGalaxy() {

    const centerX =
        width / 2 +
        mouseX * 35;

    const centerY =
        height / 2 +
        mouseY * 35;


    galaxyParticles.forEach(particle => {

        particle.angle +=
            particle.speed;


        const x =
            centerX +
            Math.cos(
                particle.angle
            ) *
            particle.radius;


        const y =
            centerY +
            Math.sin(
                particle.angle
            ) *
            particle.radius *
            0.38;


        const distance =
            particle.radius /
            (Math.min(width, height) * 0.7);


        const opacity =
            particle.opacity *
            (1 - distance);


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(150,170,255,${opacity})`;

        ctx.fill();

    });

}


/* =========================================
   NEBULA
========================================= */

function drawNebula() {

    const centerX =
        width / 2 +
        mouseX * 30;

    const centerY =
        height / 2 +
        mouseY * 30;


    const gradient =
        ctx.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            Math.max(width, height) * 0.65
        );


    gradient.addColorStop(
        0,
        "rgba(90,70,255,0.12)"
    );

    gradient.addColorStop(
        0.35,
        "rgba(60,100,255,0.06)"
    );

    gradient.addColorStop(
        0.7,
        "rgba(120,40,255,0.03)"
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );

}


/* =========================================
   SHOOTING STARS
========================================= */

const shootingStars = [];

function createShootingStar() {

    if (
        Math.random() > 0.015
    ) {

        return;

    }


    shootingStars.push({

        x:
            Math.random() *
            width,

        y:
            Math.random() *
            height *
            0.5,

        length:
            Math.random() *
            100 +
            50,

        speed:
            Math.random() *
            8 +
            6,

        opacity: 1

    });

}


function drawShootingStars() {

    shootingStars.forEach(
        (star, index) => {

            star.x += star.speed;

            star.y += star.speed * 0.35;

            star.opacity -= 0.015;


            const gradient =
                ctx.createLinearGradient(
                    star.x,
                    star.y,
                    star.x - star.length,
                    star.y - star.length * 0.35
                );


            gradient.addColorStop(
                0,
                `rgba(255,255,255,${star.opacity})`
            );

            gradient.addColorStop(
                1,
                "rgba(255,255,255,0)"
            );


            ctx.beginPath();

            ctx.moveTo(
                star.x,
                star.y
            );

            ctx.lineTo(
                star.x - star.length,
                star.y - star.length * 0.35
            );

            ctx.strokeStyle =
                gradient;

            ctx.lineWidth = 2;

            ctx.stroke();


            if (
                star.opacity <= 0 ||
                star.x > width + 200
            ) {

                shootingStars.splice(
                    index,
                    1
                );

            }

        }
    );

}


/* =========================================
   MOUSE PARALLAX
========================================= */

window.addEventListener(
    "mousemove",
    function (event) {

        targetMouseX =
            (event.clientX / width - 0.5) * 2;

        targetMouseY =
            (event.clientY / height - 0.5) * 2;

    }
);


/* =========================================
   TOUCH SUPPORT
========================================= */

window.addEventListener(
    "touchmove",
    function (event) {

        if (
            event.touches.length === 0
        ) {

            return;

        }


        targetMouseX =
            (
                event.touches[0].clientX /
                width -
                0.5
            ) * 2;


        targetMouseY =
            (
                event.touches[0].clientY /
                height -
                0.5
            ) * 2;

    }
);


/* =========================================
   ANIMATION
========================================= */

function animate() {

    ctx.fillStyle =
        "#02030a";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* Smooth mouse movement */

    mouseX +=
        (targetMouseX - mouseX) *
        0.04;

    mouseY +=
        (targetMouseY - mouseY) *
        0.04;


    /* Draw effects */

    drawNebula();

    drawGalaxy();


    stars.forEach(star => {

        star.update();

        star.draw();

    });


    createShootingStar();

    drawShootingStars();


    requestAnimationFrame(
        animate
    );

}


animate();


/* =========================================
   SMOOTH NAVIGATION
========================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            function (event) {

                const target =
                    document.querySelector(
                        this.getAttribute("href")
                    );


                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({

                        behavior: "smooth"

                    });

                }

            }
        );

    });


/* =========================================
   SCROLL REVEAL
========================================= */

const sections =
    document.querySelectorAll(
        ".content-section, .contact-section"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                }

            });

        },
        {
            threshold: 0.15
        }
    );


sections.forEach(section => {

    observer.observe(section);

});


/* =========================================
   PAGE LOADED
========================================= */

console.log(
    "Vanga Harshitha Cosmic Portfolio Loaded 🚀"
);

