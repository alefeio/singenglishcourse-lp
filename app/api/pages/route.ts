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
        bodyParser: false, // Desativar o body parser do Next.js
    },
};

export async function POST(req: NextRequest) {
    try {
        console.log('Recebendo requisição no endpoint /api/pages...');

        // Lê os dados da requisição
        const formData = await parseFormData(req);

        if (!formData?.fields?.name || !formData?.fields?.url || !formData?.fields?.components) {
            console.error('Campos obrigatórios ausentes');
            return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
        }

        console.log('Campos recebidos:', formData.fields);

        let components = [];
        try {
            components = JSON.parse(formData.fields.components);
        } catch (err) {
            console.error('Erro ao fazer o parse dos componentes:', err);
            return NextResponse.json({ error: 'Formato inválido dos componentes' }, { status: 400 });
        }

        // Processar imagens
        for (const component of components) {
            if (component.type === 'IMAGE' && component.imageFile) {
                console.log('Processando imagem do componente...');

                const file = component.imageFile;
                const ext = path.extname(file.filename).toLowerCase();
                const newFileName = `${uuidv4()}${ext}`;
                const newFilePath = path.join(process.cwd(), 'public', 'uploads', newFileName);

                const fileContent = Buffer.from(file.content, 'binary');
                fs.writeFileSync(newFilePath, fileContent);

                // Atualiza o caminho da imagem no componente
                component.imageUrl = `/uploads/${newFileName}`;
                delete component.imageFile;
            }
        }

        // Salvar dados no Firestore
        console.log('Salvando dados no Firestore...');
        const docRef = await addDoc(collection(db, 'paginas'), {
            name: formData.fields.name,
            url: formData.fields.url,
            content: components,
        });

        console.log('Página criada com sucesso!');
        return NextResponse.json({ success: true, id: docRef.id });
    } catch (err: unknown) {
        console.error('Erro ao criar página:', err);
        return NextResponse.json({ error: 'Erro ao criar página' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const snapshot = await getDocs(collection(db, 'paginas'));
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return NextResponse.json(data);
    } catch (err: unknown) {
        console.error('Erro ao buscar páginas:', err);
        return NextResponse.json({ error: 'Erro ao buscar páginas' }, { status: 500 });
    }
}
