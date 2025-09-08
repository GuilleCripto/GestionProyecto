// src/pages/dashboard/HolaPage.js
// src/pages/dashboard/ProyectoList.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects } from '../../../redux/slices/projects'; // La acción para obtener los proyectos
import Page from '../../../components/Page'; 
import LoadingScreen from '../../../components/LoadingScreen';
import ProjectListComponent from '../../../components/project-manager/proyectos/ProjectListComponent'; // <-- ¡IMPORTA EL COMPONENTE DE LISTADO!

const ProyectoList = () => {
  const dispatch = useDispatch();
  const { projects, isLoading, error } = useSelector(state => state.projects);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si hay un error, puedes mostrar un mensaje
  if (error) {
    return <div>Hubo un error al cargar los proyectos.</div>;
  }
  
  return (
    <Page title="Lista de Proyectos">
      {/* Pasa los datos al componente de la lista para que él se encargue de renderizarlos */}
      <ProjectListComponent projects={projects} /> 
    </Page>
  );
};

export default ProyectoList;