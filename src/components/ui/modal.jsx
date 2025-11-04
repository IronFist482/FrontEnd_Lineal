import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

function Modal({ open, onOpenChange }) {
  const initialSeconds = 30;
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isTimerFinished, setIsTimerFinished] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (open) {
      setSeconds(initialSeconds);
      setIsTimerFinished(false);
    }
    
    if (seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0 && !isTimerFinished) {
      setIsTimerFinished(true);
    }

    return () => clearInterval(interval);
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title>¡Tómate un Respiro!</Dialog.Title>
          <Dialog.Description>
            Inhala contando hasta 4. Exhala contando hasta 6.
          </Dialog.Description>
          
          <div className="timer-display">
            <span>{seconds}</span>
          </div>

          <Dialog.Close asChild>
            <button 
              className="close-button" 
              disabled={!isTimerFinished} 
            >
              {isTimerFinished ? 'Continuar Navegando' : 'Esperando...'}
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;