import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
// slices

import userReducer from './slices/user'
import projectsReducer from './slices/projects';
import tasksReducer from './slices/tasks';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['user', 'auth']
}

const rootReducer = combineReducers({
  user: userReducer,
  projects: projectsReducer,
  tasks: tasksReducer
})

export { rootPersistConfig, rootReducer }
