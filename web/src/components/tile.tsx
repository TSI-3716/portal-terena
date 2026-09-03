import Link from "next/link";

export function Tile({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </>
  );

  if (href) {
    return (
      <Link className="tile" href={href}>
        {content}
      </Link>
    );
  }

  return <div className="tile">{content}</div>;
}
