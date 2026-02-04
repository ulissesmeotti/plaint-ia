import React from 'react';

interface AnalysisResultProps {
  text: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ text }) => {
  // Simple function to convert basic markdown bold to HTML bold
  const formatText = (input: string) => {
    const lines = input.split('\n');
    return lines.map((line, index) => {
      // Bold
      const bolded = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Headers (Planta identificada:, etc)
      if (line.trim().endsWith(':') && line.length < 50) {
        return <h3 key={index} className="text-lg font-bold text-green-800 mt-6 mb-2 border-b border-green-100 pb-1">{line}</h3>;
      }
      
      // List items
      if (line.trim().startsWith('- ')) {
        return <li key={index} className="ml-4 list-disc text-stone-700 mb-1" dangerouslySetInnerHTML={{ __html: bolded.replace('- ', '') }} />;
      }

      // Empty lines
      if (!line.trim()) {
        return <div key={index} className="h-2"></div>;
      }

      return <p key={index} className="text-stone-700 leading-relaxed mb-1" dangerouslySetInnerHTML={{ __html: bolded }} />;
    });
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden">
      <div className="bg-green-600 px-6 py-4">
        <h2 className="text-white text-xl font-bold flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Diagnóstico Concluído
        </h2>
      </div>
      <div className="p-6 md:p-8">
        <div className="prose prose-green max-w-none">
          {formatText(text)}
        </div>
      </div>
      <div className="bg-stone-50 px-6 py-4 border-t border-stone-100 text-sm text-stone-500 text-center">
        * Este diagnóstico é gerado por Inteligência Artificial. Consulte sempre um profissional agrônomo para casos críticos.
      </div>
    </div>
  );
};