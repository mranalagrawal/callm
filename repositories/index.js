import AddressesRepository from '~/repositories/AddressesRepository'
import CountriesRepository from '~/repositories/CountriesRepository'
import CustomerRepository from '~/repositories/CustomerRepository'
import OrdersRepository from '~/repositories/OrdersRepository'
import ProductsRepository from '~/repositories/ProductsRepository'

export default ctx => ({
  addresses: AddressesRepository(ctx),
  countries: CountriesRepository(ctx),
  customer: CustomerRepository(ctx),
  orders: OrdersRepository(ctx),
  products: ProductsRepository(ctx),
})
