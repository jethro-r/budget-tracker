import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { LucideProps } from 'lucide-react';

interface IconProps {
  name: keyof typeof Icons;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export function Icon({
  name,
  className,
  size = 'md',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: IconProps) {
  const IconComponent = Icons[name] as React.ComponentType<LucideProps>;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return (
    <IconComponent
      className={cn(sizeMap[size], className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? !ariaLabel}
    />
  );
}
