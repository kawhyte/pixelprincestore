import { type SchemaTypeDefinition } from 'sanity'
import { artSize } from './artSize'
import { product } from './product'
import { subscriber } from './subscriber'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artSize, product, subscriber],
}
