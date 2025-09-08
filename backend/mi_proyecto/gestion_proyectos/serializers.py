from rest_framework import serializers
from .models import Usuario, Proyecto, Tarea, Comentario

# Serializadores para la autenticación y usuarios

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'rol']
        read_only_fields = ['rol'] # El rol solo debe ser editable por administradores

class RegistroUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password', 'rol']

    def create(self, validated_data):
        # Esta función será sobrescrita en la vista para encriptar la contraseña
        # Sin embargo, es buena práctica tenerla aquí para la validación
        user = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            rol=validated_data.get('rol', 'visor')
        )
        return user

# Serializadores para proyectos

class ProyectoSerializer(serializers.ModelSerializer):
    miembros = UsuarioSerializer(many=True, read_only=True)
    miembros_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Proyecto
        fields = ['id', 'nombre', 'descripcion', 'fecha_inicio', 'fecha_fin', 'estado', 'miembros', 'miembros_ids']

    def create(self, validated_data):
        miembros_ids = validated_data.pop('miembros_ids', [])
        proyecto = Proyecto.objects.create(**validated_data)
        proyecto.miembros.set(miembros_ids)
        return proyecto
    
    def update(self, instance, validated_data):
        miembros_ids = validated_data.pop('miembros_ids', None)
        instance = super().update(instance, validated_data)
        if miembros_ids is not None:
            instance.miembros.set(miembros_ids)
        return instance

# Serializadores para tareas

class TareaSerializer(serializers.ModelSerializer):
    asignado_a_nombre = serializers.CharField(source='asignado_a.username', read_only=True)
    proyecto_nombre = serializers.CharField(source='proyecto.nombre', read_only=True)

    class Meta:
        model = Tarea
        fields = ['id', 'nombre', 'descripcion', 'estado', 'fecha_vencimiento', 'proyecto', 'proyecto_nombre', 'asignado_a', 'asignado_a_nombre']
        read_only_fields = ['proyecto']

# Serializadores para comentarios

class ComentarioSerializer(serializers.ModelSerializer):
    autor_nombre = serializers.CharField(source='autor.username', read_only=True)
    
    class Meta:
        model = Comentario
        fields = ['id', 'contenido', 'fecha_creacion', 'tarea', 'autor', 'autor_nombre']
        read_only_fields = ['tarea', 'autor']