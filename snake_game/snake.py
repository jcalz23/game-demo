import pygame
import time
import random
import os

# Constants
FOOD_NAME = "food"
SNAKE_NAME = "snake"

# Initialize pygame
pygame.init()

# Define colors
white = (255, 255, 255)
black = (0, 0, 0)
red = (213, 50, 80)
green = (0, 255, 0)

# Set display dimensions
display_width = 800
display_height = 600

# Set block size (snake size)
block_size = 20

# Initialize display
game_display = pygame.display.set_mode((display_width, display_height))
pygame.display.set_caption('Snake Game')

# Set clock
clock = pygame.time.Clock()

# Set game speed (FPS)
fps = 15

# Font for score
font_style = pygame.font.SysFont(None, 50)

# Create directory for images if it doesn't exist
images_dir = os.path.join(os.path.dirname(__file__), 'images')
os.makedirs(images_dir, exist_ok=True)

# Placeholder for images
snake_head_img = None
snake_body_img = None
food_img = None

def load_images():
    global snake_head_img, snake_body_img, food_img
    
    # Check for different image formats (PNG and JPEG)
    head_paths = [
        os.path.join(images_dir, 'snake.jpeg')
    ]
    
    body_paths = [
        os.path.join(images_dir, 'snake.jpeg')
    ]
    
    food_paths = [
        os.path.join(images_dir, 'food.jpeg')
    ]
    
    # Try to load snake head image
    for path in head_paths:
        if os.path.exists(path):
            try:
                snake_head_img = pygame.image.load(path)
                snake_head_img = pygame.transform.scale(snake_head_img, (block_size, block_size))
                print(f"Loaded snake head image: {path}")
                break
            except pygame.error:
                print(f"Failed to load image: {path}")
    
    # Try to load snake body image
    for path in body_paths:
        if os.path.exists(path):
            try:
                snake_body_img = pygame.image.load(path)
                snake_body_img = pygame.transform.scale(snake_body_img, (block_size, block_size))
                print(f"Loaded snake body image: {path}")
                break
            except pygame.error:
                print(f"Failed to load image: {path}")
    
    # Try to load food image
    for path in food_paths:
        if os.path.exists(path):
            try:
                food_img = pygame.image.load(path)
                food_img = pygame.transform.scale(food_img, (block_size, block_size))
                print(f"Loaded food image: {path}")
                break
            except pygame.error:
                print(f"Failed to load image: {path}")

def our_snake(block_size, snake_list):
    # Draw snake body
    for i, x in enumerate(snake_list):
        if i == len(snake_list) - 1 and snake_head_img:  # Snake head
            game_display.blit(snake_head_img, [x[0], x[1]])
        elif snake_body_img:  # Snake body with image
            game_display.blit(snake_body_img, [x[0], x[1]])
        else:  # Default snake body as rectangle
            pygame.draw.rect(game_display, green, [x[0], x[1], block_size, block_size])

def message(msg, color):
    mesg = font_style.render(msg, True, color)
    game_display.blit(mesg, [display_width / 6, display_height / 3])

def game_loop():
    game_over = False
    game_close = False

    # Initial snake position
    x1 = display_width / 2
    y1 = display_height / 2

    # Initial change in position
    x1_change = 0
    y1_change = 0

    # Initial snake size
    snake_list = []
    snake_length = 1

    # Generate first food
    foodx = round(random.randrange(0, display_width - block_size) / block_size) * block_size
    foody = round(random.randrange(0, display_height - block_size) / block_size) * block_size

    while not game_over:

        while game_close:
            game_display.fill(black)
            message("You Lost! Press Q-Quit or C-Play Again", red)
            pygame.display.update()

            for event in pygame.event.get():
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_q:
                        game_over = True
                        game_close = False
                    if event.key == pygame.K_c:
                        game_loop()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                game_over = True
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT and x1_change == 0:
                    x1_change = -block_size
                    y1_change = 0
                elif event.key == pygame.K_RIGHT and x1_change == 0:
                    x1_change = block_size
                    y1_change = 0
                elif event.key == pygame.K_UP and y1_change == 0:
                    y1_change = -block_size
                    x1_change = 0
                elif event.key == pygame.K_DOWN and y1_change == 0:
                    y1_change = block_size
                    x1_change = 0

        # Check for boundary collision
        if x1 >= display_width or x1 < 0 or y1 >= display_height or y1 < 0:
            game_close = True

        # Update position
        x1 += x1_change
        y1 += y1_change
        
        game_display.fill(black)
        
        # Draw food with image or as default rectangle
        if food_img:
            game_display.blit(food_img, [foodx, foody])
        else:
            pygame.draw.rect(game_display, red, [foodx, foody, block_size, block_size])
        
        snake_head = []
        snake_head.append(x1)
        snake_head.append(y1)
        snake_list.append(snake_head)

        if len(snake_list) > snake_length:
            del snake_list[0]

        # Check for collision with own body
        for x in snake_list[:-1]:
            if x == snake_head:
                game_close = True

        our_snake(block_size, snake_list)
        
        # Display score
        score = font_style.render("Score: " + str(snake_length - 1), True, white)
        game_display.blit(score, [0, 0])
        
        pygame.display.update()

        # Eating food
        if x1 == foodx and y1 == foody:
            foodx = round(random.randrange(0, display_width - block_size) / block_size) * block_size
            foody = round(random.randrange(0, display_height - block_size) / block_size) * block_size
            snake_length += 1

        clock.tick(fps)

    pygame.quit()
    quit()

if __name__ == "__main__":
    # Load images at startup
    load_images()
    game_loop()
