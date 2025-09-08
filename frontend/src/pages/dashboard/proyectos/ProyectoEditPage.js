// src/pages/dashboard/proyectos/ProjectEditPage.js

import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // <--- Importa useLocation
import { useDispatch, useSelector } from 'react-redux';
import ProjectModal from '../../../components/project-manager/proyectos/ProjectModal';
import ProjectForm from '../../../components/project-manager/proyectos/ProjectForm';
import { getProject, updateProyecto } from '../../../redux/slices/projects';

const ProjectEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // <--- Obtiene la información de la URL

  const { projects } = useSelector((state) => state.projects);

  const selectedProject = projects.find(project => project.id.toString() === id);

  useEffect(() => {
    if (!selectedProject) {
      dispatch(getProject(id));
    }
  }, [dispatch, selectedProject, id]);

  const handleClose = () => {
    navigate('/dashboard/proyectos');
  };

  const handleUpdate = (formData) => {
    dispatch(updateProyecto(id, formData));
    handleClose();
  };
  
  // Determina si estamos en modo de "solo lectura"
  const isReadOnly = location.pathname.includes('/view/');

  if (!selectedProject) {
    return null; // O un spinner de carga
  }

  return (
    <ProjectModal
      open={true}
      onClose={handleClose}
    >
      <ProjectForm 
        onCancel={handleClose} 
        onSave={handleUpdate} 
        initialData={selectedProject}
        isReadOnly={isReadOnly} // <--- Pasamos la prop isReadOnly de forma dinámica
      />
    </ProjectModal>
  );
};

export default ProjectEditPage;