// src/pages/dashboard/HolaPage.js

import React from 'react';

// Si usas un componente de página base, impórtalo también
import Page from '../../components/Page'; 

const HolaPage = () => {
  return (
    <Page title="Página de Hola">
      <div>
        <h1>¡Hola, esta es la página!</h1>
        <p>El componente se está renderizando correctamente.</p>
      </div>
    </Page>
  );
};

export default HolaPage;