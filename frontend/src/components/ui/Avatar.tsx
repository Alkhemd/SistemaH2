import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
    src?: string | null;
    alt?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    fallback?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = 'Avatar',
    size = 'md',
    className = '',
    fallback
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-24 h-24 text-3xl',
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <div
            className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 shrink-0 ${sizeClasses[size]} ${className}`}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            ) : fallback ? (
                <span className="font-medium text-gray-600 dark:text-gray-300">
                    {getInitials(fallback)}
                </span>
            ) : (
                <User className="w-1/2 h-1/2 text-gray-400" />
            )}
        </div>
    );
};
