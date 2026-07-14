# 🚀 Inicio Rápido - CRM Intelligence

## Instalación en 5 minutos

### 1️⃣ Obtener API Key de Google Gemini (GRATIS)

1. Ve a: https://makersuite.google.com/app/apikey
2. Inicia sesión con tu cuenta Google
3. Haz clic en "Create API Key"
4. Copia la API key generada

### 2️⃣ Configurar el proyecto

```bash
# Clonar repositorio (reemplaza con tu URL)
git clone <tu-repo-url>
cd crm-intelligence

# Activar entorno virtual (si existe)
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar API key
cp .env.example .env
nano .env  # o usa tu editor favorito
```

En el archivo `.env`:
```
GOOGLE_API_KEY=tu_api_key_aqui
```

### 3️⃣ Ejecutar la aplicación

```bash
# Opción 1: Interfaz web completa
cd src
python api.py
```

Abre tu navegador en: **http://localhost:8000**

```bash
# Opción 2: Prueba rápida desde terminal
python test_agent.py
```

## ✅ Verificar que funciona

Abre http://localhost:8000 y prueba estas preguntas:

- "¿Cómo agrego un nuevo contacto?"
- "¿Cuánto cuesta el plan Professional?"
- "¿Qué automatizaciones puedo configurar?"

## 🐛 Solución de problemas

### Error: "GOOGLE_API_KEY no encontrada"
✅ Verifica que el archivo `.env` exista y tenga tu API key

### Error: "Module not found"
✅ Ejecuta: `pip install -r requirements.txt`

### Error: Puerto 8000 en uso
✅ Cambia el puerto en `src/api.py` línea final:
```python
uvicorn.run(app, host="0.0.0.0", port=8001)  # cambiar a 8001
```

## 📚 Próximos pasos

- Lee el [README.md](README.md) completo para más detalles
- Personaliza los documentos en la carpeta `docs/`
- Despliega en Azure siguiendo la guía del README

## 💡 Atajos útiles

```bash
# Probar la API con curl
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Cuánto cuesta el plan Starter?"}'

# Ver logs en tiempo real
tail -f logs/*.log  # si tienes logs configurados

# Construir Docker image
docker build -t crm-intelligence .

# Correr con Docker
docker run -p 8000:8000 -e GOOGLE_API_KEY=tu_key crm-intelligence
```

---

**¿Necesitas ayuda?** Abre un issue en GitHub o contacta al autor.
