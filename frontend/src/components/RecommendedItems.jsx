import React from 'react';
import { useRecommendedItems } from '../hooks/useProducts';

const RecommendedItems = () => {
  const { data: items = [], isLoading: loading } = useRecommendedItems();


  return (
    <section className="mt-8">
      <h3 className="text-xl sm:text-2xl font-bold mb-6">Recommended items</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-[#DEE2E7] rounded-lg p-3 sm:p-4 flex flex-col hover:shadow-[0px_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 cursor-pointer group h-full"
          >
            <div className="flex-1 flex items-center justify-center p-3 sm:p-4 mb-3">
              <img src={item.image} alt={item.desc} className="max-h-[140px] w-auto object-contain group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="mt-auto">
              <p className="font-medium text-[#1C1C1C] text-base sm:text-lg mb-1">Rs. {item.price}</p>
              <p className="text-[#8B96A5] text-sm sm:text-[15px] overflow-hidden text-ellipsis line-clamp-2 leading-snug">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedItems;
