import React from 'react';
import { ProductWithUI } from '../../hooks/useProducts';
import { Section, Table, Button } from '../primitives';

interface ProductTableProps {
  products: ProductWithUI[];
  formatPrice: (price: number, productId?: string) => string;
  onEditProduct: (product: ProductWithUI) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: () => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  formatPrice,
  onEditProduct,
  onDeleteProduct,
  onAddProduct,
}) => {
  const columns = [
    {
      key: 'name',
      header: '상품명',
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: 'price',
      header: '가격',
      render: (_: any, product: ProductWithUI) => (
        <span className="text-gray-500">
          {formatPrice(product.price, product.id)}
        </span>
      ),
    },
    {
      key: 'stock',
      header: '재고',
      render: (stock: number) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            stock > 10
              ? 'bg-green-100 text-green-800'
              : stock > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {stock}개
        </span>
      ),
    },
    {
      key: 'description',
      header: '설명',
      render: (description: string) => (
        <span className="text-gray-500 max-w-xs truncate block">
          {description || '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '작업',
      align: 'right' as const,
      render: (_: any, product: ProductWithUI) => (
        <div className="font-medium">
          <button
            onClick={() => onEditProduct(product)}
            className="text-indigo-600 hover:text-indigo-900 mr-3"
          >
            수정
          </button>
          <button
            onClick={() => onDeleteProduct(product.id)}
            className="text-red-600 hover:text-red-900"
          >
            삭제
          </button>
        </div>
      ),
    },
  ];

  return (
    <Section
      title="상품 목록"
      action={
        <Button variant="primary" size="md" onClick={onAddProduct}>
          새 상품 추가
        </Button>
      }
    >
      <Table
        columns={columns}
        data={products}
        keyExtractor={(product) => product.id}
      />
    </Section>
  );
};
