import { Link } from 'react-router-dom';

export default function Button({
  as = 'button',
  to,
  href,
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const base =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'ghost'
        ? 'btn-ghost'
        : 'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-400/40';

  const classes = `${base} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
