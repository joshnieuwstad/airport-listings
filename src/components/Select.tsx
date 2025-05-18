'use client'

interface Option {
  value: string;
  label: string;
  key: string | number;
}

interface SelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  options: Option[];
  placeholder?: string,
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Select({
  id,
  label,
  name,
  options,
  value,
  required,
  placeholder,
  onChange,
}: SelectProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium pb-2">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-black-300 focus:border"
        required={required ?? false}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.key} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}