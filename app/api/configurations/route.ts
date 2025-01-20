import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseClient';
import { collection, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';

const CONFIG_DOC_ID = 'configurations';

export async function GET(req: NextRequest) {
  try {
    const configRef = doc(db, 'configuracoes', CONFIG_DOC_ID);
    const configSnap = await getDoc(configRef);

    if (!configSnap.exists()) {
      // Não retorna valores padrão; informe que o recurso não existe
      return NextResponse.json(
        { error: 'Configurações não encontradas' },
        { status: 404 }
      );
    }

    // Retorna os dados existentes
    return NextResponse.json(configSnap.data());
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { bannerHeight = '50vh', pageWidth = '1280px' } = body;
  
      const configsCollection = collection(db, 'configuracoes');
  
      // Usando addDoc para criar um novo documento
      const docRef = await addDoc(configsCollection, {
        bannerHeight,
        pageWidth,
      });
  
      console.log('Configuração criada com sucesso. ID:', docRef.id);
      return NextResponse.json({ success: true, id: docRef.id });
    } catch (error) {
      console.error('Erro ao criar configurações:', error);
      return NextResponse.json(
        { error: 'Erro ao criar configurações', details: error.message },
        { status: 500 }
      );
    }
  }

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { bannerHeight, pageWidth } = body;

    const configRef = doc(db, 'configuracoes', CONFIG_DOC_ID);

    await updateDoc(configRef, {
      ...(bannerHeight && { bannerHeight }),
      ...(pageWidth && { pageWidth }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json({ error: 'Erro ao atualizar configurações' }, { status: 500 });
  }
}
