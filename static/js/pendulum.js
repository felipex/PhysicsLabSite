document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('pendulumCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startPendulum');
    const resetBtn = document.getElementById('resetPendulum');
    const lengthRange = document.getElementById('lengthRange');
    const angleRange = document.getElementById('angleRange');

    let length = parseFloat(lengthRange.value);
    let angle = parseFloat(angleRange.value) * Math.PI / 180;
    let angularVelocity = 0;
    let isRunning = false;
    let animationId = null;

    const g = 9.81; // acceleration due to gravity
    const damping = 0.995; // damping factor
    
    function drawPendulum(angle) {
        const centerX = canvas.width / 2;
        const centerY = 50;
        const scale = 100; // pixels per meter
        const bobRadius = 15;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw pivot point
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#666';
        ctx.fill();
        
        // Calculate bob position
        const bobX = centerX + Math.sin(angle) * (length * scale);
        const bobY = centerY + Math.cos(angle) * (length * scale);
        
        // Draw string
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        
        // Draw bob
        ctx.beginPath();
        ctx.arc(bobX, bobY, bobRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'var(--bs-primary)';
        ctx.fill();
    }

    function updatePendulum() {
        // Calculate angular acceleration
        const angularAcceleration = -(g / length) * Math.sin(angle);
        
        // Update angular velocity and angle
        angularVelocity += angularAcceleration * 0.1; // time step
        angularVelocity *= damping;
        angle += angularVelocity * 0.1;
        
        drawPendulum(angle);
        
        if (isRunning) {
            animationId = requestAnimationFrame(updatePendulum);
        }
    }

    function startSimulation() {
        if (!isRunning) {
            isRunning = true;
            startBtn.textContent = 'Pausar';
            updatePendulum();
        } else {
            isRunning = false;
            startBtn.textContent = 'Iniciar';
            cancelAnimationFrame(animationId);
        }
    }

    function resetSimulation() {
        isRunning = false;
        startBtn.textContent = 'Iniciar';
        cancelAnimationFrame(animationId);
        length = parseFloat(lengthRange.value);
        angle = parseFloat(angleRange.value) * Math.PI / 180;
        angularVelocity = 0;
        drawPendulum(angle);
    }

    // Event listeners
    startBtn.addEventListener('click', startSimulation);
    resetBtn.addEventListener('click', resetSimulation);
    
    lengthRange.addEventListener('input', function() {
        length = parseFloat(this.value);
        if (!isRunning) {
            drawPendulum(angle);
        }
    });
    
    angleRange.addEventListener('input', function() {
        angle = parseFloat(this.value) * Math.PI / 180;
        if (!isRunning) {
            drawPendulum(angle);
        }
    });

    // Initial draw
    drawPendulum(angle);
});
