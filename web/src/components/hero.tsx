export function Hero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="site-container">
      <section className="hero">
        <div className="hero-fallback" />
        <div className="hero-content">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>
    </div>
  );
}
