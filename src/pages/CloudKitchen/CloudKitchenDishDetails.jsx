import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CLOUD_KITCHEN_DISHES } from '../../utils/cloudKitchenData';
import { FaStar, FaClock, FaMinus, FaPlus, FaFire, FaLeaf, FaUtensils } from 'react-icons/fa';
import Button from '../../components/common/Button';

const SPICE_COLORS = {
  'Mild': 'bg-green-100 text-green-700 border-green-200',
  'Medium': 'bg-amber-100 text-amber-700 border-amber-200',
  'Hot': 'bg-red-100 text-red-700 border-red-200',
};

export const CloudKitchenDishDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [frequentQuantities, setFrequentQuantities] = useState({});
  const [instructions, setInstructions] = useState('');

  const dish = CLOUD_KITCHEN_DISHES.find((d) => d.id === id);

  // Find other dishes for "You May Also Like" — same category first, then others
  const sideIds = ['ck-22', 'ck-23', 'ck-24', 'ck-25', 'ck-26', 'ck-27', 'ck-28', 'ck-29', 'ck-30'];
  const sides = CLOUD_KITCHEN_DISHES.filter((d) => d.id !== id && sideIds.includes(d.id));

  const sameCategoryDishes = CLOUD_KITCHEN_DISHES.filter((d) => d.id !== id && d.category === dish?.category && !sideIds.includes(d.id));
  const differentCategoryDishes = CLOUD_KITCHEN_DISHES.filter((d) => d.id !== id && d.category !== dish?.category && !sideIds.includes(d.id));
  const otherDishes = [...sides, ...sameCategoryDishes, ...differentCategoryDishes].slice(0, 6);

  if (!dish) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <span className="text-4xl mb-3">🍽️</span>
        <p className="text-sm font-semibold text-neutral-dark opacity-60">Dish not found.</p>
        <button
          onClick={() => navigate('/cloud-kitchen')}
          className="mt-4 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-lg"
        >
          Back to Cloud Kitchen
        </button>
      </div>
    );
  }

  // Calculations
  const mainProductTotal = dish.price * quantity;
  const frequentItemsTotal = otherDishes.reduce((sum, item) => {
    const q = frequentQuantities[item.id] || 0;
    return sum + (item.price * q);
  }, 0);

  const itemsTotal = mainProductTotal + frequentItemsTotal;
  const totalSelectedItems = quantity + otherDishes.reduce((sum, item) => {
    return sum + (frequentQuantities[item.id] || 0);
  }, 0);

  const deliveryCharge = 20;
  const packagingCharge = 10;
  const totalAmount = itemsTotal + deliveryCharge + packagingCharge;

  const spiceBadge = SPICE_COLORS[dish.spiceLevel] || SPICE_COLORS['Medium'];

  const renderQuantitySelector = (item) => {
    const q = frequentQuantities[item.id] || 0;
    if (q === 0) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFrequentQuantities(prev => ({ ...prev, [item.id]: 1 }));
          }}
          className="px-4 py-1.5 bg-[#8B0000] text-white rounded-lg hover:bg-red-800 transition-all font-black text-xs md:text-sm shadow-sm flex items-center gap-1 active:scale-95 min-w-[80px] justify-center"
        >
          <span>ADD</span>
          <FaPlus className="text-[9px] md:text-xs" />
        </button>
      );
    }
    return (
      <div 
        className="flex items-center border border-[#8B0000] rounded-lg overflow-hidden h-8 md:h-9 bg-white transition-all duration-300 shadow-2xs"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setFrequentQuantities(prev => ({ ...prev, [item.id]: Math.max(0, q - 1) }))}
          className="w-8 md:w-9 h-full bg-[#8B0000] text-white flex items-center justify-center hover:bg-red-800 transition-all font-bold"
        >
          <FaMinus className="text-[9px] md:text-xs" />
        </button>
        <span className="px-3 font-extrabold text-[#8B0000] text-xs md:text-sm min-w-[28px] md:min-w-[32px] text-center">
          {q}
        </span>
        <button
          onClick={() => setFrequentQuantities(prev => ({ ...prev, [item.id]: q + 1 }))}
          className="w-8 md:w-9 h-full bg-[#8B0000] text-white flex items-center justify-center hover:bg-red-800 transition-all font-bold"
        >
          <FaPlus className="text-[9px] md:text-xs" />
        </button>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-neutral-light flex flex-col pb-28">
      {/* Hero Image */}
      <div className="relative w-full h-[320px] overflow-hidden flex items-center justify-center">
        <img
          src={dish.img}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/35 pointer-events-none" />
        {/* Tag Badge */}
        <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
          {dish.tag}
        </span>
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-neutral-dark border border-neutral-border/40 shadow-sm">
          <FaStar className="text-amber-500 text-[10px]" />
          <span>{dish.rating} Rating</span>
        </div>
        {/* Bottom Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none z-10">
          <div>
            <h1 className="text-2xl font-black text-white drop-shadow-md">{dish.name}</h1>
            <span className="text-xs text-white/90 font-semibold drop-shadow-sm">{dish.teluguName} • {dish.hindiName}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-4 flex flex-col gap-5 text-left flex-1">
        {/* Quick Info Pills */}
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 bg-neutral-light px-3 py-1.5 rounded-lg text-[11px] font-bold text-neutral-dark border border-neutral-border/40">
            <FaClock className="text-primary text-[10px]" />
            {dish.time}
          </span>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border ${spiceBadge}`}>
            <FaFire className="text-[10px]" />
            {dish.spiceLevel}
          </span>
          <span className="flex items-center gap-1.5 bg-neutral-light px-3 py-1.5 rounded-lg text-[11px] font-bold text-neutral-dark border border-neutral-border/40">
            <FaUtensils className="text-primary text-[10px]" />
            {dish.servingSize}
          </span>
          <span className="flex items-center gap-1.5 bg-neutral-light px-3 py-1.5 rounded-lg text-[11px] font-bold text-neutral-dark border border-neutral-border/40">
            🔥 {dish.calories}
          </span>
          {dish.isVeg ? (
            <span className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg text-[11px] font-bold text-green-700 border border-green-200">
              <FaLeaf className="text-[10px]" /> Veg
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-lg text-[11px] font-bold text-red-700 border border-red-200">
              🍗 Non-Veg
            </span>
          )}
        </div>

        {/* Price & Quantity */}
        <div className="flex items-center justify-between py-3 border-y border-neutral-border">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-dark/40 font-bold uppercase tracking-wider">Price</span>
            <span className="text-2xl font-black text-neutral-dark mt-0.5">₹{dish.price}</span>
          </div>
          <div className="flex items-center border border-neutral-border rounded-md bg-neutral-light overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-3 text-neutral-dark hover:bg-neutral-border/40 transition-all"
            >
              <FaMinus className="text-xs" />
            </button>
            <span className="px-4 font-bold text-[#8B0000] text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-3 text-neutral-dark hover:bg-neutral-border/40 transition-all"
            >
              <FaPlus className="text-xs" />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <h4 className="text-xs font-bold text-neutral-dark opacity-50 uppercase tracking-wider">About this Dish</h4>
          <p className="text-xs text-neutral-dark/70 font-semibold leading-relaxed">
            {dish.description}
          </p>
        </div>

        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-primary-light text-primary font-bold px-3 py-1 rounded-md border border-primary/10 uppercase tracking-widest">
            {dish.category}
          </span>
        </div>

        {/* You May Also Like */}
        {otherDishes.length > 0 && (
          <div className="flex flex-col gap-3.5 mt-2">
            <h3 className="text-base md:text-lg font-black text-neutral-dark text-left">
              You May Also Like 🍽️
            </h3>
            <div className="flex flex-col gap-3">
              {otherDishes.map((other) => {
                const q = frequentQuantities[other.id] || 0;
                return (
                  <div
                    key={other.id}
                    onClick={() => navigate(`/cloud-kitchen/${other.id}`)}
                    className={`border p-3 rounded-xl flex items-center justify-between shadow-xs hover:shadow-sm hover:border-primary/20 transition-all duration-300 group cursor-pointer ${
                      q > 0 ? 'border-primary/30 bg-primary-light/5' : 'border-neutral-border/60 bg-white'
                    }`}
                  >
                    <div className="flex gap-3.5 items-center flex-1 min-w-0">
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-neutral-border/40 product-pattern-bg p-1 flex-shrink-0 relative flex items-center justify-center">
                        <img
                          src={other.img}
                          alt={other.name}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-all duration-300"
                        />
                        <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                          {other.time}
                        </span>
                      </div>
                      <div className="flex flex-col text-left min-w-0 flex-1">
                        <h4 className="text-sm md:text-base font-black text-neutral-dark truncate group-hover:text-primary transition-colors">
                          {other.name}
                        </h4>
                        <span className="text-xs md:text-sm font-semibold text-neutral-dark/50 mt-1 truncate">
                          {other.teluguName} {other.hindiName ? `• ${other.hindiName}` : ''}
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm md:text-base font-black text-neutral-dark">
                            ₹{other.price}
                          </span>
                          <span className="text-[10px] bg-neutral-light px-2 py-0.5 rounded-md font-bold text-neutral-dark/60 flex items-center gap-1 border border-neutral-border/40">
                            ⭐ {other.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Selector */}
                    <div className="flex flex-col items-end justify-center gap-2 flex-shrink-0 ml-3">
                      {q > 0 ? (
                        <div className="bg-primary-light/50 px-2.5 py-1.5 flex flex-col items-end text-right min-w-[85px] rounded">
                          <span className="text-[10px] md:text-xs font-extrabold text-[#8B0000] leading-none uppercase tracking-wider">
                            {q} {q === 1 ? 'Pack' : 'Packs'}
                          </span>
                          <span className="text-sm md:text-base font-black text-neutral-dark mt-1 leading-none">
                            ₹{other.price * q}
                          </span>
                        </div>
                      ) : (
                        <div className="h-[34px] w-[85px]"></div>
                      )}
                      {renderQuantitySelector(other)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bill Details Section */}
        <div className="bg-white p-4 rounded-lg border border-neutral-border text-left shadow-sm flex flex-col gap-3">
          <h3 className="text-sm font-extrabold text-neutral-dark">
            Bill Details
          </h3>

          <div className="flex flex-col gap-2 text-xs font-semibold text-neutral-dark/70">
            {/* Itemized List */}
            <div className="flex flex-col gap-1.5 border-b border-neutral-border/50 pb-2">
              {/* Main Product */}
              {quantity > 0 && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-dark opacity-85">{dish.name} <span className="text-neutral-dark/45 font-bold">x {quantity}</span></span>
                  <span className="font-bold text-neutral-dark">₹{dish.price * quantity}</span>
                </div>
              )}
              {/* Addons */}
              {otherDishes.map((item) => {
                const q = frequentQuantities[item.id] || 0;
                if (q > 0) {
                  return (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="text-neutral-dark opacity-85">{item.name} <span className="text-neutral-dark/45 font-bold">x {q}</span></span>
                      <span className="font-bold text-neutral-dark">₹{item.price * q}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            <div className="flex justify-between mt-1">
              <span>Items Total ({totalSelectedItems} Items)</span>
              <span>₹{itemsTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="flex justify-between">
              <span>Packaging Charge</span>
              <span>₹{packagingCharge}</span>
            </div>
          </div>

          <div className="h-px bg-neutral-border my-1"></div>

          <div className="flex justify-between items-center text-sm font-black text-neutral-dark">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* Additional Instructions */}
        <div className="flex flex-col gap-2 text-left">
          <h4 className="text-xs font-extrabold text-neutral-dark opacity-50 uppercase tracking-wider">
            Add Additional Instruction's
          </h4>
          <textarea
            rows="3"
            placeholder="write some instruction's..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full p-3 rounded-lg border border-neutral-border bg-white text-xs font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none placeholder:text-neutral-dark/30"
          />
        </div>

        {/* Spacer */}
        <div className="h-24" />
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-neutral-border p-4 z-30 flex items-center justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-neutral-dark/45 font-bold uppercase tracking-wider">
            {totalSelectedItems} {totalSelectedItems === 1 ? 'Item' : 'Items'} selected
          </span>
          <span className="text-lg font-black text-neutral-dark mt-0.5">₹{itemsTotal}</span>
        </div>

        {dish.isAvailable ? (
          <button
            onClick={() => {
              // For now, navigate to products since cloud kitchen items are coming soon
              navigate('/cloud-kitchen');
            }}
            className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-extrabold rounded-lg transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-2"
          >
            <span>🍽️ Coming Soon</span>
          </button>
        ) : (
          <button
            disabled
            className="px-6 py-3.5 bg-neutral-dark/20 text-neutral-dark/40 text-sm font-extrabold rounded-lg cursor-not-allowed"
          >
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
};

export default CloudKitchenDishDetails;
