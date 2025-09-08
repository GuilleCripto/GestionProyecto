# gestion_proyectos/permissions.py

from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Permiso para permitir solo a los usuarios con rol 'administrador'
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.rol == 'administrador'

class IsAdminOrColaborador(permissions.BasePermission):
    """
    Permiso para permitir a los usuarios con rol 'administrador' o 'colaborador'
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.rol in ['administrador', 'colaborador']

class IsAdminOrAssignedUser(permissions.BasePermission):
    """
    Permiso para permitir a los administradores o al usuario asignado a la tarea.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.rol == 'administrador':
            return True
        return obj.asignado_a == request.user

class IsProjectMember(permissions.BasePermission):
    """
    Permiso para permitir a los miembros de un proyecto acceder a sus tareas y comentarios.
    """
    def has_object_permission(self, request, view, obj):
        # Para comentarios, verifica si el usuario es miembro del proyecto de la tarea
        if isinstance(obj, type('')):  # Esto es un truco para evitar errores con el tipo de objeto
            # Obtiene el objeto real de la vista (la tarea)
            task_id = view.kwargs.get('tarea_id')
            if not task_id:
                return False
            
            try:
                from .models import Tarea
                tarea = Tarea.objects.get(pk=task_id)
                proyecto = tarea.proyecto
                return request.user in proyecto.miembros.all() or request.user.rol == 'administrador'
            except Tarea.DoesNotExist:
                return False
        
        # Para otros objetos (como las tareas)
        return request.user in obj.proyecto.miembros.all() or request.user.rol == 'administrador'