import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import TaskModal from '../../../components/project-manager/tareas/TaskModal';
import TaskForm from '../../../components/project-manager/tareas/TaskForm';
import { createTask } from '../../../redux/slices/tasks'; // Importa la acción para crear tareas

const TareaCreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate('/dashboard/tareas');
  };

  const handleSave = (formData) => {
    dispatch(createTask(formData));
    handleClose();
  };

  return (
    <TaskModal
      open={open}
      onClose={handleClose}
    >
      <TaskForm onCancel={handleClose} onSave={handleSave} />
    </TaskModal>
  );
};

export default TareaCreatePage;
