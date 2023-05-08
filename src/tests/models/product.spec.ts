import { Product, ProductStore } from '../../models/product.model'

const store = new ProductStore()

describe('Product Model', () => {
  const product: Product = {
    name: 'Product Fake',
    category: 'Category Fake',
    price: 10,
    id: 2
  }

  afterAll((done) => {
    store.delete(product.id!).then(() => {
      done()
    })
  })

  it('should have an index method', () => {
    expect(store.index).toBeDefined()
  })

  it('should have a show method', () => {
    expect(store.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(store.create).toBeDefined()
  })

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined()
  })

  it('create method should add a product', async () => {
    const result = await store.create(product)

    product.id = result.id

    expect(result).toEqual(product)
  })

  it('index method should return a list of product', async () => {
    const result = await store.index()
    expect(result.length).toBeGreaterThan(0)
  })

  it('show method should return the correct product', async () => {
    const result = await store.show(product.id!)
    expect(result).toEqual(product)
  })
})
