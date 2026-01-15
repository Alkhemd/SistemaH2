'use client';

import React from 'react';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface ActionCardProps {
    onClick: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    showActions?: boolean;
    children: React.ReactNode;
    className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
    onClick,
    onEdit,
    onDelete,
    showActions = true,
    children,
    className = ''
}) => {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{
                scale: 1.03,
                y: -6,
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 17
                }
            }}
            whileTap={{ scale: 0.98 }}
            className={`
        card group cursor-pointer relative overflow-visible
        ${className}
      `}
        >
            {/* Ícono de ojo - neutral, bien visible */}
            <div className="absolute top-4 right-4 z-10">
                <div className="p-2 neuro-convex-sm rounded-xl transition-all duration-300 group-hover:shadow-md">
                    <EyeIcon className="w-5 h-5 text-[#4A5568] transition-all duration-300 group-hover:text-[#2D3748] group-hover:scale-110" />
                </div>
            </div>

            {/* Contenido de la tarjeta */}
            <div className="pr-12">
                {children}
            </div>

            {/* Botones de acción que aparecen al hover */}
            {showActions && (onEdit || onDelete) && (
                <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    {onEdit && (
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2.5 neuro-convex-sm rounded-xl hover:shadow-md transition-all duration-200"
                            title="Editar"
                        >
                            <PencilIcon className="w-4 h-4 text-[#4A5568]" />
                        </motion.button>
                    )}
                    {onDelete && (
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2.5 neuro-convex-sm rounded-xl hover:shadow-md transition-all duration-200"
                            title="Eliminar"
                        >
                            <TrashIcon className="w-4 h-4 text-[#E53E3E]" />
                        </motion.button>
                    )}
                </div>
            )}
        </motion.div>
    );
};
