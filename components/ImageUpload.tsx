import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  isLoading: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Por favor, envie apenas arquivos de imagem.");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onImageSelected(file);
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const resetSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />
      
      {!preview ? (
        <div 
          className={`
            relative group cursor-pointer transition-all duration-300 ease-in-out
            border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center h-80
            ${dragActive 
              ? 'border-green-500 bg-green-50 scale-[1.02]' 
              : 'border-stone-200 bg-white hover:border-green-400 hover:bg-stone-50 hover:shadow-lg'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={triggerSelect}
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
             <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
          </div>
          
          <h3 className="text-xl font-bold text-stone-800 mb-2">Envie a foto da sua planta</h3>
          <p className="text-stone-500 text-sm max-w-xs mx-auto leading-relaxed">
            Arraste e solte aqui ou clique para buscar na galeria.
          </p>
          <div className="mt-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
              JPG, PNG ou WebP
            </span>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden shadow-xl bg-stone-900 h-80 group">
           <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-60" 
           />
           
           {isLoading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
               <div className="relative w-20 h-20">
                 <div className="absolute top-0 left-0 w-full h-full border-4 border-stone-600 rounded-full opacity-20"></div>
                 <div className="absolute top-0 left-0 w-full h-full border-4 border-t-green-500 rounded-full animate-spin"></div>
               </div>
               <p className="text-white font-bold mt-6 tracking-wider animate-pulse">ANALISANDO...</p>
             </div>
           ) : (
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                  onClick={resetSelection}
                  className="bg-white/20 backdrop-blur-md border border-white/50 text-white px-6 py-2 rounded-full font-medium hover:bg-white hover:text-red-500 transition-all"
                >
                  Trocar Imagem
                </button>
             </div>
           )}
        </div>
      )}
    </div>
  );
};
