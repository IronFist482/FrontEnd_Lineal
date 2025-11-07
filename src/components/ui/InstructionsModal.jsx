
import * as Dialog from '@radix-ui/react-dialog';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import '../../styles/modaltxt.css'; 

export default function InstructionsModal({ open, onOpenChange }) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                {/* 1. Fondo (Overlay) */}
                <Dialog.Overlay className="info-modal__overlay" />
                
                {/* 2. Contenido del Modal */}
                <Dialog.Content className="info-modal__content">
                    
                    {/* Encabezado */}
                    <header className="info-modal__header">
                        <Dialog.Title className="info-modal__title">
                            Especificaciones del Archivo de Entrada (.txt)
                        </Dialog.Title>
                    </header>
                    
                    {/* Cuerpo (con scroll) */}
                    <div className="info-modal__body">
                        <Dialog.Description asChild>
                            <div className="info-modal__description-wrapper">
                                <p>Para el correcto procesamiento de la matriz, el archivo de texto debe adherirse al siguiente formato:</p>
                                
                                <h3 className="info-modal__subtitle">Reglas de Formato</h3>
                                <ul className="info-modal__list">
                                    <li>Cada fila de la matriz debe corresponder a una nueva línea en el archivo.</li>
                                    <li>Los elementos numéricos de cada fila deben estar separados por comas (<code>,</code>).</li>
                                    <li>Solo se admiten valores numéricos (enteros, decimales y negativos).</li>
                                    <li>El separador decimal debe ser un punto (<code>.</code>).</li>
                                </ul>

                                <h3 className="info-modal__subtitle">Ejemplos de Estructura</h3>
                                
                                {/* Layout de Ejemplos */}
                                <div className="info-modal__example-grid">
                                    
                                    {/* Ejemplo 1 */}
                                    <div className="info-modal__example-card">
                                        <h4 className="info-modal__example-title">Caso 1: Matriz Cuadrada</h4>
                                        <p className="info-modal__example-context">
                                            (Para Inversa, Determinante, etc.)
                                        </p>
                                        <pre className="info-modal__code-block">
{`3, 2, -1
1, -1, 4
2, 1, 3`}
                                        </pre>
                                    </div>
                                    
                                    {/* Ejemplo 2 */}
                                    <div className="info-modal__example-card">
                                        <h4 className="info-modal__example-title">Caso 2: Matriz Aumentada (SEL)</h4>
                                        <p className="info-modal__example-context">
                                            Sistema: <InlineMath math="x + 2y = 5" />, <InlineMath math="3x - y = 1" />
                                        </p>
                                        <pre className="info-modal__code-block">
{`1, 2, 5
3, -1, 1`}
                                        </pre>
                                    </div>
                                </div>

                                {/* Nota de Alerta */}
                                <div className="info-modal__alert info-modal__alert--critical">
                                    <strong>Importante:</strong> El archivo no debe contener corchetes (<code>[ ]</code>), 
                                    variables (<code>x, y</code>), ni la barra de separación (<code>|</code>). 
                                    Únicamente los coeficientes numéricos.
                                </div>

                            </div>
                        </Dialog.Description>
                    </div>

                    {/* Pie de Página (Footer) */}
                    <footer className="info-modal__footer">
                        <Dialog.Close asChild>
                            <button 
                                className="info-modal__primary-btn"
                                onClick={() => onOpenChange(false)}
                            >
                                Entendido
                            </button>
                        </Dialog.Close>
                    </footer>
                    
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}