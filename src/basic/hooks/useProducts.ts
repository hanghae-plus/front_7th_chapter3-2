import { useEffect, useMemo, useState } from 'react';
import type { Product } from '../../types';

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface UseProductsOptions {
  initialProducts: ProductWithUI[];
}

export function useProducts(options: UseProductsOptions) {
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return options.initialProducts;
      }
    }
    return options.initialProducts;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm) return products;
    const term = debouncedSearchTerm.toLowerCase();
    return products.filter(
      product =>
        product.name.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term))
    );
  }, [debouncedSearchTerm, products]);

  const addProduct = (newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (productId: string, updates: Partial<ProductWithUI>) => {
    setProducts(prev =>
      prev.map(product => (product.id === productId ? { ...product, ...updates } : product))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
  };

  return {
    products,
    setProducts,
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    filteredProducts,
    editingProduct,
    setEditingProduct,
    productForm,
    setProductForm,
    addProduct,
    updateProduct,
    deleteProduct,
    startEditProduct,
  };
}


