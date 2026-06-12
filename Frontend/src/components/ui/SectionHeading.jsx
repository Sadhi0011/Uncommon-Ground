import Reveal from './Reveal';
import { cn } from '../../utils/format';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false,
  className = '',
}) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  return (
    <Reveal className={cn('flex flex-col gap-4', alignment, className)}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {title && (
        <h2
          className={cn(
            'display-hero text-4xl sm:text-5xl lg:text-6xl',
            light ? 'text-onink' : 'text-sand'
          )}
        >
          {title}
        </h2>
      )}
      {description && (
        <p
          className={cn(
            'max-w-2xl text-base leading-relaxed sm:text-lg',
            light ? 'text-ink-700/80' : 'text-haze',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
