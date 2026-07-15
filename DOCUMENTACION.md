# 📘 Documentación Completa - Proyecto CRM Intelligence

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Componentes Principales](#componentes-principales)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Uso del Sistema](#uso-del-sistema)
7. [API Endpoints](#api-endpoints)
8. [Base de Conocimiento](#base-de-conocimiento)
9. [Flujo de Datos](#flujo-de-datos)
10. [Troubleshooting](#troubleshooting)

---

## 📖 Descripción General

**SalesPro CRM Intelligence** es un sistema de gestión de relaciones con clientes (CRM) potenciado por un agente de inteligencia artificial que responde preguntas sobre el producto utilizando RAG (Retrieval Augmented Generation).

### Tecnologías Principales

- **Backend:** FastAPI + LangChain + DeepSeek LLM
- **Frontend:** React 19 + Vite + Lucide Icons
- **Retriever:** BM25 (búsqueda léxica sin embeddings)
- **Documentos:** PDF, TXT, CSV

### Cumplimiento Challenge Alura

✅ Agente RAG funcional con documentos PDF  
✅ API REST documentada  
✅ Interfaz web interactiva  
✅ Chat conversacional con fuentes citadas  
✅ Funcionalidades de CRM completas

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        USUARIO                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React)                          │
│  - Dashboard con métricas                                   │
│  - Gestión de contactos                                     │
│  - Pipeline de ventas                                       │
│  - Chat con Agente IA                                       │
│  Puerto: 5173                                               │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP REST
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                        │
│  Endpoints:                                                 │
│  - POST /query      → Consultas al agente                  │
│  - GET  /health     → Estado del sistema                   │
│  Puerto: 8000                                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  AGENTE IA (LangChain)                      │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │  BM25        │ ───→ │  DeepSeek    │                    │
│  │  Retriever   │      │  LLM         │                    │
│  └──────────────┘      └──────────────┘                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              BASE DE CONOCIMIENTO (docs/)                   │
│  - 5 archivos PDF                                           │
│  - 5 archivos TXT (backup)                                  │
│  - 1 archivo CSV (precios)                                  │
│  Total: 21 documentos cargados                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
proyecto-asistente/
├── docs/                           # Base de conocimiento
│   ├── base_conocimiento_producto.pdf
│   ├── base_conocimiento_producto.txt
│   ├── faq_soporte.pdf
│   ├── faq_soporte.txt
│   ├── manual_usuario.pdf         ⭐ Guía completa de uso
│   ├── manual_usuario.txt
│   ├── planes_precios.csv
│   ├── politica_privacidad.pdf
│   ├── politica_privacidad.txt
│   ├── terminos_uso.pdf
│   └── terminos_uso.txt
│
├── src/                            # Backend Python
│   ├── agent.py                   # Agente RAG principal
│   └── api.py                     # API REST FastAPI
│
├── frontend/                       # Frontend React
│   ├── src/
│   │   ├── App.jsx               # Componente principal
│   │   ├── App.css               # Estilos del CRM
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Estilos globales
│   ├── public/                   # Assets
│   ├── package.json
│   └── vite.config.js
│
├── scripts/
│   └── txt_to_pdf.py             # Conversor TXT → PDF
│
├── templates/
│   └── index.html                # HTML básico para API
│
├── venv/                          # Entorno virtual Python
├── .env                           # Variables de entorno (NO en git)
├── .env.example                   # Plantilla de variables
├── requirements.txt               # Dependencias Python
├── test_agent.py                 # Test del agente
├── README.md
└── DOCUMENTACION.md              # Este archivo
```

---

## 🔧 Componentes Principales

### 1. Agente IA (`src/agent.py`)

**Clase: `CRMAgent`**

```python
class CRMAgent:
    def __init__(self, deepseek_api_key: str)
    def load_documents(self, docs_path: str = "docs")
    def query(self, question: str) -> dict
```

**Características:**
- ✅ Carga documentos PDF, TXT y CSV
- ✅ Divide en chunks de 1000 caracteres (overlap 200)
- ✅ Usa BM25 para búsqueda (k=3 documentos)
- ✅ Genera respuestas con DeepSeek (temperature 0.3)
- ✅ Retorna fuentes citadas

**Flujo de procesamiento:**
1. Usuario envía pregunta
2. BM25 busca los 3 fragmentos más relevantes
3. DeepSeek genera respuesta usando esos fragmentos
4. Retorna: `{question, answer, sources[]}`

---

### 2. API REST (`src/api.py`)

**Framework:** FastAPI  
**Puerto:** 8000  
**CORS:** Habilitado para localhost:5173

**Endpoints:**

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Interfaz HTML básica |
| POST | `/query` | Consultar al agente IA |
| GET | `/health` | Estado de salud del sistema |
| GET | `/docs` | Documentación Swagger automática |

**Ejemplo de uso:**

```bash
# Consulta al agente
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Cómo agrego contactos?"}'

# Respuesta
{
  "question": "¿Cómo agrego contactos?",
  "answer": "Para agregar un contacto en SalesPro CRM:\n1. Ve al menú 'Contactos'\n2. Haz clic en '+ Nuevo Contacto'...",
  "sources": ["docs/manual_usuario.pdf"]
}
```

---

### 3. Frontend React (`frontend/src/App.jsx`)

**Vistas principales:**

#### 📊 Dashboard
- Métricas: MRR, contactos activos, tasa de conversión
- Gráfico de rendimiento comercial
- Preguntas rápidas al agente

#### 👥 Contactos
- Tabla de contactos con filtros
- **Botón "+ Nuevo Contacto"** ⭐
- Modal para crear contactos:
  - Nombre (obligatorio)
  - Email (obligatorio)
  - Plan (Starter/Professional/Enterprise)
  - Estado (Activo/Inactivo)

#### 🔄 Embudo de Ventas (Pipeline)
- Kanban board con 5 etapas:
  - Lead → Contactado → Propuesta → Negociación → Ganado
- Arrastrar/mover deals entre etapas
- Selector dropdown para cambiar etapa

#### 🔌 Integraciones
- Gmail, WhatsApp, Stripe, Outlook
- Botones conectar/desconectar
- Estados visuales (conectado/desconectado)

#### 💳 Planes y Costos
- 3 cards de precios:
  - **Starter:** $29/mes
  - **Professional:** $79/mes (más popular)
  - **Enterprise:** $199/mes
- Botones para consultar al agente sobre cada plan

#### 🤖 Chat Agente IA
- Botón flotante en esquina inferior derecha
- Panel lateral deslizable
- Historial de conversación
- Badges de fuentes clickeables
- Indicador de estado (conectado/desconectado)
- Preguntas sugeridas
- Botón copiar respuesta

---

## ⚙️ Instalación y Configuración

### Requisitos Previos

- Python 3.10+
- Node.js 18+
- npm o yarn
- Cuenta en DeepSeek (para API key)

### Paso 1: Clonar repositorio

```bash
git clone <tu-repo>
cd proyecto-asistente
```

### Paso 2: Configurar Backend

```bash
# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
nano .env  # Editar y agregar tu DEEPSEEK_API_KEY
```

**Contenido de `.env`:**
```bash
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

### Paso 3: Configurar Frontend

```bash
cd frontend
npm install
```

### Paso 4: Verificar documentos

```bash
ls -lh docs/
# Deberías ver 5 PDFs + 5 TXT + 1 CSV
```

---

## 🚀 Uso del Sistema

### Iniciar el proyecto

**Terminal 1 - Backend:**
```bash
source venv/bin/activate
uvicorn src.api:app --reload --host 0.0.0.0 --port 8000
```

Verás:
```
✅ 21 documentos cargados exitosamente
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Verás:
```
  VITE v8.1.1  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Acceder al sistema

1. Abrir navegador en `http://localhost:5173`
2. Verás el Dashboard del CRM
3. Indicador verde en "Agente de IA" = Backend conectado

---

## 📡 API Endpoints

### POST /query

**Descripción:** Envía una pregunta al agente IA

**Request:**
```json
{
  "question": "¿Cómo configuro automatizaciones?"
}
```

**Response:**
```json
{
  "question": "¿Cómo configuro automatizaciones?",
  "answer": "Para crear una automatización en SalesPro:\n1. Ve a 'Integraciones' > 'Automatizaciones'\n2. Haz clic en '+ Nueva Automatización'\n3. Define el disparador (trigger)...",
  "sources": [
    "docs/manual_usuario.pdf",
    "docs/base_conocimiento_producto.pdf"
  ]
}
```

### GET /health

**Descripción:** Verifica que el backend esté funcionando

**Response:**
```json
{
  "status": "healthy",
  "agent": "ready"
}
```

### GET /docs

**Descripción:** Documentación interactiva Swagger UI

**URL:** `http://localhost:8000/docs`

---

## 📚 Base de Conocimiento

### Documentos disponibles

| Archivo | Formato | Contenido | Tamaño |
|---------|---------|-----------|--------|
| `base_conocimiento_producto` | PDF + TXT | Funcionalidades del CRM, automatizaciones, reportes | 6.3 KB |
| `faq_soporte` | PDF + TXT | Preguntas frecuentes sobre soporte técnico | 6.6 KB |
| `manual_usuario` | PDF + TXT | Guía completa paso a paso de cómo usar el CRM | 17 KB ⭐ |
| `politica_privacidad` | PDF + TXT | Almacenamiento y seguridad de datos | 7.1 KB |
| `terminos_uso` | PDF + TXT | Términos legales y condiciones de uso | 11 KB |
| `planes_precios` | CSV | Tabla estructurada con planes y precios | 469 B |

### Tipos de preguntas que responde

**Operativas (Manual de Usuario):**
- ¿Cómo agrego un nuevo contacto?
- ¿Cómo creo una oportunidad de venta?
- ¿Cómo muevo deals en el pipeline?
- ¿Cómo configuro automatizaciones?
- ¿Cómo integro mi email con el CRM?
- ¿Cuáles son los atajos de teclado?

**Sobre el producto:**
- ¿Qué automatizaciones tiene SalesPro?
- ¿Qué reportes genera el CRM?
- ¿Hay integraciones con WhatsApp?

**Precios y planes:**
- ¿Cuánto cuesta el plan Professional?
- ¿Qué diferencias hay entre planes?
- ¿Cuántos usuarios incluye cada plan?

**Soporte y políticas:**
- ¿Cómo contacto al soporte?
- ¿Cómo cambio mi contraseña?
- ¿Dónde se almacenan mis datos?
- ¿Cuál es la política de reembolso?

---

## 🔄 Flujo de Datos

### Escenario 1: Usuario hace pregunta al agente

```
1. Usuario escribe en chat: "¿Cómo agrego contactos?"
   ↓
2. Frontend → POST /query {"question": "..."}
   ↓
3. API recibe request → agent.query(question)
   ↓
4. BM25 Retriever busca en documentos cargados
   → Encuentra 3 chunks más relevantes de manual_usuario.pdf
   ↓
5. DeepSeek LLM recibe:
   - Pregunta del usuario
   - 3 fragmentos de contexto
   → Genera respuesta coherente
   ↓
6. Backend retorna: {answer, sources}
   ↓
7. Frontend muestra:
   - Respuesta formateada (markdown)
   - Badges de fuentes clickeables
```

### Escenario 2: Usuario crea contacto

```
1. Usuario hace clic en "+ Nuevo Contacto"
   ↓
2. Modal se abre con formulario
   ↓
3. Usuario completa:
   - Nombre: María López
   - Email: maria@startup.com
   - Plan: Professional
   - Estado: Activo
   ↓
4. Click en "Guardar"
   ↓
5. Frontend valida (nombre y email obligatorios)
   ↓
6. Si válido → agrega a estado local (contacts)
   ↓
7. Tabla se actualiza instantáneamente
   ↓
8. Modal se cierra
```

### Escenario 3: Sistema carga documentos al iniciar

```
1. Backend inicia (startup event)
   ↓
2. agent.load_documents("docs/")
   ↓
3. Itera por cada archivo:
   - .txt → TextLoader
   - .pdf → PyPDFLoader
   - .csv → CSVLoader
   ↓
4. Divide cada documento en chunks
   (1000 caracteres, overlap 200)
   ↓
5. Crea índice BM25 con todos los chunks
   ↓
6. Consola: "✅ 21 documentos cargados exitosamente"
   ↓
7. API lista para recibir queries
```

---

## 🛠️ Troubleshooting

### Backend no inicia

**Error:** `DEEPSEEK_API_KEY no encontrada`

**Solución:**
```bash
# Verifica que .env existe y tiene la key
cat .env

# Si no existe, créalo:
echo "DEEPSEEK_API_KEY=sk-xxxxxxxxx" > .env
```

---

### Frontend no conecta con backend

**Error:** "No pude conectarme con el servidor del Agente IA"

**Solución:**
```bash
# 1. Verifica que backend esté corriendo
curl http://localhost:8000/health

# 2. Si no responde, inicia backend:
uvicorn src.api:app --reload

# 3. Verifica CORS en src/api.py:
# allow_origins=["*"] debe estar habilitado
```

---

### Documentos no cargan

**Error:** `0 documentos cargados`

**Solución:**
```bash
# Verifica que docs/ existe y tiene archivos
ls -lh docs/

# Debe mostrar PDFs, TXTs y CSV
# Si faltan, regenera PDFs:
python scripts/txt_to_pdf.py
```

---

### Modal de contacto no abre

**Solución:**
```bash
# 1. Verifica consola del navegador (F12)
# 2. Asegúrate de que frontend está actualizado:
cd frontend
npm run dev

# 3. Limpia cache del navegador (Ctrl+Shift+R)
```

---

### Agente responde "no encontré información"

**Causas posibles:**
1. Pregunta muy genérica o fuera del dominio
2. BM25 no encuentra documentos relevantes
3. Documentos no cargados correctamente

**Solución:**
```bash
# 1. Reformula la pregunta de manera más específica
# Mal:  "¿Qué es esto?"
# Bien: "¿Cómo agrego un nuevo contacto en SalesPro?"

# 2. Verifica logs del backend
# Debe mostrar: "✅ 21 documentos cargados"

# 3. Reinicia backend para recargar documentos
```

---

## 📊 Métricas del Sistema

### Rendimiento típico

- **Carga de documentos:** ~2-3 segundos
- **Búsqueda BM25:** ~50-100ms
- **Generación de respuesta (DeepSeek):** ~2-4 segundos
- **Total query → respuesta:** ~2-5 segundos

### Capacidades

- **Documentos:** 21 cargados (puede escalar a 100+)
- **Chunks:** ~150-200 fragmentos indexados
- **Consultas simultáneas:** Limitado por DeepSeek API
- **Idioma:** Español (puede extenderse a multilenguaje)

---

## 🔐 Seguridad

### Variables sensibles

- ✅ `.env` en `.gitignore` (no se sube al repo)
- ✅ `.env.example` sin valores reales
- ✅ API keys solo en servidor backend

### CORS

- Actualmente: `allow_origins=["*"]` (desarrollo)
- Producción: cambiar a dominios específicos

### Datos de usuarios

- ⚠️ Contactos almacenados solo en memoria (frontend)
- No hay persistencia en base de datos (MVP)
- Para producción: integrar PostgreSQL/MongoDB

---

## 📝 Testing

### Test manual del agente

```bash
python test_agent.py
```

Ejecuta 3 preguntas de prueba y muestra respuestas.

### Test de API con curl

```bash
# Health check
curl http://localhost:8000/health

# Query
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Cuánto cuesta el plan Starter?"}'
```

---

## 🚀 Próximas Mejoras

### Backend
- [ ] Agregar embeddings (ChromaDB/Pinecone) para búsqueda semántica
- [ ] Implementar caché de respuestas frecuentes
- [ ] Rate limiting en API
- [ ] Logging estructurado (Winston/Loguru)

### Frontend
- [ ] Persistencia de contactos (localStorage o API)
- [ ] Filtros avanzados en tabla de contactos
- [ ] Exportar contactos a CSV
- [ ] Modo oscuro/claro toggle
- [ ] Autenticación de usuarios

### Documentos
- [ ] Actualizar automáticamente cuando cambian archivos
- [ ] Interfaz para subir nuevos documentos
- [ ] Versionado de documentos

### Agente IA
- [ ] Historial de conversación persistente
- [ ] Sugerencias proactivas
- [ ] Análisis de sentimiento en consultas
- [ ] Multi-agente (ventas, soporte, análisis)

---

## 📞 Soporte

- **Repositorio:** [GitHub Link]
- **Challenge:** Alura Latam - RAG Challenge
- **Autor:** [Tu Nombre]
- **Fecha:** Julio 2026

---

## 📄 Licencia

Este proyecto fue desarrollado como parte del Challenge de Alura Latam.

---

**Última actualización:** 15 de Julio 2026
