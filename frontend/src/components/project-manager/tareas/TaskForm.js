import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  TextField, 
  Stack, 
  MenuItem, 
  Button 
} from '@mui/material';
import { getProjects } from '../../../redux/slices/projects';

// ----------------------------------------------------------------------

// Esquema de validación para el formulario de Tarea
const TaskSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  descripcion: Yup.string().required('La descripción es requerida'),
  fecha_vencimiento: Yup.string().required('La fecha de vencimiento es requerida'),
  proyecto: Yup.string().required('El proyecto es requerido'),
  estado: Yup.string().required('El estado es requerido')
});

// ----------------------------------------------------------------------

// Componente del Formulario de Tarea
const TaskForm = ({ onCancel, onSave, initialData, isReadOnly = false }) => {
  const dispatch = useDispatch();
  const { projects } = useSelector(state => state.projects);
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(TaskSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      fecha_vencimiento: '',
      proyecto: '',
      estado: 'pendiente'
    }
  });
  
  // Carga la lista de proyectos para el selector
  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  // Rellena el formulario con los datos iniciales
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        proyecto: initialData.proyecto?.id || '' // Asegura que el valor sea el ID
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data) => {
    if (onSave) {
      onSave(data);
    }
  };

  // Opciones para el campo de estado
  const estados = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_progreso', label: 'En progreso' },
    { value: 'completado', label: 'Completado' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Controller
          name="nombre"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nombre de la Tarea"
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
              disabled={isReadOnly}
            />
          )}
        />
        
        <Controller
          name="descripcion"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Descripción"
              multiline
              rows={4}
              error={!!errors.descripcion}
              helperText={errors.descripcion?.message}
              disabled={isReadOnly}
            />
          )}
        />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Controller
            name="fecha_vencimiento"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Fecha de Vencimiento"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.fecha_vencimiento}
                helperText={errors.fecha_vencimiento?.message}
                sx={{ flexGrow: 1 }}
                disabled={isReadOnly}
              />
            )}
          />

          <Controller
            name="proyecto"
            control={control}
            render={({ field }) => (
              <TextField 
                {...field} 
                select 
                label="Proyecto" 
                error={!!errors.proyecto} 
                helperText={errors.proyecto?.message} 
                sx={{ flexGrow: 1 }}
                disabled={isReadOnly}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.nombre}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Stack>

        <Controller
          name="estado"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Estado" error={!!errors.estado} helperText={errors.estado?.message} disabled={isReadOnly}>
              {estados.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
        <Button variant="outlined" onClick={onCancel}>
          {isReadOnly ? 'Cerrar' : 'Cancelar'}
        </Button>
        { !isReadOnly && (
            <Button type="submit" variant="contained">
              Guardar
            </Button>
        )}
      </Box>
    </form>
  );
};

export default TaskForm;
