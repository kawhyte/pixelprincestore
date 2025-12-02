# Webhook Testing Guide

Complete guide for testing the Cloudinary garbage collection webhook system.

---

## Table of Contents

1. [Quick Start - Health Check](#quick-start---health-check)
2. [Local Testing with Mock Payloads](#local-testing-with-mock-payloads)
3. [Testing with ngrok (Recommended)](#testing-with-ngrok-recommended)
4. [Production Testing](#production-testing)
5. [Validation Checklist](#validation-checklist)

---

## Quick Start - Health Check

### Step 1: Start Your Dev Server

```bash
npm run dev
```

### Step 2: Test Health Endpoint

```bash
curl http://localhost:3000/api/webhooks/sanity
```

**Expected Response (Before Adding Secret):**

```json
{
  "status": "ok",
  "service": "Sanity Webhook - Cloudinary Garbage Collection",
  "configured": false,
  "message": "SANITY_WEBHOOK_SECRET not configured"
}
```

### Step 3: Add Webhook Secret

```bash
# Generate secret
openssl rand -base64 32

# Add to .env.local
echo "SANITY_WEBHOOK_SECRET=Ukz8a+2I8pWW1xLEF+4bQdFxPK9Vpt4ytBW/8Ge1us4=" >> .env.local

# Restart server
npm run dev
```

### Step 4: Test Again

```bash
curl http://localhost:3000/api/webhooks/sanity
```

**Expected Response (After Adding Secret):**

```json
{
  "status": "ok",
  "service": "Sanity Webhook - Cloudinary Garbage Collection",
  "configured": true,
  "message": "Webhook is ready to receive events"
}
```

✅ **If you see `"configured": true`, your webhook is ready!**

---

## Local Testing with Mock Payloads

Test the webhook locally without involving Sanity.

### Create Test Script

Create `scripts/test-webhook.ts`:

```typescript
/**
 * Local Webhook Tester
 *
 * Usage: npx tsx scripts/test-webhook.ts
 */

import crypto from 'crypto';

const WEBHOOK_URL = 'http://localhost:3000/api/webhooks/sanity';
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET || 'test-secret-123';

// Mock webhook payload - simulates removing a Cloudinary asset
const mockPayload = {
  _id: 'test-product-123',
  _type: 'product',
  _rev: 'abc123',
  transition: 'update',
  current: {
    _id: 'test-product-123',
    title: 'Test Product',
    sizes: [
      {
        id: '8x10',
        highResAsset: {
          cloudinaryPublicId: 'high-res-assets/test-8x10'
        }
      }
    ]
  },
  previous: {
    _id: 'test-product-123',
    title: 'Test Product',
    sizes: [
      {
        id: '8x10',
        highResAsset: {
          cloudinaryPublicId: 'high-res-assets/test-8x10'
        }
      },
      {
        id: '16x20',
        highResAsset: {
          // This asset was removed - should be deleted
          cloudinaryPublicId: 'high-res-assets/test-16x20'
        }
      }
    ]
  }
};

function generateSignature(body: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = `${timestamp}.${body}`;
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return `sha256=${hash},t=${timestamp}`;
}

async function testWebhook() {
  console.log('🧪 Testing Webhook Locally...\n');

  const body = JSON.stringify(mockPayload);
  const signature = generateSignature(body, WEBHOOK_SECRET);

  console.log('📤 Sending request to:', WEBHOOK_URL);
  console.log('🔐 Generated signature:', signature.substring(0, 50) + '...\n');

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sanity-webhook-signature': signature
      },
      body
    });

    const result = await response.json();

    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Body:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('\n✅ Webhook test PASSED!');
      console.log('Expected behavior: Should detect 1 removed asset (test-16x20)');
    } else {
      console.log('\n❌ Webhook test FAILED!');
    }
  } catch (error) {
    console.error('\n❌ Error:', error);
  }
}

testWebhook();
```

### Run Test

```bash
# Install tsx if needed
npm install -D tsx

# Run test
npx tsx scripts/test-webhook.ts
```

**Expected Output:**

```
🧪 Testing Webhook Locally...

📤 Sending request to: http://localhost:3000/api/webhooks/sanity
🔐 Generated signature: sha256=abc123...

📥 Response Status: 200
📥 Response Body: {
  "success": true,
  "message": "Garbage collection completed",
  "processed": 1,
  "results": {
    "total": 1,
    "successful": 1,
    "notFound": 1,
    "failed": 0
  }
}

✅ Webhook test PASSED!
```

**Note:** The asset will show as "not found" because it doesn't exist in Cloudinary. This is expected and correct behavior (idempotent).

---

## Testing with ngrok (Recommended)

This allows Sanity to send real webhooks to your local dev server.

### Step 1: Install ngrok

```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com/download
```

### Step 2: Start ngrok Tunnel

```bash
# In a separate terminal
ngrok http 3000
```

**Example Output:**

```
Forwarding   https://abc123.ngrok.io -> http://localhost:3000
```

Copy the `https://` URL (e.g., `https://abc123.ngrok.io`)

### Step 3: Configure Sanity Webhook

1. Go to [Sanity Management](https://www.sanity.io/manage)
2. Your Project → **API** → **Webhooks** → **Add Webhook**
3. Fill in:
   - **Name:** `Local Testing - Cloudinary GC`
   - **URL:** `https://abc123.ngrok.io/api/webhooks/sanity` (use your ngrok URL)
   - **Dataset:** `production`
   - **Trigger on:** Update ✅, Delete ✅
   - **Secret:** Your `SANITY_WEBHOOK_SECRET` from `.env.local`
   - **Projection:** (Use GROQ from `SANITY_WEBHOOK_SETUP.md`)

4. Click **Save**

### Step 4: Test with Sanity's Test Button

1. In the webhook you just created, click **Test**
2. Select a **product** document
3. Choose **Update** event
4. Click **Send Test**

### Step 5: Check Your Terminal

You should see logs like:

```
[Sanity Webhook] ========================================
[Sanity Webhook] Received webhook request
[Sanity Webhook] Verifying signature...
[Sanity Webhook] Signature verified successfully
[Sanity Webhook] Event type: update
[Sanity Webhook] Document ID: 1a2b3c4d
[Sanity Webhook] Document type: product
[Sanity Webhook] Handling UPDATE event
[Sanity Webhook] Previous state had 4 assets
[Sanity Webhook] Current state has 4 assets
[Sanity Webhook] Detected 0 removed assets
[Sanity Webhook] No assets to delete - completed successfully
```

✅ **If you see signature verified and event processing, it works!**

### Step 6: Test Actual Deletion

1. Open Sanity Studio at `http://localhost:3000/studio`
2. Open a product that has Cloudinary assets
3. Remove one of the sizes (or change its `cloudinaryPublicId`)
4. **Publish** the document
5. Watch your terminal

**Expected Logs:**

```
[Sanity Webhook] Detected 1 removed assets
[Sanity Webhook] Assets to delete: ["high-res-assets/moon-16x20"]
[Sanity Webhook] Starting Cloudinary deletion...
[Sanity Webhook] Deletion complete:
[Sanity Webhook]   - Total: 1
[Sanity Webhook]   - Successful: 1
```

### Step 7: Verify in Cloudinary

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Media Library → Search for the deleted asset
3. Should be **gone** ✅

---

## Production Testing

### Step 1: Deploy to Vercel/Production

```bash
# Push to main branch
git add .
git commit -m "feat: add Cloudinary garbage collection webhook"
git push origin main

# Vercel will auto-deploy
```

### Step 2: Add Environment Variable

In Vercel Dashboard:

1. Your Project → **Settings** → **Environment Variables**
2. Add `SANITY_WEBHOOK_SECRET` = `your-secret-here`
3. Click **Save**
4. **Redeploy** (Deployments → Latest → "...") → Redeploy

### Step 3: Update Sanity Webhook URL

1. Go to [Sanity Management](https://www.sanity.io/manage)
2. Your Project → **API** → **Webhooks**
3. Edit the webhook
4. Change URL to: `https://yourdomain.com/api/webhooks/sanity`
5. **Save**

### Step 4: Test in Production

Same process as ngrok testing:

1. Use Sanity's **Test** button
2. Or make real changes in Sanity Studio

### Step 5: Monitor Logs

In Vercel:

1. Your Project → **Logs** → **Runtime Logs**
2. Filter by: `[Sanity Webhook]`

---

## Validation Checklist

Use this checklist to verify everything works:

### ✅ Environment Setup

- [ ] `SANITY_WEBHOOK_SECRET` in `.env.local`
- [ ] `CLOUDINARY_API_KEY` configured
- [ ] `CLOUDINARY_API_SECRET` configured
- [ ] Health check returns `"configured": true`

### ✅ Signature Verification

- [ ] Valid signature → 200 response
- [ ] Invalid signature → 401 "Invalid webhook signature"
- [ ] Missing signature → 401 error

### ✅ Event Handling

- [ ] DELETE event extracts all Cloudinary IDs
- [ ] UPDATE event compares before/after
- [ ] CREATE event returns "no action required"
- [ ] Logs show correct event type

### ✅ Cloudinary Deletion

- [ ] Assets deleted successfully
- [ ] "Not found" assets treated as success
- [ ] Multiple assets deleted in parallel
- [ ] Results logged with counts

### ✅ Idempotency

- [ ] Deleting same asset twice doesn't fail
- [ ] "Not found" counted as success
- [ ] No errors on duplicate deletions

### ✅ Error Handling

- [ ] Missing secret → 500 "not configured"
- [ ] Invalid JSON → 500 error
- [ ] Cloudinary errors logged but don't crash

---

## Troubleshooting Tests

### Issue: 401 "Invalid signature"

**Cause:** Secret mismatch or wrong signature format

**Fix:**

```bash
# Verify secret matches
echo $SANITY_WEBHOOK_SECRET

# Check Sanity webhook settings
# Secret in Sanity MUST match .env.local

# Restart server after changing .env.local
npm run dev
```

### Issue: "No assets to delete"

**Cause:** GROQ projection not capturing `cloudinaryPublicId`

**Debug:**

1. Add console.log in webhook handler:

```typescript
console.log('Previous:', JSON.stringify(payload.previous, null, 2));
console.log('Current:', JSON.stringify(payload.current, null, 2));
```

2. Check if `cloudinaryPublicId` appears in logs
3. If missing, verify GROQ projection includes `highResAsset.cloudinaryPublicId`

### Issue: Assets not actually deleted from Cloudinary

**Cause:** Cloudinary credentials missing or incorrect

**Debug:**

```bash
# Check credentials
echo $CLOUDINARY_API_KEY
echo $CLOUDINARY_API_SECRET

# Check logs for Cloudinary errors
grep "Cloudinary" /var/log/app.log
```

### Issue: ngrok session expired

**Cause:** Free ngrok sessions expire after 2 hours

**Fix:**

```bash
# Restart ngrok
ngrok http 3000

# Update webhook URL in Sanity with new ngrok URL
```

---

## Quick Test Commands

### Test Health Check

```bash
curl http://localhost:3000/api/webhooks/sanity
```

### Test with Invalid Signature

```bash
curl -X POST http://localhost:3000/api/webhooks/sanity \
  -H "Content-Type: application/json" \
  -H "sanity-webhook-signature: invalid" \
  -d '{"_id":"test"}'

# Expected: 401 "Invalid webhook signature"
```

### Test Missing Secret

```bash
# Remove SANITY_WEBHOOK_SECRET from .env.local
# Restart server
npm run dev

curl http://localhost:3000/api/webhooks/sanity

# Expected: "configured": false
```

---

## Expected Test Results Summary

| Test | Expected Result |
|------|----------------|
| Health check (no secret) | `"configured": false` |
| Health check (with secret) | `"configured": true` |
| Valid webhook request | `200` + deletion results |
| Invalid signature | `401 "Invalid webhook signature"` |
| Missing signature | `401` error |
| DELETE event | All assets deleted |
| UPDATE event (no changes) | `"processed": 0` |
| UPDATE event (removed asset) | Asset deleted from Cloudinary |
| Duplicate deletion | `"notFound": 1` (success) |

---

## Next Steps After Testing

Once all tests pass:

1. ✅ Remove test webhook from Sanity (if created for ngrok)
2. ✅ Create production webhook with your domain
3. ✅ Add `SANITY_WEBHOOK_SECRET` to production environment
4. ✅ Monitor production logs for first real event
5. ✅ Test with real content update in Sanity Studio

🎉 **Your garbage collection system is now live!**
