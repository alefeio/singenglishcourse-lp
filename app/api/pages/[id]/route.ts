import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface ContentItem {
  id?: string; // Opcional, se necessário
  type: string;
  content: string;
  children?: ContentItem[]; // Recursividade para filhos
}

// 🔹 Corrigido: Extraindo o ID da URL diretamente no Next.js App Router
export async function GET(req: NextRequest) {
  try {
    const urlParts = req.nextUrl.pathname.split('/');
    const id = urlParts[urlParts.length - 1]; // Último segmento da URL

    const pageRef = doc(db, 'paginas', id);
    const pageSnap = await getDoc(pageRef);

    if (!pageSnap.exists()) {
      console.error('Página não encontrada:', id);
      return NextResponse.json({ error: 'Página não encontrada' }, { status: 404 });
    }
    return NextResponse.json(pageSnap.data());
  } catch (error) {
    console.error('Erro ao buscar a página:', error);
    return NextResponse.json({ error: 'Erro ao buscar a página' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const urlParts = req.nextUrl.pathname.split('/');
    const id = urlParts[urlParts.length - 1]; // Extraindo o ID da URL corretamente

    const body = await req.json();
    const pageRef = doc(db, 'paginas', id);

    // Processar o campo 'content' para salvar as imagens localmente
    const processContent = (content: ContentItem[]): ContentItem[] => {
      return content.map((item) => {
        if (item.type === 'image' && item.content.startsWith('data:image')) {
          const base64Data = item.content.split(',')[1];
          const ext = item.content.match(/data:image\/([a-zA-Z0-9-.+]+);base64/)?.[1] || 'png';
          const fileName = `${uuidv4()}.${ext}`;
          const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

          // Salvar a imagem no diretório local
          fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

          // Atualizar o conteúdo da imagem para a URL relativa
          item.content = `/uploads/${fileName}`;
        }

        // Processar recursivamente os filhos
        if (item.children && item.children.length > 0) {
          item.children = processContent(item.children);
        }

        return item;
      });
    };

    // Atualizar o conteúdo processado
    const processedContent = processContent(body.components || []);

    // Atualizar o documento no Firestore
    await updateDoc(pageRef, {
      name: body.name,
      url: body.url,
      content: processedContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar a página:', error);
    return NextResponse.json({ error: 'Erro ao atualizar a página' }, { status: 500 });
  }
}
