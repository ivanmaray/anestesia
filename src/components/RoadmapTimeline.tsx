import React from 'react';

interface RoadmapItem {
  phase: string;
  description: string;
  date?: string;
}

const RoadmapTimeline: React.FC<{ items: RoadmapItem[] }> = ({ items }) => {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 inset-y-0 w-0.5 bg-gray-200"></div>
      <ul className="space-y-6">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-blue-600 font-semibold">{idx + 1}</div>
            </div>
            <div className="flex-1">
              <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-4 transition-transform transform hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-md font-semibold text-gray-900">{it.phase}</h4>
                  {it.date && <span className="text-sm text-gray-500">{it.date}</span>}
                </div>
                <p className="mt-2 text-gray-600">{it.description}</p>
              </div>
            </div>
          </li>
        ))}
        {/* optional hospitals reference item removed - use a callout in the Roadmap card instead */}
      </ul>
    </div>
  );
};

export default RoadmapTimeline;
