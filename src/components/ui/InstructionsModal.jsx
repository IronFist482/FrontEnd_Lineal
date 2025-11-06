import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import '../../styles/modaltxt.css'; 
import { InlineMath } from 'react-katex';

export default function InstructionsModal({ open, onOpenChange }) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" /> 
                <Dialog.Content className="dialog-content txt-modal-content">
                    
                    <Dialog.Title className="txt-title">Formato Requerido del Archivo TXT</Dialog.Title>
                    
                    <div className="txt-scroll-container"> 
                        <Dialog.Description className="txt-description">
                            
                            <p>Para procesar la matriz correctamente, el archivo TXT debe seguir las siguientes reglas:</p>
                            
                            <h4 className="txt-subtitle">Reglas de Estructura:</h4>
                            <ul className="txt-list">
                                <li>Cada fila de la matriz debe ocupar una línea, separada en el archivo.</li>
                                <li>Los elementos de la fila deben estar separados por comas (,).</li>
                                <li>Solo se permiten valores numéricos (enteros, decimales o negativos).</li>
                                <li>Utilice el **punto (`.`)** como separador decimal.</li>
                            </ul>

                            <div className="txt-horizontal-layout">

                                <div className="txt-example-section">
                                    <h4 className="txt-subtitle txt-example-title">Ejemplo 1: Matriz Cuadrada (Inversa / Determinante)</h4>
                                    
                                    <pre className="txt-format-example">
{`3, 2, -1
1, -1, 4
2, 1, 3`}
                                    </pre>
                                    
        
                                </div>

                                {/* --- Ejemplo 2: Sistema de Ecuaciones Lineales (SEL) --- */}
                                <div className="txt-example-section">
                                    <h4 className="txt-subtitle txt-example-title">Ejemplo 2: Sistema de Ecuaciones (SEL)</h4>
                                    
                                    <p>La última columna** de la matriz corresponde a los coeficientes de los términos independientes</p>

                                    <p style={{marginBottom: '5px'}}>
                                        Sistema: <InlineMath math="x + 2y = 5" /> y <InlineMath math="3x - y = 1" />
                                    </p>
                                    
                                    <pre className="txt-format-example">
{`1 2 5
3 -1 1`}
                                    </pre>
                                    
                                </div>

                            </div> 
                            
                            <p className="txt-example-note" style={{marginTop: '25px', color: '#cc0000', fontWeight: 600}}>
                                ¡Importante! No incluir variables (x, y, z), corchetes ([ ]), ni la barra de matriz aumentada (|) en el archivo de texto. Solo los números.
                            </p>
                            
                        </Dialog.Description>
                    </div> 
                    <Dialog.Close asChild>
                        <button 
                            className="txt-close-button txt-primary-action" 
                            onClick={() => onOpenChange(false)}
                        >
                            Entendido, ¡Iniciar Cálculo!
                        </button>
                    </Dialog.Close>
                    
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}