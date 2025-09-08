import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects } from '../redux/slices/projects';

const ProjectList = () => {
  const dispatch = useDispatch();
  const { projects, isLoading, error } = useSelector(state => state.projects);

  useEffect(() => {
    // Solo hacemos la petición si no estamos cargando
    if (isLoading) {
      dispatch(getProjects());
    }
  }, [dispatch, isLoading]);

  if (isLoading) {
    return <div>Cargando proyectos...</div>;
  }

  if (error) {
    return <div>Error al cargar los proyectos: {error}</div>;
  }
  
  if (projects.length === 0) {
    return <div>No se encontraron proyectos.</div>;
  }

  return (
    <div>
      <h2>Lista de Proyectos</h2>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <h3>{project.name}</h3> {/* Ajusta 'name' a la propiedad de tu modelo */}
            <p>{project.description}</p> {/* Ajusta 'description' a la propiedad de tu modelo */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;