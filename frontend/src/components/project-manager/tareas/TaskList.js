import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTasksAll } from '../../../redux/slices/tasks';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, error } = useSelector(state => state.tasks);

  useEffect(() => {
    // Solo hacemos la petición si no estamos cargando
    if (isLoading) {
      dispatch(getTasksAll());
    }
  }, [dispatch, isLoading]);

  if (isLoading) {
    return <div>Cargando Tareas...</div>;
  }

  if (error) {
    return <div>Error al cargar los Tareas: {error}</div>;
  }
  
  if (tasks.length === 0) {
    return <div>No se encontraron Tareas.</div>;
  }

  return (
    <div>
      <h2>Lista de Tareas</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <h3>{task.name}</h3> {/* Ajusta 'name' a la propiedad de tu modelo */}
            <p>{task.description}</p> {/* Ajusta 'description' a la propiedad de tu modelo */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;