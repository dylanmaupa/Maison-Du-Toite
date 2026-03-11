import { Helmet } from 'react-helmet-async';

export default function SEO({ 
    title = 'Maison du Torte | Artisanal Parisian Bakery',
    description = 'The pinnacle of artisanal baking. Every creation tells a story of exceptional craft and timeless indulgence. Order signature creations, baked fresh daily.',
    keywords = 'bakery, artisanal bakery, parisian bakery, pastries, cakes, maison du torte',
    url = 'https://maisondutorte.com'
}) {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={`${url}/bakery_hero.png`} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={`${url}/bakery_hero.png`} />
        </Helmet>
    );
}
