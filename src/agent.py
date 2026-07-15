import os
from pathlib import Path
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain_community.retrievers import BM25Retriever
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader, CSVLoader, PyPDFLoader

class CRMAgent:
    def __init__(self, deepseek_api_key: str, google_api_key: str = None):
        self.deepseek_api_key = deepseek_api_key
        
        # Inicializar DeepSeek Chat usando el cliente de OpenAI compatible
        self.llm = ChatOpenAI(
            model="deepseek-chat",
            openai_api_key=deepseek_api_key,
            openai_api_base="https://api.deepseek.com/v1",
            temperature=0.3
        )
        
        self.retriever = None
        self.qa_chain = None
        
    def load_documents(self, docs_path: str = "docs"):
        """Carga todos los documentos de la carpeta docs"""
        documents = []
        docs_dir = Path(docs_path)
        
        # Cargar archivos .txt
        for txt_file in docs_dir.glob("*.txt"):
            loader = TextLoader(str(txt_file), encoding='utf-8')
            documents.extend(loader.load())
        
        # Cargar archivos .pdf
        for pdf_file in docs_dir.glob("*.pdf"):
            loader = PyPDFLoader(str(pdf_file))
            documents.extend(loader.load())
        
        # Cargar archivo CSV
        csv_file = docs_dir / "planes_precios.csv"
        if csv_file.exists():
            loader = CSVLoader(str(csv_file))
            documents.extend(loader.load())
        
        # Dividir documentos en chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        splits = text_splitter.split_documents(documents)
        
        # Crear retriever BM25 (no necesita embeddings ni API keys)
        self.retriever = BM25Retriever.from_documents(splits, k=3)
        
        # Crear cadena de Q&A
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.retriever,
            return_source_documents=True
        )
        
        return len(documents)
    
    def query(self, question: str) -> dict:
        """Realiza una consulta al agente"""
        if not self.qa_chain:
            raise ValueError("Documentos no cargados. Ejecuta load_documents() primero.")
        
        result = self.qa_chain({"query": question})
        
        return {
            "question": question,
            "answer": result["result"],
            "sources": [doc.metadata.get("source", "Unknown") for doc in result["source_documents"]]
        }
