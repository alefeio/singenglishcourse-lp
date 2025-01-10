import { NextResponse } from 'next/server';
import formidable from 'formidable';

// Middleware para garantir que o formidable processe os dados corretamente
export async function middleware(req: Request) {
  const form = new formidable.IncomingForm({
    uploadDir: './public/uploads', // Defina o diretório de upload
    keepExtensions: true, // Manter a extensão do arquivo
    filename: (name, ext, part, form) => part.originalFilename, // Usar o nome original do arquivo
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err); // Se ocorrer erro, rejeita
      }

      // Para passar para o handler da API
      req.body = { fields, files }; // Atribui os campos e arquivos processados ao corpo da requisição
      resolve(NextResponse.next()); // Continua o processamento da requisição
    });
  });
}
