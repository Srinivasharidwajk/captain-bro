import React from 'react';
import ProductCard from './ProductCard';
import { SkeletonList } from '../common/Loader';
import { FaInbox } from 'react-icons/fa';

export const ProductList = ({ products, loading, onResetFilter }) => {
  if (loading) {
    return (
      <div className="p-1">
        <SkeletonList count={4} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-float">
        <div className="w-16 h-16 rounded-full bg-neutral-light flex items-center justify-center text-neutral-dark/40 text-2xl mb-4 border border-neutral-border">
          <FaInbox />
        </div>
        <h3 className="text-base font-bold text-neutral-dark">
          No Products Found
        </h3>
        <p className="text-xs text-neutral-dark/60 mt-1 max-w-[240px]">
          We couldn't find any items in this category right now.
        </p>
        {onResetFilter && (
          <button
            onClick={onResetFilter}
            className="mt-4 px-5 py-2 bg-neutral-light border border-neutral-border text-xs font-bold rounded-xl text-neutral-dark hover:bg-neutral-border transition-all active:scale-95"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-1">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
export default ProductList;
