'use server'

import { Building, Category, createBuilding } from '@/lib/microcms'

export async function createBuildingAction(formData: FormData) {
  // Category オブジェクトの作成
  const category: Category = {
    id: formData.get('categoryId') as string, // カテゴリーのIDを取得
    name: formData.get('categoryName') as string, // カテゴリーの名前を取得
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    revisedAt: new Date().toISOString()
  }

  const building: Omit<Building, "id" | "createdAt" | "updatedAt" | "publishedAt" | "revisedAt"> = {
    name: formData.get('name') as string,
    architect: formData.get('architect') as string,
    address: formData.get('address') as string,
    completionYear: parseInt(formData.get('completionYear') as string),
    structure: formData.get('structure') as string,
    usage: formData.get('usage') as string,
    category: category, // Category オブジェクトを設定
    description: formData.get('description') as string,
    latitude: parseFloat(formData.get('latitude') as string) || 0,
    longitude: parseFloat(formData.get('longitude') as string) || 0,
    photo: {
      url: formData.get('photoUrl') as string || '',
      height: parseInt(formData.get('photoHeight') as string) || 0,
      width: parseInt(formData.get('photoWidth') as string) || 0
    }
  }

  try {
    await createBuilding(building)
    return { success: true, message: '建築物情報が正常に登録されました。' }
  } catch (error) {
    console.error('Error creating building:', error)
    return { success: false, message: '建築物情報の登録に失敗しました。' }
  }
}
