import Dexie from 'dexie'

const DB_KEY = 'cache-requests'
export const db = new Dexie(DB_KEY)

db.version(1).stores({
  [DB_KEY]: '&key',
})

export async function getItem(key: string) {
  const array = await db.table(DB_KEY).where('key').equals(key).toArray()
  return array[0]?.data || undefined
}

export async function setItem(key: string, data: any) {
  try {
    await db.table(DB_KEY).put({
      key,
      data,
    })
  } catch (error: any) {
    console.log(error && error.name)
  }
}

const cache = {
  getItem,
  setItem,
}

export default cache
