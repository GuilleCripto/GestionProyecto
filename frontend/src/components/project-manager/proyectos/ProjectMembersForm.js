// src/components/project-manager/proyectos/ProjectMembersForm.js

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { getUsers } from '../../../redux/slices/user';
import { assignMembersToProject } from '../../../redux/slices/projects';

const ProjectMembersForm = ({ open, onClose, project }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  
  useEffect(() => {
    if (project && project.members) {
      // Nota: Aquí asumimos que project.members es un array de objetos con un 'id'
      setSelectedUserIds(project.members.map(member => member.id));
    }
  }, [project]);

  const handleCheckboxChange = (event) => {
    const userId = parseInt(event.target.value, 10);
    if (event.target.checked) {
      setSelectedUserIds([...selectedUserIds, userId]);
    } else {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    }
  };

  const handleAssign = () => {
    if (project) {
      dispatch(assignMembersToProject(project.id, selectedUserIds));
    }
    onClose();
  };


  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Asignar Miembros al Proyecto</DialogTitle>
      <DialogContent>
        <FormGroup>
          {/* Aquí está la corrección: `users && users.map` */}
          {users && users.map((user) => (
            <FormControlLabel
              key={user.id}
              control={
                <Checkbox
                  checked={selectedUserIds.includes(user.id)}
                  onChange={handleCheckboxChange}
                  value={user.id}
                />
              }
              label={user.username}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleAssign} variant="contained">
          Asignar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectMembersForm;