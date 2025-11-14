const API_URL = 'https://proyectoalgebralineal-production.up.railway.app';
//const API_URL = 'http://127.0.0.1:8000';

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

    return await response.json();

  } catch (error) {
    console.error('Error al llamar a la API:', error);
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login `, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Login exitoso:', data);
    return data;

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};


export const obtenerPruebas = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/prueba/pruebas`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al obtener registros");

  return await response.json();
};
