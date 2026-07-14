from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from pathlib import Path

from agent import CRMAgent

# Cargar variables de entorno
load_dotenv()

app = FastAPI(
    title="CRM Intelligence API",
    description="API del agente inteligente para SalesPro CRM",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar agente
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY no encontrada en las variables de entorno")

agent = CRMAgent(api_key)

# Cargar documentos al iniciar
@app.on_event("startup")
async def startup_event():
    docs_loaded = agent.load_documents()
    print(f"✅ {docs_loaded} documentos cargados exitosamente")

class Question(BaseModel):
    question: str

class Answer(BaseModel):
    question: str
    answer: str
    sources: list[str]

@app.get("/", response_class=HTMLResponse)
async def root():
    """Página principal con interfaz web"""
    html_path = Path("templates/index.html")
    if html_path.exists():
        return html_path.read_text(encoding='utf-8')
    return "<h1>CRM Intelligence API</h1><p>Documentación en /docs</p>"

@app.post("/query", response_model=Answer)
async def query_agent(question: Question):
    """Endpoint para hacer preguntas al agente"""
    try:
        result = agent.query(question.question)
        return Answer(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Verifica el estado de la API"""
    return {"status": "healthy", "agent": "ready"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
