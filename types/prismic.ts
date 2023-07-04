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
  section: Record<string, any>
  body?: Record<string, any>[]
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
  section: [],
  body: [],
}
