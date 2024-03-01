declare global {
  type Maybe<T> = T | null | undefined;
  interface Window {
    google_tag_manager: any
  }
}

export {}
