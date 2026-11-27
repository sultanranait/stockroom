const constMessages = {
  invalidProductId: 'Product id must be a valid UUID',
  invalidName: 'Name must be between 2 and 150 characters',
  invalidSku: 'SKU must be 3-64 characters: letters, numbers or dashes',
  invalidDescription: 'Description must be text of at most 2000 characters',
  invalidPrice: 'Price must be 0 or more with up to 2 decimals',
  invalidQuantity: 'Quantity must be a whole number of 0 or more',
  invalidStatus: 'Status must be active or archived',
  invalidPage: 'Page must be a whole number of 1 or more',
  invalidLimit: 'Limit must be between 1 and 100',
  invalidSearch: 'Search must be at most 100 characters',
  skuExists: 'A product with this SKU already exists',
  productNotFound: 'Product not found',
  productsFetched: 'Products fetched successfully',
  productFetched: 'Product fetched successfully',
  productCreated: 'Product created successfully',
  productUpdated: 'Product updated successfully',
  productDeleted: 'Product deleted successfully',
};

export default constMessages;
