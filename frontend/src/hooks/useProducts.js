import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const useProducts = (searchQuery = '') => {
  return useQuery({
    queryKey: ['products', searchQuery],
    queryFn: async () => {
      const data = await api.products.getAll(searchQuery);
      return data;
    },
  });
};

export const useCategories = () => {
  const { data: allProducts, ...rest } = useProducts();

  const categories = {};
  const categoryList = [];

  if (allProducts) {
    const uniqueCategories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
    categoryList.push(...uniqueCategories);

    uniqueCategories.forEach(cat => {
      const productsInCat = allProducts
        .filter(p => p.category === cat)
        .slice(0, 8);
      categories[cat] = productsInCat;
    });
  }

  return { categories, categoryList, ...rest };
};

export const useRecommendedItems = () => {
  return useQuery({
    queryKey: ['recommended_items'],
    queryFn: async () => {
      const data = await api.recommendedItems.getAll();
      return data;
    },
  });
};

export const useConfirmedOrdersCount = (userId) => {
  return useQuery({
    queryKey: ['confirmed_orders_count', userId],
    queryFn: async () => {
      if (!userId) return 0;
      const count = await api.orders.getConfirmedCount();
      return count || 0;
    },
    enabled: !!userId,
  });
};

export const useOrders = (userId) => {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      if (!userId) return [];
      const data = await api.orders.getAll();
      return data || [];
    },
    enabled: !!userId,
  });
};

export const useRelatedProducts = (category, productId) => {
  return useQuery({
    queryKey: ['related_products', category, productId],
    queryFn: async () => {
      if (!category) return [];
      const data = await api.products.getRelated(category, productId);
      return data || [];
    },
    enabled: !!category,
  });
};

export const useReviews = (productId) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      if (!productId) return [];
      const data = await api.reviews.getByProduct(productId);
      return data || [];
    },
    enabled: !!productId,
  });
};
