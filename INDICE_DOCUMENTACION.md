# 📚 Índice de Documentación - CRM Intelligence

## 🗂️ Guías Disponibles

### Para Usuarios

| Documento | Descripción | Audiencia |
|-----------|-------------|-----------|
| **[README.md](./README.md)** | Vista general del proyecto, instalación y uso | Todos |
| **[GUIA_RAPIDA.md](./GUIA_RAPIDA.md)** | Inicio rápido en 5 minutos + troubleshooting | Usuarios nuevos |
| **[QUICKSTART.md](./QUICKSTART.md)** | Guía rápida original (legacy) | Usuarios |

### Para Desarrolladores

| Documento | Descripción | Audiencia |
|-----------|-------------|-----------|
| **[DOCUMENTACION.md](./DOCUMENTACION.md)** | Documentación técnica completa | Desarrolladores |
| **[ARQUITECTURA.md](./ARQUITECTURA.md)** | Diagramas de arquitectura y flujos | Arquitectos/Devs |
| **[PARA_IA.md](./PARA_IA.md)** | Contexto para IAs trabajando en el proyecto | Agentes IA |

### Para Deployment

| Documento | Descripción | Audiencia |
|-----------|-------------|-----------|
| **[DEPLOY_AZURE.md](./DEPLOY_AZURE.md)** | Guía de deployment en Azure | DevOps |
| **[COMANDOS_UTILES.md](./COMANDOS_UTILES.md)** | Comandos útiles para operación | DevOps/Admins |

### Histórico

| Documento | Descripción | Audiencia |
|-----------|-------------|-----------|
| **[PROYECTO_COMPLETADO.md](./PROYECTO_COMPLETADO.md)** | Estado del proyecto al momento del challenge | PM/Stakeholders |

---

## 🎯 ¿Qué documento leer según tu objetivo?

### 🚀 "Quiero empezar a usar el CRM ahora"
👉 **[GUIA_RAPIDA.md](./GUIA_RAPIDA.md)**
- Instalación en 5 minutos
- Funcionalidades principales
- Troubleshooting común

---

### 📖 "Quiero entender cómo funciona el proyecto"
👉 **[README.md](./README.md)**
- Descripción general
- Arquitectura visual
- Tecnologías usadas
- Ejemplos de uso

---

### 🔧 "Voy a desarrollar/modificar el código"
👉 **[DOCUMENTACION.md](./DOCUMENTACION.md)**
- Estructura del proyecto completa
- Componentes principales explicados
- API endpoints documentados
- Base de conocimiento detallada
- Flujos de datos
- Testing

---

### 🏗️ "Necesito entender la arquitectura técnica"
👉 **[ARQUITECTURA.md](./ARQUITECTURA.md)**
- Diagramas de arquitectura ASCII
- Flujos de interacción detallados
- Modelos de datos
- Métricas de rendimiento
- Guía de escalabilidad

---

### 🚢 "Voy a deployar el proyecto"
👉 **[DEPLOY_AZURE.md](./DEPLOY_AZURE.md)**
- Deployment en Azure
- Configuración de servicios
- Variables de entorno
- CI/CD

---

### 🤖 "Soy una IA trabajando en el proyecto"
👉 **[PARA_IA.md](./PARA_IA.md)**
- Contexto del proyecto
- Decisiones de arquitectura
- Convenciones de código
- Tareas comunes

---

## 📋 Resumen Ejecutivo

### ¿Qué es este proyecto?

**CRM Intelligence** es un sistema de gestión de clientes con IA conversacional que:
- Responde preguntas sobre el producto usando documentos PDF/TXT/CSV
- Permite gestionar contactos, pipeline de ventas e integraciones
- Usa RAG (Retrieval Augmented Generation) con DeepSeek y BM25

### Stack Tecnológico

**Backend:** Python 3.10 + FastAPI + LangChain + DeepSeek  
**Frontend:** React 19 + Vite 8 + Lucide Icons  
**Base de Conocimiento:** 5 PDFs + 5 TXT + 1 CSV (21 documentos)  
**Retriever:** BM25 (sin embeddings)

### Puertos

- **Backend:** http://localhost:8000
- **Frontend:** http://localhost:5173

### Requisitos

- Python 3.10+
- Node.js 18+
- DeepSeek API Key

---

## 🗺️ Mapa de Contenidos

### README.md
```
📦 Instalación
├── Requisitos previos
├── Backend setup
└── Frontend setup

🚀 Uso
├── Iniciar backend
├── Iniciar frontend
└── Funcionalidades principales

📡 API
├── POST /query
├── GET /health
└── GET /docs

📚 Base de Conocimiento
└── Documentos disponibles
```

### DOCUMENTACION.md
```
📖 Introducción
├── Descripción general
├── Arquitectura del sistema
└── Estructura del proyecto

🔧 Componentes
├── Agente IA (agent.py)
├── API REST (api.py)
└── Frontend (App.jsx)

⚙️ Configuración
├── Variables de entorno
├── Instalación paso a paso
└── Ejecución

📡 API Reference
├── Endpoints
├── Request/Response
└── Ejemplos

🔄 Flujos
├── Usuario hace pregunta
├── Usuario crea contacto
└── Sistema carga docs

🛠️ Troubleshooting
└── Errores comunes
```

### ARQUITECTURA.md
```
🏗️ Vista General
└── Diagrama completo del sistema

🔄 Flujos de Interacción
├── Flujo 1: Pregunta al agente
├── Flujo 2: Crear contacto
└── Flujo 3: Carga de documentos

🗄️ Modelos de Datos
├── Frontend: Contact, Deal
└── Backend: Question, Answer

🔐 Seguridad
├── Variables de entorno
└── CORS

📊 Métricas
└── Rendimiento típico

🚀 Escalabilidad
├── Límites actuales
└── Mejoras para producción
```

### GUIA_RAPIDA.md
```
⚡ Inicio Rápido
├── Instalación en 5 min
├── Configuración
└── Ejecución

🎯 Funcionalidades
├── Crear contacto
├── Consultar agente
├── Gestionar pipeline
└── Ver precios

🤖 Usando el Agente
├── Preguntas operativas
├── Preguntas sobre producto
├── Preguntas sobre precios
└── Preguntas sobre políticas

🛠️ Troubleshooting
└── Problemas comunes
```

---

## 📊 Estadísticas de Documentación

- **Total de archivos MD:** 9
- **Documentación principal:** 4 archivos (README, DOCUMENTACION, ARQUITECTURA, GUIA_RAPIDA)
- **Líneas de documentación:** ~2,500 líneas
- **Diagramas ASCII:** 5+
- **Ejemplos de código:** 20+
- **Screenshots/Capturas:** Pendiente agregar

---

## 🔄 Actualización de Documentación

### Última actualización: 15 de Julio 2026

**Cambios recientes:**
- ✅ Agregado DOCUMENTACION.md completa
- ✅ Actualizado README.md con stack actual
- ✅ Creado GUIA_RAPIDA.md para usuarios
- ✅ Agregado ARQUITECTURA.md con diagramas
- ✅ Creado INDICE_DOCUMENTACION.md (este archivo)

**Por hacer:**
- [ ] Agregar screenshots del CRM
- [ ] Video demo del proyecto
- [ ] API reference en formato OpenAPI
- [ ] Guía de contribución (CONTRIBUTING.md)
- [ ] Changelog (CHANGELOG.md)

---

## 🤝 Cómo Contribuir

Si quieres mejorar la documentación:

1. Lee [PARA_IA.md](./PARA_IA.md) para entender el contexto
2. Identifica qué falta o puede mejorarse
3. Crea un PR con los cambios
4. Actualiza este índice si agregas nuevos documentos

---

## 📞 Soporte

¿Documentación confusa o incompleta?

- **Issues:** [GitHub Issues]
- **Email:** tu@email.com
- **Discord:** [Link al servidor]

---

## 📝 Licencia

Toda la documentación está bajo la misma licencia del proyecto.

---

**Este índice se actualiza con cada commit significativo de documentación.**

---

## 🎓 Recursos Externos

### Tecnologías Usadas

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [LangChain Docs](https://python.langchain.com/)
- [DeepSeek API](https://platform.deepseek.com/docs)
- [Vite Docs](https://vitejs.dev/)

### Tutoriales Relacionados

- [RAG con LangChain](https://python.langchain.com/docs/tutorials/rag/)
- [BM25 Retriever](https://python.langchain.com/docs/integrations/retrievers/bm25/)
- [FastAPI + React](https://testdriven.io/blog/fastapi-react/)

---

**¡Gracias por leer la documentación! 🚀**
