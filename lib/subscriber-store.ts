import { writeClient } from "@/sanity/lib/write-client";
import { WEEKLY_DOWNLOAD_LIMIT } from "@/config/free-art";

export interface SubscriberDownload {
  artId: string;
  sizeId?: string; // legacy only: pre single-file-pipeline records
  requestedAt: string;
}

export interface SubscriberDoc {
  _id: string;
  email: string;
  downloads?: SubscriberDownload[];
}

function docIdForEmail(email: string): string {
  // deterministic id → natural dedupe, no race on "find then create"
  return `subscriber-${Buffer.from(normalizeEmail(email)).toString("hex")}`;
}

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export async function getSubscriber(email: string): Promise<SubscriberDoc | null> {
  if (!writeClient) throw new Error("Sanity write client not configured");
  return writeClient.getDocument<SubscriberDoc>(docIdForEmail(email)).then((d) => d ?? null);
}

export function weeklyDownloadCount(sub: SubscriberDoc | null): number {
  if (!sub?.downloads) return 0;
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return sub.downloads.filter((d) => new Date(d.requestedAt).getTime() > cutoff).length;
}

export function isOverWeeklyLimit(sub: SubscriberDoc | null): boolean {
  return weeklyDownloadCount(sub) >= WEEKLY_DOWNLOAD_LIMIT;
}

/** Creates the subscriber if new; appends the download record. Returns true if the subscriber is brand new. */
export async function recordDownloadRequest(
  email: string,
  artId: string,
  source: string
): Promise<{ isNewSubscriber: boolean }> {
  if (!writeClient) throw new Error("Sanity write client not configured");
  const id = docIdForEmail(email);
  const existing = await writeClient.getDocument(id);
  const isNewSubscriber = !existing;
  await writeClient
    .transaction()
    .createIfNotExists({
      _id: id,
      _type: "subscriber",
      email: normalizeEmail(email),
      consentAt: new Date().toISOString(),
      source,
      downloads: [],
    })
    .patch(id, (p) =>
      p.setIfMissing({ downloads: [] }).append("downloads", [
        {
          _key: `${Date.now()}`,
          artId,
          requestedAt: new Date().toISOString(),
        },
      ])
    )
    .commit();
  return { isNewSubscriber };
}

/** Creates the subscriber if new (no download record). Returns true if the subscriber is brand new. */
export async function recordSubscription(
  email: string,
  source: string
): Promise<{ isNewSubscriber: boolean }> {
  if (!writeClient) throw new Error("Sanity write client not configured");
  const id = docIdForEmail(email);
  const existing = await writeClient.getDocument(id);
  const isNewSubscriber = !existing;
  await writeClient.createIfNotExists({
    _id: id,
    _type: "subscriber",
    email: normalizeEmail(email),
    consentAt: new Date().toISOString(),
    source,
    downloads: [],
  });
  return { isNewSubscriber };
}
