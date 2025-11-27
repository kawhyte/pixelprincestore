'use client'

import { Card, Button, Stack, Text } from '@sanity/ui'
import { Sparkles } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useClient, useFormValue } from 'sanity'
import imageUrlBuilder from '@sanity/image-url'
import { toast } from 'sonner'

interface ImageAsset {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

export function GeminiGenerator() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [isGenerating, setIsGenerating] = useState(false)

  // Get current form values
  const title = useFormValue(['title']) as string | undefined
  const previewImage = useFormValue(['previewImage']) as ImageAsset | undefined
  const documentId = useFormValue(['_id']) as string | undefined

  // Build image URL
  const builder = imageUrlBuilder(client)
  const urlFor = (source: ImageAsset) => builder.image(source)

  const handleGenerate = useCallback(async () => {
    // Validate required fields
    if (!title) {
      toast.error('Please enter a title first')
      return
    }

    if (!previewImage?.asset?._ref) {
      toast.error('Please upload a preview image first')
      return
    }

    if (!documentId) {
      toast.error('Document ID not found')
      return
    }

    setIsGenerating(true)
    const loadingToast = toast.loading('Generating descriptions with Gemini...')

    try {
      // Resolve the image URL
      const imageUrl = urlFor(previewImage).width(800).url()

      // Call the Next.js API route
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          imageUrl,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('API Error Response:', error)
        throw new Error(error.error || error.details || 'Failed to generate descriptions')
      }

      const result = await response.json()

      // Update the document with the generated descriptions
      await client
        .patch(documentId)
        .set({
          description: result.short,
          longDescription: result.long,
        })
        .commit()

      toast.dismiss(loadingToast)
      toast.success('Descriptions generated successfully!')
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to generate descriptions'
      )
      console.error('Error generating descriptions:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [title, previewImage, documentId, client, urlFor])

  return (
    <Card padding={4} radius={2} shadow={1} tone="primary">
      <Stack space={3}>
        <Text size={2} weight="semibold">
          AI Assistant
        </Text>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !title || !previewImage}
          tone="primary"
          mode="default"
          text="Generate Descriptions with Gemini"
          icon={Sparkles}
          loading={isGenerating}
        />
        <Text size={1} muted>
          Uses AI to generate short and long descriptions based on the title and
          preview image.
        </Text>
      </Stack>
    </Card>
  )
}
