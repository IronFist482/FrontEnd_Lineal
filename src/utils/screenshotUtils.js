import html2canvas from 'html2canvas';

const takeScreenshotAndGetBase64 = async (elementId) => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error(`Elemento con ID "${elementId}" no encontrado. Asegúrate de que el ID esté presente.`);
    return null;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, 
      useCORS: true,
      backgroundColor: null, // Si quieres transparencia o usar el fondo del body
    });

    // Retorna la imagen como Data URL (string Base64)
    return canvas.toDataURL('image/png'); 
  } catch (error) {
    console.error('Error al generar la captura:', error);
    return null;
  }
};

export default takeScreenshotAndGetBase64;