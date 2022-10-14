import { loadData } from "$lib/sanity.js"

// GET =>
export const GET = async (request) => {
    const response = await loadData("*[_type == 'user' && slug.current == $slug][0]", { slug: request.params.slug })
    return new Response(JSON.stringify(response));
};