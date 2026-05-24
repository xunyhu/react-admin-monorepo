import {
  ProductModel,
  ProductPayload,
  ProductListParams,
} from '../models/product.model';

class ProductService {
  async getProductList(params: ProductListParams) {
    return ProductModel.findList(params);
  }

  async createProduct(data: ProductPayload) {
    return ProductModel.create(data);
  }

  async updateProduct(id: number, data: Partial<ProductPayload>) {
    const product = await ProductModel.findById(id);

    if (!product) {
      throw Object.assign(new Error('商品不存在'), { status: 404 });
    }

    return ProductModel.update(id, data);
  }

  async deleteProduct(id: number) {
    const product = await ProductModel.findById(id);

    if (!product) {
      throw Object.assign(new Error('商品不存在'), { status: 404 });
    }

    return ProductModel.delete(id);
  }
}

export default new ProductService();
