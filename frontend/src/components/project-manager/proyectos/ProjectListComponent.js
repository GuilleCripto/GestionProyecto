// src/components/project-manager/proyectos/ProjectListComponent.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import { deleteProyecto } from '../../../redux/slices/projects';
import ProjectMembersForm from './ProjectMembersForm';

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// ----------------------------------------------------------------------

const ProjectListComponent = ({ projects }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.user);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  const handleClick = (event, projectId) => {
    setAnchorEl(event.currentTarget);
    setSelectedProjectId(projectId);

  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedProjectId(null);
  };

  const handleView = () => {
    if (selectedProjectId) {
      navigate(`/dashboard/proyectos/view/${selectedProjectId}`);
    }
    handleClose();
  };

  const handleEdit = () => {
    if (selectedProjectId) {
      navigate(`/dashboard/proyectos/edit/${selectedProjectId}`);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedProjectId) {
      dispatch(deleteProyecto(selectedProjectId));
    }
    handleClose();
  };

  const handleOpenMembersModal = () => {
    setIsMembersModalOpen(true);
    handleClose();
  };

  const handleCloseMembersModal = () => {
    setIsMembersModalOpen(false);
    setSelectedProjectId(null);
  };


  // Corrección: Usamos `user.rol` como lo tenías originalmente
  const isAdministrador = user && user.rol === 'administrador';
  const isColaborador = user && user.rol === 'colaborador';
  const isVisor = user && user.rol === 'visor';

  const canModify = (project) => {
    if (isAdministrador) {
      return true;
    }
    if (isColaborador && project.autor === user.id) {
      return true;
    }
    return false;
  };
  
  const selectedProject = projects.find(p => p.id === selectedProjectId);




  if (projects.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          No se encontraron proyectos.
        </Typography>
      </Box>
    );
  }


  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Lista de Proyectos
        </Typography>
        { (isAdministrador || isColaborador) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/proyectos/new')}
          >
            Crear Proyecto
          </Button>
        )}
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Inicio</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Usuarios</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <StyledTableRow key={project.id}> 
                <TableCell>{project.id}</TableCell>
                <TableCell>{project.nombre}</TableCell>
                <TableCell>{project.descripcion}</TableCell>
                <TableCell>{project.fecha_inicio}</TableCell>
                <TableCell>{project.fecha_fin}</TableCell>
                <TableCell>{project.estado}</TableCell>
                <TableCell>
                    {project.miembros && project.miembros.length > 0
                    ? project.miembros.map((miembro) => miembro.username).join(', ')
                    : 'N/A'}
                </TableCell>
                <TableCell align="right">
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={(event) => handleClick(event, project.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        id="long-menu"
        MenuListProps={{ 'aria-labelledby': 'long-button' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { maxHeight: 48 * 4.5, width: '20ch' } }}
      >
        <MenuItem onClick={handleView}>
          Consultar
        </MenuItem>
        { canModify(selectedProject) && (
          <MenuItem onClick={handleEdit}>
            Editar
          </MenuItem>
        )}
        { canModify(selectedProject) && (
          <MenuItem onClick={handleOpenMembersModal}>
            Asignar Miembros
          </MenuItem>
        )}
        { isAdministrador && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            Eliminar
          </MenuItem>
        )}
      </Menu>

      {selectedProject && (
        <ProjectMembersForm
          open={isMembersModalOpen}
          onClose={handleCloseMembersModal}
          project={selectedProject}
        />
      )}
    </Box>
  );
};
  
export default ProjectListComponent;