import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Desativa o bodyParser
export const config = {
  api: {
    bodyParser: false,  // Desativar o body parser do Next.js
  },
};

// Tipagem para os dados do formulário
interface FormData {
  fields: Record<string, string>;
  imageFile: {
    filename: string;
    contentType: string;
  } | null;
}

export async function POST(req: NextRequest) {
  try {
    // Lê o corpo da requisição como stream
    const formData = await parseFormData(req);

    // Defina a URL da imagem
    const imageUrl = formData.imageFile
      ? `/uploads/${formData.imageFile.filename}`
      : null;

    // Salvar dados no Firestore
    const docRef = await addDoc(collection(db, 'banners'), {
      title: formData.fields.title || '',
      subtitle: formData.fields.subtitle || '',
      ctaText: formData.fields.ctaText || '',
      ctaColor: formData.fields.ctaColor || '',
      ctaLink: formData.fields.ctaLink || '',
      imageUrl,
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err: unknown) {
    console.error('Erro ao criar banner:', err);
    return NextResponse.json({ error: 'Erro ao criar banner' }, { status: 500 });
  }
}

// Função para lidar com a leitura do formulário e salvar o arquivo
async function parseFormData(req: NextRequest) {
  return new Promise<any>((resolve, reject) => {
    const formData: any = {
      fields: {},
      imageFile: null,
    };

    const boundary = req.headers.get('content-type')?.split('boundary=')[1];
    if (!boundary) {
      reject('Não foi possível encontrar o boundary.');
    }

    const reader = req.body?.getReader();
    if (!reader) {
      reject('Não foi possível ler a requisição.');
    }

    const chunks: Uint8Array[] = [];
    reader?.read().then(function processData({ done, value }) {
      if (done) {
        const buffer = Buffer.concat(chunks);
        parseMultipartFormData(buffer, boundary!, formData);
        resolve(formData);
      } else {
        chunks.push(value);
        reader?.read().then(processData);
      }
    }).catch(reject);
  });
}

// Função para analisar o conteúdo do formulário multipart/form-data
function parseMultipartFormData(buffer: Buffer, boundary: string, formData: any) {
  const bufferStr = buffer.toString('utf-8');

  // Divida o conteúdo com base no boundary
  const parts = bufferStr.split(`--${boundary}`);

  parts.forEach((part) => {
    if (part.includes('Content-Disposition')) {
      const nameMatch = part.match(/name="([^"]+)"/);
      const filenameMatch = part.match(/filename="([^"]+)"/);
      const contentTypeMatch = part.match(/Content-Type: ([^;]+)/);

      if (nameMatch) {
        const name = nameMatch[1];
        const content = part.split('\r\n\r\n')[1]?.split('\r\n--')[0];

        if (name === 'imageFile' && filenameMatch && content) {
          const filePath = path.join(process.cwd(), 'public', 'uploads', filenameMatch[1]);

          // Usar fs.createWriteStream para salvar o arquivo binário corretamente
          const fileStream = fs.createWriteStream(filePath);
          fileStream.write(Buffer.from(content, 'binary'));
          fileStream.end();

          formData.imageFile = {
            filename: filenameMatch[1],
            filepath: filePath,
            originalFilename: filenameMatch[1],
            contentType: contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream',
          };
        } else {
          formData.fields[name] = content;
        }
      }
    }
  });
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