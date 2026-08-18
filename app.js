const loginBtn = document.getElementById('login-btn');
const loginForm = document.getElementById('login-form');
const gameOverlay = document.getElementById('game-overlay');
const balloonArea = document.getElementById('balloon-area');
const scoreDisplay = document.getElementById('score');
const closeGameBtn = document.getElementById('close-game');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

let gameUnlocked = false;
let extraGameActive = false;
let chargeInterval = null;
let chargeProgress = 0;

let score = 0;
const targetScore = 5;

const validUsername = "annikamae";
const validPassword = "123456Amazing!";

loginForm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        return false;
    }
});

loginBtn.addEventListener('mouseenter', (e) => {
    if (!gameUnlocked) {
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 100 - 50;
        loginBtn.style.transform = `translate(${x}px, ${y}px)`;
    } else if (!extraGameActive) {
        loginBtn.style.opacity = '0';

        setTimeout(() => {
            const padding = 50;
            const randomX = Math.random() * (window.innerWidth - loginBtn.offsetWidth - padding * 2) + padding;
            const randomY = Math.random() * (window.innerHeight - loginBtn.offsetHeight - padding * 2) + padding;
            
            loginBtn.style.left = `${randomX}px`;
            loginBtn.style.top = `${randomY}px`;

            loginBtn.style.opacity = '1';
        }, 200);
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!gameUnlocked) {
        gameOverlay.classList.remove('hidden');
        startBalloonGame();
    } else if (!extraGameActive) {
        const user = usernameInput.value.trim();
        const pass = passwordInput.value.trim();

        if (user === validUsername && pass === validPassword) {
            alert("Wow! Congrats bai naka-log in naka");
            let wantMore = confirm("Do you want more?");
            
            if (wantMore) {
                startDancingChargeGame();
            } else {
                alert("Bawal");
                startDancingChargeGame();
            }
        } else {
            alert("Login Failed: Incorrect username or password. Check your credentials and try again!");
        }
    }
});

function startBalloonGame() {
    score = 0;
    scoreDisplay.textContent = `Popped: ${score} / ${targetScore}`;
    balloonArea.innerHTML = '';
    closeGameBtn.classList.add('hidden');

    const spawnInterval = setInterval(() => {
        if (score >= targetScore) {
            clearInterval(spawnInterval);
            return;
        }

        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.left = Math.random() * (balloonArea.clientWidth - 40) + 'px';
        
        const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#9b59b6'];
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        balloon.addEventListener('mousedown', () => {
            score++;
            scoreDisplay.textContent = `Popped: ${score} / ${targetScore}`;
            balloon.remove();

            if (score >= targetScore) {
                closeGameBtn.classList.remove('hidden');
                scoreDisplay.textContent = "Balloons cleared! Now find me.";
            }
        });

        balloon.addEventListener('animationend', () => {
            balloon.remove();
        });

        balloonArea.appendChild(balloon);
    }, 600);
}

closeGameBtn.addEventListener('click', () => {
    gameUnlocked = true;
    gameOverlay.classList.add('hidden');
    
    const padding = 50;
    const randomX = Math.random() * (window.innerWidth - loginBtn.offsetWidth - padding * 2) + padding;
    const randomY = Math.random() * (window.innerHeight - loginBtn.offsetHeight - padding * 2) + padding;
    
    loginBtn.style.position = 'fixed';
    loginBtn.style.left = `${randomX}px`;
    loginBtn.style.top = `${randomY}px`;
    loginBtn.style.transform = 'translate(0, 0)';
    
    loginBtn.classList.add('teleporting');
    loginBtn.style.backgroundColor = '#ff4757';
    loginBtn.textContent = "Catch Me!";
});

function startDancingChargeGame() {
    extraGameActive = true;
    loginBtn.classList.remove('teleporting');
    loginBtn.classList.add('dancing');
    loginBtn.textContent = "Hold Me to Charge!";
    
    chargeProgress = 0;
    
    loginBtn.addEventListener('mousedown', startCharging);
    window.addEventListener('mouseup', stopCharging);
    loginBtn.addEventListener('mouseleave', stopCharging);
}

function startCharging(e) {
    if (!extraGameActive) return;
    e.preventDefault();

    if (chargeInterval) clearInterval(chargeInterval);

    chargeInterval = setInterval(() => {
        chargeProgress += 2; 
        
        loginBtn.style.background = `linear-gradient(90deg, #2ed573 ${chargeProgress}%, #ff4757 ${chargeProgress}%)`;
        loginBtn.textContent = `Charging... ${chargeProgress}%`;

        if (chargeProgress >= 100) {
            clearInterval(chargeInterval);
            extraGameActive = false;
            loginBtn.style.background = '#2ed573';
            loginBtn.textContent = "SUCCESS!";
            alert("Login Success!");
        }
    }, 40);
}

function stopCharging() {
    if (!extraGameActive || chargeProgress >= 100) return;
    
    if (chargeInterval) clearInterval(chargeInterval);
    chargeProgress = 0;
    loginBtn.style.background = '#ff4757';
    loginBtn.textContent = "Hold Me to Log-In!";
}


