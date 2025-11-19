from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io
import os
import aiofiles
from typing import List
import json

app = FastAPI(
    title="Movie Scene API",
    description="API для работы с постами и обработки изображений",
    version="1.0.0"
)

# Разрешаем CORS для React приложения
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Монтируем статическую папку для загруженных изображений
os.makedirs("static/uploaded", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Модели данных
class Post(BaseModel):
    userId: int
    id: int
    title: str
    body: str

# Эндпоинт 1: Получение постов (аналогично JSONPlaceholder)
@app.get("/posts", response_model=List[Post])
async def get_posts(limit: int = 10):
    """
    Получить список постов с ограничением по количеству
    """
    import requests
    
    try:
        # Загружаем посты с JSONPlaceholder
        response = requests.get("https://jsonplaceholder.typicode.com/posts")
        response.raise_for_status()
        
        posts = response.json()
        # Ограничиваем количество постов
        return posts[:limit]
    
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching posts: {str(e)}")

# Эндпоинт 2: Инверсия изображения
@app.post("/invert-image")
async def invert_image(file: UploadFile = File(...)):
    """
    Принимает изображение и возвращает инвертированное изображение
    """
    # Проверяем что файл является изображением
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Читаем загруженное изображение
        contents = await file.read()
        
        # Открываем изображение с помощью PIL
        image = Image.open(io.BytesIO(contents))
        
        # Конвертируем в RGB если необходимо
        if image.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1])
            image = background
        elif image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Инвертируем изображение
        inverted_image = Image.eval(image, lambda x: 255 - x)
        
        # Сохраняем инвертированное изображение в буфер
        output_buffer = io.BytesIO()
        inverted_image.save(output_buffer, format='JPEG')
        output_buffer.seek(0)
        
        # Сохраняем файл на сервере
        filename = f"inverted_{file.filename}"
        file_path = f"static/uploaded/{filename}"
        
        async with aiofiles.open(file_path, 'wb') as out_file:
            await out_file.write(output_buffer.getvalue())
        
        # Возвращаем URL к инвертированному изображению
        return {
            "message": "Image inverted successfully",
            "inverted_image_url": f"/static/uploaded/{filename}",
            "filename": filename
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

# Эндпоинт для скачивания инвертированного изображения
@app.get("/static/uploaded/{filename}")
async def get_inverted_image(filename: str):
    file_path = f"static/uploaded/{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="File not found")

# Эндпоинт для получения OpenAPI спецификации
@app.get("/openapi.json", include_in_schema=False)
async def get_openapi_schema():
    return JSONResponse(content=app.openapi())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)