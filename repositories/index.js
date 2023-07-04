import AddressesRepository from '~/repositories/AddressesRepository'
import CountriesRepository from '~/repositories/CountriesRepository'
import CustomerRepository from '~/repositories/CustomerRepository'
import OrdersRepository from '~/repositories/OrdersRepository'
import PrismicRepository from '~/repositories/PrismicRepository.ts'
import ProductsRepository from '~/repositories/ProductsRepository'
import ShopifyPagesRepository from '~/repositories/ShopifyPagesRepository'

export default ctx => ({
  addresses: AddressesRepository(ctx),
  countries: CountriesRepository(ctx),
  customer: CustomerRepository(ctx),
  orders: OrdersRepository(ctx),
  prismic: PrismicRepository(ctx),
  products: ProductsRepository(ctx),
  shopifyPages: ShopifyPagesRepository(ctx),
})
