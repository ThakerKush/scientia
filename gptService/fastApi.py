from fastapi import FastAPI
from pydantic import BaseModel
from cache import ask, askQuiz

app = FastAPI()

class Prompt(BaseModel):
    type: str
    content: str
class Quiz(BaseModel):
    type: str
    content: str
@app.post("/ask")
def read_root(prompt: Prompt):
    response = ask(prompt.type, prompt.content)
    return response

@app.post("/makeQuiz")
def read_root(Quiz: Quiz):
    response = askQuiz(Quiz.type, Quiz.content)
    return response