import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params; // Extrai o ID da URL
      const body = await req.json();
      const { bannerHeight, pageWidth } = body;
  
      if (!id) {
        return NextResponse.json(
          { error: 'ID do documento é obrigatório para atualização' },
          { status: 400 }
        );
      }
  
      if (!bannerHeight && !pageWidth) {
        return NextResponse.json(
          { error: 'Nenhuma propriedade fornecida para atualização' },
          { status: 400 }
        );
      }
  
      const configRef = doc(db, 'configuracoes', id);
      const configSnap = await getDoc(configRef);
  
      if (!configSnap.exists()) {
        return NextResponse.json(
          { error: 'Configuração não encontrada para atualizar' },
          { status: 404 }
        );
      }
  
      const updateData: Record<string, any> = {};
      if (bannerHeight) updateData.bannerHeight = bannerHeight;
      if (pageWidth) updateData.pageWidth = pageWidth;
  
      await updateDoc(configRef, updateData);
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar configurações' },
        { status: 500 }
      );
    }
  }
  