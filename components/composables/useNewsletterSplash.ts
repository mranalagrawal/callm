import { useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useCustomer } from '~/store/customer'
import { useSplash } from '~/store/splash'

export default function () {
  const { customer } = storeToRefs(useCustomer())
  const splash = useSplash()
  const { $cookies } = useContext()

  const setNewsletterCookie = (expires: Date) => {
    $cookies.set('newsletter', true, {
      expires,
      path: '/',
    })
  }

  const handleNewsletterSplash = () => {
    setTimeout(() => {
      const newsletterCookie = $cookies.get('newsletter')

      if (newsletterCookie) { return }

      if (customer.value.acceptsMarketing) {
        const oneYearLater = new Date()
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)
        setNewsletterCookie(oneYearLater)
      } else if (!customer.value.id) {
        const oneDayLater = new Date()
        oneDayLater.setDate(oneDayLater.getDate() + 1)
        splash.$patch({
          currentSplash: 'TheNewsletterSplash',
          onBeforeCloseModal: () => {
            const expires = new Date(oneDayLater.toUTCString())
            setNewsletterCookie(expires)
          },
        })
      } else if (!customer.value.acceptsMarketing) {
        const thirtyDaysLater = new Date()
        thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)
        splash.$patch({
          currentSplash: 'TheNewsletterSplash',
          onBeforeCloseModal: () => {
            const expires = new Date(thirtyDaysLater.toUTCString())
            setNewsletterCookie(expires)
          },
        })
      }
    }, 10000)
  }

  return { handleNewsletterSplash }
}
