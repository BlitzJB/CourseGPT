from fastapi import FastAPI
from .routes import outline, course
from middleware import cors

app = FastAPI()

cors.add_cors_middleware(app)

app.include_router(outline.router)
app.include_router(course.router)