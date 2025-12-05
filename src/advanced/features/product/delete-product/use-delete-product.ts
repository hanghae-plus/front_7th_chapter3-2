import { useProducts } from '../../../entities/product';
import { useToast } from '../../../shared/ui/toast/toast-context';

export function useDeleteProduct() {
  const { deleteProduct } = useProducts();
  const { toast } = useToast();

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);

    toast({
      message: '상품이 삭제되었습니다.',
      type: 'success',
    });
  };
  return {
    onDeleteProduct: handleDeleteProduct,
  };
}
