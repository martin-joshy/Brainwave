import random


def generate_random_color():
    while True:
        r = random.randint(0, 255)
        g = random.randint(0, 255)
        b = random.randint(0, 255)

        brightness = 0.299 * r + 0.587 * g + 0.114 * b

        if 50 < brightness < 200:
            break

    return f"#{r:02x}{g:02x}{b:02x}"
