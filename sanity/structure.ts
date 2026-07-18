import type {StructureResolver} from 'sanity/structure'
import { Gift, FileText, Users } from 'lucide-react'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('The Pixel Prince')
    .items([
      S.listItem()
        .title('Artworks')
        .icon(Gift)
        .child(
          S.documentTypeList('product')
            .title('Artworks')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),
      S.listItem()
        .title('Blog Posts')
        .icon(FileText)
        .child(
          S.documentTypeList('post')
            .title('Blog Posts')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),
      S.divider(),
      S.listItem()
        .title('Subscribers')
        .icon(Users)
        .child(S.documentTypeList('subscriber').title('Subscribers')),
    ])
