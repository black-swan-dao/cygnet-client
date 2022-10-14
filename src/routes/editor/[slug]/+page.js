import { error } from '@sveltejs/kit';

export const load = async ({ params, fetch }) => {
  const res = await fetch(`/editor/${params.slug}.json`)
  if (res.ok) {
    const proposal = await res.json()
    return { proposal }
  }
  const { message } = await res.json()
  throw error(500, message);
}
