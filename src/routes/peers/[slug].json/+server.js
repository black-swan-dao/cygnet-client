import { loadData } from "$lib/sanity.js"

// GET =>
export const get = async (request) => {
    const response = await loadData("*[_type == 'user' && slug.current == $slug][0]", { slug: request.params.slug })
    return { body: response.status === 404 ? 'ERROR' : response };
};