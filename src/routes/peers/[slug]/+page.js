import { error } from '@sveltejs/kit';

export const load = async ({ params, fetch }) => {
  const res = await fetch(`/peers/${params.slug}.json`)
  if (res.ok) {
    const item = await res.json()
    return { item }
  }
  const { message } = await res.json()
  throw error(500, message);
}
