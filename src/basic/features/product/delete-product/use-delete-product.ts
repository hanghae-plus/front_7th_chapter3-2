import { ToastProps } from '../../../shared/ui/toast';

interface PropsType {
  deleteProduct: (productId: string) => void;
  toast: (notification: ToastProps) => void;
}
export function useDeleteProduct({ deleteProduct, toast }: PropsType) {
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
