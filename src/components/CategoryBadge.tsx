import React from 'react';

interface CategoryBadgeProps {
  name: string;
  slug: string;
  isActive?: boolean;
  onClick?: () => void;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  name, 
  slug, 
  isActive = false, 
  onClick 
}) => {
  const baseClasses = "px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200";
  const activeClasses = isActive 
    ? "bg-indigo-600 text-white" 
    : "bg-gray-100 text-gray-700 hover:bg-gray-200";
  
  return (
    <span 
      className={`${baseClasses} ${activeClasses}`}
      onClick={onClick}
    >
      {name}
    </span>
  );
};

export default CategoryBadge;