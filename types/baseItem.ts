/**
 * Represents a base item with common properties.
 */
/**
 * The IBaseItem interface represents a base item with common properties.
 * It is used as a base for other item-related interfaces.
 */
export interface IBaseItem {
  /**
   * The handle of the item. It is a unique identifier used to reference the item.
   */
  handle: string

  /**
   * A globally unique identifier for the item. It can be a string or a number.
   */
  id: string | number

  /**
   * Another unique identifier for the item. It can be a string or a number.
   */
  key: string | number

  /**
   * The label of the item. It is a descriptive or identifying term associated with the item.
   */
  label: string

  /**
   * The name of the item. It is a human-readable identifier for the item.
   */
  name: string

  /**
   * The title of the item. It is a descriptive or identifying term, often used for display purposes.
   */
  title: string
}

export interface ILocales {
  de: string
  en: string
  fr: string
  it: string
  [key: string]: string
}
