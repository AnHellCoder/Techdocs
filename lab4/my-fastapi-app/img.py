from PIL import Image
import numpy as np
import cv2

image = Image.open('dokidoki.png')

# Конвертируем в RGB если необходимо
if image.mode in ('RGBA', 'LA'):
    background = Image.new('RGB', image.size, (255, 255, 255))
    background.paste(image, mask=image.split()[-1])
    image = background
elif image.mode != 'RGB':
    image = image.convert('RGB')

p = 235