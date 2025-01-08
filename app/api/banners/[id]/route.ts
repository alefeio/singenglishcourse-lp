import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebaseClient'
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadDir = path.join(process.cwd(), 'public', 'banners')

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bannerId = params.id
    // Buscamos o doc para saber se tem imageUrl antigo
    const docRef = doc(db, 'banners', bannerId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Banner não encontrado' }, { status: 404 })
    }

    const oldData = docSnap.data()

    // Parse do form
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

    let newImageUrl = oldData.imageUrl || ''

    // Se subiu nova imagem
    if (files.imageFile) {
      // Apagar imagem antiga (se existir)
      if (oldData.imageUrl) {
        const oldPath = path.join(process.cwd(), 'public', oldData.imageUrl)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }

      // Salvar nova
      const file = files.imageFile
      const ext = path.extname(file.originalFilename || '').toLowerCase()
      const newFileName = `${uuidv4()}${ext}`
      const newFilePath = path.join(uploadDir, newFileName)

      fs.renameSync(file.filepath, newFilePath)
      newImageUrl = `/banners/${newFileName}`
    }

    // Atualizar doc
    await updateDoc(docRef, {
      title: fields.title ?? oldData.title,
      subtitle: fields.subtitle ?? oldData.subtitle,
      ctaText: fields.ctaText ?? oldData.ctaText,
      ctaColor: fields.ctaColor ?? oldData.ctaColor,
      ctaLink: fields.ctaLink ?? oldData.ctaLink,
      imageUrl: newImageUrl,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao editar banner:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bannerId = params.id
    const docRef = doc(db, 'banners', bannerId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Banner não encontrado' }, { status: 404 })
    }
    const data = docSnap.data()

    // Apagar do Firestore
    await deleteDoc(docRef)

    // Se existir arquivo local, deletar
    if (data.imageUrl) {
      const filePath = path.join(process.cwd(), 'public', data.imageUrl)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao excluir banner:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
