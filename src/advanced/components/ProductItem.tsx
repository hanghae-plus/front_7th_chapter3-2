import { ProductWithUI } from '../../types';
import { formatPrice } from '../utils/formatters';
import * as productModel from '../models/product';

interface ProductItemProps {
  product: ProductWithUI;
  remainingStock: number;
  onAddToCart: (product: ProductWithUI) => void;
}

const ProductItem = ({
  product,
  remainingStock,
  onAddToCart,
}: ProductItemProps) => {
  const { name, description, price, isRecommended } = product;

  const maxDiscountRate = productModel.getMaxDiscountRate(product);
  const discountQuantity = productModel.getMinDiscountQuantity(product);
  const isSoldOut = productModel.isSoldOut(remainingStock);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* 상품 이미지 영역 (placeholder) */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <svg
            className="w-24 h-24 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        {isRecommended && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            BEST
          </span>
        )}
        {maxDiscountRate && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            ~{Math.round(maxDiscountRate * 100)}%
          </span>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {description}
          </p>
        )}

        {/* 가격 정보 */}
        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">
            {isSoldOut ? 'SOLD OUT' : formatPrice(price)}
          </p>
          {maxDiscountRate && discountQuantity && (
            <p className="text-xs text-gray-500">
              {discountQuantity}개 이상 구매시 최대{' '}
              {Math.round(maxDiscountRate * 100)}% 할인
            </p>
          )}
        </div>

        {/* 재고 상태 */}
        <div className="mb-3">
          {remainingStock <= 5 && remainingStock > 0 && (
            <p className="text-xs text-red-600 font-medium">
              품절임박! {remainingStock}개 남음
            </p>
          )}
          {remainingStock > 5 && (
            <p className="text-xs text-gray-500">재고 {remainingStock}개</p>
          )}
        </div>

        {/* 장바구니 버튼 */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={isSoldOut}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isSoldOut
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {isSoldOut ? '품절' : '장바구니 담기'}
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
