import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Resend } from 'resend';

// 🔧 Desativa o bodyParser para evitar problemas com form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Configuração da API de e-mail (Resend)
const resend = new Resend(process.env.RESEND_API_KEY); // Defina a variável no .env.local

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nenhum dado recebido' }, { status: 400 });
    }

    console.log('📩 Recebendo dados do formulário:', data);

    // Salvando no Firestore
    const docRef = await addDoc(collection(db, 'contactForm'), data);
    console.log('✅ Dados salvos no Firestore:', docRef.id);

    // 🔹 Montando o conteúdo do e-mail dinamicamente
    const emailContent = `
      <h2>${data.formTitle}</h2>
      <ul>
        ${Object.entries(data.formData)
          .map(([key, value]) => `<li><strong>${key.replace(/-/g, ' ')}:</strong> ${value || 'Não informado'}</li>`)
          .join('')}
      </ul>
    `;

    // Enviando e-mail de notificação
    const emailResponse = await resend.emails.send({
      from: 'singenglishcourse <onboarding@resend.dev>',
      to: 'alefeio@gmail.com',
      subject: '📩 Nova Matrícula Efetuada',
      html: emailContent,
    });

    console.log('✅ E-mail enviado com sucesso:', emailResponse);

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('❌ Erro ao processar o formulário:', error);
    return NextResponse.json({ error: 'Erro ao processar o formulário' }, { status: 500 });
  }
}

/**
 * 📌 GET - Lista todos os formulários da coleção `contactForm`
 */
export async function GET() {
  try {
    console.log('📥 Buscando formulários salvos...');
    
    const snapshot = await getDocs(collection(db, 'contactForm'));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ ${data.length} formulários encontrados.`);
    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error('❌ Erro ao buscar formulários:', err);
    return NextResponse.json({ error: 'Erro ao buscar formulários' }, { status: 500 });
  }
}
