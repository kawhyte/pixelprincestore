# Updated GROQ Projection for Sanity Webhook

## The Problem

The current simple projection only returns the current document state, not the previous state needed to detect deleted assets.

## Solution: Use Sanity's Webhook GROQ Syntax

Sanity webhooks support special variables:
- `@` - The current document
- `@[_rev == "previous"]` or similar to access previous state

## New Projection to Try

```groq
{
  "current": @{
    _id,
    _type,
    _rev,
    sizes[]{
      id,
      highResAsset{
        cloudinaryPublicId
      }
    }
  },
  "previous": @{
    _id,
    _type,
    sizes[]{
      id,
      highResAsset{
        cloudinaryPublicId
      }
    }
  }[_rev == ^._originalRev]
}
```

## Alternative: Use Sanity's Content Lake History

Actually, Sanity might provide document history via a different mechanism. Let me research this.

## Temporary Workaround

For now, we can:
1. Use `sanity-operation` header to detect event type
2. Only handle DELETE events (we'll get the document in the payload)
3. For UPDATE events, skip garbage collection until we solve the before/after problem

This at least prevents orphaned assets when entire products are deleted.
