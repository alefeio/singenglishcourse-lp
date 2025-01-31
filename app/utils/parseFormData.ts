import { NextRequest } from 'next/server';
import { parseMultipartFormData } from "./parseMultipartFormData";

// Tipagem correta para os dados do formulário
interface ParsedFormData {
    fields: Record<string, string>;
    imageFile: {
        filename: string;
        content: Buffer; // ✅ Agora é um Buffer, e não uma string
    } | null;
}

// Função para lidar com a leitura do formulário e salvar o arquivo
export async function parseFormData(req: NextRequest): Promise<ParsedFormData> {
    return new Promise<ParsedFormData>((resolve, reject) => {
        const formData: ParsedFormData = {
            fields: {},
            imageFile: null,
        };

        const boundary = req.headers.get('content-type')?.split('boundary=')[1];
        if (!boundary) {
            return reject(new Error('Não foi possível encontrar o boundary!'));
        }

        const reader = req.body?.getReader();
        if (!reader) {
            return reject(new Error('Não foi possível ler a requisição.'));
        }

        const chunks: Buffer[] = [];

        reader.read().then(function processData({ done, value }) {
            if (done) {
                const buffer = Buffer.concat(chunks);
                parseMultipartFormData(buffer, boundary!, formData);

                // ✅ Verifica se o conteúdo da imagem é string e converte para Buffer
                if (formData.imageFile?.content && typeof formData.imageFile.content === 'string') {
                    formData.imageFile.content = Buffer.from(formData.imageFile.content, 'base64');
                }

                resolve(formData);
            } else {
                // ✅ Converte o Uint8Array para Buffer corretamente
                chunks.push(Buffer.from(value));
                reader.read().then(processData);
            }
        }).catch(reject);
    });
}
