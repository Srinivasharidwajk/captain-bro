import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../utils/constants';
import { getProducts } from '../../services/productService';
import Loader from '../../components/common/Loader';
import { FaChevronRight } from 'react-icons/fa';

export const Categories = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const products = await getProducts();
        const countsObj = {};
        products.forEach((p) => {
          countsObj[p.category] = (countsObj[p.category] || 0) + 1;
        });
        setCounts(countsObj);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const getImageUrl = (imageName) => {
    try {
      return new URL(`../../assets/images/${imageName}`, import.meta.url).href;
    } catch (e) {
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150';
    }
  };

  const getCategoryTagline = (id) => {
    const taglines = {
      chicken: 'Tender chicken cuts, wings, and drumsticks from bio-secured farms.',
      mutton: 'Juicy, rich, and farm-fresh goat meat cuts cleaned and packaged safe.',
      fish: 'Freshwater murrel, rohu, and sea-catch slices, cut to curry/fry size.',
      prawns: 'Plump, juicy, de-veined jumbo prawns sourced daily.',
      vegetables: 'Crisp green chillies, organic coriander, lemons, and daily vegetables.'
    };
    return taglines[id] || 'Sourced daily with strict safety checkmarks.';
  };

  if (loading) return <Loader fullPage={true} />;

  return (
    <div className="flex-1 bg-neutral-light px-4 py-5 flex flex-col gap-4 pb-20 text-left">
      <div>
        <h2 className="text-lg font-bold text-neutral-dark">Browse Categories</h2>
        <p className="text-[10px] text-neutral-dark/50 font-semibold mt-0.5">Explore our range of premium meats & produce</p>
      </div>

      <div className="flex flex-col gap-3.5">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/products?category=${cat.id}`)}
            className="bg-white p-4 rounded-lg border border-neutral-border flex gap-4 items-center shadow-xs cursor-pointer hover:shadow-md transition-all duration-200"
          >
            {/* Category Icon */}
            <div className="w-16 h-16 bg-neutral-light rounded-md flex items-center justify-center p-2.5 border border-neutral-border/40">
              <img
                src={getImageUrl(cat.image)}
                alt={cat.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150';
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-dark truncate leading-none">
                  {cat.name}
                </h3>
                <span className="text-[9px] bg-primary-light text-primary border border-primary/10 px-2 py-0.5 rounded font-bold">
                  {counts[cat.id] || 0} Items
                </span>
              </div>
              
              <p className="text-[10px] text-neutral-dark/60 font-semibold leading-relaxed mt-1.5">
                {getCategoryTagline(cat.id)}
              </p>
            </div>

            <FaChevronRight className="text-neutral-dark/30 text-xs" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Categories;
