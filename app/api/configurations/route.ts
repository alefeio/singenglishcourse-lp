import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  try {
    const configRef = collection(db, 'configuracoes');
    const configQuery = query(configRef, limit(1)); // Busca o primeiro registro da coleção
    const configSnap = await getDocs(configQuery);

    if (configSnap.empty) {
      // Nenhuma configuração encontrada
      return NextResponse.json(
        { error: 'Configurações não encontradas' },
        { status: 404 }
      );
    }

    // Obtém o primeiro documento retornado
    const configData = configSnap.docs[0].data();
    const configId = configSnap.docs[0].id;

    return NextResponse.json({ id: configId, ...configData });
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