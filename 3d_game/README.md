# 3D Game with Third-Person Character

A simple 3D game featuring a third-person character that must avoid zombies while exploring a field.

## Features

- 3D environment with a green field
- Third-person character with basic movement
- Zombies that chase the player
- Score system based on survival time
- Game over when zombies catch you
- Camera follows the character

## Controls

- W: Move forward
- A: Move left
- S: Move backward
- D: Move right
- R: Restart game after game over

## Gameplay

- Avoid the green zombies that will chase you
- Zombies detect you when you're close enough
- New zombies spawn periodically
- Your score increases the longer you survive
- Game ends when a zombie touches you

## How to Run

1. Make sure you have Node.js installed
2. Navigate to the project directory in your terminal
3. Install dependencies:
   ```
   npm install
   ```
4. Start the game:
   ```
   npm start
   ```
5. Open your browser and go to `http://localhost:8080`

## Technologies Used

- Three.js for 3D rendering
- HTML5/JavaScript
- Node.js with http-server for development 