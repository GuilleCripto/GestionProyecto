// src/pages/dashboard/proyectos/ProjectEditPage.js

import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // <--- Importa useLocation
import { useDispatch, useSelector } from 'react-redux';
import TaskModal from '../../../components/project-manager/tareas/TaskModal';
import TaskForm from '../../../components/project-manager/tareas/TaskForm';
import { getTasks, updateTask } from '../../../redux/slices/tasks';

const TareaEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // <--- Obtiene la información de la URL

  const { tasks } = useSelector((state) => state.tasks);

  const selectedTask = tasks.find(task => task.id.toString() === id);

  useEffect(() => {
    if (!selectedTask) {
      dispatch(getTasks(id));
    }
  }, [dispatch, selectedTask, id]);

  const handleClose = () => {
    navigate('/dashboard/tareas');
  };

  const handleUpdate = (formData) => {
    dispatch(updateTask(id, formData));
    handleClose();
  };
  
  // Determina si estamos en modo de "solo lectura"
  const isReadOnly = location.pathname.includes('/view/');

  if (!selectedTask) {
    return null; // O un spinner de carga
  }

  return (
    <TaskModal
      open={true}
      onClose={handleClose}
    >
      <TaskForm 
        onCancel={handleClose} 
        onSave={handleUpdate} 
        initialData={selectedTask}
        isReadOnly={isReadOnly} // <--- Pasamos la prop isReadOnly de forma dinámica
      />
    </TaskModal>
  );
};


export default TareaEditPage;
