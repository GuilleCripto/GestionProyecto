// src/redux/slices/tasks.js

import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  tasks: [], // Aquí guardaremos la lista de tareas
};

const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Inicia la carga de tareas
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },

    // Maneja los errores de la petición
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Actualiza el estado con la lista de tareas
    getTasksSuccess(state, action) {
      state.isLoading = false;
      state.tasks = action.payload;
    },

    createTaskSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.tasks.push(action.payload);
    },

    deleteTasksSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      // Filtra la tarea eliminada del estado
      state.tasks = state.tasks.filter(
        (task) => task.id !== action.payload
      );
    },
  },
});

// Reducer
export default slice.reducer;

// Acciones asíncronas
export const { actions } = slice;

export function getTasks(projectId) {
  return async (dispatch) => {
    dispatch(actions.startLoading());
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No se encontró el token de autenticación.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Hacemos la petición a la API de tareas para un proyecto específico
      const response = await axios.get(`/api/v1/proyectos/${projectId}/tareas/`, config);
      dispatch(actions.getTasksSuccess(response.data));
    } catch (error) {
      dispatch(actions.hasError(error.message));
    }
  };
}

// Nueva acción para crear tareas
export function createTask(formData) {
  console.log("este es el formdata", formData)
  return async (dispatch) => {
    dispatch(actions.startLoading());
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No se encontró el token de autenticación.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };  

      const response = await axios.post('/api/v1/proyectos/5/tareas/', formData, config);
      dispatch(actions.createTaskSuccess(response.data));
    } catch (error) {
      dispatch(actions.hasError(error.message));
    }
  };
}

export function getTasksAll() {
  return async (dispatch) => {
    dispatch(actions.startLoading());
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No se encontró el token de autenticación.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Haz la petición al endpoint que te da todas las tareas
      const response = await axios.get('/api/v1/tareas/', config);
      dispatch(actions.getTasksSuccess(response.data));
    } catch (error) {
      dispatch(actions.hasError(error.message));
    }
  };
}

export function deleteTasks(taskId) {
  return async (dispatch) => {
    dispatch(actions.startLoading());
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No se encontró el token de autenticación.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Haz la llamada DELETE a la API
      await axios.delete(`/tareas/${taskId}/`, config);
      dispatch(actions.deleteTasksSuccess(taskId));
    } catch (error) {
      dispatch(actions.hasError(error.message));
    }
  };
}


