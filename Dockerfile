FROM python:3.10-slim

WORKDIR /app

# Copiar archivos de dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente y documentos
COPY src/ ./src/
COPY docs/ ./docs/
COPY templates/ ./templates/

# NO copiamos ninguna .env: la DEEPSEEK_API_KEY se pasa como variable de
# entorno al correr el contenedor (docker run -e DEEPSEEK_API_KEY=...).
# Así la clave real nunca queda dentro de la imagen.

# Exponer puerto
EXPOSE 8000

# Comando de inicio
CMD ["python", "src/api.py"]
