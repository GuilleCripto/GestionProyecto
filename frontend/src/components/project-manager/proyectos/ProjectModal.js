// src/components/ProjectModal.js

import React from 'react';
import { 
  Modal, 
  Box, 
  Typography 
} from '@mui/material';

// ----------------------------------------------------------------------

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 800 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 3
};

// ----------------------------------------------------------------------

const ProjectModal = ({ open, onClose, children }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        {/* Encabezado del Modal */}
        <Typography id="modal-title" variant="h6" component="h2">
          Crear Nuevo Proyecto
        </Typography>

        {/* Contenido del formulario (se pasa como prop) */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 2 }}>
          {children}
        </Box>
      </Box>
    </Modal>
  );
};

export default ProjectModal;