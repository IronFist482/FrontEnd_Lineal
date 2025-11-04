import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import '../../styles/modal.css';

function Modal({ open, onOpenChange }) {
  const initialSeconds = 5;
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isTimerFinished, setIsTimerFinished] = useState(false);

  useEffect(() => {
    if (open) {
      setSeconds(initialSeconds);
      setIsTimerFinished(false);
    }
  }, [open]);

  useEffect(() => {
    let interval = null;

    if (open && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } 
    if (open && seconds === 0 && !isTimerFinished) {
      setIsTimerFinished(true); 
    }

    return () => clearInterval(interval);
    
  }, [open, seconds, isTimerFinished]);

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title>¡Tómate un Respiro!</Dialog.Title>
          <Dialog.Description>
            Inhala contando hasta 4.
            Exhala contando hasta 6.
            <br/><br/>
            {seconds > 0 ? <span>{seconds}</span> : '¡Listo!'

            }
            
          </Dialog.Description>
          <Dialog.Close asChild>
            <button 
              className="close-button" 
              disabled={!isTimerFinished}
              onClick={handleClose}
              
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