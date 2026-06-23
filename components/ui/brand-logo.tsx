import { cn } from '@/lib/utils'

interface BrandLogoProps {
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showTagline?: boolean
}

const NAME_SIZES  = { sm: '15px', md: '20px', lg: '27px', xl: '36px' }
const TAG_SIZES   = { sm: '5px',  md: '6.5px', lg: '8px', xl: '10px' }
const BS_SIZES    = { sm: '40px', md: '56px',  lg: '74px', xl: '98px' }
const TAG_SPACING = { sm: '0.40em', md: '0.48em', lg: '0.52em', xl: '0.55em' }

export function BrandLogo({
  variant = 'dark',
  size = 'md',
  className,
  showTagline = true,
}: BrandLogoProps) {
  const textColor   = variant === 'dark' ? '#111111' : '#FFFFFF'
  const accentColor = '#C7A98B'
  const bsOpacity   = variant === 'dark' ? 0.055 : 0.09

  return (
    <div className={cn('relative inline-flex flex-col items-center leading-none select-none', className)}>
      {/* Large BS lettermarks — background watermark, same as brand logo */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 font-display font-light"
        style={{
          fontSize: BS_SIZES[size],
          color: textColor,
          opacity: bsOpacity,
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        BS
      </span>

      {/* Primary brand name — Cormorant italic script */}
      <span
        className="relative font-display font-light italic"
        style={{ fontSize: NAME_SIZES[size], color: textColor, letterSpacing: '0.03em' }}
      >
        <span
          style={{ color: accentColor, fontStyle: 'normal', fontFamily: 'serif', fontSize: '0.78em', opacity: 0.9 }}
        >
          {' '}—{' '}
        </span>
        Besma Sevdam
        <span
          style={{ color: accentColor, fontStyle: 'normal', fontFamily: 'serif', fontSize: '0.78em', opacity: 0.9 }}
        >
          {' '}—{' '}
        </span>
      </span>

      {/* BEAUTY tagline */}
      {showTagline && (
        <span
          className="relative text-center font-sans font-light uppercase"
          style={{
            fontSize: TAG_SIZES[size],
            color: accentColor,
            letterSpacing: TAG_SPACING[size],
            marginTop: '4px',
          }}
        >
          Beauty
        </span>
      )}
    </div>
  )
}
