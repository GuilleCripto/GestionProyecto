import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  notifications: [], // Aquí se guardarán las notificaciones
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Inicia la carga de datos
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },

    // Maneja los errores de la petición
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Actualiza el estado con la lista de notificaciones
    getNotificationsSuccess(state, action) {
      state.isLoading = false;
      state.notifications = action.payload;
    },

    // Actualiza una notificación marcándola como leída
    markNotificationAsReadSuccess(state, action) {
      const updatedNotification = action.payload;
      state.notifications = state.notifications.map((notification) =>
        notification.id === updatedNotification.id ? updatedNotification : notification
      );
    },

    // Elimina una notificación del estado
    deleteNotificationSuccess(state, action) {
      const notificationId = action.payload;
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== notificationId
      );
    },
  },
});

// Reducer
export default slice.reducer;

// Acciones
export const { actions } = slice;

// ----------------------------------------------------------------------

// Acciones asíncronas

// Obtiene todas las notificaciones del usuario
export function getNotifications() {
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

      const response = await axios.get('/api/v1/notifications/', config);
      dispatch(actions.getNotificationsSuccess(response.data));
    } catch (error) {
      dispatch(actions.hasError(error.message));
    }
  };
}

// Marca una notificación como leída
export function markNotificationAsRead(notificationId) {
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

      const response = await axios.patch(
        `/api/v1/notifications/${notificationId}/`,
        { leido: true },
        config
      );
      dispatch(actions.markNotificationAsReadSuccess(response.data));
    } catch (error) {
      dispatch(actions.hasError(error.message));
    }
  };
}

// Elimina una notificación
export function deleteNotification(notificationId) {
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

      await axios.delete(`/api/v1/notifications/${notificationId}/`, config);
      dispatch(actions.deleteNotificationSuccess(notificationId));
    } catch (error) {
      dispatch(actions.hasError(error.message));
    }
  };
}
