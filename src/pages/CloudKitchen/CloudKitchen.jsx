import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CLOUD_KITCHEN_DISHES, CLOUD_KITCHEN_CATEGORIES } from '../../utils/cloudKitchenData';
import CloudKitchenBanner from '../../assets/images/CloudKitchenBanner.png';
import { FaStar, FaClock, FaLeaf, FaSearch, FaPlus } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';

export const CloudKitchen = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDishes = CLOUD_KITCHEN_DISHES.filter((dish) => {
    const matchesCategory = activeCategory === 'all' || dish.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.teluguName.includes(searchQuery) ||
      dish.hindiName.includes(searchQuery) ||
      dish.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group dishes by category for "All" view
  const groupedDishes = {};
  if (activeCategory === 'all' && !searchQuery.trim()) {
    CLOUD_KITCHEN_CATEGORIES.filter((c) => c.id !== 'all').forEach((cat) => {
      const items = CLOUD_KITCHEN_DISHES.filter((d) => d.category === cat.id);
      if (items.length > 0) {
        groupedDishes[cat.id] = { label: cat.label, emoji: cat.emoji, items };
      }
    });
  }

  const showGrouped = activeCategory === 'all' && !searchQuery.trim();

  return (
    <div className="flex-1 bg-neutral-light flex flex-col pb-20">
      {/* Hero Banner */}
      {/* <div className="relative w-full">
        <img
          src={CloudKitchenBanner}
          alt="Cloud Kitchen — Authentic Warangal Recipes"
          className="w-full h-auto block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-left">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-black text-white drop-shadow-lg">Cloud Kitchen</h1>
            <span className="bg-amber-500 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse shadow-lg">
              Home Food
            </span>
          </div>
          <p className="text-[11px] text-white/80 font-semibold">
            Authentic Warangal recipes, freshly cooked & delivered to your doorstep
          </p>
        </div>
      </div> */}

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search biryani, curry, snacks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-border bg-white transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm"
          />
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-dark/40 text-sm" />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">
        {CLOUD_KITCHEN_CATEGORIES.map((cat) => {
          const count = cat.id === 'all'
            ? CLOUD_KITCHEN_DISHES.length
            : CLOUD_KITCHEN_DISHES.filter((d) => d.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
              className={`
                flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-bold whitespace-nowrap transition-all duration-200
                ${activeCategory === cat.id
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/15'
                  : 'bg-white border-neutral-border text-neutral-dark hover:bg-neutral-light'
                }
              `}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-neutral-light text-neutral-dark/50'
                }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Info Strip */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-y border-neutral-border">
        <span className="text-xs font-bold text-neutral-dark/60">
          {filteredDishes.length} {filteredDishes.length === 1 ? 'Dish' : 'Dishes'}
        </span>
        <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
          <FaStar className="text-[10px]" />
          <span>4.8 Avg Rating</span>
          <span className="mx-1 text-neutral-border">|</span>
          <span className="text-green-600 font-bold">🍽️ Freshly Cooked</span>
        </div>
      </div>

      {/* Dishes List */}
      <div className="px-4 py-3 flex flex-col gap-4">
        {filteredDishes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="text-4xl">🍽️</span>
            <p className="text-sm font-semibold text-neutral-dark/50">No dishes found</p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="text-xs font-bold text-primary hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}

        {showGrouped ? (
          // Grouped View
          Object.entries(groupedDishes).map(([catId, group]) => (
            <div key={catId} className="flex flex-col gap-2.5 mb-4">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-neutral-dark flex items-center gap-1.5">
                  <span>{group.emoji}</span> {group.label}
                  <span className="text-[10px] font-bold text-neutral-dark/40 ml-1">({group.items.length})</span>
                </h2>
                <button
                  onClick={() => setActiveCategory(catId)}
                  className="text-[11px] font-bold text-primary hover:underline"
                >
                  View All →
                </button>
              </div>

              {/* Dish Cards Grid */}
              <div className="grid grid-cols-2 gap-3">
                {group.items.map((dish) => (
                  <DishCard key={dish.id} dish={dish} navigate={navigate} />
                ))}
              </div>
            </div>
          ))
        ) : (
          // Flat filtered view
          <div className="grid grid-cols-2 gap-3">
            {filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} navigate={navigate} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div className="px-4 pb-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-center">
          <span className="text-xs font-bold text-amber-700">
            🧑‍🍳 All dishes are freshly prepared by our experienced home chefs with authentic Warangal recipes
          </span>
        </div>
      </div>
    </div>
  );
};

/** Reusable Dish Card (Matches standard ProductCard design) */
const DishCard = ({ dish, navigate }) => {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.stopPropagation();
    navigate(`/cloud-kitchen/${dish.id}`);
  };

  return (
    <div
      onClick={() => navigate(`/cloud-kitchen/${dish.id}`)}
      className="bg-white rounded-lg border border-neutral-border p-1 flex flex-col gap-2 relative shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      {/* Image Container */}
      <div className="w-full h-40 product-pattern-bg rounded-md overflow-hidden flex items-center justify-center p-1 relative">
        <img
          src={dish.img}
          alt={dish.name}
          className="w-full  rounded object-contain mix-blend-multiply group-hover:scale-105 transition-all duration-300"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1544025162-d76694265947?w=300";
          }}
        />

        {/* Rating Badge */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded flex items-center gap-0.5 text-[10px] font-bold text-neutral-dark border border-neutral-border/40">
          <FaStar className="text-secondary text-[9px]" />
          <span>{dish.rating || '5.0'}</span>
        </div>

        {/* Veg / Non-veg badge */}
        <div className="absolute top-2 right-2">
          <span className={`w-4 h-4 rounded-[3px] border-[1.5px] bg-white flex items-center justify-center ${dish.isVeg ? 'border-green-600' : 'border-red-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
          </span>
        </div>

        {/* Time Badge */}
        <div className="absolute bottom-2 right-2 bg-neutral-dark/70 text-white px-2 py-0.5 rounded text-[9px] font-semibold">
          {dish.time}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col text-left px-1">
        <h3 className="text-sm font-bold text-neutral-dark truncate line-clamp-1">
          {dish.name}
        </h3>
        <span className="text-[10px] text-neutral-dark/50 capitalize font-medium block truncate">
          {dish.teluguName} • {dish.hindiName}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-auto p-1">
        <div className="flex flex-col text-left">
          <span className="text-base font-extrabold text-neutral-dark leading-none mt-0.5">
            ₹{dish.price}
          </span>
        </div>

        <button
          onClick={handleAdd}
          className="p-2.5 bg-primary text-white rounded-md shadow-md shadow-primary/15 hover:bg-primary-dark transition-all duration-200 active:scale-90"
        >
          <FaPlus className="text-xs" />
        </button>
      </div>
    </div>
  );
};

export default CloudKitchen;
