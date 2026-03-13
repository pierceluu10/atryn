"use client";

import { Resource } from "@/types";

const categoryLabels: Record<string, string> = {
  campus_service: "Campus Service",
  lab: "Research Lab",
  professor: "Professor",
  opportunity: "Opportunity",
  student_group: "Student Group",
};

const categoryColors: Record<string, string> = {
  campus_service: "bg-blue-50 text-blue-700 border-blue-200",
  lab: "bg-purple-50 text-purple-700 border-purple-200",
  professor: "bg-amber-50 text-amber-700 border-amber-200",
  opportunity: "bg-emerald-50 text-emerald-700 border-emerald-200",
  student_group: "bg-rose-50 text-rose-700 border-rose-200",
};

interface Props {
  resource: Resource;
  onClick: (resource: Resource) => void;
}

export default function ResourceCard({ resource, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(resource)}
      className="w-full text-left bg-white border border-gray-150 rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                categoryColors[resource.category] || "bg-gray-50 text-gray-600"
              }`}
            >
              {categoryLabels[resource.category] || resource.category}
            </span>
          </div>
          <h3 className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors truncate">
            {resource.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {resource.shortDescription}
          </p>
          {resource.department && (
            <p className="text-xs text-gray-400 mt-1.5">{resource.department}</p>
          )}
        </div>
        <svg
          className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors mt-1 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
      {resource.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {resource.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
