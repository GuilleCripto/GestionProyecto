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
import { deleteTasks } from '../../../redux/slices/tasks'; // Usamos la acción para eliminar tareas

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

const TaskListComponent = ({ tasks }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.user);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const handleClick = (event, taskId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };

  const handleView = () => {
    if (selectedTaskId) {
      navigate(`/dashboard/tareas/view/${selectedTaskId}`);
    }
    handleClose();
  };

  const handleEdit = () => {
    if (selectedTaskId) {
      navigate(`/dashboard/tareas/edit/${selectedTaskId}`);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedTaskId) {
      dispatch(deleteTasks(selectedTaskId));
    }
    handleClose();
  };
  
  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  // Funciones de permisos
  const isAdministrador = user && user.rol === 'administrador';
  const isColaborador = user && user.rol === 'colaborador';
  const isVisor = user && user.rol === 'visor';

  
  const canModify = (task) => {
    // Si la tarea está asignada al usuario actual, puede modificarla
    return isAdministrador || (task && task.asignado_a?.id === user.id);
  };

  if (tasks.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          No se encontraron tareas.
        </Typography>
      </Box>
    );
  }
  


  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Lista de Tareas
        </Typography>
        { (isAdministrador) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/tareas/new')}
          >
            Crear Tarea
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
              <TableCell>Estado</TableCell>
              <TableCell>Vencimiento</TableCell>
              <TableCell>Proyecto</TableCell>
              <TableCell>Asignado a</TableCell>
              <TableCell align="right">Acciones</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <StyledTableRow key={task.id}> 
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.nombre}</TableCell>
                <TableCell>{task.descripcion}</TableCell>
                <TableCell>{task.estado}</TableCell>
                <TableCell>{task.fecha_vencimiento}</TableCell>
                {/* Asumimos que la tarea tiene una relación a su proyecto con el nombre del proyecto */}
                <TableCell>{task.proyecto.nombre || 'Sin proyecto'}</TableCell> 
                <TableCell>{task.asignado_a?.username || 'Sin asignar'}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleClick(event, task.id)}
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
        { canModify(selectedTask) && (
          <MenuItem onClick={handleEdit}>
            Editar
          </MenuItem>
        )}
        { canModify(selectedTask) && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            Eliminar
          </MenuItem>
        )}
      </Menu>

    


    </Box>
  );
};
  
export default TaskListComponent;
