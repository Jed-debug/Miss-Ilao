// fireworks.js
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let particles = [];
let fireworksActive = false;

// 🔧 TUNING VARIABLES
const ROCKET_MIN_SPEED = 4;
const ROCKET_MAX_SPEED = 7;
const EXPLOSION_SPEED = 2.5;     // ⬅️ CONTROL EXPLOSION SPEED HERE
const PARTICLE_FADE = 0.02;    // lower = longer lasting
const GRAVITY = 0.05;          // set to 0 for no gravity

function random(min, max) {
    return Math.random() * (max - min) + min;
}

// 🚀 Firework rocket
class Firework {
    constructor(x) {
        this.x = x;
        this.y = canvas.height;
        this.targetY = random(canvas.height * 0.2, canvas.height * 0.5);
        this.speed = random(ROCKET_MIN_SPEED, ROCKET_MAX_SPEED);
        this.exploded = false;
    }

    update() {
        if (this.y > this.targetY) {
            this.y -= this.speed;
        } else if (!this.exploded) {
            this.explode();
            this.exploded = true;
        }
    }

    explode() {
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle(this.x, this.y));
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        }
    }
}

// ✨ Explosion particles
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        const angle = Math.random() * Math.PI * 2;
        const speed = random(0.5, 1) * EXPLOSION_SPEED;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.alpha = 1;
        this.gravity = GRAVITY;
        this.color = `hsl(${random(0, 360)}, 100%, 75%)`;
    }

    update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= PARTICLE_FADE;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// 🎆 Animation loop
function animate() {
    if (!fireworksActive) return;

    ctx.fillStyle = "rgba(8,51,62,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.05) {
        fireworks.push(new Firework(random(50, canvas.width - 50)));
    }

    fireworks = fireworks.filter(f => {
        f.update();
        f.draw();
        return !f.exploded;
    });

    particles = particles.filter(p => {
        p.update();
        p.draw();
        return p.alpha > 0;
    });

    requestAnimationFrame(animate);
}

// 🔄 Resize handling
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
