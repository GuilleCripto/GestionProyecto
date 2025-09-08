// src/pages/dashboard/proyectos/ProyectoCreatePage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // <--- Importa useDispatch
import ProjectModal from '../../../components/project-manager/proyectos/ProjectModal';
import ProjectForm from '../../../components/project-manager/proyectos/ProjectForm';
import { createProyecto } from '../../../redux/slices/projects'; // <--- Importa la acción

const ProyectoCreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // <--- Llama al hook useDispatch

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate('/dashboard/proyectos');
  };

  const handleSave = (formData) => { // Elimina el `async` ya que el thunk lo maneja
    dispatch(createProyecto(formData)); // Despacha la acción de creación
    handleClose();
  };

  return (
    <ProjectModal
      open={open}
      onClose={handleClose}
    >
      <ProjectForm onCancel={handleClose} onSave={handleSave} />
    </ProjectModal>
  );
};

export default ProyectoCreatePage;