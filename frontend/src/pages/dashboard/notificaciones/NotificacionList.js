// src/pages/dashboard/HolaPage.js
// src/pages/dashboard/NotificacionList.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications } from '../../../redux/slices/notificaciones'; 
import Page from '../../../components/Page'; 
import LoadingScreen from '../../../components/LoadingScreen';
import NotificacionListComponent from '../../../components/project-manager/notificaciones/NotificacionListComponent'; // <-- ¡IMPORTA EL COMPONENTE DE LISTADO!

const NotificacionList = () => {
  const dispatch = useDispatch();
  const {notifications, isLoading, error } = useSelector(state => state.notifications);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si hay un error, puedes mostrar un mensaje
  if (error) {
    return <div>Hubo un error al cargar los proyectos.</div>;
  }
  
  return (
    <Page title="Lista de Notificacions">
      {/* Pasa los datos al componente de la lista para que él se encargue de renderizarlos */}
      <NotificacionListComponent notifications={notifications} /> 
    </Page>
  );
};

export default NotificacionList;