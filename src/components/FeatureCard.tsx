import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-6 flex gap-4 items-start border border-gray-100 ${className || ''} transition-transform transform hover:-translate-y-1 hover:shadow-xl`}>
      <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-gray-600">{description}</p>
        <div className="mt-3">
          <a className="text-sm text-indigo-600 hover:underline font-medium cursor-pointer">Ver detalles →</a>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
