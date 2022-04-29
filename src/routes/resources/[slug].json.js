import { loadData } from "$lib/sanity.js"

// GET =>
export const get = async (request) => {
    console.log('request.params', request.params)
    const response = await loadData("*[_type == 'resource' && slug.current == $slug]{..., cycle->{...}}[0]", { slug: request.params.slug })
    return { body: response.status === 404 ? 'ERROR' : response };
};