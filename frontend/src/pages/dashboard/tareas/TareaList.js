import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasksAll } from '../../../redux/slices/tasks'; // La nueva acción para obtener todas las tareas
import Page from '../../../components/Page';
import LoadingScreen from '../../../components/LoadingScreen';
import TaskListComponent from 'src/components/project-manager/tareas/TaskListComponent';

const TaskList = () => {
    const dispatch = useDispatch();
    const { tasks, isLoading, error } = useSelector(state => state.tasks);

    useEffect(() => {
        dispatch(getTasksAll()); // Llama a la acción para obtener todas las tareas
    }, [dispatch]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div>Hubo un error al cargar las tareas.</div>;
    }

    return (
        <Page title="Lista de Tareas">
            {/* Pasa los datos al componente TareaList para que él se encargue de renderizarlos */}
            <TaskListComponent tasks={tasks} /> 
        </Page>
    );
};

export default TaskList;

