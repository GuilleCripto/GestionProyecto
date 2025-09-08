# gestion_proyectos/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class Usuario(AbstractUser):
    ROLES = (
        ('administrador', 'Administrador'),
        ('colaborador', 'Colaborador'),
        ('visor', 'Visor'),
    )
    rol = models.CharField(max_length=15, choices=ROLES, default='visor')
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class Proyecto(models.Model):
    ESTADOS = (
        ('pendiente', 'Pendiente'),
        ('en_progreso', 'En progreso'),
        ('completado', 'Completado'),
        ('cancelado', 'Cancelado'),
    )
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    miembros = models.ManyToManyField(Usuario, related_name='proyectos')

class Tarea(models.Model):
    ESTADOS = (
        ('pendiente', 'Pendiente'),
        ('en_progreso', 'En progreso'),
        ('completado', 'Completado'),
    )
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    fecha_vencimiento = models.DateField()
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE, related_name='tareas')
    asignado_a = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='tareas_asignadas')

class Comentario(models.Model):
    contenido = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    tarea = models.ForeignKey(Tarea, on_delete=models.CASCADE, related_name='comentarios')
    autor = models.ForeignKey(Usuario, on_delete=models.CASCADE)

class Notificacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='notificaciones')
    mensaje = models.CharField(max_length=255)
    leida = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f'Notificación para {self.usuario.email}: {self.mensaje}'