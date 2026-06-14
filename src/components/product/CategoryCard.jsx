import React from 'react';

export const CategoryCard = ({ category, active, onClick }) => {
  // Resolve image dynamically from local assets
  const getImageUrl = (imageName) => {
    try {
      return new URL(`../../assets/images/${imageName}`, import.meta.url).href;
    } catch (e) {
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center gap-2 p-2 rounded-lg border transition-all duration-200 min-w-[82px]
        ${active
          ? 'bg-primary-light border-primary/30 shadow-md shadow-primary/5'
          : 'bg-white border-neutral-border hover:bg-neutral-light'}
      `}
    >
      <div className={`
        w-16 h-16 rounded-full flex items-center justify-center  transition-all
        ${active ? 'bg-white' : 'bg-neutral-light'}
      `}>
        <img
          src={getImageUrl(category.image)}
          alt={category.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120';
          }}
        />
      </div>
      <span className={`text-[10px] font-bold text-center leading-tight tracking-wide whitespace-pre-line ${active ? 'text-primary' : 'text-neutral-dark opacity-75'}`}>
        {category.name}
      </span>
    </button>
  );
};
export default CategoryCard;
