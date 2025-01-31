import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { parseFormData } from '@/app/utils/parseFormData';

// Desativa o bodyParser
export const config = {
    api: {
        bodyParser: false,  // Desativar o body parser do Next.js
    },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Verifica se o diretório de upload existe, se não, cria
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export async function PATCH(req: NextRequest) {
    try {
        console.log('Iniciando atualização do banner...');

        // Obtém o ID do banner da URL
        const url = req.nextUrl.pathname;
        const id = url.split('/').pop();
        if (!id) {
            return NextResponse.json({ error: 'ID do banner não fornecido' }, { status: 400 });
        }

        // Recupera o banner atual do Firestore
        const docRef = doc(db, 'banners', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return NextResponse.json({ error: 'Banner não encontrado' }, { status: 404 });
        }
        const oldData = docSnap.data();
        console.log('Dados antigos do banner:', oldData);

        // Lê os dados da requisição
        const formData = await parseFormData(req);

        console.log('Dados recebidos do formulário:', formData);

        let newImageUrl = oldData.imageUrl || '';

        // Se uma nova imagem foi enviada, processa o arquivo
        if (formData.imageFile) {
            console.log('Nova imagem recebida, processando...');

            // Remove a imagem antiga, se existir
            if (oldData.imageUrl) {
                const oldImagePath = path.join(process.cwd(), 'public', oldData.imageUrl);
                console.log(`Tentando remover imagem antiga em: ${oldImagePath}`);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                    console.log(`Imagem antiga removida: ${oldImagePath}`);
                } else {
                    console.warn(`Imagem antiga não encontrada: ${oldImagePath}`);
                }
            }

            // Gera o novo nome do arquivo com UUID e extensão correta
            const file = formData.imageFile;
            const ext = path.extname(file.filename).toLowerCase();
            const newFileName = `${uuidv4()}${ext}`;
            const newFilePath = path.join(process.cwd(), 'public', 'uploads', newFileName);

            console.log('Novo nome do arquivo:', newFileName);
            console.log('Novo caminho do arquivo:', newFilePath);

            // ✅ O conteúdo já é um Buffer, então não precisa de conversão
            fs.writeFileSync(newFilePath, file.content);

            newImageUrl = `/uploads/${newFileName}`; // Define a URL da nova imagem
            console.log(`Nova imagem salva: ${newFilePath}`);
        }

        // Atualiza os dados no Firestore
        await updateDoc(docRef, {
            title: formData?.fields.title ?? oldData.title,
            subtitle: formData?.fields.subtitle ?? oldData.subtitle,
            ctaText: formData?.fields.ctaText ?? oldData.ctaText,
            ctaColor: formData?.fields.ctaColor ?? oldData.ctaColor,
            ctaLink: formData?.fields.ctaLink ?? oldData.ctaLink,
            imageUrl: newImageUrl, // Salva o nome com UUID no Firestore
        });

        console.log('Banner atualizado com sucesso!');
        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        console.error('Erro ao atualizar banner:', err);
        return NextResponse.json({ error: 'Erro ao atualizar banner' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const url = req.nextUrl.pathname;
        const id = url.split('/').pop(); // Extraindo o ID da URL
        if (!id) {
            return NextResponse.json({ error: 'ID do banner não fornecido' }, { status: 400 });
        }

        const docRef = doc(db, 'banners', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return NextResponse.json({ error: 'Banner não encontrado' }, { status: 404 });
        }
        const data = docSnap.data();

        // Apagar do Firestore
        await deleteDoc(docRef);

        // Se existir arquivo local, deletar
        if (data.imageUrl) {
            const filePath = path.join(process.cwd(), 'public', data.imageUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        console.error('Erro ao excluir banner:', err);
        return NextResponse.json({ error: 'Erro ao excluir banner' }, { status: 500 });
    }
}
