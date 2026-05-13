class Tarea:
    def __init__(self, nombre, descripcion):
        self.nombre = nombre
        self.descripcion = descripcion
        self.completada = False
        self.cancelada = False
    def __str__(self):
        estado = "cancelada"if self.cancelada else "✓" if self.completada else "pendiente"
        return f"{self.nombre} - {self.descripcion} [{estado}] "    
    
    def completar(self):
        self.completada =True

    def cancelar(self):
        self.cancelada = True

tarea1 = Tarea("Aprender python","Estudiar clases y POO")
print(tarea1)

tarea2 = Tarea("Aprende IA full satck", "langchain")
print(tarea2)

tarea1.completar()

print(tarea1)
print(tarea2)


tarea1.cancelar()

print(tarea1)