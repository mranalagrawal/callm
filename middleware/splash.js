// import { useCustomer } from '@/store/userV2'

import { useSplash } from '~/store/splash'

export default async function () {
  const splash = useSplash()

  splash.$reset()
}
