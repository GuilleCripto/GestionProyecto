// src/components/project-manager/proyectos/ProjectForm.js

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { 
  Box, 
  TextField, 
  Stack, 
  MenuItem, 
  Button 
} from '@mui/material';

// ----------------------------------------------------------------------

// Esquema de validación para el formulario
const ProjectSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  descripcion: Yup.string().required('La descripción es requerida'),
  fecha_inicio: Yup.string().required('La fecha de inicio es requerida'),
  fecha_fin: Yup.string().required('La fecha de fin es requerida'),
  estado: Yup.string().required('El estado es requerido')
});

// ----------------------------------------------------------------------

// Componente del Formulario
const ProjectForm = ({ onCancel, onSave, initialData, isReadOnly = false }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(ProjectSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      estado: 'pendiente'
    }
  });
  
  // Usa useEffect para rellenar el formulario con los datos iniciales
  // Se ejecutará solo cuando initialData cambie
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = (data) => {
    // Procesa los datos antes de enviarlos, si es necesario
    const processedData = {
      ...data,
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin,
    };
    if (onSave) {
      onSave(processedData);
    }
  };

  // Opciones para el campo de estado
  const estados = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_progreso', label: 'En progreso' },
    { value: 'completado', label: 'Completado' },
    { value: 'cancelado', label: 'Cancelado' },
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
              label="Nombre del Proyecto"
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
              disabled={isReadOnly} // Controla la deshabilitación del campo
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
            name="fecha_inicio"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Fecha de Inicio"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.fecha_inicio}
                helperText={errors.fecha_inicio?.message}
                sx={{ flexGrow: 1 }}
                disabled={isReadOnly}
              />
            )}
          />

          <Controller
            name="fecha_fin"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Fecha de Fin"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.fecha_fin}
                helperText={errors.fecha_fin?.message}
                sx={{ flexGrow: 1 }}
                disabled={isReadOnly}
              />
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

export default ProjectForm;