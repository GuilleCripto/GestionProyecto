from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from rest_framework import generics, mixins

from .models import Usuario, Proyecto, Tarea, Comentario, Notificacion
from .serializers import (
    UsuarioSerializer,
    RegistroUsuarioSerializer,
    ProyectoSerializer,
    TareaSerializer,
    ComentarioSerializer,
    NotificacionSerializer
)
from .permissions import IsAdmin, IsAdminOrColaborador, IsAdminOrAssignedUser, IsProjectMember

# Vistas de autenticación y usuarios

class RegistroUsuarioView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegistroUsuarioSerializer(data=request.data)
        if serializer.is_valid():
            # Encripta la contraseña antes de guardar
            password = make_password(serializer.validated_data['password'])
            serializer.validated_data['password'] = password
            
            # Crea el usuario
            usuario = Usuario.objects.create(**serializer.validated_data)
            return Response({"message": "Usuario registrado exitosamente."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

# Vistas de gestión de proyectos

class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer
    permission_classes = [IsAuthenticated, IsAdminOrColaborador]

    def get_queryset(self):
        """
        Permite a los 'visores' ver solo los proyectos en los que son miembros.
        """
        user = self.request.user
        if user.rol == 'visor':
            return user.proyectos.all()
        return Proyecto.objects.all()
    
    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def asignar_usuario(self, request, pk=None):
        """
        Asigna un usuario a un proyecto.
        Requiere el rol de 'administrador'.
        """
        proyecto = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            usuario = Usuario.objects.get(pk=user_id)
            proyecto.miembros.add(usuario)
            return Response({"message": f"Usuario {usuario.username} asignado al proyecto {proyecto.nombre}."}, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=True, methods=['patch'])
    def actualizar_miembros(self, request, pk=None):
        """
        Actualiza los miembros de un proyecto.
        """
        proyecto = self.get_object()
        miembros_ids = request.data.get('miembros_ids', None)

        if miembros_ids is None:
            return Response({"error": "El campo 'miembros_ids' es requerido."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            usuarios = Usuario.objects.filter(id__in=miembros_ids)
            proyecto.miembros.set(usuarios) # .set() es eficiente para actualizar
            
            serializer = ProyectoSerializer(proyecto)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Vistas de gestión de tareas

class TareaViewSet(viewsets.ModelViewSet):
    queryset = Tarea.objects.all()
    serializer_class = TareaSerializer
    permission_classes = [IsAuthenticated, IsAdminOrColaborador]

    def get_queryset(self):
        # ... tu código de filtrado existente ...
        queryset = super().get_queryset()
        proyecto_id = self.kwargs.get('proyecto_id')
        if proyecto_id:
            queryset = queryset.filter(proyecto_id=proyecto_id)
        return queryset

    def perform_create(self, serializer):
        proyecto_id = self.kwargs.get('proyecto_id')
        proyecto = get_object_or_404(Proyecto, id=proyecto_id)
        
        # Guarda la tarea
        tarea = serializer.save(proyecto=proyecto)

        # Lógica de notificación:
        if tarea.asignado_a:
            Notificacion.objects.create(
                usuario=tarea.asignado_a,
                mensaje=f"Se te ha asignado la nueva tarea: '{tarea.nombre}'."
            )

    def perform_update(self, serializer):
        # Obtiene el usuario asignado antes de la actualización
        old_asignado_a = self.get_object().asignado_a
        
        # Guarda la actualización
        tarea = serializer.save()

        # Lógica de notificación:
        # Si el usuario asignado ha cambiado, crea una notificación
        if old_asignado_a != tarea.asignado_a:
            if tarea.asignado_a:
                Notificacion.objects.create(
                    usuario=tarea.asignado_a,
                    mensaje=f"Ahora eres responsable de la tarea: '{tarea.nombre}'."
                )
            # También puedes notificar al usuario anterior
            if old_asignado_a:
                 Notificacion.objects.create(
                    usuario=old_asignado_a,
                    mensaje=f"Ya no estás asignado a la tarea: '{tarea.nombre}'."
                )

# Vistas de comentarios

class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer
    permission_classes = [IsAuthenticated, IsProjectMember]

    def get_queryset(self):
        """
        Filtra los comentarios por la tarea especificada en la URL.
        """
        queryset = super().get_queryset()
        tarea_id = self.kwargs.get('tarea_id')
        if tarea_id:
            queryset = queryset.filter(tarea_id=tarea_id)
        return queryset
    
    def perform_create(self, serializer):
        """
        Asigna el usuario autenticado como autor del comentario.
        """
        tarea = get_object_or_404(Tarea, pk=self.kwargs.get('tarea_id'))
        serializer.save(autor=self.request.user, tarea=tarea)

class NotificacionViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Permite a cada usuario ver solo sus propias notificaciones
        return self.request.user.notificaciones.all()
