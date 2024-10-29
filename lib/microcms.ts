import { createClient } from 'microcms-js-sdk'

export const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN || '',
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY || '',
})

export type Category = {
  id: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
  name: string
}

export type Building = {
  id: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
  name: string
  architect: string
  address: string
  completionYear: number
  structure: string
  usage: string
  category: Category
  description: string
  latitude: number
  longitude: number
  photo: {
    url: string
    height: number
    width: number
  }
}

export async function getBuildings() {
  const response = await client.get({
    endpoint: 'buildings',
  })
  return response.contents as Building[]
}

export async function createBuilding(buildingData: Omit<Building, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'revisedAt'>) {
  const response = await client.create({
    endpoint: 'buildings',
    content: buildingData,
  })
  return response as Building
}
