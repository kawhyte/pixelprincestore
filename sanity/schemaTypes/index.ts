import { type SchemaTypeDefinition } from 'sanity'
import { artSize } from './artSize'
import { product } from './product'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artSize, product],
}
