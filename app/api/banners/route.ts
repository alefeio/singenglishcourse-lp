
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import fs from 'fs';

// Desativa o bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    console.log('Iniciando o processamento do formulário...');

    // Use o formidable para lidar com o stream da requisição
    const form = formidable({
      uploadDir: './public/uploads',
      keepExtensions: true,
    });

    // Usamos diretamente o stream da requisição
    const [fields, files] = await new Promise<any>((resolve, reject) => {
      form.parse(req.body, (err, fieldsResult, filesResult) => {
        if (err) reject(err);
        else resolve([fieldsResult, filesResult]);
      });
    });

    console.log('Campos recebidos:', fields);
    console.log('Arquivos recebidos:', files);

    const imageUrl = files?.imageFile ? `/uploads/${files.imageFile.newFilename}` : null;

    console.log('Salvando dados no Firestore...');
    const docRef = await addDoc(collection(db, 'banners'), {
      title: fields?.title || '',
      subtitle: fields?.subtitle || '',
      ctaText: fields?.ctaText || '',
      ctaColor: fields?.ctaColor || '',
      ctaLink: fields?.ctaLink || '',
      imageUrl,
    });

    console.log('Banner criado com sucesso!');
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error('Erro ao criar banner:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'banners'));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erro ao buscar banners:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
