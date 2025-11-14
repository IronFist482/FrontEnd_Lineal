import * as Dialog from "@radix-ui/react-dialog";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import "../../styles/modaltxt.css";
import { useState } from "react";

export default function InstructionsModal({ open, onOpenChange }) {
  const [viewMode, setViewMode] = useState("manual");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="info-modal__overlay" />

        <Dialog.Content className="info-modal__content">
          <header className="info-modal__header">
            <Dialog.Title className="info-modal__title">
              ¿Cómo ingresar los datos para operar?
            </Dialog.Title>
          </header>

          <div className="info-modal__body">
            <Dialog.Description asChild>
              <div className="info-modal__description-wrapper">
                <p>
                  En esta sección encontrarás dos botones principales justo
                  encima del cuadro grande: <strong>“Archivo .txt”</strong> y{" "}
                  <strong>“Ingresar”</strong>. Estos botones determinan{" "}
                  <strong>cómo vas a proporcionar los datos</strong> de tu
                  matriz o sistema para que el programa pueda operar.
                </p>
                {/* 🔀 Conmutador Dual */}
                <div className="dual-toggle">
                  <span
                    className={`dual-option ${
                      viewMode === "manual" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("manual")}
                  >
                    Ingreso Manual
                  </span>
                  <span
                    className={`dual-option ${
                      viewMode === "archivo" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("archivo")}
                  >
                    Archivo .txt
                  </span>
                </div>

                {viewMode === "manual" && (
                  <div className="dual-section fade-in">
                    <h3 className="info-modal__subtitle">Ingreso Manual</h3>
                    <p>
                      Al presionar <strong>“Ingresar”</strong>, aparecerá una
                      cuadrícula con casillas vacías donde puedes escribir los
                      valores de tu matriz o sistema.
                    </p>
                    <ul className="info-modal__list">
                      <li>
                        Cada <strong>fila</strong> representa una ecuación o
                        fila de la matriz.
                      </li>
                      <li>
                        Cada <strong>columna</strong> representa una variable o
                        elemento.
                      </li>
                    </ul>

                    <p>Por ejemplo, si escribes:</p>

                    <pre className="info-modal__code-block">
                      {`1   2   5
3  -1   1`}
                    </pre>

                    <p>
                      Estás indicando el sistema:
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "0.5rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <InlineMath
                          math={`\\left\\{\\begin{array}{l}
x + 2y = 5 \\\\
3x - y = 1
\\end{array}\\right.`}
                        />
                      </div>
                    </p>

                    <div className="info-modal__alert info-modal__alert--tip">
                      <strong>Tip:</strong> Usa las flechas del teclado o los
                      botones (+Fila, +Columna) para expandir la cuadrícula.
                    </div>
                  </div>
                )}

                {/* 🔹 Vista 2: Archivo */}
                {viewMode === "archivo" && (
                  <div className="dual-section fade-in">
                    <h3 className="info-modal__subtitle">
                      Ingreso mediante Archivo .txt
                    </h3>
                    <p>
                      Si ya tienes tus datos guardados, puedes subirlos con el
                      botón de cargar archivo que aparece junto al botón{" "}
                      <strong>“Ingresar”</strong>.
                    </p>

                    <h4 className="info-modal__subtitle">Reglas de Formato</h4>
                    <ul className="info-modal__list">
                      <li>
                        Cada fila de la matriz debe corresponder a una nueva
                        línea en el archivo.
                      </li>
                      <li>
                        Los elementos numéricos deben estar separados por comas
                        (<code>,</code>).
                      </li>
                      <li>
                        Usa punto (<code>.</code>) como separador decimal.
                      </li>
                      <li>
                        Solo se admiten valores numéricos (enteros, decimales y
                        negativos).
                      </li>
                    </ul>

                    <div className="info-modal__example-grid">
                      <div className="info-modal__example-card">
                        <h4 className="info-modal__example-title">
                          Caso 1: Matriz Cuadrada
                        </h4>
                        <p className="info-modal__example-context">
                          (Para Inversa, Determinante, etc.)
                        </p>
                        <pre className="info-modal__code-block">
                          {`3, 2, -1
1, -1, 4
2, 1, 3`}
                        </pre>
                      </div>

                      <div className="info-modal__example-card">
                        <h4 className="info-modal__example-title">
                          Caso 2: Matriz Aumentada (SEL)
                        </h4>
                        <p className="info-modal__example-context">
                          Sistema:{" "}
                          <InlineMath
                            math={`\\left\\{\\begin{array}{l}
x + 2y = 5 \\\\
3x - y = 1
\\end{array}\\right.`}
                          />
                        </p>
                        <pre className="info-modal__code-block">
                          {`1, 2, 5
3, -1, 1`}
                        </pre>
                      </div>
                    </div>

                    <div className="info-modal__alert info-modal__alert--critical">
                      <strong>Importante:</strong> El archivo no debe contener
                      corchetes (<code>[ ]</code>), variables (<code>x, y</code>
                      ) ni barras (<code>|</code>). Solo números separados por
                      comas.
                    </div>
                  </div>
                )}
              </div>
            </Dialog.Description>
          </div>

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
