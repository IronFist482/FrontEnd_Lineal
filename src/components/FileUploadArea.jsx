import { useRef, useState } from 'react';
import { Card } from './ui/card';
import { Upload, Plus } from 'lucide-react';
import { InputMatrix } from './ui/InputMatrix';
import '../styles/FileUploadArea.css';

export function FileUploadArea({ onFileSelect, onMatrixChange, onError, operationtype }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [mode, setMode] = useState('file');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => { 
    e.preventDefault(); 
    setIsDragging(true); 
  };

  const handleDragLeave = (e) => { 
    e.preventDefault(); 
    setIsDragging(false); 
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith('.txt')) {
      setFileName(files[0].name);
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files?.length > 0) {
      setFileName(files[0].name);
      onFileSelect(files[0]);
    }
  };

  const handleButtonClick = () => { 
    fileInputRef.current?.click(); 
  };

  return (
    <Card className="file-upload-card-root" style={{ position: 'relative' }}>
      <div className="mode-switch">
        <button 
          className={mode === 'file' ? 'button button-default' : 'button button-outline'} 
          onClick={() => setMode('file')}
        >
          Archivo .txt
        </button>

        <button 
          className={mode === 'matrix' ? 'button button-default' : 'button button-outline'} 
          onClick={() => setMode('matrix')}
        >
          Ingresar
        </button>
      </div>

      {mode === 'file' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`file-drop-area ${isDragging ? 'file-drop-area-dragging' : 'file-drop-area-idle'}`}
          onClick={handleButtonClick}
        >
          <div className={`upload-icon-wrapper ${isDragging ? 'upload-icon-wrapper-dragging' : 'upload-icon-wrapper-idle'}`}>
            <Plus className="upload-icon-plus" strokeWidth={2} />
          </div>

          <div className="file-info-text-wrapper">
            <p className="file-info-main-text">{fileName || 'Arrastra o pega tu archivo aquí'}</p>
            {fileName && <p className="file-info-success-text">✓ Archivo seleccionado</p>}
          </div>

          <button
            type="button"
            className="button button-outline upload-button-custom-style"
            onClick={(e) => { 
              e.stopPropagation(); 
              handleButtonClick(); 
            }}
          >
            <Upload className="upload-button-icon" /> Elegir archivo
          </button>

          <input 
            ref={fileInputRef} 
            type="file" 
            accept=".txt" 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </div>
      ) : (
        <InputMatrix
          onMatrixChange={onMatrixChange}
          onError={onError}       
          operationtype={operationtype}
        />
      )}
    </Card>
  );
}
