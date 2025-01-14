import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { parseFormData } from '@/app/utils/parseFormData';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Desativa o bodyParser
export const config = {
  api: {
    bodyParser: false,  // Desativar o body parser do Next.js
  },
};

export async function POST(req: NextRequest) {
  try {
    console.log('Iniciando o processamento do formulário...');

    // Lê os dados da requisição
    const formData = await parseFormData(req);

    console.log('Campos recebidos:', formData.fields);
    console.log('Arquivo recebido:', formData.imageFile);

    let imageUrl = null;

    // Se uma imagem foi enviada, processa o arquivo
    if (formData.imageFile) {
      console.log('Nova imagem recebida, processando...');

      // Gera o novo nome do arquivo com UUID e extensão correta
      const file = formData.imageFile;
      const ext = path.extname(file.filename).toLowerCase();
      const newFileName = `${uuidv4()}${ext}`;
      const newFilePath = path.join(process.cwd(), 'public', 'uploads', newFileName);

      console.log('Novo nome do arquivo:', newFileName);
      console.log('Novo caminho do arquivo:', newFilePath);

      // Garantir que o conteúdo da imagem seja um buffer
      const fileContent = Buffer.from(file.content, 'binary'); // Transformar o conteúdo em um buffer
      if (!Buffer.isBuffer(fileContent)) {
        console.error('O conteúdo do arquivo não é um buffer!');
        return NextResponse.json({ error: 'Conteúdo da imagem inválido' }, { status: 400 });
      }

      // Salva o arquivo binário no sistema de arquivos
      fs.writeFileSync(newFilePath, fileContent);
      imageUrl = `/uploads/${newFileName}`; // Define a URL da nova imagem
      console.log(`Nova imagem salva: ${newFilePath}`);
    }

    // Salvar dados no Firestore
    console.log('Salvando dados no Firestore...');
    const docRef = await addDoc(collection(db, 'banners'), {
      title: formData?.fields.title || '',
      subtitle: formData?.fields.subtitle || '',
      ctaText: formData?.fields.ctaText || '',
      ctaColor: formData?.fields.ctaColor || '',
      ctaLink: formData?.fields.ctaLink || '',
      imageUrl, // URL da imagem
    });

    console.log('Banner criado com sucesso!');
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err: unknown) {
    console.error('Erro ao criar banner:', err);
    return NextResponse.json({ error: 'Erro ao criar banner' }, { status: 500 });
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
  } catch (err: unknown) {
    console.error('Erro ao buscar banners:', err);
    return NextResponse.json({ error: 'Erro ao buscar banners' }, { status: 500 });
  }
}

