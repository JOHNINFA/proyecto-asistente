FROM python:3.10-slim

WORKDIR /app

# Copiar archivos de dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente y documentos
COPY src/ ./src/
COPY docs/ ./docs/
COPY templates/ ./templates/
COPY .env.example .env

# Exponer puerto
EXPOSE 8000

# Comando de inicio
CMD ["python", "src/api.py"]
