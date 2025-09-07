// --- SETUP ---
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreEl = document.getElementById('scoreEl');
        const modal = document.getElementById('modal');
        const startGameBtn = document.getElementById('startGameBtn');
        const modalScoreEl = document.getElementById('modal-score');
        const modalTitle = document.getElementById('modal-title');

        // --- MODIFICATION HERE ---
        // Increased the maximum size of the canvas for a larger game frame
        canvas.width = window.innerWidth > 1280 ? 1280 : window.innerWidth * 0.95;
        canvas.height = window.innerHeight > 720 ? 720 : window.innerHeight * 0.85;

        // --- GAME OBJECT CLASSES ---

        // Player Class
        class Player {
            constructor(x, y, radius, color) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.color = color;
                this.speed = 5;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // Projectile Class
        class Projectile {
            constructor(x, y, radius, color, velocity) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.color = color;
                this.velocity = velocity;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                this.draw();
                this.x += this.velocity.x;
                this.y += this.velocity.y;
            }
        }

        // Enemy Class
        class Enemy {
            constructor(x, y, radius, color, velocity) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.color = color;
                this.velocity = velocity;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                this.draw();
                this.x += this.velocity.x;
                this.y += this.velocity.y;
            }
        }

        // --- GAME STATE & VARIABLES ---
        let player;
        let projectiles;
        let enemies;
        let score;
        let animationId;
        let enemySpawnInterval;

        // --- INITIALIZE GAME ---
        function init() {
            const playerX = canvas.width / 2;
            const playerY = canvas.height / 2;
            player = new Player(playerX, playerY, 15, '#00ffff');
            projectiles = [];
            enemies = [];
            score = 0;
            scoreEl.textContent = 0;
            modalScoreEl.textContent = 'Final Score: 0';
        }


        // --- EVENT LISTENERS ---
        const keys = { w: false, a: false, s: false, d: false };
        
        window.addEventListener('keydown', (e) => {
            if (e.key in keys) keys[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            if (e.key in keys) keys[e.key] = false;
        });
        
        // Shoot on click
        window.addEventListener('click', (event) => {
            if (!animationId) return; // Don't shoot if game isn't running
            
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
            const velocity = {
                x: Math.cos(angle) * 7,
                y: Math.sin(angle) * 7
            };
            projectiles.push(new Projectile(player.x, player.y, 5, 'white', velocity));
        });

        // Start Game Button
        startGameBtn.addEventListener('click', () => {
            init();
            animate();
            spawnEnemies();
            modal.style.display = 'none';
        });

        // --- GAME LOGIC ---

        function spawnEnemies() {
            enemySpawnInterval = setInterval(() => {
                const radius = Math.random() * (30 - 10) + 10;
                let x, y;

                if (Math.random() < 0.5) {
                    x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
                    y = Math.random() * canvas.height;
                } else {
                    x = Math.random() * canvas.width;
                    y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
                }
                
                const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
                const angle = Math.atan2(player.y - y, player.x - x);
                const speed = 0.8; 
                const velocity = {
                    x: Math.cos(angle) * speed,
                    y: Math.sin(angle) * speed
                };
                
                enemies.push(new Enemy(x, y, radius, color, velocity));
            }, 1000); // Spawn an enemy every 1 second
        }

        function handlePlayerMovement() {
            if (keys.w && player.y - player.radius > 0) player.y -= player.speed;
            if (keys.a && player.x - player.radius > 0) player.x -= player.speed;
            if (keys.s && player.y + player.radius < canvas.height) player.y += player.speed;
            if (keys.d && player.x + player.radius < canvas.width) player.x += player.speed;
        }

        // --- GAME LOOP ---
        function animate() {
            animationId = requestAnimationFrame(animate);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Motion blur effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            handlePlayerMovement();
            player.draw();

            // Update projectiles
            for (let i = projectiles.length - 1; i >= 0; i--) {
                const p = projectiles[i];
                p.update();
                // Remove if off-screen
                if (p.x + p.radius < 0 || p.x - p.radius > canvas.width || p.y + p.radius < 0 || p.y - p.radius > canvas.height) {
                    projectiles.splice(i, 1);
                }
            }

            // Update enemies & check collisions
            for (let eIndex = enemies.length - 1; eIndex >= 0; eIndex--) {
                const enemy = enemies[eIndex];
                enemy.update();

                // Player-Enemy collision (Game Over)
                const distPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
                if (distPlayer - enemy.radius - player.radius < 1) {
                    cancelAnimationFrame(animationId);
                    clearInterval(enemySpawnInterval);
                    animationId = null; // Mark game as stopped
                    modal.style.display = 'flex';
                    modalTitle.textContent = 'GAME OVER';
                    modalScoreEl.textContent = `Final Score: ${score}`;
                    startGameBtn.textContent = 'Restart Game';
                }

                // Projectile-Enemy collision
                for (let pIndex = projectiles.length - 1; pIndex >= 0; pIndex--) {
                    const projectile = projectiles[pIndex];
                    const dist = Math.hypot( projectile.x - enemy.x, projectile.y - enemy.y);
                    if (dist - enemy.radius - projectile.radius < 1) {
                        score += 100;
                        scoreEl.textContent = score;
                        enemies.splice(eIndex, 1);
                        projectiles.splice(pIndex, 1);
                        break; // Move to next enemy
                    }
                }
            }
        }
        
        // Initially hide score and show start modal
        modalScoreEl.style.display = 'none';
        startGameBtn.addEventListener('click', () => {
            init();
            animate();
            spawnEnemies();
            modal.style.display = 'none';
            modalScoreEl.style.display = 'block'; // Show it for subsequent game overs
        });