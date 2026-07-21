const BLOB_BASE =
  process.env.NEXT_PUBLIC_BLOB_BASE_URL ||
  "https://h67vy9xnqpkimvev.public.blob.vercel-storage.com";

export const SITE_NAME = "ศูนย์สื่อการเรียนรู้ดิจิทัลพระพุทธศาสนา";

export function getContentBlobUrl(slug) {
  return `${BLOB_BASE}/content/${slug}.json`;
}

export { BLOB_BASE };
