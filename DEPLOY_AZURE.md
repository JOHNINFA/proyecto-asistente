# 🌐 Guía de Deploy en Azure

Esta guía te ayudará a desplegar **CRM Intelligence** en Azure App Service.

## Prerrequisitos

- Cuenta de Azure activa
- Azure CLI instalado ([Instalar aquí](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli))
- Git instalado

## Opción 1: Azure App Service (Recomendado)

### Paso 1: Login en Azure

```bash
az login
```

### Paso 2: Crear un grupo de recursos

```bash
az group create --name crm-intelligence-rg --location eastus
```

### Paso 3: Crear App Service Plan

```bash
az appservice plan create \
  --name crm-intelligence-plan \
  --resource-group crm-intelligence-rg \
  --sku B1 \
  --is-linux
```

### Paso 4: Crear Web App

```bash
az webapp create \
  --name crm-intelligence-app \
  --resource-group crm-intelligence-rg \
  --plan crm-intelligence-plan \
  --runtime "PYTHON:3.10"
```

**Nota:** El nombre debe ser único globalmente. Si ya existe, cambia `crm-intelligence-app` por otro nombre.

### Paso 5: Configurar variables de entorno

```bash
az webapp config appsettings set \
  --name crm-intelligence-app \
  --resource-group crm-intelligence-rg \
  --settings GOOGLE_API_KEY="tu_api_key_aqui"
```

### Paso 6: Configurar startup command

```bash
az webapp config set \
  --name crm-intelligence-app \
  --resource-group crm-intelligence-rg \
  --startup-file "cd src && python -m uvicorn api:app --host 0.0.0.0 --port 8000"
```

### Paso 7: Deploy desde GitHub (Recomendado)

#### Opción A: Desde Azure Portal
1. Ve a Azure Portal → Tu Web App
2. Deployment Center → Source: GitHub
3. Autoriza Azure a acceder a tu repo
4. Selecciona tu repositorio y branch
5. Save → Deploy automático

#### Opción B: Desde CLI

```bash
# Configurar deployment desde GitHub
az webapp deployment source config \
  --name crm-intelligence-app \
  --resource-group crm-intelligence-rg \
  --repo-url https://github.com/tu-usuario/crm-intelligence \
  --branch main \
  --manual-integration
```

### Paso 8: Deploy local (Alternativa)

```bash
# Deploy desde carpeta local
az webapp up \
  --name crm-intelligence-app \
  --resource-group crm-intelligence-rg \
  --runtime "PYTHON:3.10"
```

### Paso 9: Verificar el deploy

```bash
# Ver logs en tiempo real
az webapp log tail \
  --name crm-intelligence-app \
  --resource-group crm-intelligence-rg
```

Abre tu aplicación:
```
https://crm-intelligence-app.azurewebsites.net
```

## Opción 2: Azure Container Instances (ACI)

### Paso 1: Construir imagen Docker

```bash
docker build -t crm-intelligence .
```

### Paso 2: Crear Azure Container Registry

```bash
az acr create \
  --name crmIntelligenceRegistry \
  --resource-group crm-intelligence-rg \
  --sku Basic \
  --admin-enabled true
```

### Paso 3: Push imagen a ACR

```bash
# Login al registry
az acr login --name crmIntelligenceRegistry

# Tag la imagen
docker tag crm-intelligence crmIntelligenceRegistry.azurecr.io/crm-intelligence:v1

# Push
docker push crmIntelligenceRegistry.azurecr.io/crm-intelligence:v1
```

### Paso 4: Deploy en ACI

```bash
# Obtener password del registry
ACR_PASSWORD=$(az acr credential show --name crmIntelligenceRegistry --query "passwords[0].value" -o tsv)

# Crear container instance
az container create \
  --name crm-intelligence-container \
  --resource-group crm-intelligence-rg \
  --image crmIntelligenceRegistry.azurecr.io/crm-intelligence:v1 \
  --registry-password $ACR_PASSWORD \
  --dns-name-label crm-intelligence \
  --ports 8000 \
  --environment-variables GOOGLE_API_KEY="tu_api_key"
```

Tu aplicación estará en:
```
http://crm-intelligence.eastus.azurecontainer.io:8000
```

## Configuración adicional

### Habilitar HTTPS

```bash
az webapp update \
  --name crm-intelligence-app \
  --resource-group crm-intelligence-rg \
  --https-only true
```

### Configurar custom domain

```bash
az webapp config hostname add \
  --webapp-name crm-intelligence-app \
  --resource-group crm-intelligence-rg \
  --hostname www.tudominio.com
```

### Escalar recursos

```bash
# Escalar a más instancias
az appservice plan update \
  --name crm-intelligence-plan \
  --resource-group crm-intelligence-rg \
  --number-of-workers 2

# Cambiar tier
az appservice plan update \
  --name crm-intelligence-plan \
  --resource-group crm-intelligence-rg \
  --sku S1
```

### Ver métricas

```bash
az monitor metrics list \
  --resource crm-intelligence-app \
  --resource-group crm-intelligence-rg \
  --metric-names CpuPercentage MemoryPercentage
```

## Monitoreo

### Application Insights

```bash
# Crear Application Insights
az monitor app-insights component create \
  --app crm-intelligence-insights \
  --location eastus \
  --resource-group crm-intelligence-rg

# Obtener instrumentation key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app crm-intelligence-insights \
  --resource-group crm-intelligence-rg \
  --query instrumentationKey -o tsv)

# Configurar en la web app
az webapp config appsettings set \
  --name crm-intelligence-app \
  --resource-group crm-intelligence-rg \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$INSTRUMENTATION_KEY
```

## Troubleshooting

### Ver logs de la aplicación

```bash
# Habilitar logging
az webapp log config \
  --name crm-intelligence-app \
  --resource-group crm-intelligence-rg \
  --application-logging filesystem \
  --level information

# Ver logs
az webapp log tail \
  --name crm-intelligence-app \
  --resource-group crm-intelligence-rg
```

### SSH a la instancia

```bash
az webapp ssh \
  --name crm-intelligence-app \
  --resource-group crm-intelligence-rg
```

### Restart app

```bash
az webapp restart \
  --name crm-intelligence-app \
  --resource-group crm-intelligence-rg
```

## Costos estimados

**App Service B1:**
- ~$13/mes
- 1 Core, 1.75GB RAM
- Perfecto para este proyecto

**Container Instances:**
- ~$0.0000125/segundo
- ~$32/mes (24/7)
- Pago por uso

**Free Tier (F1):**
- Gratis
- Limitaciones: 60 min CPU/día
- No custom domain

## Eliminar recursos

```bash
# Eliminar todo el grupo de recursos
az group delete \
  --name crm-intelligence-rg \
  --yes \
  --no-wait
```

## Checklist final

- [ ] App desplegada correctamente
- [ ] Variables de entorno configuradas
- [ ] HTTPS habilitado
- [ ] Logs funcionando
- [ ] Verificar URL pública funciona
- [ ] Tomar screenshots para el README
- [ ] Actualizar README con URL real

## URLs de referencia

- **Azure Portal:** https://portal.azure.com
- **Azure CLI Docs:** https://docs.microsoft.com/en-us/cli/azure/
- **App Service Docs:** https://docs.microsoft.com/en-us/azure/app-service/

---

**¿Problemas?** Revisa los logs o contacta al soporte de Azure.
