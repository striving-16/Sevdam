import 'server-only'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadProductImage(dataUrl: string): Promise<string> {
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: 'store/products',
    transformation: [
      {
        width: 1200,
        height: 1500,
        crop: 'fill',
        gravity: 'center',
        quality: 'auto',
        fetch_format: 'auto',
      },
    ],
  })
  return result.secure_url
}

export async function deleteProductImage(url: string): Promise<void> {
  const match = url.match(/store\/products\/([^.]+)/)
  if (!match) return
  await cloudinary.uploader.destroy(`store/products/${match[1]}`)
}
