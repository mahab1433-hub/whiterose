import { getProducts } from '@/lib/supabase';

export default async function sitemap() {
    const products = await getProducts();

    const productUrls = products.map((product) => ({
        url: `https://www.whiterosekeysoulcosmatics.com/products/${product.slug}`,
        lastModified: new Date(),
    }));

    return [
        {
            url: 'https://www.whiterosekeysoulcosmatics.com',
            lastModified: new Date(),
        },
        {
            url: 'https://www.whiterosekeysoulcosmatics.com/shop',
            lastModified: new Date(),
        },
        {
            url: 'https://www.whiterosekeysoulcosmatics.com/blog',
            lastModified: new Date(),
        },
        ...productUrls,
    ];
}