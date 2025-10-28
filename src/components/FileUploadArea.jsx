import { useRef, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import '../styles/FileUploadArea.css';
import { Upload, Plus, FileText } from 'lucide-react';


export function FileUploadArea({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
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
    if (files && files.length > 0) {
      setFileName(files[0].name);
      onFileSelect(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="file-upload-card-root">
      <div className="file-type-indicator">
        <FileText className="file-type-icon" />
        <span>Archivo .txt</span>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          file-drop-area
          ${
            isDragging
              ? 'file-drop-area-dragging'
              : 'file-drop-area-idle'
          }
        `}
        onClick={handleButtonClick}
      >
        <div
          className={`
            upload-icon-wrapper
            ${isDragging ? 'upload-icon-wrapper-dragging' : 'upload-icon-wrapper-idle'}
          `}
        >
          <Plus className="upload-icon-plus" strokeWidth={2} />
        </div>

        <div className="file-info-text-wrapper">
          <p className="file-info-main-text">
            {fileName || 'Arrastra o pega tu archivo aquí'}
          </p>
          {fileName && (
            <p className="file-info-success-text">✓ Archivo seleccionado</p>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          className="upload-button-custom-style"
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick();
          }}
        >
          <Upload className="upload-button-icon" />
          Elegir archivo
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </Card>
  );
}