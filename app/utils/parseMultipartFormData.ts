// Tipagem para os dados do formulário
interface FormData {
    fields: Record<string, string>;
    imageFile: {
        filename: string;
        content: Buffer; // Alterado de string para Buffer
    } | null;
}

export function parseMultipartFormData(buffer: Buffer, boundary: string, formData: FormData) {
    const boundaryBuffer = Buffer.from(`--${boundary}`, 'utf-8');
    const boundaryEndBuffer = Buffer.from(`--${boundary}--`, 'utf-8');
    let startIndex = 0;

    while (startIndex < buffer.length) {
        // Localiza o início da próxima parte
        const partStartIndex = buffer.indexOf(boundaryBuffer, startIndex);
        if (partStartIndex === -1 || partStartIndex + boundaryBuffer.length >= buffer.length) break;

        // Localiza o fim desta parte
        const partEndIndex = buffer.indexOf(boundaryBuffer, partStartIndex + boundaryBuffer.length);
        if (partEndIndex === -1) break;

        const part = buffer.slice(partStartIndex + boundaryBuffer.length, partEndIndex);

        // Extraia os cabeçalhos e o conteúdo
        const headerEndIndex = part.indexOf('\r\n\r\n');
        if (headerEndIndex === -1) continue;

        const headers = part.slice(0, headerEndIndex).toString('utf-8');
        const body = part.slice(headerEndIndex + 4);

        const nameMatch = headers.match(/name="([^"]+)"/);
        const filenameMatch = headers.match(/filename="([^"]+)"/);
        const contentTypeMatch = headers.match(/Content-Type: ([^;]+)/);

        if (nameMatch) {
            const name = nameMatch[1];

            if (filenameMatch) {
                const filename = filenameMatch[1];
                const content = body;

                // Salva o arquivo com o conteúdo binário real da imagem
                formData.imageFile = { filename, content };
            } else {
                const value = body.toString('utf-8').trim();
                formData.fields[name] = value;
            }
        }

        startIndex = partEndIndex;
    }
}

