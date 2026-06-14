import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaStar, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';

const MULTILINGUAL_LABELS = {
  categories: {
    chicken: { en: 'chicken', te: 'చికెన్', hi: 'चिकन' },
    mutton: { en: 'mutton', te: 'మటన్', hi: 'मटन' },
    fish: { en: 'fish', te: 'చేపలు', hi: 'मछली' },
    prawns: { en: 'prawns', te: 'రొయ్యలు', hi: 'झींगे' },
    grocery: { en: 'grocery', te: 'కిరాణా', hi: 'किराना' },
    vegetables: { en: 'vegetables', te: 'కూరగాయలు', hi: 'सब्जियां' },
    fruits: { en: 'fruits', te: 'పండ్లు', hi: 'फल' }
  },
  products: {
    p5: { en: 'onion', te: 'ఉల్లిపాయ', hi: 'प्याज' },
    p6: { en: 'green chilli', te: 'పచ్చిమిర్చి', hi: 'हरी मिर्च' },
    p7: { en: 'coriander', te: 'కొత్తిమీర', hi: 'धनिया' },
    p8: { en: 'lemon', te: 'నిమ్మకాయ', hi: 'नींबू' },
    p9: { en: 'basmati rice', te: 'బాస్మతి బియ్యం', hi: 'बासमती चावल' },
    p10: { en: 'cooking oil', te: 'వంట నూనె', hi: 'खाना पकाने का तेल' },
    p11: { en: 'curd', te: 'పెరుగు', hi: 'दही' },
    p12: { en: 'chilli powder', te: 'కారం పొడి', hi: 'लाल मिर्च पाउडर' },
    p13: { en: 'ginger garlic paste', te: 'అల్లం వెల్లుల్లి పేస్ట్', hi: 'अदरक लहसुन का पेस्ट' },
    p14: { en: 'mint', te: 'పుదీనా', hi: 'पुदीना' },
    p15: { en: 'masala powder', te: 'మసాలా పొడి', hi: 'मसाला पाउडर' },
    p16: { en: 'raw masala mix', te: 'మసాలా దినుసులు', hi: 'खड़ा मसाला' },
    p17: { en: 'sona masuri rice', te: 'సోనా మసూరి బియ్యం', hi: 'सोना मसूरी चावल' },
    p23: { en: 'banana', te: 'అరటిపండు', hi: 'केला' }
  }
};

const getSubtextLabel = (product) => {
  if (MULTILINGUAL_LABELS.products[product.id]) {
    const label = MULTILINGUAL_LABELS.products[product.id];
    return `${label.en} • ${label.te} • ${label.hi}`;
  }
  if (MULTILINGUAL_LABELS.categories[product.category]) {
    const label = MULTILINGUAL_LABELS.categories[product.category];
    return `${label.en} • ${label.te} • ${label.hi}`;
  }
  return product.category;
};

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const getImageUrl = (imageName) => {
    try {
      if (imageName.startsWith('data:image') || imageName.startsWith('http')) {
        return imageName;
      }
      return new URL(`../../assets/images/${imageName}`, import.meta.url).href;
    } catch (e) {
      return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300';
    }
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-lg border border-neutral-border p-1 flex flex-col gap-2 relative shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      {/* Image Container */}
      <div className="w-full h-32 md:h-36 product-pattern-bg rounded-md overflow-hidden flex items-center justify-center relative">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full rounded object-contain mix-blend-multiply group-hover:scale-105 transition-all duration-300"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1544025162-d76694265947?w=300";
          }}
        />

        {/* Rating Badge */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded flex items-center gap-0.5 text-[10px] font-bold text-neutral-dark border border-neutral-border/40">
          <FaStar className="text-secondary text-[9px]" />
          <span>{product.rating || '5.0'}</span>
        </div>

        {/* Weight Badge */}
        <div className="absolute bottom-2 right-2 bg-neutral-dark/70 text-white px-2 py-0.5 rounded text-[9px] font-semibold">
          {product.weight}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col text-left px-1">
        <h3 className="text-sm font-bold text-neutral-dark truncate line-clamp-1">
          {product.name}
        </h3>
        <span className="text-[10px] text-neutral-dark/50 capitalize font-medium block truncate">
          {getSubtextLabel(product)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-auto p-1">
        <div className="flex flex-col text-left">
          <span className="text-base font-extrabold text-neutral-dark leading-none mt-0.5">
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          onClick={handleAdd}
          className="p-2.5 bg-primary text-white rounded-md shadow-md shadow-primary/15 hover:bg-primary-dark transition-all duration-200 active:scale-90"
        >
          <FaArrowRight className="text-xs" />
        </button>
      </div>
    </div>
  );
};
export default ProductCard;
