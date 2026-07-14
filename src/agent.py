import os
from pathlib import Path
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader, CSVLoader
import pandas as pd

class CRMAgent:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=api_key,
            temperature=0.3
        )
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=api_key
        )
        self.vectorstore = None
        self.qa_chain = None
        
    def load_documents(self, docs_path: str = "docs"):
        """Carga todos los documentos de la carpeta docs"""
        documents = []
        docs_dir = Path(docs_path)
        
        # Cargar archivos .txt
        for txt_file in docs_dir.glob("*.txt"):
            loader = TextLoader(str(txt_file), encoding='utf-8')
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
        
        # Crear vectorstore
        self.vectorstore = FAISS.from_documents(splits, self.embeddings)
        
        # Crear cadena de Q&A
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vectorstore.as_retriever(search_kwargs={"k": 3}),
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
