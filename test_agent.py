"""
Script de prueba simple del agente CRM Intelligence
"""
import os
from dotenv import load_dotenv
from src.agent import CRMAgent

def main():
    # Cargar variables de entorno
    load_dotenv()
    api_key = os.getenv("GOOGLE_API_KEY")
    
    if not api_key:
        print("❌ Error: GOOGLE_API_KEY no encontrada")
        print("Por favor crea un archivo .env con tu API key")
        return
    
    print("🤖 Inicializando agente CRM Intelligence...")
    agent = CRMAgent(api_key)
    
    print("📚 Cargando documentos...")
    docs_count = agent.load_documents()
    print(f"✅ {docs_count} documentos cargados\n")
    
    # Preguntas de prueba
    test_questions = [
        "¿Cómo agrego un nuevo contacto?",
        "¿Cuánto cuesta el plan Professional?",
        "¿Qué automatizaciones puedo configurar?",
    ]
    
    print("=" * 60)
    for question in test_questions:
        print(f"\n❓ Pregunta: {question}")
        print("-" * 60)
        
        result = agent.query(question)
        print(f"💬 Respuesta: {result['answer']}")
        print(f"📖 Fuentes: {', '.join([s.split('/')[-1] for s in result['sources']])}")
        print("=" * 60)

if __name__ == "__main__":
    main()
