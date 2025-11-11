
const API_URL = 'https://proyectoalgebralineal-production.up.railway.app';
//const API_URL = 'http://127.0.0.1:8000';

import { toast } from 'react-toastify';


export const procesarMatriz = async (operacion, archivo) => {
  const formData = new FormData();
  formData.append('operacion', operacion);
  formData.append('archivo', archivo);


  try {
    const response = await fetch(`${API_URL}/matrices/procesar`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Error HTTP: ${response.status}`);
    }
    console.log(response) ;
    toast.success('Matriz procesada correctamente');
    return await response.json();

  } catch (error) {

    console.error('Error al llamar a la API:', error);
    toast.error(`Error al procesar la matriz: ${error.message}`);
    throw error;
  }
};