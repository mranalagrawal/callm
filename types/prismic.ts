export interface IPrismicPageData {
  title: string
  image: {
    alt: string
    dimensions: {
      height: number
      width: number
    }
    url: string
  }
  main_banner?: {
    alt: string
    dimensions: {
      height: number
      width: number
    }
    url: string
  }
  section: Record<string, any>
  content: Record<string, any>
  body?: Record<string, any>[]
  box?: Record<string, any>[]
  text?: Record<string, any>[]
  description?: string
  newsletter_cta?: string
  first_check?: string
  second_check?: string
  info?: string
  subtitle?: string
  cta_button?: string
  cta_link?: string
  shown?: string
  hidden?: string
  productor?: Record<string, any>[]
  featured?: Record<string, any>[]
  label?: string
}

export const initialPageData: IPrismicPageData = {
  title: '',
  image: {
    alt: '',
    dimensions: {
      height: 0,
      width: 0,
    },
    url: '',
  },
  content: [],
  section: [],
}
