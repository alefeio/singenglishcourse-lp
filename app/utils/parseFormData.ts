import { NextRequest } from 'next/server';
import { parseMultipartFormData } from "./parseMultipartFormData";

// Tipagem para os dados do formulário
interface FormData {
    fields: Record<string, string>;
    imageFile: {
      filename: string;
      content: string;
    } | null;
  }

// Função para lidar com a leitura do formulário e salvar o arquivo
export async function parseFormData(req: NextRequest): Promise<FormData> {
    return new Promise<FormData>((resolve, reject) => {
      const formData: FormData = {
        fields: {},
        imageFile: null,
      };
  
      const boundary = req.headers.get('content-type')?.split('boundary=')[1];
      if (!boundary) {
        reject('Não foi possível encontrar o boundary!');
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
          // Converte o Uint8Array para Buffer corretamente
          chunks.push(Buffer.from(value));
          reader?.read().then(processData);
        }
      }).catch(reject);
    });
  }