# 🏗️ Arquitectura del Sistema - CRM Intelligence

## 📊 Vista General

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                          🌐 USUARIO                                 │
│                    (Navegador Web)                                  │
│                                                                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTP (localhost:5173)
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    ⚛️  FRONTEND - REACT                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │ Dashboard  │  │ Contactos  │  │  Pipeline  │  │Integraciones│  │
│  │            │  │            │  │            │  │            │   │
│  │ Métricas   │  │ + Nuevo    │  │ Kanban     │  │ Gmail      │   │
│  │ Gráficos   │  │   Contacto │  │ Board      │  │ WhatsApp   │   │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │         🤖 Chat Agente IA (Drawer)                          │   │
│  │  - Botón flotante                                           │   │
│  │  - Panel lateral deslizable                                 │   │
│  │  - Historial de conversación                               │   │
│  │  - Badges de fuentes                                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Puerto: 5173                                                       │
│  Tecnologías: React 19, Vite 8, Lucide Icons                       │
│                                                                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ REST API (JSON)
                             │ POST /query
                             │ GET  /health
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    🐍 BACKEND - FASTAPI                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📡 API Endpoints:                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ POST /query        → Consultas al agente IA                  │  │
│  │ GET  /health       → Health check del sistema                │  │
│  │ GET  /             → Interfaz HTML básica                    │  │
│  │ GET  /docs         → Documentación Swagger                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  🔧 Middlewares:                                                    │
│  - CORS (allow_origins: *)                                          │
│  - JSON body parser                                                 │
│                                                                     │
│  🚀 Startup:                                                        │
│  - Cargar documentos de docs/                                       │
│  - Inicializar agente RAG                                           │
│  - Crear índice BM25                                                │
│                                                                     │
│  Puerto: 8000                                                       │
│  Tecnologías: FastAPI, Uvicorn, Pydantic                           │
│                                                                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ agent.query(question)
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│              🤖 AGENTE IA - LANGCHAIN                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Clase: CRMAgent                                                    │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   RETRIEVAL (BM25)                           │  │
│  │                                                              │  │
│  │  1. Recibe pregunta del usuario                             │  │
│  │  2. Tokeniza y procesa query                                │  │
│  │  3. Busca en índice BM25                                    │  │
│  │  4. Retorna top-k=3 chunks más relevantes                   │  │
│  │                                                              │  │
│  │  Ventajas:                                                  │  │
│  │  ✅ Búsqueda léxica rápida                                   │  │
│  │  ✅ Sin necesidad de embeddings                             │  │
│  │  ✅ No requiere Google API Key                              │  │
│  │  ✅ Funciona offline después de cargar docs                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             │                                       │
│                             │ context (3 chunks)                    │
│                             ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              GENERATION (DeepSeek LLM)                       │  │
│  │                                                              │  │
│  │  1. Recibe pregunta + contexto (3 chunks)                   │  │
│  │  2. Construye prompt:                                       │  │
│  │     "Responde basándote en este contexto: ..."             │  │
│  │  3. Envía a DeepSeek API                                    │  │
│  │  4. Genera respuesta coherente                              │  │
│  │  5. Extrae fuentes de los chunks usados                     │  │
│  │                                                              │  │
│  │  Configuración:                                             │  │
│  │  - Model: deepseek-chat                                     │  │
│  │  - Temperature: 0.3 (respuestas consistentes)              │  │
│  │  - Chain type: "stuff" (concatena todos los docs)          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  🔄 Flujo completo:                                                 │
│  Question → BM25 → Top-3 Chunks → DeepSeek → Answer + Sources      │
│                                                                     │
│  Tecnologías: LangChain, BM25Retriever, ChatOpenAI                 │
│                                                                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ load_documents()
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│              📚 BASE DE CONOCIMIENTO - docs/                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📄 PDFs (5 archivos):                                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ base_conocimiento_producto.pdf         6.3 KB               │  │
│  │ faq_soporte.pdf                        6.6 KB               │  │
│  │ manual_usuario.pdf                    17.0 KB ⭐            │  │
│  │ politica_privacidad.pdf                7.1 KB               │  │
│  │ terminos_uso.pdf                      11.0 KB               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  📝 TXT (5 archivos - backup):                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ base_conocimiento_producto.txt         4.8 KB               │  │
│  │ faq_soporte.txt                        5.0 KB               │  │
│  │ manual_usuario.txt                     8.6 KB               │  │
│  │ politica_privacidad.txt                5.8 KB               │  │
│  │ terminos_uso.txt                       8.9 KB               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  📊 CSV (1 archivo):                                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ planes_precios.csv                     469 B                 │  │
│  │ Columnas: Plan, Precio_Mensual, Precio_Anual, ...          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  📊 Total: 21 documentos                                            │
│  📦 Chunks: ~150-200 fragmentos (1000 chars, overlap 200)           │
│                                                                     │
│  Procesamiento:                                                     │
│  1. PyPDFLoader → carga PDFs                                        │
│  2. TextLoader → carga TXT (encoding: utf-8)                        │
│  3. CSVLoader → carga CSV como documentos                           │
│  4. RecursiveCharacterTextSplitter → divide en chunks               │
│  5. BM25Retriever.from_documents() → crea índice                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujos de Interacción

### Flujo 1: Usuario hace pregunta al Agente

```
┌─────────┐
│ Usuario │ Escribe: "¿Cómo agrego un contacto?"
└────┬────┘
     │
     ↓
┌─────────────────┐
│ Frontend (React)│ onClick → handleSendMessage()
└────┬────────────┘
     │
     │ POST http://localhost:8000/query
     │ Body: {"question": "¿Cómo agrego un contacto?"}
     │
     ↓
┌─────────────────┐
│ Backend (FastAPI)│ Recibe request → /query endpoint
└────┬────────────┘
     │
     │ agent.query(question)
     │
     ↓
┌─────────────────┐
│ Agente RAG      │ 1. BM25 busca en docs/
└────┬────────────┘    2. Encuentra "manual_usuario.pdf" (score: 0.85)
     │                 3. Extrae 3 chunks relevantes
     │
     │ chunks → prompt → DeepSeek API
     │
     ↓
┌─────────────────┐
│ DeepSeek LLM    │ Genera respuesta usando contexto
└────┬────────────┘
     │
     │ answer + sources
     │
     ↓
┌─────────────────┐
│ Backend         │ Retorna JSON:
└────┬────────────┘ {
     │               "answer": "Para agregar un contacto...",
     │               "sources": ["docs/manual_usuario.pdf"]
     │             }
     ↓
┌─────────────────┐
│ Frontend        │ 1. Muestra respuesta con markdown
└────┬────────────┘ 2. Agrega badge "manual_usuario.pdf"
     │              3. Scroll automático
     │
     ↓
┌─────────┐
│ Usuario │ Ve respuesta + fuente
└─────────┘

Tiempo total: ~2-5 segundos
```

---

### Flujo 2: Usuario crea contacto

```
┌─────────┐
│ Usuario │ Clic en "+ Nuevo Contacto"
└────┬────┘
     │
     ↓
┌─────────────────┐
│ Frontend        │ setShowNewContactModal(true)
└────┬────────────┘
     │
     │ Modal aparece con formulario
     │
     ↓
┌─────────┐
│ Usuario │ Completa:
└────┬────┘ - Nombre: María López
     │      - Email: maria@startup.com
     │      - Plan: Professional
     │      - Estado: Activo
     │
     │ Clic "Guardar"
     │
     ↓
┌─────────────────┐
│ Frontend        │ 1. Valida campos obligatorios
└────┬────────────┘ 2. if (!name || !email) → alert()
     │              3. if (válido) → continuar
     │
     │ handleAddContact()
     │
     ↓
┌─────────────────┐
│ Estado Local    │ setContacts([...contacts, newContact])
└────┬────────────┘
     │
     │ React actualiza DOM
     │
     ↓
┌─────────────────┐
│ Tabla Contactos │ Nuevo contacto aparece instantáneamente
└────┬────────────┘
     │
     │ setShowNewContactModal(false)
     │
     ↓
┌─────────┐
│ Usuario │ Ve contacto en la tabla
└─────────┘

Tiempo: ~100ms (sin backend, solo frontend)
```

---

### Flujo 3: Sistema carga documentos al iniciar

```
┌──────────┐
│ Terminal │ uvicorn src.api:app --reload
└────┬─────┘
     │
     │ Ejecuta api.py
     │
     ↓
┌─────────────────┐
│ FastAPI         │ @app.on_event("startup")
└────┬────────────┘
     │
     │ startup_event()
     │
     ↓
┌─────────────────┐
│ Agente RAG      │ agent.load_documents("docs/")
└────┬────────────┘
     │
     │ Itera por cada archivo en docs/
     │
     ↓
┌─────────────────────────────────────────────┐
│ docs/base_conocimiento_producto.pdf         │
│ ├─ PyPDFLoader(file)                        │
│ └─ 12 páginas → 12 documentos               │
├─────────────────────────────────────────────┤
│ docs/faq_soporte.pdf                        │
│ ├─ PyPDFLoader(file)                        │
│ └─ 8 páginas → 8 documentos                 │
├─────────────────────────────────────────────┤
│ docs/manual_usuario.pdf                     │
│ ├─ PyPDFLoader(file)                        │
│ └─ 25 páginas → 25 documentos ⭐            │
├─────────────────────────────────────────────┤
│ ... (resto de PDFs y TXTs)                  │
└─────────────────────────────────────────────┘
     │
     │ Total: 21 documentos cargados
     │
     ↓
┌─────────────────┐
│ Text Splitter   │ RecursiveCharacterTextSplitter
└────┬────────────┘ - chunk_size: 1000
     │              - chunk_overlap: 200
     │
     │ 21 docs → ~150-200 chunks
     │
     ↓
┌─────────────────┐
│ BM25 Retriever  │ BM25Retriever.from_documents(chunks, k=3)
└────┬────────────┘
     │
     │ Crea índice invertido
     │
     ↓
┌─────────────────┐
│ RetrievalQA     │ RetrievalQA.from_chain_type(
└────┬────────────┘     llm=deepseek,
     │                   retriever=bm25,
     │                   return_source_documents=True
     │                )
     │
     ↓
┌─────────────────┐
│ Consola         │ ✅ 21 documentos cargados exitosamente
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ API REST        │ Lista para recibir queries
└─────────────────┘

Tiempo: ~2-3 segundos
```

---

## 🗄️ Modelos de Datos

### Frontend: Contacto

```typescript
interface Contact {
  id: number;              // Generado con Date.now()
  name: string;            // Obligatorio
  email: string;           // Obligatorio
  plan: 'Starter' | 'Professional' | 'Enterprise';
  status: 'Activo' | 'Inactivo';
}
```

### Frontend: Deal (Pipeline)

```typescript
interface Deal {
  id: string;              // 'deal-1', 'deal-2', etc.
  title: string;           // 'Licencias Enterprise'
  company: string;         // 'Corp Latam'
  value: string;           // '$8,500'
  stage: 'lead' | 'contacted' | 'proposal' | 'negotiation' | 'won';
}
```

### Backend: Question Request

```python
class Question(BaseModel):
    question: str
```

### Backend: Answer Response

```python
class Answer(BaseModel):
    question: str
    answer: str
    sources: list[str]
```

---

## 🔐 Seguridad y Configuración

### Variables de Entorno (.env)

```bash
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_API_KEY=xxxxx  # Opcional (no usado con BM25)
```

### CORS Configuration

```python
# src/api.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Desarrollo: *
                                # Producción: ["https://miapp.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 Métricas de Rendimiento

| Operación | Tiempo Típico |
|-----------|---------------|
| Carga de documentos | 2-3 segundos |
| Búsqueda BM25 | 50-100ms |
| Generación DeepSeek | 2-4 segundos |
| Query completa | 2-5 segundos |
| Crear contacto (frontend) | <100ms |
| Renderizado modal | <50ms |

---

## 🚀 Escalabilidad

### Límites Actuales

- **Documentos:** 21 cargados (puede escalar a 100+)
- **Chunks:** ~200 fragmentos indexados
- **Consultas simultáneas:** Limitado por DeepSeek API rate limit
- **Contactos:** Almacenados en memoria (frontend)

### Para Producción

1. **Backend:**
   - Agregar PostgreSQL para contactos
   - Implementar caché Redis para respuestas frecuentes
   - Rate limiting por usuario
   - Load balancer para múltiples instancias

2. **Frontend:**
   - Server-side rendering (Next.js)
   - Estado global (Redux/Zustand)
   - Lazy loading de componentes

3. **Documentos:**
   - Vector DB (Pinecone/Weaviate) para búsqueda semántica
   - CDN para PDFs
   - Actualización incremental de índice

4. **Agente:**
   - Multi-agente (ventas, soporte, análisis)
   - Fine-tuning de modelo
   - Historial persistente de conversaciones

---

## 📦 Deployment

### Desarrollo Local

```bash
# Backend
uvicorn src.api:app --reload --port 8000

# Frontend
cd frontend && npm run dev
```

### Producción

```bash
# Backend (Gunicorn + Uvicorn workers)
gunicorn src.api:app -w 4 -k uvicorn.workers.UvicornWorker

# Frontend (Build + Nginx)
npm run build
nginx -c nginx.conf
```

### Docker

```dockerfile
# Backend
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0"]

# Frontend
FROM node:18
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build
```

---

**Última actualización:** Julio 15, 2026
