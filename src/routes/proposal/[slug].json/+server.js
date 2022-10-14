import { loadData } from "$lib/sanity.js"

// GET =>
export const GET = async (request) => {
    const response = await loadData("*[_type == 'proposal' && slug.current == $slug]{..., authors[]->{...}, resources[]->{...}, cycle->{...}}[0]", { slug: request.params.slug })
    return new Response(JSON.stringify(response));
};