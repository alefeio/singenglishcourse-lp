import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { parseFormData } from '@/app/utils/parseFormData';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  console.log('req', req);
  try {
    const configRef = collection(db, 'configuracoes');
    const configQuery = query(configRef, limit(1));
    const configSnap = await getDocs(configQuery);

    if (configSnap.empty) {
      return NextResponse.json(
        { error: 'Configurações não encontradas' },
        { status: 404 }
      );
    }

    const configData = configSnap.docs[0].data();
    const configId = configSnap.docs[0].id;

    return NextResponse.json({
      id: configId,
      ...configData,
      highlightName: configData.highlightName || 'Reserve sua Matrícula', // ✅ Nome do botão de destaque
      highlightUrl: configData.highlightUrl || '#matricula', // ✅ Link do botão
      highlightBgColor: configData.highlightBgColor || '#ea428e', // ✅ Cor de fundo
      highlightTextColor: configData.highlightTextColor || '#ffffff', // ✅ Cor do texto
    });
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    );
  }
}

// Desativa o bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Caminho do diretório de uploads
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Garante que o diretório de uploads existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    console.log('Iniciando criação da configuração...');

    const formData = await parseFormData(req);

    console.log('Campos recebidos:', formData.fields);
    console.log('Arquivo recebido:', formData.imageFile);

    let logoUrl = '';

    // Se uma logomarca foi enviada, processa o upload do arquivo
    if (formData.imageFile) {
      console.log('Nova logomarca recebida, processando...');

      const file = formData.imageFile;
      const ext = path.extname(file.filename).toLowerCase();
      const newFileName = `${uuidv4()}${ext}`;
      const newFilePath = path.join(uploadDir, newFileName);

      console.log('Novo nome do arquivo:', newFileName);
      console.log('Novo caminho do arquivo:', newFilePath);

      // ✅ O conteúdo já é um Buffer, então não precisa de conversão
      const fileContent = file.content;

      if (!Buffer.isBuffer(fileContent)) {
        console.error('O conteúdo do arquivo não é um buffer!');
        return NextResponse.json({ error: 'Conteúdo da logomarca inválido' }, { status: 400 });
      }

      fs.writeFileSync(newFilePath, fileContent);
      logoUrl = `/uploads/${newFileName}`;
      console.log(`Nova logomarca salva: ${newFilePath}`);
    }

    const docRef = await addDoc(collection(db, 'configuracoes'), {
      bannerHeight: formData.fields.bannerHeight || '50vh',
      bannerWidth: formData.fields.bannerWidth || '1280px',
      pageWidth: formData.fields.pageWidth || '1280px',
      footerText: formData.fields.footerText || '© 2025 Minha Empresa. Todos os direitos reservados.',
      menuLinks: JSON.parse(formData.fields.menuLinks || '[]'),
      footerLinks: JSON.parse(formData.fields.footerLinks || '[]'),
      logoUrl, // Salva a URL da logomarca
      highlightName: formData.fields.highlightName || 'Reserve sua Matrícula', // ✅ Nome do botão de destaque
      highlightUrl: formData.fields.highlightUrl || '#matricula', // ✅ Link do botão
      highlightBgColor: formData.fields.highlightBgColor || '#ea428e', // ✅ Cor de fundo
      highlightTextColor: formData.fields.highlightTextColor || '#ffffff', // ✅ Cor do texto
    });

    console.log('Configuração criada com sucesso!');
    return NextResponse.json({ success: true, id: docRef.id, logoUrl });
  } catch (err: unknown) {
    console.error('Erro ao criar configurações:', err);
    return NextResponse.json({ error: 'Erro ao criar configurações' }, { status: 500 });
  }
}
