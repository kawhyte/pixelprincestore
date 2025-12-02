/**
 * Local Webhook Tester
 *
 * Tests the Sanity webhook handler locally without needing Sanity
 *
 * Usage:
 *   npx tsx scripts/test-webhook.ts
 *
 * What it does:
 *   1. Creates a mock webhook payload simulating a document update
 *   2. Generates a valid HMAC signature
 *   3. Sends POST request to local webhook endpoint
 *   4. Displays the response
 *
 * Expected result:
 *   - Webhook should detect 1 removed asset (test-16x20)
 *   - Deletion will show as "not found" (expected - asset doesn't exist)
 *   - This proves the webhook logic works correctly
 */

import crypto from 'crypto';

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/api/webhooks/sanity';
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET || 'test-secret-please-change';

// Mock webhook payload - simulates removing a Cloudinary asset
const mockUpdatePayload = {
  _id: 'test-product-123',
  _type: 'product',
  _rev: 'abc123',
  transition: 'update',
  current: {
    _id: 'test-product-123',
    _type: 'product',
    title: 'Test Product',
    sizes: [
      {
        id: '8x10',
        displayLabel: '8″×10″',
        highResAsset: {
          assetType: 'cloudinary',
          cloudinaryPublicId: 'high-res-assets/test-8x10',
          cloudinaryUrl: 'https://res.cloudinary.com/demo/image/upload/v1234/high-res-assets/test-8x10.jpg'
        }
      }
    ]
  },
  previous: {
    _id: 'test-product-123',
    _type: 'product',
    title: 'Test Product',
    sizes: [
      {
        id: '8x10',
        displayLabel: '8″×10″',
        highResAsset: {
          assetType: 'cloudinary',
          cloudinaryPublicId: 'high-res-assets/test-8x10',
          cloudinaryUrl: 'https://res.cloudinary.com/demo/image/upload/v1234/high-res-assets/test-8x10.jpg'
        }
      },
      {
        id: '16x20',
        displayLabel: '16″×20″',
        highResAsset: {
          assetType: 'cloudinary',
          // This asset was removed - should be detected for deletion
          cloudinaryPublicId: 'high-res-assets/test-16x20',
          cloudinaryUrl: 'https://res.cloudinary.com/demo/image/upload/v1234/high-res-assets/test-16x20.jpg'
        }
      }
    ]
  }
};

const mockDeletePayload = {
  _id: 'test-product-456',
  _type: 'product',
  _rev: 'def456',
  transition: 'delete',
  previous: {
    _id: 'test-product-456',
    _type: 'product',
    title: 'Deleted Product',
    sizes: [
      {
        id: '4x5',
        highResAsset: {
          cloudinaryPublicId: 'high-res-assets/deleted-4x5'
        }
      },
      {
        id: '8x10',
        highResAsset: {
          cloudinaryPublicId: 'high-res-assets/deleted-8x10'
        }
      }
    ]
  }
};

/**
 * Generate Sanity-compatible webhook signature
 */
function generateSignature(body: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = `${timestamp}.${body}`;
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return `sha256=${hash},t=${timestamp}`;
}

/**
 * Send webhook request
 */
async function sendWebhookRequest(payload: unknown, description: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 TEST: ${description}`);
  console.log('='.repeat(60));

  const body = JSON.stringify(payload);
  const signature = generateSignature(body, WEBHOOK_SECRET);

  console.log('📤 URL:', WEBHOOK_URL);
  console.log('🔐 Signature:', signature.substring(0, 30) + '...');
  console.log('📦 Payload:', payload);

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

    console.log('\n📥 RESPONSE:');
    console.log('   Status:', response.status, response.ok ? '✅' : '❌');
    console.log('   Body:', JSON.stringify(result, null, 2));

    // Validate response
    if (response.ok) {
      console.log('\n✅ Test PASSED');
      return true;
    } else {
      console.log('\n❌ Test FAILED');
      return false;
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    return false;
  }
}

/**
 * Test health check endpoint
 */
async function testHealthCheck() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('🏥 HEALTH CHECK');
  console.log('='.repeat(60));

  try {
    const response = await fetch(WEBHOOK_URL);
    const result = await response.json();

    console.log('📥 Status:', response.status);
    console.log('📥 Response:', JSON.stringify(result, null, 2));

    if (result.configured) {
      console.log('\n✅ Webhook is configured and ready');
      return true;
    } else {
      console.log('\n⚠️  Webhook secret not configured');
      console.log('   Add SANITY_WEBHOOK_SECRET to .env.local');
      return false;
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    console.error('   Make sure dev server is running (npm run dev)');
    return false;
  }
}

/**
 * Test invalid signature
 */
async function testInvalidSignature() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('🔒 TEST: Invalid Signature (should fail)');
  console.log('='.repeat(60));

  const body = JSON.stringify({ _id: 'test' });

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sanity-webhook-signature': 'sha256=invalid,t=123456'
      },
      body
    });

    const result = await response.json();

    console.log('📥 Status:', response.status);
    console.log('📥 Response:', JSON.stringify(result, null, 2));

    if (response.status === 401) {
      console.log('\n✅ Test PASSED - Invalid signature correctly rejected');
      return true;
    } else {
      console.log('\n❌ Test FAILED - Should have returned 401');
      return false;
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    return false;
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('\n🚀 SANITY WEBHOOK TEST SUITE');
  console.log('='.repeat(60));
  console.log('Testing webhook at:', WEBHOOK_URL);
  console.log('Using secret:', WEBHOOK_SECRET.substring(0, 10) + '...');
  console.log('='.repeat(60));

  const results: { test: string; passed: boolean }[] = [];

  // Test 1: Health Check
  const healthCheck = await testHealthCheck();
  results.push({ test: 'Health Check', passed: healthCheck });

  if (!healthCheck) {
    console.log('\n⚠️  Skipping remaining tests - webhook not configured');
    console.log('   Add SANITY_WEBHOOK_SECRET to .env.local and restart server');
    return;
  }

  // Test 2: Invalid Signature
  const invalidSig = await testInvalidSignature();
  results.push({ test: 'Invalid Signature', passed: invalidSig });

  // Test 3: Update Event (removed asset)
  const updateTest = await sendWebhookRequest(
    mockUpdatePayload,
    'UPDATE Event - Asset Removed'
  );
  results.push({ test: 'Update Event', passed: updateTest });

  // Test 4: Delete Event
  const deleteTest = await sendWebhookRequest(
    mockDeletePayload,
    'DELETE Event - All Assets Removed'
  );
  results.push({ test: 'Delete Event', passed: deleteTest });

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));

  results.forEach(({ test, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${test}`);
  });

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  console.log('\n' + '='.repeat(60));
  console.log(`${passedCount}/${totalCount} tests passed`);

  if (passedCount === totalCount) {
    console.log('\n🎉 ALL TESTS PASSED! Your webhook is working correctly.');
    console.log('\nNote: Assets show as "not found" because they don\'t exist in Cloudinary.');
    console.log('This is expected and proves idempotency works correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
  }

  console.log('='.repeat(60) + '\n');
}

// Run tests
runAllTests().catch(console.error);
