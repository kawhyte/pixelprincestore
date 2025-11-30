'use client';

import { useState } from 'react';

/**
 * Test page for Cloudinary deletion
 * Access at: /test-cloudinary-delete
 *
 * This page helps you test if the Cloudinary deletion API is working
 */
export default function TestCloudinaryDelete() {
  const [publicId, setPublicId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDelete = async () => {
    if (!publicId) {
      alert('Please enter a public_id');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/cloudinary/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      });

      const data = await response.json();
      setResult({
        status: response.status,
        ok: response.ok,
        data,
      });
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Test Cloudinary Deletion API</h1>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4">
            <label className="mb-2 block font-semibold">
              Cloudinary Public ID:
            </label>
            <input
              type="text"
              value={publicId}
              onChange={(e) => setPublicId(e.target.value)}
              placeholder="high-res-assets/sample-image"
              className="w-full rounded border border-gray-300 px-4 py-2"
            />
            <p className="mt-2 text-sm text-gray-600">
              Example: <code className="rounded bg-gray-100 px-1">high-res-assets/your-image-name</code>
            </p>
          </div>

          <button
            onClick={testDelete}
            disabled={loading}
            className="w-full rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Delete'}
          </button>

          {result && (
            <div className="mt-6">
              <h2 className="mb-2 font-semibold">Result:</h2>
              <pre className="overflow-auto rounded bg-gray-900 p-4 text-sm text-green-400">
                {JSON.stringify(result, null, 2)}
              </pre>

              {result.ok && (
                <p className="mt-4 text-green-600">✅ Deletion successful!</p>
              )}
              {!result.ok && result.data?.error && (
                <div className="mt-4 rounded bg-red-50 p-4 text-red-700">
                  <p className="font-semibold">Error:</p>
                  <p>{result.data.error}</p>
                  {result.data.details && (
                    <pre className="mt-2 text-sm">{JSON.stringify(result.data.details, null, 2)}</pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h2 className="mb-4 font-semibold text-blue-900">How to use:</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-blue-800">
            <li>Go to your Cloudinary dashboard</li>
            <li>Find an image in the <code>high-res-assets</code> folder</li>
            <li>Copy the public_id (e.g., <code>high-res-assets/image-name</code>)</li>
            <li>Paste it above and click "Test Delete"</li>
          </ol>
        </div>

        <div className="mt-4 rounded-lg bg-yellow-50 p-6">
          <h2 className="mb-2 font-semibold text-yellow-900">Environment Check:</h2>
          <ul className="space-y-1 text-sm text-yellow-800">
            <li>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing'}</li>
            <li>CLOUDINARY_API_KEY: (server-side only)</li>
            <li>CLOUDINARY_API_SECRET: (server-side only)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
