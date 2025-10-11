'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Filter } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface EquipmentFiltersProps {
  modalidades: FilterOption[];
  estados: FilterOption[];
  fabricantes: FilterOption[];
  selectedFilters: {
    modalidades: string[];
    estados: string[];
    fabricantes: string[];
  };
  onFilterChange: (filterType: string, values: string[]) => void;
  onClearAll: () => void;
}

const EquipmentFilters = ({
  modalidades,
  estados,
  fabricantes,
  selectedFilters,
  onFilterChange,
  onClearAll
}: EquipmentFiltersProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const FilterDropdown = ({ 
    title, 
    options, 
    selectedValues, 
    filterKey 
  }: {
    title: string;
    options: FilterOption[];
    selectedValues: string[];
    filterKey: string;
  }) => {
    const isOpen = openDropdown === filterKey;
    const hasSelected = selectedValues.length > 0;

    const toggleOption = (value: string) => {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onFilterChange(filterKey, newValues);
    };

    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : filterKey)}
          className={`
            flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-200
            ${hasSelected 
              ? 'border-[#0071E3] bg-blue-50 text-[#0071E3]' 
              : 'border-gray-200 bg-white text-[#6E6E73] hover:border-gray-300'
            }
            min-w-[140px]
          `}
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium">{title}</span>
            {hasSelected && (
              <span className="bg-[#0071E3] text-white text-xs px-2 py-0.5 rounded-full">
                {selectedValues.length}
              </span>
            )}
          </div>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto"
            >
              <div className="p-2">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200
                      ${selectedValues.includes(option.value)
                        ? 'bg-blue-50 text-[#0071E3]'
                        : 'hover:bg-gray-50 text-[#6E6E73]'
                      }
                    `}
                  >
                    <span className="font-medium">{option.label}</span>
                    {option.count && (
                      <span className="text-xs text-[#86868B]">
                        {option.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const totalSelected = Object.values(selectedFilters).flat().length;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-[#6E6E73]" />
          <h3 className="font-semibold text-[#1D1D1F]">Filtros</h3>
          {totalSelected > 0 && (
            <span className="bg-[#0071E3] text-white text-xs px-2 py-1 rounded-full">
              {totalSelected}
            </span>
          )}
        </div>
        
        {totalSelected > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center space-x-1 text-[#6E6E73] hover:text-[#FF3B30] transition-colors duration-200"
          >
            <X size={16} />
            <span className="text-sm font-medium">Limpiar</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <FilterDropdown
          title="Modalidad"
          options={modalidades}
          selectedValues={selectedFilters.modalidades}
          filterKey="modalidades"
        />
        
        <FilterDropdown
          title="Estado"
          options={estados}
          selectedValues={selectedFilters.estados}
          filterKey="estados"
        />
        
        <FilterDropdown
          title="Fabricante"
          options={fabricantes}
          selectedValues={selectedFilters.fabricantes}
          filterKey="fabricantes"
        />
      </div>

      {/* Selected Filters Display */}
      {totalSelected > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-gray-100"
        >
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([filterType, values]) =>
              values.map((value) => (
                <motion.div
                  key={`${filterType}-${value}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-1 bg-blue-50 text-[#0071E3] px-3 py-1 rounded-full text-sm"
                >
                  <span>{value}</span>
                  <button
                    onClick={() => {
                      const newValues = selectedFilters[filterType as keyof typeof selectedFilters]
                        .filter(v => v !== value);
                      onFilterChange(filterType, newValues);
                    }}
                    className="hover:bg-blue-100 rounded-full p-0.5 transition-colors duration-200"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* Click outside to close dropdowns */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
};

export default EquipmentFilters;
