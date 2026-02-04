import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-10 w-auto" }) => {
  return (
    <div className="flex items-center gap-2">
      {/* 
        IMPORTANT: Save the image you provided as 'logo.png' in your public folder.
        If the file is missing, the alt text will show or the browser will handle broken image.
      */}
      <img 
        src="/logo.png" 
        alt="BioPlant AI Logo" 
        className={`${className} object-contain`}
        onError={(e) => {
          // Fallback if image fails to load
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement?.classList.add('fallback-text-only');
        }}
      />
      <span className="text-xl font-bold text-stone-800 tracking-tight">
        Plant<span className="text-green-600">AI</span>
      </span>
    </div>
  );
};
