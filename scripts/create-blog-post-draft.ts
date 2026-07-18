/**
 * Create Blog Post Draft
 *
 * Creates an unpublished (drafts.<slug>) Sanity `post` document from a
 * pre-resolved JSON payload produced by the pixelprince-blog Claude skill.
 * The hero image is intentionally omitted — Kenny adds it in Studio. The
 * schema marks hero required, so Studio flags the missing image as a
 * validation error; add it before publishing so the post has a header image.
 * (The blog renders fine without one, but the card/hero slot stays empty.)
 *
 * Run with: npx tsx scripts/create-blog-post-draft.ts <path-to-json>
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Must run before importing sanity/lib/write-client, which reads
// process.env.SANITY_API_WRITE_TOKEN at module top level. Static imports
// are hoisted even under tsx, so write-client is loaded dynamically below
// (inside main(), after config() has run) rather than imported here.
config({ path: resolve(__dirname, '../.env.local') });

interface ParagraphBlock {
  type: 'paragraph';
  text: string;
}

interface HeadingBlock {
  type: 'h2' | 'h3';
  text: string;
}

interface ProductEmbedBlock {
  type: 'productEmbed';
  productRef: string; // already-resolved Sanity product _id
  note?: string;
}

interface EmailCaptureBlock {
  type: 'emailCapture';
  heading?: string;
}

interface ImagePlaceholderBlock {
  type: 'image';
  alt: string;
}

type SimpleBodyBlock =
  | ParagraphBlock
  | HeadingBlock
  | ProductEmbedBlock
  | EmailCaptureBlock
  | ImagePlaceholderBlock;

interface SimpleFaqEntry {
  q: string;
  a: string;
}

interface BlogPostDraftInput {
  title: string;
  slug: string;
  excerpt: string;
  targetKeyword?: string;
  body: SimpleBodyBlock[];
  faq: SimpleFaqEntry[];
  publishedAt?: string;
}

// Same format Sanity itself uses for _key.
function generateKey(): string {
  return Math.random().toString(36).substring(2, 11);
}

const LINK_RE = /\[([^\]]+)\]\((\/[^)]+)\)/g;

function textToSpansAndMarkDefs(text: string) {
  const spans: Record<string, unknown>[] = [];
  const markDefs: Record<string, unknown>[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;

  while ((match = LINK_RE.exec(text))) {
    const [full, linkText, href] = match;
    if (match.index > lastIndex) {
      spans.push({ _type: 'span', _key: generateKey(), text: text.slice(lastIndex, match.index), marks: [] });
    }
    const markKey = generateKey();
    markDefs.push({ _key: markKey, _type: 'link', href });
    spans.push({ _type: 'span', _key: generateKey(), text: linkText, marks: [markKey] });
    lastIndex = match.index + full.length;
  }

  if (lastIndex < text.length) {
    spans.push({ _type: 'span', _key: generateKey(), text: text.slice(lastIndex), marks: [] });
  }
  if (spans.length === 0) {
    spans.push({ _type: 'span', _key: generateKey(), text: '', marks: [] });
  }

  return { spans, markDefs };
}

function toPortableTextBlock(b: SimpleBodyBlock): Record<string, unknown> {
  switch (b.type) {
    case 'paragraph':
    case 'h2':
    case 'h3': {
      const { spans, markDefs } = textToSpansAndMarkDefs(b.text);
      return {
        _type: 'block',
        _key: generateKey(),
        style: b.type === 'paragraph' ? 'normal' : b.type,
        children: spans,
        markDefs,
      };
    }
    case 'productEmbed':
      return {
        _type: 'productEmbed',
        _key: generateKey(),
        product: { _type: 'reference', _ref: b.productRef },
        ...(b.note ? { note: b.note } : {}),
      };
    case 'emailCapture':
      return {
        _type: 'emailCapture',
        _key: generateKey(),
        ...(b.heading ? { heading: b.heading } : {}),
      };
    case 'image':
      return { _type: 'image', _key: generateKey(), alt: b.alt };
  }
}

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error('Usage: npx tsx scripts/create-blog-post-draft.ts <path-to-json>');
    process.exit(1);
  }

  const { writeClient, hasWriteAccess } = await import('../sanity/lib/write-client');

  if (!hasWriteAccess() || !writeClient) {
    console.error(
      '❌ SANITY_API_WRITE_TOKEN is missing or invalid in .env.local. ' +
      'This script needs an Editor-level (or higher) token — read-only tokens will fail on create.'
    );
    process.exit(1);
  }

  const raw = readFileSync(jsonPath, 'utf-8');
  const input: BlogPostDraftInput = JSON.parse(raw);

  for (const field of ['title', 'slug', 'excerpt', 'body', 'faq'] as const) {
    if (!input[field]) {
      console.error(`❌ Missing required field "${field}" in ${jsonPath}`);
      process.exit(1);
    }
  }

  // perspective: 'raw' overrides the client's default perspective:'published' —
  // otherwise an existing *unpublished* drafts.<slug> doc is invisible to this
  // check, and a re-run would silently no-op instead of erroring, misleading
  // Kenny into thinking new content was created.
  const existing = await writeClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{ _id }`,
    { slug: input.slug },
    { perspective: 'raw' }
  );
  if (existing) {
    console.error(
      `❌ A post with slug "${input.slug}" already exists (_id: ${existing._id}). ` +
      `Aborting — no overwrite. Pick a different slug or delete the existing doc in Studio first.`
    );
    process.exit(1);
  }

  const draftId = `drafts.${input.slug}`;
  const doc = {
    _id: draftId,
    _type: 'post',
    title: input.title,
    slug: { _type: 'slug', current: input.slug },
    excerpt: input.excerpt,
    ...(input.targetKeyword ? { targetKeyword: input.targetKeyword } : {}),
    body: input.body.map(toPortableTextBlock),
    faq: input.faq.map((f) => ({ _key: generateKey(), q: f.q, a: f.a })),
    publishedAt: input.publishedAt ?? new Date().toISOString(),
    // hero intentionally omitted — see file header comment.
  };

  const result = await writeClient.createIfNotExists(doc);

  console.log(`✅ Draft created: ${result._id}`);
  console.log(`   Title: ${input.title}`);
  console.log(`   Slug:  ${input.slug}`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Open /studio and find this post by title (shows as unpublished/draft).');
  console.log('  2. Add the hero image — Studio flags it as required; add it so the post has a header image.');
  console.log('  3. Review the body, FAQ, and any [KENNY: ...] placeholders.');
  console.log('  4. Publish when ready.');
}

main().catch((err) => {
  console.error('❌ Failed to create draft:', err);
  process.exit(1);
});
