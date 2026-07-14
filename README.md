# 🤖 CRM Intelligence - Agente IA para SalesPro CRM

Agente inteligente basado en IA que responde preguntas sobre SalesPro CRM utilizando RAG (Retrieval-Augmented Generation) con LangChain y Gemini.

## 📋 Descripción del Proyecto

Este proyecto implementa un asistente virtual que puede responder preguntas sobre:
- Funcionalidades del CRM
- Planes y precios
- Políticas de privacidad
- Términos y condiciones
- Preguntas frecuentes de soporte

El agente utiliza documentación real del producto para proporcionar respuestas precisas y contextualizadas.

## 🏗️ Arquitectura

```
┌─────────────┐
│  Usuario    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Frontend Web   │ (HTML/JS)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   FastAPI       │
│   (API REST)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   LangChain     │
│   Agent (RAG)   │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────┐
│ FAISS  │ │Gemini│
│Vector  │ │ Pro  │
│Store   │ │ LLM  │
└────────┘ └──────┘
    ▲
    │
┌───┴────┐
│  Docs  │
│ (PDF/  │
│  CSV)  │
└────────┘
```

### Componentes:

1. **Frontend**: Interfaz web simple para interactuar con el agente
2. **FastAPI**: API REST que expone el endpoint `/query`
3. **LangChain Agent**: Implementa RAG para recuperar contexto relevante
4. **FAISS VectorStore**: Base de datos vectorial para búsqueda semántica
5. **Gemini Pro**: Modelo de lenguaje de Google para generar respuestas
6. **Documentos**: Base de conocimiento en formato TXT y CSV

## 🚀 Tecnologías Utilizadas

- **Python 3.10+**
- **LangChain**: Framework para aplicaciones con LLM
- **Google Gemini Pro**: Modelo de lenguaje
- **FastAPI**: Framework web moderno y rápido
- **FAISS**: Búsqueda de similitud vectorial
- **Pandas**: Procesamiento de datos CSV
- **Uvicorn**: Servidor ASGI

## 📁 Estructura del Proyecto

```
crm-intelligence/
├── docs/                          # Documentación del CRM
│   ├── base_conocimiento_producto.txt
│   ├── faq_soporte.txt
│   ├── politica_privacidad.txt
│   ├── terminos_uso.txt
│   └── planes_precios.csv
├── src/                           # Código fuente
│   ├── agent.py                   # Lógica del agente IA
│   └── api.py                     # API FastAPI
├── templates/                     # Templates HTML
│   └── index.html                 # Interfaz web
├── requirements.txt               # Dependencias Python
├── .env.example                   # Ejemplo de variables de entorno
└── README.md                      # Este archivo
```

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd crm-intelligence
```

### 2. Crear entorno virtual

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y agrega tu API key de Google Gemini:

```
GOOGLE_API_KEY=tu_api_key_aqui
```

**¿Cómo obtener la API key?**
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Cópiala en el archivo `.env`

### 5. Ejecutar la aplicación

```bash
cd src
python api.py
```

La aplicación estará disponible en: `http://localhost:8000`

## 💬 Ejemplos de Uso

### Interfaz Web
Abre tu navegador en `http://localhost:8000` y haz preguntas como:

**Pregunta:** "¿Cómo agrego un nuevo contacto?"
**Respuesta:** "Para agregar un contacto nuevo: 1. Ve al menú 'Contactos', 2. Haz clic en '+ Nuevo Contacto'..."

**Pregunta:** "¿Cuánto cuesta el plan Professional?"
**Respuesta:** "El plan Professional cuesta $79/mes o $758/año (con 20% de descuento)..."

**Pregunta:** "¿Qué automatizaciones puedo configurar?"
**Respuesta:** "Puedes configurar automatizaciones como emails automáticos de bienvenida..."

### API REST

**Endpoint:** `POST /query`

```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Cómo integro Gmail con el CRM?"}'
```

**Respuesta:**
```json
{
  "question": "¿Cómo integro Gmail con el CRM?",
  "answer": "Para integrar Gmail: 1. Ve a Configuración → Integraciones...",
  "sources": ["base_conocimiento_producto.txt"]
}
```

## 🌐 Deploy en Azure

### Opción 1: Azure App Service (Recomendado)

1. **Crear App Service:**
```bash
az webapp up --name crm-intelligence --runtime "PYTHON:3.10"
```

2. **Configurar variables de entorno:**
```bash
az webapp config appsettings set --name crm-intelligence \
  --settings GOOGLE_API_KEY=tu_api_key
```

3. **Deploy automático desde GitHub:**
- Conecta tu repositorio en Azure Portal
- Configura CI/CD con GitHub Actions

### Opción 2: Azure Container Instances

1. **Crear Dockerfile** (ya incluido en el proyecto)
2. **Build y push a Azure Container Registry**
3. **Deploy en ACI**

### URL del proyecto desplegado:
🔗 `https://crm-intelligence.azurewebsites.net`

## 📸 Capturas de Pantalla

### Interfaz Principal
![Interfaz](screenshots/interfaz.png)

### Ejemplo de Conversación
![Conversación](screenshots/conversation.png)

## 🧪 Testing

### Prueba local:
```bash
# Terminal 1: Iniciar servidor
python src/api.py

# Terminal 2: Hacer pruebas
curl http://localhost:8000/health
```

### Prueba de queries:
```python
from src.agent import CRMAgent

agent = CRMAgent(api_key="tu_api_key")
agent.load_documents()
result = agent.query("¿Cuáles son los planes disponibles?")
print(result["answer"])
```

## 📊 Métricas del Proyecto

- **Documentos procesados:** 5 archivos (4 TXT + 1 CSV)
- **Vectores generados:** ~150 chunks
- **Tiempo de respuesta:** ~2-3 segundos
- **Modelo:** Gemini Pro (gratuito)
- **Precisión:** Alta (basada en documentación real)

## 🔒 Seguridad

- ✅ API key almacenada en variables de entorno
- ✅ No se exponen datos sensibles en logs
- ✅ CORS configurado para producción
- ✅ Rate limiting (en producción)

## 🤝 Contribuciones

Este es un proyecto personal para el challenge. Si deseas contribuir:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit tus cambios (`git commit -m 'Agregar mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## 📝 Licencia

MIT License - ver archivo LICENSE para más detalles

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)
- Email: tu@email.com

## 🙏 Agradecimientos

- Oracle Cloud Infrastructure (OCI) por el challenge
- Google por Gemini Pro
- LangChain por el framework
- La comunidad de desarrolladores

---

**Nota:** Este proyecto fue desarrollado como parte del challenge de Oracle + Alura Latam.
