# 🛠️ Comandos Útiles - CRM Intelligence

Referencia rápida de comandos para desarrollo, testing y deploy.

---

## 🔧 Configuración Inicial

### Crear y activar entorno virtual
```bash
# Crear venv
python -m venv venv

# Activar (Linux/Mac)
source venv/bin/activate

# Activar (Windows)
venv\Scripts\activate

# Desactivar
deactivate
```

### Instalar dependencias
```bash
# Instalar todo
pip install -r requirements.txt

# Actualizar pip
pip install --upgrade pip

# Ver paquetes instalados
pip list

# Generar requirements actualizado
pip freeze > requirements.txt
```

### Configurar API key
```bash
# Copiar ejemplo
cp .env.example .env

# Editar con nano
nano .env

# O con vim
vim .env

# Ver variables (Linux/Mac)
cat .env

# Ver variables (Windows)
type .env
```

---

## 🚀 Ejecutar Aplicación

### Modo desarrollo
```bash
# Ejecutar API con interfaz web
cd src
python api.py

# O con uvicorn directamente (con reload)
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

### Ejecutar en otro puerto
```bash
# Puerto 8080
uvicorn api:app --host 0.0.0.0 --port 8080

# Puerto 3000
uvicorn api:app --host 0.0.0.0 --port 3000
```

### Script de prueba
```bash
# Desde raíz del proyecto
python test_agent.py
```

---

## 🧪 Testing

### Probar la API con curl

```bash
# Health check
curl http://localhost:8000/health

# Hacer una pregunta
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Cómo agrego un nuevo contacto?"}'

# Con formato (requiere jq)
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Cuánto cuesta el plan Professional?"}' | jq
```

### Probar con Python
```python
# test_manual.py
import requests

response = requests.post(
    "http://localhost:8000/query",
    json={"question": "¿Qué incluye el plan Enterprise?"}
)

print(response.json())
```

---

## 🐳 Docker

### Construir imagen
```bash
# Build básico
docker build -t crm-intelligence .

# Build con tag específico
docker build -t crm-intelligence:v1.0 .

# Build sin cache
docker build --no-cache -t crm-intelligence .
```

### Ejecutar container
```bash
# Ejecutar con API key
docker run -p 8000:8000 \
  -e GOOGLE_API_KEY="tu_api_key" \
  crm-intelligence

# Ejecutar en background
docker run -d -p 8000:8000 \
  -e GOOGLE_API_KEY="tu_api_key" \
  --name crm-agent \
  crm-intelligence

# Ver logs
docker logs -f crm-agent

# Detener container
docker stop crm-agent

# Remover container
docker rm crm-agent
```

### Ver imágenes y containers
```bash
# Listar imágenes
docker images

# Listar containers activos
docker ps

# Listar todos los containers
docker ps -a

# Remover imagen
docker rmi crm-intelligence
```

---

## 📦 Git

### Inicializar y primer commit
```bash
# Inicializar repo
git init

# Ver estado
git status

# Agregar archivos
git add .
# o específicos
git add README.md src/agent.py

# Commit
git commit -m "Initial commit: CRM Intelligence Agent"

# Ver historial
git log --oneline
```

### Conectar con GitHub
```bash
# Agregar remoto
git remote add origin https://github.com/tu-usuario/crm-intelligence.git

# Ver remotos
git remote -v

# Push inicial
git push -u origin main

# Push subsecuentes
git push
```

### Branches
```bash
# Crear branch
git checkout -b feature/mejora

# Cambiar de branch
git checkout main

# Listar branches
git branch

# Merge branch
git checkout main
git merge feature/mejora

# Eliminar branch
git branch -d feature/mejora
```

---

## ☁️ Azure CLI

### Login y configuración
```bash
# Login
az login

# Ver suscripciones
az account list --output table

# Seleccionar suscripción
az account set --subscription "nombre-o-id"

# Ver ubicaciones disponibles
az account list-locations --output table
```

### Crear recursos
```bash
# Crear resource group
az group create --name crm-intelligence-rg --location eastus

# Listar resource groups
az group list --output table

# Crear App Service plan
az appservice plan create \
  --name crm-plan \
  --resource-group crm-intelligence-rg \
  --sku B1 \
  --is-linux

# Crear Web App
az webapp create \
  --name crm-intelligence-tuusuario \
  --resource-group crm-intelligence-rg \
  --plan crm-plan \
  --runtime "PYTHON:3.10"
```

### Deploy
```bash
# Deploy local
az webapp up \
  --name crm-intelligence-tuusuario \
  --resource-group crm-intelligence-rg

# Configurar variable de entorno
az webapp config appsettings set \
  --name crm-intelligence-tuusuario \
  --resource-group crm-intelligence-rg \
  --settings GOOGLE_API_KEY="tu_api_key"

# Ver configuración
az webapp config appsettings list \
  --name crm-intelligence-tuusuario \
  --resource-group crm-intelligence-rg
```

### Monitoreo
```bash
# Ver logs en tiempo real
az webapp log tail \
  --name crm-intelligence-tuusuario \
  --resource-group crm-intelligence-rg

# Habilitar logging
az webapp log config \
  --name crm-intelligence-tuusuario \
  --resource-group crm-intelligence-rg \
  --application-logging filesystem

# Restart app
az webapp restart \
  --name crm-intelligence-tuusuario \
  --resource-group crm-intelligence-rg
```

### Limpiar recursos
```bash
# Eliminar web app
az webapp delete \
  --name crm-intelligence-tuusuario \
  --resource-group crm-intelligence-rg

# Eliminar todo el resource group
az group delete \
  --name crm-intelligence-rg \
  --yes
```

---

## 🔍 Debugging

### Ver logs de Python
```bash
# Ver logs de uvicorn
tail -f uvicorn.log

# Ver errores
python src/api.py 2>&1 | tee error.log
```

### Verificar puertos
```bash
# Ver qué está usando el puerto 8000 (Linux/Mac)
lsof -i :8000

# Matar proceso en puerto 8000
kill -9 $(lsof -t -i:8000)

# Windows
netstat -ano | findstr :8000
```

### Python debugging
```bash
# Ejecutar con modo verbose
python -v src/api.py

# Usar pdb (debugger)
python -m pdb src/api.py
```

---

## 📊 Útiles

### Ver estructura del proyecto
```bash
# Linux/Mac (si tienes tree)
tree -I 'venv|__pycache__|.git'

# Alternativa con find
find . -type f -not -path "./venv/*" -not -path "./.git/*" | head -20

# Contar líneas de código
find . -name "*.py" -not -path "./venv/*" | xargs wc -l
```

### Limpiar archivos temporales
```bash
# Limpiar cache de Python
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find . -type f -name "*.pyc" -delete

# Limpiar archivos de build
rm -rf build/ dist/ *.egg-info
```

### Variables de entorno
```bash
# Ver variable (Linux/Mac)
echo $GOOGLE_API_KEY

# Exportar temporalmente
export GOOGLE_API_KEY="tu_key"

# Windows
echo %GOOGLE_API_KEY%
set GOOGLE_API_KEY=tu_key
```

---

## 🎯 Shortcuts de desarrollo

### Alias útiles (agregar a .bashrc o .zshrc)
```bash
# Activar venv
alias venv='source venv/bin/activate'

# Ejecutar app
alias runapp='cd src && python api.py'

# Ver logs de Azure
alias azlogs='az webapp log tail --name crm-intelligence-tuusuario --resource-group crm-intelligence-rg'

# Git shortcuts
alias gs='git status'
alias ga='git add'
alias gc='git commit -m'
alias gp='git push'
```

---

## 📚 Recursos útiles

### URLs importantes
```
Google AI Studio: https://makersuite.google.com/app/apikey
Azure Portal: https://portal.azure.com
FastAPI Docs: http://localhost:8000/docs
ReDoc: http://localhost:8000/redoc
```

### Documentación
```
LangChain: https://python.langchain.com/docs/
FastAPI: https://fastapi.tiangolo.com/
Gemini API: https://ai.google.dev/docs
Azure CLI: https://docs.microsoft.com/cli/azure/
```

---

**Tip:** Copia estos comandos en tu terminal según los necesites. ¡Feliz desarrollo! 🚀
