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


class GestorTareas:
    def __init__(self):
        self.tareas =[]
    
    def agregar(self, tarea):
        self.tareas.append(tarea)

    def listar(self):
        for tarea in self.tareas:
            print(tarea)  

    def buscar(self, nombre):
        for tarea in self.tareas:
            if tarea.nombre == nombre: 
                print(tarea)
                return
        print("Tarea no encontrada")      

        


gestor = GestorTareas()
gestor.agregar(Tarea("Aprender Python", "Estudiar POO"))
gestor.agregar(Tarea("Aprender FastAPI", "Crear una API REST"))
gestor.agregar(Tarea("Aprender React", "Construir el frontend"))

gestor.listar()

gestor.buscar("Aprender Python")
gestor.buscar("Aprender Django")