# Orb Shooter 🎮

A classic **top-down arena shooter** built with pure **HTML, CSS, and JavaScript**.  
No frameworks, no backend — just fast-paced arcade action right in your browser.

---

## 📖 Overview
You control the **cyan orb**, moving with **WASD** and aiming/shooting with the mouse.  
Hordes of colorful enemies spawn from the edges of the screen and relentlessly advance on your position.  

Your objective is simple:  
👉 **Survive as long as possible**  
👉 **Score as high as you can by destroying enemies**

⚠️ The game ends instantly if an enemy touches you.  
It’s pure arcade fun with no distractions — only skill and reflexes matter.

---

## 💻 Technologies Used
This game demonstrates what can be achieved with **core web technologies** alone:

- **HTML**
  - Provides the structure, including:
    - `<canvas>` element for rendering
    - Score display
    - Modal window for start/end screens

- **CSS**
  - Retro neon-noir style: dark background, glowing text, and *Press Start 2P* pixel font
  - Centers the game on the page and overlays UI (score + modal)

- **JavaScript (Vanilla)**
  - **Canvas API** → Draws and updates game objects each frame  
  - **OOP Classes** → `Player`, `Projectile`, `Enemy` keep code modular  
  - **Event Listeners** → Keyboard for movement, mouse click for shooting  
  - **Game Loop** → `requestAnimationFrame` for smooth animation and high performance

---

## ⭐ Features
- **Intuitive Controls**
  - Move with **W, A, S, D**
  - Shoot with mouse click (aim at cursor)

- **Gameplay**
  - Enemies spawn from off-screen and chase the player’s position
  - Collision detection with `Math.hypot` ensures precise hit detection
  - Survive as long as possible while racking up points

- **Scoring**
  - +100 points per enemy destroyed
  - Real-time score display (top-left corner)
  - Final score shown on **Game Over** screen

- **Lightweight**
  - 100% client-side
  - No backend, no dependencies (except Google Fonts)

---

## 🚀 Getting Started
1. Clone or download the repository  
   ```bash
   git clone https://github.com/username/orb-shooter.git
   
2. Open index.html in your browser
3. Play!
