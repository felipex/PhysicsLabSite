// Global variables for sketches
let pendulumSketch = null;
let projectileSketch = null;

// Pendulum simulation
const createPendulumSketch = (p) => {
    let length;
    let angle;
    let angleVelocity = 0;
    let angleAcceleration = 0;
    const gravity = 9.81;
    let origin;
    let bob;

    p.setup = () => {
        const canvas = p.createCanvas(400, 300);
        canvas.parent('pendulum-canvas');
        origin = p.createVector(p.width/2, 50);
        length = 100;
        angle = p.PI/6;
        updateBobPosition();
    };

    p.draw = () => {
        p.background(p.color(getComputedStyle(document.documentElement).getPropertyValue('--body-bg')));
        
        // Draw pivot point
        p.stroke(p.color(getComputedStyle(document.documentElement).getPropertyValue('--link-color')));
        p.fill(p.color(getComputedStyle(document.documentElement).getPropertyValue('--link-color')));
        p.circle(origin.x, origin.y, 10);

        // Draw pendulum arm
        p.stroke(p.color(getComputedStyle(document.documentElement).getPropertyValue('--link-color')));
        p.line(origin.x, origin.y, bob.x, bob.y);

        // Draw bob
        p.fill(p.color(getComputedStyle(document.documentElement).getPropertyValue('--link-color')));
        p.circle(bob.x, bob.y, 30);

        // Update physics
        angleAcceleration = -gravity * p.sin(angle) / length;
        angleVelocity += angleAcceleration;
        angleVelocity *= 0.99; // damping
        angle += angleVelocity;
        
        updateBobPosition();
    };

    function updateBobPosition() {
        bob = p.createVector(
            origin.x + length * p.sin(angle),
            origin.y + length * p.cos(angle)
        );
    }

    p.updateParameters = (newLength, newAngle) => {
        length = newLength * 100; // Convert meters to pixels
        angle = newAngle * p.PI / 180; // Convert degrees to radians
        angleVelocity = 0;
        updateBobPosition();
    };
};

// Projectile motion simulation
const createProjectileSketch = (p) => {
    let velocity;
    let angle;
    let position;
    let velocityVector;
    const gravity = 9.81;
    let time = 0;
    let path = [];
    let isSimulating = false;

    p.setup = () => {
        const canvas = p.createCanvas(400, 300);
        canvas.parent('projectile-canvas');
        reset();
    };

    p.draw = () => {
        p.background(p.color(getComputedStyle(document.documentElement).getPropertyValue('--body-bg')));
        
        // Draw ground
        p.stroke(p.color(getComputedStyle(document.documentElement).getPropertyValue('--link-color')));
        p.line(0, p.height - 50, p.width, p.height - 50);

        // Draw path
        p.noFill();
        p.beginShape();
        for(let pos of path) {
            p.vertex(pos.x, pos.y);
        }
        p.endShape();

        // Draw projectile
        p.fill(p.color(getComputedStyle(document.documentElement).getPropertyValue('--link-color')));
        p.circle(position.x, position.y, 20);

        if(isSimulating) {
            // Update physics
            time += 0.1;
            position.x = velocityVector.x * time;
            position.y = p.height - 50 - (velocityVector.y * time - 0.5 * gravity * time * time);
            path.push(p.createVector(position.x, position.y));

            // Stop if projectile hits ground
            if(position.y >= p.height - 50) {
                isSimulating = false;
                updateResults();
            }
        }
    };

    function reset() {
        position = p.createVector(0, p.height - 50);
        path = [];
        time = 0;
    }

    function updateResults() {
        const range = position.x / 20; // Convert pixels to meters
        const maxHeight = p.max(path.map(p => p.height - 50 - p.y)) / 20;
        document.getElementById('range').textContent = range.toFixed(1);
        document.getElementById('max-height').textContent = maxHeight.toFixed(1);
    }

    p.updateParameters = (newVelocity, newAngle) => {
        velocity = newVelocity;
        angle = newAngle * p.PI / 180;
        velocityVector = p.createVector(
            velocity * p.cos(angle) * 20, // Scale for visualization
            velocity * p.sin(angle) * 20
        );
        reset();
        isSimulating = true;
    };
};

// Initialize sketches when document loads
document.addEventListener('DOMContentLoaded', () => {
    pendulumSketch = new p5(createPendulumSketch);
    projectileSketch = new p5(createProjectileSketch);
});

// Update functions called by the UI
function updatePendulum() {
    const length = parseFloat(document.getElementById('length').value);
    const angle = parseFloat(document.getElementById('angle').value);
    pendulumSketch.updateParameters(length, angle);
    
    // Update period display
    const period = 2 * Math.PI * Math.sqrt(length/9.81);
    document.getElementById('period').textContent = period.toFixed(2);
}

function updateProjectile() {
    const velocity = parseFloat(document.getElementById('velocity').value);
    const angle = parseFloat(document.getElementById('launch-angle').value);
    projectileSketch.updateParameters(velocity, angle);
}
