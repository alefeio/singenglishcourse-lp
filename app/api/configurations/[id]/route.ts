import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { parseFormData } from '@/app/utils/parseFormData';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

export async function PATCH(req: NextRequest) {
  try {
    console.log('Iniciando atualização da configuração...');

    // Extraindo o ID da URL
    const urlParts = req.nextUrl.pathname.split('/');
    const id = urlParts[urlParts.length - 1]; // Último segmento da URL

    if (!id) {
      return NextResponse.json({ error: 'ID da configuração não fornecido' }, { status: 400 });
    }

    const configRef = doc(db, 'configuracoes', id);
    const configSnap = await getDoc(configRef);
    if (!configSnap.exists()) {
      return NextResponse.json({ error: 'Configuração não encontrada' }, { status: 404 });
    }
    const oldData = configSnap.data();
    console.log('Dados antigos da configuração:', oldData);

    const formData = await parseFormData(req);
    console.log('Dados recebidos do formulário:', formData);

    let newLogoUrl = oldData.logoUrl || '';

    // Se uma nova logomarca foi enviada, processa o upload do arquivo
    if (formData.imageFile) {
      console.log('Nova logomarca recebida, processando...');

      // Remove a logomarca antiga, se existir
      if (oldData.logoUrl) {
        const oldLogoPath = path.join(process.cwd(), 'public', oldData.logoUrl);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
          console.log(`Logomarca antiga removida: ${oldLogoPath}`);
        } else {
          console.warn(`Logomarca antiga não encontrada: ${oldLogoPath}`);
        }
      }

      // Gera um novo nome para a logomarca
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
      newLogoUrl = `/uploads/${newFileName}`;
      console.log(`Nova logomarca salva: ${newFilePath}`);
    }

    await updateDoc(configRef, {
      bannerHeight: formData.fields.bannerHeight ?? oldData.bannerHeight,
      bannerWidth: formData.fields.bannerWidth ?? oldData.bannerWidth,
      pageWidth: formData.fields.pageWidth ?? oldData.pageWidth,
      footerText: formData.fields.footerText ?? oldData.footerText,
      menuLinks: JSON.parse(formData.fields.menuLinks || '[]'),
      footerLinks: JSON.parse(formData.fields.footerLinks || '[]'),
      logoUrl: newLogoUrl, // Atualiza a URL da logomarca
      highlightName: formData.fields.highlightName ?? oldData.highlightName,
      highlightUrl: formData.fields.highlightUrl ?? oldData.highlightUrl,
      highlightBgColor: formData.fields.highlightBgColor ?? oldData.highlightBgColor,
      highlightTextColor: formData.fields.highlightTextColor ?? oldData.highlightTextColor,
    });
    
    console.log('Configuração atualizada com sucesso!');
    return NextResponse.json({ success: true, logoUrl: newLogoUrl });
  } catch (err: unknown) {
    console.error('Erro ao atualizar configurações:', err);
    return NextResponse.json({ error: 'Erro ao atualizar configurações' }, { status: 500 });
  }
}
