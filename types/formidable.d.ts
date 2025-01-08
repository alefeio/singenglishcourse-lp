// types/formidable.d.ts

declare module 'formidable' {
    // Aqui você pode colocar declarações mínimas pra satisfazer o TS
    // ou copiar de repositórios de terceiros.
    // Exemplo simplificado:
  
    interface Fields {
      [key: string]: any
    }
  
    interface Files {
      [key: string]: {
        filepath: string
        originalFilename?: string
        mimetype?: string
        size?: number
        // etc...
      }
    }
  
    interface FormidableOptions {
      multiples?: boolean
      uploadDir?: string
      keepExtensions?: boolean
    }
  
    export default class Formidable {
      constructor(options?: FormidableOptions)
      parse(req: any, callback: (err: any, fields: Fields, files: Files) => void): void
    }
  }
  