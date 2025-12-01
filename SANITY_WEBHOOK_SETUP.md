# Sanity Webhook Setup Guide

## Cloudinary Garbage Collection System

This guide walks you through setting up the Sanity webhook for automatic Cloudinary asset garbage collection.

---

## Table of Contents

1. [Overview](#overview)
2. [Environment Setup](#environment-setup)
3. [Sanity Dashboard Configuration](#sanity-dashboard-configuration)
4. [GROQ Projection](#groq-projection)
5. [Testing the Webhook](#testing-the-webhook)
6. [Troubleshooting](#troubleshooting)

---

## Overview

When you delete a document or remove an image in Sanity, the Cloudinary asset remains orphaned. This webhook system automatically detects and deletes orphaned assets.

**How it works:**

1. Sanity sends webhook events on document updates/deletes
2. Your Next.js webhook handler receives the event
3. Handler compares before/after states to find orphaned assets
4. Orphaned Cloudinary assets are deleted automatically

---

## Environment Setup

### 1. Generate a Webhook Secret

Generate a secure random secret for webhook signature verification:

```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Add to Environment Variables

Add the secret to your `.env.local` file:

```bash
# Sanity Webhook Secret (for signature verification)
SANITY_WEBHOOK_SECRET=your-generated-secret-here
```

**Important:** This secret MUST match the one you configure in Sanity's webhook settings.

### 3. Verify Cloudinary Credentials

Ensure these environment variables are already configured:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Sanity Dashboard Configuration

### Step 1: Access Webhook Settings

1. Go to [Sanity Management Console](https://www.sanity.io/manage)
2. Select your project
3. Click **API** in the left sidebar
4. Click **Webhooks** tab
5. Click **Add Webhook**

### Step 2: Configure Webhook

Fill in the following settings:

| Field | Value |
|-------|-------|
| **Name** | `Cloudinary Garbage Collection` |
| **Description** | `Automatically delete orphaned Cloudinary assets` |
| **URL** | `https://yourdomain.com/api/webhooks/sanity` |
| **Dataset** | `production` (or your active dataset) |
| **Trigger on** | ✅ **Update** <br> ✅ **Delete** <br> ❌ Create (not needed) |
| **HTTP method** | `POST` |
| **HTTP Headers** | (Leave empty - signature is automatic) |
| **Secret** | Paste your `SANITY_WEBHOOK_SECRET` here |
| **API version** | `v2021-06-07` (or latest) |
| **Include drafts** | ❌ Unchecked (only published documents) |

### Step 3: Add GROQ Projection

In the **Projection** field, paste this GROQ query:

```groq
{
  _id,
  _type,
  _rev,
  "transition": select(
    _id in path("drafts.**") => "draft",
    !defined(*[_id == "drafts." + ^._id][0]) && !defined(*[_id == ^._id][0]) => "delete",
    _id in path("**.") => "update",
    "create"
  ),
  "current": *[_id == ^._id][0]{
    ...,
    sizes[]{
      ...,
      highResAsset{
        ...,
        cloudinaryPublicId
      }
    }
  },
  "previous": *[_id == "previous::" + ^._id][0]{
    ...,
    sizes[]{
      ...,
      highResAsset{
        ...,
        cloudinaryPublicId
      }
    }
  }
}
```

### Step 4: Filter by Document Type (Optional)

If you only want to garbage collect for specific document types (e.g., `product`), add this to the **Filter** field:

```groq
_type == "product"
```

Leave empty to process all document types.

### Step 5: Save Webhook

Click **Save** to activate the webhook.

---

## GROQ Projection Explained

The projection does the following:

### 1. Determine Transition Type

```groq
"transition": select(
  _id in path("drafts.**") => "draft",
  !defined(*[_id == "drafts." + ^._id][0]) && !defined(*[_id == ^._id][0]) => "delete",
  _id in path("**.") => "update",
  "create"
)
```

This determines if the event is a `create`, `update`, or `delete`.

### 2. Capture Current State

```groq
"current": *[_id == ^._id][0]{
  ...,
  sizes[]{
    ...,
    highResAsset{
      ...,
      cloudinaryPublicId
    }
  }
}
```

This captures the **after** state of the document, including all `cloudinaryPublicId` values.

### 3. Capture Previous State

```groq
"previous": *[_id == "previous::" + ^._id][0]{
  ...,
  sizes[]{
    ...,
    highResAsset{
      ...,
      cloudinaryPublicId
    }
  }
}
```

This captures the **before** state of the document (Sanity provides this via the `previous::` prefix).

### 4. Extract Nested Fields

The `sizes[]{...}` and `highResAsset{...}` parts ensure we capture all nested `cloudinaryPublicId` values from your product schema.

---

## Testing the Webhook

### Test 1: Health Check

Verify the webhook endpoint is accessible:

```bash
curl https://yourdomain.com/api/webhooks/sanity
```

**Expected Response:**

```json
{
  "status": "ok",
  "service": "Sanity Webhook - Cloudinary Garbage Collection",
  "configured": true,
  "message": "Webhook is ready to receive events"
}
```

If `configured: false`, check your `SANITY_WEBHOOK_SECRET` environment variable.

### Test 2: Sanity Test Webhook

In the Sanity webhook settings:

1. Click **Test** (in the webhook you just created)
2. Select a **product** document that has Cloudinary assets
3. Choose **Update** event type
4. Click **Send Test**

**Expected in Vercel/Server Logs:**

```
[Sanity Webhook] ========================================
[Sanity Webhook] Received webhook request
[Sanity Webhook] Verifying signature...
[Sanity Webhook] Signature verified successfully
[Sanity Webhook] Event type: update
[Sanity Webhook] Document ID: 1a2b3c4d
[Sanity Webhook] Document type: product
```

### Test 3: Actual Deletion

1. Go to Sanity Studio (`/studio`)
2. Open a product with Cloudinary assets
3. Remove one of the sizes (or change a `cloudinaryPublicId`)
4. **Publish** the document
5. Check your server logs for deletion confirmation

**Expected Logs:**

```
[Sanity Webhook] Detected 1 removed assets
[Sanity Webhook] Assets to delete: ["high-res-assets/moon-8x10"]
[Sanity Webhook] Starting Cloudinary deletion...
[Sanity Webhook] Deletion complete:
[Sanity Webhook]   - Total: 1
[Sanity Webhook]   - Successful: 1
[Sanity Webhook]   - Not found: 0
[Sanity Webhook]   - Failed: 0
```

### Test 4: Document Deletion

1. Delete an entire product document in Sanity Studio
2. Check logs to verify ALL Cloudinary assets were deleted

**Expected Logs:**

```
[Sanity Webhook] Handling DELETE event
[Sanity Webhook] Found 4 assets in deleted document
[Sanity Webhook] Starting Cloudinary deletion...
```

---

## Troubleshooting

### Issue: Webhook returns 401 "Invalid signature"

**Cause:** `SANITY_WEBHOOK_SECRET` mismatch

**Fix:**

1. Verify the secret in `.env.local` matches Sanity webhook settings
2. Restart your Next.js server after changing `.env.local`
3. In production (Vercel), redeploy after updating environment variables

### Issue: Webhook returns 500 "Webhook secret not configured"

**Cause:** `SANITY_WEBHOOK_SECRET` not set

**Fix:**

```bash
# Add to .env.local
echo "SANITY_WEBHOOK_SECRET=your-secret-here" >> .env.local
npm run dev
```

### Issue: Assets not being deleted

**Cause:** GROQ projection missing `cloudinaryPublicId`

**Fix:**

1. Check the webhook projection includes `cloudinaryPublicId`
2. Verify your Sanity schema has `cloudinaryPublicId` field
3. Check server logs for extraction errors

**Debugging Command:**

```bash
# Check extracted IDs
grep "Assets to delete" /var/log/app.log
```

### Issue: Webhook not receiving events

**Cause:** Incorrect URL or Sanity webhook disabled

**Fix:**

1. Verify webhook URL in Sanity dashboard
2. Check webhook is **enabled** (toggle switch on)
3. Verify dataset matches your environment
4. Test with Sanity's "Send Test" button

### Issue: Idempotency - "Asset already deleted"

**Status:** ✅ This is EXPECTED behavior

The webhook is designed to be idempotent. If the UI deletes an asset manually, the webhook will still try to delete it and receive a "not found" response. This is counted as a success.

**Example Log:**

```
[Sanity Webhook]   - Not found: 1
```

This means 1 asset was already deleted (likely by UI), which is fine.

---

## Production Deployment Checklist

Before deploying to production:

- [ ] `SANITY_WEBHOOK_SECRET` added to production environment variables
- [ ] Webhook URL updated to production domain
- [ ] Webhook tested with "Send Test" button
- [ ] Verified Cloudinary credentials are in production environment
- [ ] Monitored logs for first real webhook event
- [ ] Confirmed idempotency works (test deleting same asset twice)

---

## Advanced: Webhook Payload Example

For reference, here's what Sanity sends to your webhook:

```json
{
  "_id": "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
  "_type": "product",
  "_rev": "abc123",
  "transition": "update",
  "current": {
    "_id": "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
    "title": "Ethereal Dreams",
    "sizes": [
      {
        "id": "8x10",
        "highResAsset": {
          "cloudinaryPublicId": "high-res-assets/ethereal-dreams-8x10"
        }
      }
    ]
  },
  "previous": {
    "_id": "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
    "title": "Ethereal Dreams",
    "sizes": [
      {
        "id": "8x10",
        "highResAsset": {
          "cloudinaryPublicId": "high-res-assets/ethereal-dreams-8x10"
        }
      },
      {
        "id": "16x20",
        "highResAsset": {
          "cloudinaryPublicId": "high-res-assets/ethereal-dreams-16x20"
        }
      }
    ]
  }
}
```

In this example, the `16x20` size was removed, so the webhook will delete `high-res-assets/ethereal-dreams-16x20`.

---

## Support

If you encounter issues:

1. Check server logs (`console.log` statements prefixed with `[Sanity Webhook]`)
2. Verify webhook signature with test button in Sanity dashboard
3. Check Sanity webhook delivery log (shows request/response for each event)
4. Ensure GROQ projection matches your schema structure

---

## Summary

✅ **What's Automated:**
- Deletion of orphaned Cloudinary assets when documents are updated or deleted
- Idempotent deletion (safe to retry)
- Comprehensive logging for debugging

❌ **What's NOT Automated:**
- Manual asset deletions via UI still work (webhook handles duplicate deletions gracefully)
- Asset uploads (handled by Sanity Studio upload component)

🎉 **You're Done!** Your Cloudinary garbage collection system is now active.
