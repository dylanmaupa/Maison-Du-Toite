import Footer from '../components/Footer';

const sections = [
    {
        title: 'Delivery Areas',
        body: `We deliver to selected areas in Johannesburg and surroundings. Delivery zones and fees are calculated at checkout based on your address. Free delivery may apply above a certain order threshold — check your zone at checkout.`,
    },
    {
        title: 'Delivery Times',
        body: `Orders are delivered between 8am and 2pm, Monday to Saturday, subject to slot availability. You will receive a WhatsApp confirmation once your order is confirmed and again when it is out for delivery.`,
    },
    {
        title: 'Pickup',
        body: `Self-collection is available at our bakery during operating hours (Mon–Sat, 7am–12pm or until sold out). Once your order is ready, you will receive a WhatsApp notification.`,
    },
    {
        title: 'Lead Times',
        body: `Some products require advance notice (e.g. 24–48 hours). These requirements are displayed on product pages and will be validated at checkout. Orders placed without sufficient notice will not be accepted for those items.`,
    },
    {
        title: 'Returns & Refunds',
        body: `Due to the perishable nature of baked goods, we do not accept returns. If there is a quality issue with your order, please contact us within 2 hours of receiving your delivery with a photo, and we will make it right.`,
    },
    {
        title: 'Cancellations',
        body: `Orders may be cancelled within 1 hour of placement for a full refund. After this window, cancellations are at our discretion. Cash on Delivery orders confirmed via WhatsApp are considered binding.`,
    },
];

export default function DeliveryReturnsPage() {
    return (
        <main>
            <div className="page-header">
                <p className="page-header__pre">Helpful Information</p>
                <h1 className="page-header__title">Delivery & Returns</h1>
            </div>

            <section className="section container" style={{ maxWidth: 780, marginTop: 'var(--space-xl)' }}>
                {sections.map((s, i) => (
                    <div key={i} style={{ marginBottom: 'var(--space-lg)', paddingBottom: 'var(--space-lg)', borderBottom: i < sections.length - 1 ? '1px solid var(--color-grey-mid)' : 'none' }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>{s.title}</h2>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>{s.body}</p>
                    </div>
                ))}
            </section>

            <Footer />
        </main>
    );
}
