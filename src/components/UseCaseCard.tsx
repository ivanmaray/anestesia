import React from 'react';

interface UseCaseCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onExplore?: () => void;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ title, description, icon, onExplore }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-3 items-start transition-transform transform hover:scale-[1.02] hover:shadow-lg">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-700 font-semibold">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <div className="text-xs text-gray-600 mt-1">{description}</div>
        <div className="mt-2">
          <button onClick={onExplore} className="text-xs text-indigo-600 hover:underline font-medium">Explorar</button>
        </div>
      </div>
    </div>
  );
};

export default UseCaseCard;
