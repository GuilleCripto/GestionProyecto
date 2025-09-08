// src/redux/slices/projects.js

import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  projects: [],
};

const slice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getProjectsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.projects = action.payload;
    },
    
    getProjectSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const existingProjectIndex = state.projects.findIndex(p => p.id === action.payload.id);
      if (existingProjectIndex === -1) {
        state.projects.push(action.payload);
      }
    },

    createProjectSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.projects = [action.payload, ...state.projects];
    },
    
    updateProjectSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const updatedProject = action.payload;
      state.projects = state.projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      );
    },

    // 1. Nuevo reducer para eliminar un proyecto del estado
    deleteProjectSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const deletedProjectId = action.payload;
      state.projects = state.projects.filter(project => project.id !== deletedProjectId);
    },
  },
});

export default slice.reducer;
export const { actions } = slice;

// ----------------------------------------------------------------------

// Thunks (Acciones)

export function getProjects() {
  return async (dispatch) => {
    dispatch(actions.startLoading());
    try {
      const response = await axios.get('/api/v1/proyectos/'); 
      dispatch(actions.getProjectsSuccess(response.data));
    } catch (error) {
      dispatch(actions.hasError(error.message));
    }
  };
}

export function getProject(id) {
  return async (dispatch) => {
    dispatch(actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/proyectos/${id}/`); 
      dispatch(actions.getProjectSuccess(response.data));
    } catch (error) {
      dispatch(actions.hasError(error.message));
    }
  };
}

export function createProyecto(formData) {
  return async (dispatch) => {
    dispatch(actions.startLoading());
    try {
      const response = await axios.post('/api/v1/proyectos/', formData);
      dispatch(actions.createProjectSuccess(response.data));
    } catch (error) {
      dispatch(actions.hasError(error.message));
    }
  };
}

export function updateProyecto(id, formData) {
  return async (dispatch) => {
    dispatch(actions.startLoading());
    try {
      const response = await axios.put(`/api/v1/proyectos/${id}/`, formData);
      dispatch(actions.updateProjectSuccess(response.data));
    } catch (error) {
      dispatch(actions.hasError(error.message));
    }
  };
}

// 2. Nueva acción para eliminar un proyecto
export function deleteProyecto(id) {
  return async (dispatch) => {
    dispatch(actions.startLoading());
    try {
      await axios.delete(`/api/v1/proyectos/${id}/`);
      dispatch(actions.deleteProjectSuccess(id));
    } catch (error) {
      dispatch(actions.hasError(error.message));
    }
  };
}

export function assignMembersToProject(projectId, memberIds) {

  return async (dispatch, getState) => {
    dispatch(actions.startLoading());
    try {
      const token = localStorage.getItem('accessToken'); // <-- Usa la clave correcta
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const payload = { miembros_ids: memberIds };
      const response = await axios.patch(`/api/v1/proyectos/${projectId}/`, payload);
      
      // Actualiza el proyecto en el estado con los nuevos miembros
      dispatch(actions.updateProjectSuccess(response.data));
    } catch (error) {
      dispatch(actions.hasError(error.message));
    }
  };
}