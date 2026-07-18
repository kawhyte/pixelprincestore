import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product'
import { subscriber } from './subscriber'
import { post } from './post'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, subscriber, post],
}
