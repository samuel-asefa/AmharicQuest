import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'jade' | 'gold' | 'berbere' | 'lapis' | 'plum' | 'outline' | 'ghost' | 'white' | 'glass';
type Size = 'sm' | 'md' | 'lg' | 'icon';

export function buttonClass({
    variant = 'jade',
    size = 'md',
    block,
    className,
}: { variant?: Variant; size?: Size; block?: boolean; className?: string } = {}) {
    return cn(
        'btn',
        `btn-${variant}`,
        size === 'sm' && 'btn-sm',
        size === 'lg' && 'btn-lg',
        size === 'icon' && 'btn-icon',
        block && 'w-full',
        className,
    );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    block?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, block, type = 'button', ...props }, ref) => (
        <button ref={ref} type={type} className={buttonClass({ variant, size, block, className })} {...props} />
    ),
);
Button.displayName = 'Button';

export interface ButtonLinkProps extends React.ComponentProps<typeof Link> {
    variant?: Variant;
    size?: Size;
    block?: boolean;
}

export function ButtonLink({ className, variant, size, block, ...props }: ButtonLinkProps) {
    return <Link className={buttonClass({ variant, size, block, className })} {...props} />;
}
