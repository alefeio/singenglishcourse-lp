import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebaseClient'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Desativa o bodyParser padrão do Next para lidar com multipart
export const config = {
  api: {
    bodyParser: false,
  },
}

// Caminho local para salvar as imagens
const uploadDir = path.join(process.cwd(), 'public', 'banners')

// Certifique-se de que a pasta exista
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'banners'))
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Parse do FormData com formidable
    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
    })

    const [fields, files] = await new Promise<any>((resolve, reject) => {
      form.parse(req as any, (err, fieldsResult, filesResult) => {
        if (err) reject(err)
        else resolve([fieldsResult, filesResult])
      })
    })

    // 2. Se tiver imagem, renomear e mover
    let imageUrl = ''
    if (files.imageFile) {
      const file = files.imageFile
      const ext = path.extname(file.originalFilename || '').toLowerCase()
      const newFileName = `${uuidv4()}${ext}`
      const newFilePath = path.join(uploadDir, newFileName)

      fs.renameSync(file.filepath, newFilePath)
      // URL local
      imageUrl = `/banners/${newFileName}`
    }

    // 3. Salvar dados no Firestore
    // fields.title, fields.subtitle, etc. vem como strings
    const docRef = await addDoc(collection(db, 'banners'), {
      title: fields.title || '',
      subtitle: fields.subtitle || '',
      ctaText: fields.ctaText || '',
      ctaColor: fields.ctaColor || '',
      ctaLink: fields.ctaLink || '',
      imageUrl: imageUrl,
    })

    return NextResponse.json({ success: true, id: docRef.id })
  } catch (error: any) {
    console.error('Erro ao criar banner:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
