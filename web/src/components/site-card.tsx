import Link from "next/link";

export function SiteCard({
  title,
  description,
  href,
  hrefLabel = "Ver mais →",
  meta,
  search,
}: {
  title: string;
  description: string;
  href?: string;
  hrefLabel?: string;
  meta?: string;
  search?: string;
}) {
  return (
    <article className="card" data-search={search}>
      <div className="card-img" />
      <div className="card-body">
        {meta ? <div className="meta">{meta}</div> : null}
        <h3>{title}</h3>
        <p>{description}</p>
        {href ? (
          <Link className="btn" href={href}>
            {hrefLabel}
          </Link>
        ) : (
          <span className="btn">{hrefLabel}</span>
        )}
      </div>
    </article>
  );
}
