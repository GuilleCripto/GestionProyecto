# gestion_proyectos/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    ProyectoViewSet,
    TareaViewSet,
    ComentarioViewSet,
    UsuarioViewSet,
    RegistroUsuarioView,
    CurrentUserView, 
)

# Crea un router para registrar tus ViewSets
router = DefaultRouter()
router.register(r'proyectos', ProyectoViewSet, basename='proyectos')
router.register(r'tareas', TareaViewSet, basename='tareas')
router.register(r'comentarios', ComentarioViewSet, basename='comentarios')
router.register(r'usuarios', UsuarioViewSet, basename='usuarios')

urlpatterns = [
    # Incluye todas las URLs generadas por el router    
    path('', include(router.urls)),

    # URL para el registro de usuarios, ya que no forma parte de un ViewSet.
    path('auth/register/', RegistroUsuarioView.as_view(), name='registro_usuario'),

    # Rutas para el login y refresco de tokens JWT.
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('accounts/profile/', CurrentUserView.as_view(), name='user_profile'),

    path('proyectos/<int:proyecto_id>/tareas/',
        TareaViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='proyecto-tareas'),

    path('tareas/<int:tarea_id>/comentarios/',
        ComentarioViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='tarea-comentarios'),

]