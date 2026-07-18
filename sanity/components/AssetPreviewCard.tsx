'use client';

import React, { useState } from 'react';
import { Card, Flex, Stack, Text, Button, Badge } from '@sanity/ui';
import { LinkIcon, ImageIcon } from 'lucide-react';
import type { HighResAsset } from '@/lib/types/high-res-asset';
import { deriveRatio } from '@/config/print-sizes';

function formatUploadedAt(uploadedAt?: string): string | null {
  if (!uploadedAt) return null;
  const date = new Date(uploadedAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface AssetPreviewCardProps {
  asset: HighResAsset;
  onReplace: () => void;
}

export function AssetPreviewCard({ asset, onReplace }: AssetPreviewCardProps) {
  const [thumbFailed, setThumbFailed] = useState(false);
  const isCloudinary = !!asset.cloudinaryUrl;
  const uploadedLabel = formatUploadedAt(asset.uploadedAt);
  const ratio = asset.width && asset.height ? deriveRatio(asset.width, asset.height) : null;

  if (isCloudinary) {
    const thumbUrl = asset.cloudinaryUrl!.replace('/upload/', '/upload/w_200/');

    return (
      <Card padding={3} radius={2} shadow={1} tone="positive">
        <Flex gap={3} align="center">
          <Card radius={2} overflow="hidden" style={{ width: 72, height: 72, flexShrink: 0 }}>
            {thumbFailed ? (
              <Flex align="center" justify="center" style={{ width: '100%', height: '100%' }}>
                <ImageIcon size={28} />
              </Flex>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbUrl}
                alt={asset.filename}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setThumbFailed(true)}
              />
            )}
          </Card>
          <Stack space={2} flex={1}>
            <Text size={1} weight="semibold">{asset.filename}</Text>
            <Flex gap={2} align="center" wrap="wrap">
              {ratio && <Badge tone="positive">{ratio}</Badge>}
              {!ratio && asset.width && asset.height && <Badge tone="caution">odd crop</Badge>}
              {asset.width && asset.height && (
                <Text size={1} muted>{asset.width}×{asset.height}</Text>
              )}
              {uploadedLabel && <Text size={1} muted>· {uploadedLabel}</Text>}
            </Flex>
          </Stack>
          <Button text="Replace file" mode="ghost" onClick={onReplace} />
        </Flex>
      </Card>
    );
  }

  // Legacy external asset (read-only, migrated docs only)
  const hostname = asset.externalUrl ? safeHostname(asset.externalUrl) : 'external link';
  return (
    <Card padding={3} radius={2} shadow={1} tone="caution">
      <Flex gap={3} align="center">
        <Flex align="center" justify="center" style={{ width: 72, height: 72, flexShrink: 0 }}>
          <LinkIcon size={28} />
        </Flex>
        <Stack space={2} flex={1}>
          <Text size={1} weight="semibold">{asset.filename}</Text>
          <Text size={1} muted>{hostname}{uploadedLabel ? ` · ${uploadedLabel}` : ''}</Text>
        </Stack>
        {asset.externalUrl && (
          <Button as="a" href={asset.externalUrl} target="_blank" rel="noopener noreferrer" text="Open link" mode="ghost" />
        )}
        <Button text="Replace file" mode="ghost" onClick={onReplace} />
      </Flex>
    </Card>
  );
}

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
