import { createSlice } from '@reduxjs/toolkit'

// utils
import axios from '../../utils/axios'

// Slice to fetch User Detail

const initialState = {
  isLoading: true,
  isProfileUploading: false,
  isProfileUploadError: false,
  error: null,
  success: null,
  user: null, // <-- Agregado para el usuario logueado
  users: [] // <-- Agregado para la lista de usuarios
};
const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING (Genérico) - Ya no borra el usuario
    startLoading(state) {
      state.success = null;
      state.isLoading = true;
      state.error = false;
    },

    // HAS ERROR (Genérico) - Ya no borra el usuario
    hasError(state, action) {
      state.success = null;
      state.isLoading = false;
      state.error = action.payload;
    },

    // LOGIN SUCCESS
    loginSuccess(state, action) {
      state.success = true;
      state.isLoading = false;
      state.error = false;
      state.user = action.payload;
    },

    // GET USERS SUCCESS
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.users = action.payload;
    },

    // GET USER SUCCESS
    getUserSuccess(state, action) {
      state.success = true;
      state.isLoading = false;
      state.error = false;
      state.user = action.payload;
    },

    // Los demás reducers que no modifican la lista de usuarios
    startProfileUpdateLoading(state) {
      state.success = null;
      state.isLoading = true;
      state.error = false;
    },
    startForgotPassLoading(state) {
      state.success = null;
      state.isLoading = true;
      state.error = false;
    },
    startUploadProfilePictureLoading(state) {
      state.success = null;
      state.isProfileUploading = true;
      state.isProfileUploadError = false;
    },
    startPasswordResetLoading(state) {
      state.success = null;
      state.isLoading = true;
      state.error = false;
    },
    profileUpdateHasError(state, action) {
      state.success = null;
      state.isLoading = false;
      state.error = action.payload;
    },
    passwordResetHasError(state, action) {
      state.success = null;
      state.isLoading = false;
      state.error = action.payload;
    },
    profilePictureUploadError(state, action) {
      state.success = null;
      state.isProfileUploading = false;
      state.isProfileUploadError = action.payload;
    },
    forgotPassHasError(state, action) {
      state.success = null;
      state.isLoading = false;
      state.error = action.payload;
    },
    profileUpdateSuccess(state, action) {
      state.success = true;
      state.isLoading = false;
      state.error = false;
      state.user = action.payload;
    },
    profilePictureUploadSuccess(state, action) {
      state.success = true;
      state.isProfileUploading = false;
      state.isProfileUploadError = false;
      state.user = action.payload;
    },
    passwordResetSuccess(state) {
      state.success = true;
      state.isLoading = false;
      state.error = false;
    },
    forgotPassSuccess(state) {
      state.success = true;
      state.isLoading = false;
      state.error = false;
    }
  }
});

// Reducer
export default slice.reducer
export const { actions } = slice

// Actions
export function getUser() {
  return async (dispatch) => {
    dispatch(actions.startLoading());
    try {
      const response = await axios.get('/api/v1/accounts/profile/');
      dispatch(actions.getUserSuccess(response.data));
    } catch (error) {
      dispatch(actions.hasError(error));
    }
  };
}

export function updateProfile(data) {
  return async (dispatch) => {
    dispatch(actions.startProfileUpdateLoading())
    try {
      const response = await axios.patch('/api/v1/accounts/profile/', data)
      dispatch(actions.profileUpdateSuccess(response.data))
    } catch (error) {
      dispatch(actions.profileUpdateHasError(error))
    }
  }
}

export function forgotPassword(data) {
  return async (dispatch) => {
    dispatch(actions.startForgotPassLoading())
    try {
      await axios.post('/api/v1/accounts/forgot-password/', data)
      dispatch(actions.forgotPassSuccess())
    } catch (error) {
      dispatch(actions.forgotPassHasError(error))
    }
  }
}

export function updatePassword(data) {
  return async (dispatch) => {
    dispatch(actions.startPasswordResetLoading())
    try {
      await axios.post('/api/v1/accounts/update-password/', data)
      dispatch(actions.passwordResetSuccess())
    } catch (error) {
      dispatch(actions.passwordResetHasError(error))
    }
  }
}

export function resetPassword(data) {
  return async (dispatch) => {
    dispatch(actions.startPasswordResetLoading())
    try {
      await axios.post('/api/v1/accounts/reset-password/', data)
      dispatch(actions.passwordResetSuccess())
    } catch (error) {
      dispatch(actions.passwordResetHasError(error))
    }
  }
}

export function getUsers() {
  return async (dispatch) => {
    dispatch(actions.startLoading());
    try {
      // Obtenemos el token directamente del localStorage
      const token = localStorage.getItem('accessToken'); // <-- Usa la clave correcta
      if (!token) {
        throw new Error('No se encontró el token de autenticación.');
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get('/api/v1/usuarios/', config); 
      dispatch(actions.getUsersSuccess(response.data));
    } catch (error) {
      dispatch(actions.hasError(error.message));
    }
  };
}