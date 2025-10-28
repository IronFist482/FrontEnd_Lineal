"use client";

import * as React from "react";
// Asumiendo que esta importación es de una librería de iconos
import { GripVerticalIcon } from "lucide-react"; 
import * as ResizablePrimitive from "react-resizable-panels@2.1.7";
import '../../styles/resizable.css';

// NOTA: La función 'cn' de './utils' debe ser proporcionada para que
// este archivo funcione correctamente, ya que es la que combina
// las clases de Tailwind que se sustituyen por CSS puro en este archivo.
// Para este ejemplo, la sustituiré por una función simple que solo concatena clases.
// Si tu 'cn' maneja más lógica (como sobrescribir clases), deberás conservarla.
const cn = (...classes) => classes.filter(Boolean).join(' '); 

function ResizablePanelGroup({
  className,
  ...props
}) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "resizable-panel-group", // Clase base en CSS puro
        className,
      )}
      {...props}
    />
  );
}

function ResizablePanel({
  ...props
}) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}) {
  // Nota: Todas las clases de Tailwind están agrupadas en la clase base 'resizable-handle'
  // y 'resizable-handle-vertical' para una mejor gestión en el CSS puro.
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "resizable-handle", // Clase base en CSS puro
        className,
      )}
      {...props}
    >
      {withHandle && (
        // Nota: Todas las clases de Tailwind para el handle visual están en 'resizable-handle-grip'
        <div className="resizable-handle-grip">
          <GripVerticalIcon className="resizable-handle-icon" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
