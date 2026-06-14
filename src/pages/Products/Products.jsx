import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../utils/constants';
import { getProducts } from '../../services/productService';
import CategoryCard from '../../components/product/CategoryCard';
import ProductCard from '../../components/product/ProductCard';
import ProductList from '../../components/product/ProductList';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const categoryParam = searchParams.get('category');

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const handleCategorySelect = (id) => {
    if (categoryParam === id) {
      // Toggle off
      searchParams.delete('category');
    } else {
      searchParams.set('category', id);
    }
    setSearchParams(searchParams);
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val === '') {
      searchParams.delete('search');
    } else {
      searchParams.set('search', val);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const filteredProducts = products.filter((product) => {
    const activeCategories = categoryParam ? categoryParam.split(',') : [];
    const matchesCategory = !categoryParam || activeCategories.includes(product.category);
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 bg-neutral-light px-4 py-5 flex flex-col gap-4 pb-20">
      {/* Back Arrow & Header */}


      {/* Search Header */}
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-neutral-border bg-white transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm"
        />
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-dark/40 text-sm" />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        <button
          onClick={() => {
            searchParams.delete('category');
            setSearchParams(searchParams);
          }}
          className={`
            px-4 py-2 rounded-md border text-xs font-bold whitespace-nowrap transition-all duration-200
            ${!categoryParam
              ? 'bg-primary border-primary text-white shadow-md'
              : 'bg-white border-neutral-border text-neutral-dark hover:bg-neutral-light'}
          `}
        >
          All
        </button>
        {CATEGORIES.map((cat) => {
          const activeCategories = categoryParam ? categoryParam.split(',') : [];
          const isActive = activeCategories.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`
                px-4 py-2 rounded-md border text-xs font-bold whitespace-nowrap transition-all duration-200
                ${isActive
                  ? 'bg-primary border-primary text-white shadow-md'
                  : 'bg-white border-neutral-border text-neutral-dark hover:bg-neutral-light'}
              `}
            >
              {cat.name.replace('\n', ' ')}
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center text-left">
        <span className="text-xs font-bold text-neutral-dark opacity-60">
          Showing {filteredProducts.length} items
        </span>
        {searchQuery || categoryParam ? (
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-primary hover:underline"
          >
            Clear All
          </button>
        ) : null}
      </div>

      {/* Product Grid / Grouped Lists */}
      {loading ? (
        <ProductList
          products={[]}
          loading={loading}
          onResetFilter={handleResetFilters}
        />
      ) : !categoryParam && !searchQuery ? (
        <div className="flex flex-col gap-6">
          {CATEGORIES.map((cat) => {
            const catProducts = products.filter(p => p.category === cat.id);
            if (catProducts.length === 0) return null;
            return (
              <div key={cat.id} className="flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-sm font-black text-neutral-dark capitalize">
                    {cat.name.replace('\n', ' ')}
                  </h3>
                  <button
                    onClick={() => handleCategorySelect(cat.id)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 p-1">
                  {catProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <ProductList
          products={filteredProducts}
          loading={loading}
          onResetFilter={handleResetFilters}
        />
      )}
    </div>
  );
};
export default Products;
