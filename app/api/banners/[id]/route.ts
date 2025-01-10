import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

// Tipos para os dados do formulário
interface FormData {
    fields: { [key: string]: string };
    imageFile: {
        filename: string;
        filepath: string;
        originalFilename: string;
        contentType: string;
    } | null;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params; // Acesso correto ao parâmetro 'id'
        if (!id) {
            return NextResponse.json({ error: 'ID do banner não fornecido' }, { status: 400 });
        }

        const docRef = doc(db, 'banners', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: 'Banner não encontrado' }, { status: 404 });
        }

        const oldData = docSnap.data();

        // Lê o corpo da requisição como um stream
        const formData: FormData = await parseFormData(req);

        let newImageUrl = oldData.imageUrl || '';

        // Se subiu nova imagem
        if (formData.imageFile) {
            // Apagar imagem antiga (se existir)
            if (oldData.imageUrl) {
                const oldPath = path.join(process.cwd(), 'public', oldData.imageUrl);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            // Salvar nova imagem
            const file = formData.imageFile;
            const ext = path.extname(file.originalFilename || '').toLowerCase();
            const newFileName = `${uuidv4()}${ext}`;
            const newFilePath = path.join(uploadDir, newFileName);

            // Mover o arquivo para o diretório de uploads
            fs.renameSync(file.filepath, newFilePath);
            newImageUrl = `/uploads/${newFileName}`;
        }

        // Atualizar dados no Firestore
        await updateDoc(docRef, {
            title: formData.fields.title ?? oldData.title,
            subtitle: formData.fields.subtitle ?? oldData.subtitle,
            ctaText: formData.fields.ctaText ?? oldData.ctaText,
            ctaColor: formData.fields.ctaColor ?? oldData.ctaColor,
            ctaLink: formData.fields.ctaLink ?? oldData.ctaLink,
            imageUrl: newImageUrl,
        });

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        console.error('Erro ao editar banner:', err);
        return NextResponse.json({ error: 'Erro ao editar banner' }, { status: 500 });
    }
}

// Função para lidar com a leitura do formulário e salvar o arquivo
async function parseFormData(req: NextRequest): Promise<FormData> {
    return new Promise<FormData>((resolve, reject) => {
        const formData: FormData = {
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

        const chunks: Buffer[] = [];
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
function parseMultipartFormData(buffer: Buffer, boundary: string, formData: FormData) {
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
                    formData.imageFile = {
                        filename: filenameMatch[1],
                        filepath: path.join(uploadDir, filenameMatch[1]),
                        originalFilename: filenameMatch[1],
                        contentType: contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream',
                    };
                    fs.writeFileSync(formData.imageFile.filepath, Buffer.from(content, 'binary'));
                } else {
                    formData.fields[name] = content;
                }
            }
        }
    });
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

        // Apagar o banner do Firestore
        await deleteDoc(docRef);

        // Se existir o arquivo da imagem, deletar do sistema de arquivos
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