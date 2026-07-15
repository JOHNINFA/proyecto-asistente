# ⚡ Guía Rápida - CRM Intelligence

## 🚀 Inicio Rápido (5 minutos)

### 1. Instalar dependencias

```bash
# Backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
cd ..
```

### 2. Configurar API Key

```bash
# Crear archivo .env
echo "DEEPSEEK_API_KEY=tu_key_aqui" > .env
```

**¿Dónde conseguir la key?**
👉 https://platform.deepseek.com/api_keys

### 3. Iniciar proyecto

**Terminal 1:**
```bash
uvicorn src.api:app --reload
```

**Terminal 2:**
```bash
cd frontend && npm run dev
```

### 4. Abrir en navegador

```
http://localhost:5173
```

✅ ¡Listo! Ya puedes usar el CRM.

---

## 🎯 Funcionalidades Principales

### 1️⃣ Crear Contacto

1. Ir a **"Contactos"** en el menú lateral
2. Clic en **"+ Nuevo Contacto"**
3. Completar formulario:
   - Nombre: Juan Pérez
   - Email: juan@empresa.com
   - Plan: Professional
   - Estado: Activo
4. Clic **"Guardar"**

✅ Contacto aparece en la tabla

---

### 2️⃣ Consultar al Agente IA

1. Clic en botón flotante **🤖** (esquina inferior derecha)
2. Escribir pregunta en el chat:
   ```
   ¿Cómo agrego un nuevo contacto?
   ```
3. Ver respuesta + fuentes citadas

**Preguntas ejemplo:**
- ¿Cuánto cuesta el plan Professional?
- ¿Qué automatizaciones puedo configurar?
- ¿Cómo integro Gmail con el CRM?

---

### 3️⃣ Gestionar Pipeline

1. Ir a **"Embudo Ventas"**
2. Ver deals en 5 etapas:
   - Lead
   - Contactado
   - Propuesta
   - Negociación
   - Ganado
3. Usar dropdown para mover deals entre etapas

---

### 4️⃣ Ver Planes y Precios

1. Ir a **"Planes y Costos"**
2. Ver 3 opciones:
   - **Starter:** $29/mes
   - **Professional:** $79/mes ⭐
   - **Enterprise:** $199/mes
3. Clic en "Preguntar a la IA" para más detalles

---

## 🤖 Usando el Agente IA

### Preguntas Operativas
```
¿Cómo agrego un nuevo contacto?
¿Cómo creo una oportunidad de venta?
¿Cómo configuro automatizaciones?
¿Cómo integro mi email?
¿Cuáles son los atajos de teclado?
```

### Preguntas sobre Producto
```
¿Qué automatizaciones tiene SalesPro?
¿Qué reportes genera el CRM?
¿Hay integración con WhatsApp?
¿Puedo importar contactos masivamente?
```

### Preguntas sobre Precios
```
¿Cuánto cuesta el plan Professional?
¿Qué incluye cada plan?
¿Cuántos usuarios tiene el plan Starter?
¿Hay descuento anual?
```

### Preguntas sobre Políticas
```
¿Dónde se almacenan mis datos?
¿Cómo cancelo mi suscripción?
¿Cuál es la política de reembolso?
¿Cómo contacto al soporte?
```

---

## 📊 Dashboard - Métricas

Al iniciar verás:

- **Ingresos Mensuales (MRR):** $12,450
- **Contactos Activos:** 1,234
- **Tasa de Conversión:** 3.2%
- **Gráfico:** Rendimiento por etapa del embudo

---

## 🔌 Integraciones

1. Ir a **"Integraciones"**
2. Ver apps disponibles:
   - Gmail Integration
   - WhatsApp Cloud API
   - Stripe Payments
   - Outlook 365
3. Clic en **"Conectar"** o **"Desconectar"**

---

## ❓ Troubleshooting Rápido

### Backend no inicia
```bash
# Verificar API key
cat .env

# Si no existe:
echo "DEEPSEEK_API_KEY=sk-xxxxx" > .env
```

### Frontend no conecta
```bash
# Verificar que backend esté corriendo
curl http://localhost:8000/health

# Debería responder:
# {"status": "healthy", "agent": "ready"}
```

### Agente no responde
1. Verificar indicador verde en esquina superior derecha
2. Si está rojo, reiniciar backend:
   ```bash
   uvicorn src.api:app --reload
   ```

### Modal no abre
1. Refrescar página (Ctrl+R)
2. Limpiar caché (Ctrl+Shift+R)

---

## 🎨 Atajos de Teclado

- **Ctrl + K:** Búsqueda rápida
- **G + D:** Ir al Dashboard
- **G + C:** Ir a Contactos
- **G + P:** Ir al Pipeline
- **/:** Activar búsqueda

---

## 📱 API REST

### Consultar desde código

**Python:**
```python
import requests

response = requests.post(
    "http://localhost:8000/query",
    json={"question": "¿Cómo agrego contactos?"}
)

print(response.json()["answer"])
```

**JavaScript:**
```javascript
fetch('http://localhost:8000/query', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    question: '¿Cuánto cuesta el plan Professional?'
  })
})
.then(r => r.json())
.then(data => console.log(data.answer));
```

**cURL:**
```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Qué automatizaciones hay?"}'
```

---

## 📖 Documentación Completa

Para más detalles:

👉 **[DOCUMENTACION.md](./DOCUMENTACION.md)** - Guía técnica completa  
👉 **[README.md](./README.md)** - Información del proyecto

---

## 💡 Tips

1. **Preguntas específicas** obtienen mejores respuestas
   - ❌ "¿Qué es esto?"
   - ✅ "¿Cómo agrego un nuevo contacto en SalesPro?"

2. **Fuentes citadas** son clickeables
   - Haz clic en badges para ver de dónde viene la info

3. **Botón copiar** en cada respuesta
   - Clic en 📋 para copiar texto

4. **Preguntas sugeridas** en el chat
   - Chips clickeables con preguntas comunes

5. **Estado de conexión** siempre visible
   - Verde = Backend activo
   - Rojo = Backend desconectado

---

## 🆘 Soporte

**Documentación:**
- [DOCUMENTACION.md](./DOCUMENTACION.md)
- [README.md](./README.md)

**Errores comunes:**
- Backend: Verificar `.env` con DEEPSEEK_API_KEY
- Frontend: Asegurar que puerto 5173 esté libre
- Documentos: Verificar `docs/` tiene PDFs

**Contacto:**
- GitHub Issues: [Link]
- Email: tu@email.com

---

**¡Disfruta del CRM! 🚀**
