import { type FC } from "react";
import { ProductWithUI } from "../../../../types";
import { formatPrice } from "../../../utils/formatters";
import {
  getMaxDiscountRate,
  getStockStatus,
  getFirstDiscount,
} from "../../../models/product";
import Button from "../../_common/Button";
import ImagePlaceholderIcon from "../../_icons/ImagePlaceholderIcon";
import ProductBadge from "./ProductBadge";
import StockStatus from "./StockStatus";
import DiscountInfo from "./DiscountInfo";

interface IProps {
  product: ProductWithUI;
  remainingStock: number;
  onAddToCart: (product: ProductWithUI) => void;
}

const ProductCard: FC<IProps> = ({ product, onAddToCart, remainingStock }) => {
  const maxDiscountRate = getMaxDiscountRate(product);
  const stockStatus = getStockStatus(remainingStock);
  const firstDiscount = getFirstDiscount(product);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* 상품 이미지 영역 */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <ImagePlaceholderIcon />
        </div>
        {product.isRecommended && <ProductBadge type="best" />}
        {maxDiscountRate > 0 && (
          <ProductBadge type="discount" value={maxDiscountRate} />
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(product.price, remainingStock)}
          </p>
          {firstDiscount && (
            <DiscountInfo
              quantity={firstDiscount.quantity}
              rate={firstDiscount.rate}
            />
          )}
        </div>

        {/* 재고 상태 */}
        <div className="mb-3">
          <StockStatus
            isLowStock={stockStatus.isLowStock}
            message={stockStatus.message}
          />
        </div>

        {/* 장바구니 버튼 */}
        <Button
          variant="solid"
          color="secondary"
          className="w-full"
          disabled={stockStatus.isOutOfStock}
          onClick={() => onAddToCart(product)}>
          {stockStatus.buttonText}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
