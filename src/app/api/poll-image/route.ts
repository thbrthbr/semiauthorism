import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

function toWebpFileName(originalName: string) {
  const dotIndex = originalName.lastIndexOf('.');
  if (dotIndex === -1) return originalName + '.webp';

  const base = originalName.substring(0, dotIndex);
  return `${base}.webp`;
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) return new Response('No file uploaded', { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

  const originalName = file.name;
  const webpName = toWebpFileName(originalName);

  const filename = `pollism/${Date.now()}-${webpName}`;

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: filename,
      Body: webpBuffer,
      ContentType: 'image/webp',
    }),
  );

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;

  return new Response(JSON.stringify({ url: publicUrl }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
