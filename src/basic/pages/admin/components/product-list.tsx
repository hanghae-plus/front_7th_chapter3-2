import Button from '../../../components/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/table';
import { ProductWithUI } from '../../../types/products';
import { formatPrice } from '../../../utils/format';
import { getStockStatusStyle } from '../../../utils/product';

interface ProductListProps {
  products: ProductWithUI[];
  setEditingProduct: (productId: string | null) => void;
  deleteProduct: (productId: string) => void;
  open: () => void;
}

const ProductList = ({ products, setEditingProduct, deleteProduct, open }: ProductListProps) => {
  const handleEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    open();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>상품명</TableHead>
          <TableHead>가격</TableHead>
          <TableHead>재고</TableHead>
          <TableHead>설명</TableHead>
          <TableHead align='right'>작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map(product => (
          <TableRow key={product.id}>
            <TableCell className='font-medium text-gray-900'>{product.name}</TableCell>
            <TableCell className='text-gray-500'>
              {formatPrice(product.price, {
                suffix: '원',
                isSoldOut: product.stock <= 0
              })}
            </TableCell>
            <TableCell className='text-gray-500'>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusStyle(product.stock)}`}>
                {product.stock}개
              </span>
            </TableCell>
            <TableCell className='text-gray-500 max-w-xs truncate'>{product.description || '-'}</TableCell>
            <TableCell align='right' className='font-medium'>
              <Button variant='subtle' onClick={() => handleEditProduct(product)} className='mr-3'>
                수정
              </Button>
              <Button variant='destructive' onClick={() => deleteProduct(product.id)}>
                삭제
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductList;
