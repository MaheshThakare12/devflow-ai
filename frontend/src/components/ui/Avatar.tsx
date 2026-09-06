import { getInitials, generateAvatarColor, cn } from '@/lib/utils';
import Image from 'next/image';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-24 h-24 text-2xl',
  };

  const bgColor = generateAvatarColor(name);

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full overflow-hidden shrink-0 border-2 border-background font-semibold text-white shadow-sm',
        sizes[size],
        className
      )}
      style={{ backgroundColor: !src ? bgColor : undefined }}
      title={name}
    >
      {src ? (
        <Image src={src} alt={name} fill className="object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}
