"""
Script para convertir todos los archivos .txt de docs/ a PDFs profesionales.
"""
from fpdf import FPDF
from pathlib import Path

# Mapa de archivos -> título del PDF
DOCS_MAP = {
    "base_conocimiento_producto.txt": "Base de Conocimiento del Producto — SalesPro CRM",
    "faq_soporte.txt": "Preguntas Frecuentes (FAQ) de Soporte — SalesPro CRM",
    "politica_privacidad.txt": "Política de Privacidad — SalesPro CRM",
    "terminos_uso.txt": "Términos y Condiciones de Uso — SalesPro CRM",
}

docs_dir = Path(__file__).parent.parent / "docs"

for filename, title in DOCS_MAP.items():
    txt_path = docs_dir / filename
    if not txt_path.exists():
        print(f"⚠️  No encontrado: {filename}")
        continue

    content = txt_path.read_text(encoding="utf-8")
    pdf_name = filename.replace(".txt", ".pdf")
    pdf_path = docs_dir / pdf_name

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Título
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_fill_color(40, 40, 80)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 12, title, align="C", fill=True, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(8)

    # Empresa
    pdf.set_font("Helvetica", "I", 10)
    pdf.set_text_color(100, 100, 150)
    pdf.cell(0, 6, "SalesPro CRM — Documento Oficial", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(10)

    # Contenido
    pdf.set_font("Helvetica", size=11)
    pdf.set_text_color(30, 30, 30)

    for line in content.split("\n"):
        line = line.strip()
        if not line:
            pdf.ln(4)
            continue
        # Detectar títulos de sección (líneas en mayúsculas o con "---")
        if line.isupper() or line.startswith("---") or line.startswith("==="):
            pdf.set_font("Helvetica", "B", 12)
            pdf.set_text_color(40, 40, 120)
            pdf.multi_cell(0, 7, line)
            pdf.set_font("Helvetica", size=11)
            pdf.set_text_color(30, 30, 30)
            pdf.ln(2)
        else:
            pdf.multi_cell(0, 6, line)

    pdf.output(str(pdf_path))
    print(f"✅ PDF generado: {pdf_path.name}")

print("\n🎉 Todos los PDFs creados exitosamente en docs/")
