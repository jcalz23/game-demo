# Snake Game

A simple Snake game built with Python and Pygame.

## Requirements

- Python 3
- Pygame

## Installation

1. Make sure you have Python installed on your Mac. If not, download and install it from [python.org](https://python.org).
2. Install Pygame using pip:

```
pip install pygame
```

## How to Play

1. Run the game:

```
python game/snake.py
```

2. Controls:
   - Use arrow keys (Up, Down, Left, Right) to control the snake
   - Eat the red food to grow longer
   - Avoid hitting the walls or yourself
   - Press Q to quit when game over
   - Press C to play again when game over

## Features

- Score display
- Game over screen with restart option
- Increasing difficulty as snake grows longer

## Customizing Images

You can customize the game by adding your own images:

1. Place your custom images in the `game/images/` directory with these filenames:
   - For the snake's head: `snake_head.png`, `snake_head.jpg`, or `snake_head.jpeg`
   - For the snake's body segments: `snake_body.png`, `snake_body.jpg`, or `snake_body.jpeg`
   - For the food item: `food.png`, `food.jpg`, or `food.jpeg`

2. Images will be automatically loaded and scaled to the appropriate size when the game starts.

3. If no custom images are found, the game will use the default colored rectangles.

4. The game will first look for PNG files, then JPG/JPEG files.