import { useRef, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Upload, Plus, FileText } from 'lucide-react';

interface FileUploadAreaProps {
  onFileSelect: (file: File) => void;
}

export function FileUploadArea({ onFileSelect }: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith('.txt')) {
      setFileName(files[0].name);
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <Card className="rounded-2xl shadow-lg border-0 bg-white p-4 md:p-6 lg:p-8">
      <div className="mb-4 md:mb-6 flex items-center gap-2 text-gray-700">
        <FileText className="w-4 h-4 md:w-5 md:h-5" />
        <span>Archivo .txt</span>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-2xl p-6 md:p-10 lg:p-12 
          flex flex-col items-center justify-center gap-4 md:gap-6
          transition-all duration-200 cursor-pointer min-h-[200px] md:min-h-[250px]
          ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-25'
          }
        `}
        onClick={handleButtonClick}
      >
        <div
          className={`
          w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center
          transition-all duration-200
          ${isDragging ? 'bg-indigo-100' : 'bg-white shadow-md'}
        `}
        >
          <Plus className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-indigo-500" strokeWidth={2} />
        </div>

        <div className="text-center px-4">
          <p className="text-gray-700 mb-2 text-sm md:text-base">
            {fileName || 'Arrastra o pega tu archivo aquí'}
          </p>
          {fileName && (
            <p className="text-sm text-green-600">✓ Archivo seleccionado</p>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl bg-white hover:bg-indigo-50 border-indigo-200 hover:border-indigo-400 text-sm md:text-base"
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick();
          }}
        >
          <Upload className="w-4 h-4 mr-2" />
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
