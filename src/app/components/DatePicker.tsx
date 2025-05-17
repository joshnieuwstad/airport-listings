'use client'

interface DatePickerProps {
    id: string;
    name: string;
    label: string;
    value: Date | null;
    onChange: (e: Date) => void;
}

export default function DatePicker({
    id,
    label,
    name,
    value,
    onChange
}: DatePickerProps) {
    const formatDate = (date: Date | null): string => {
        if (!date) {
            return '';
        }
        return new Date(date).toISOString().slice(0, 10);
    };

    const parseDate = (value: string): Date => {
        return new Date(value);
    };

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium pb-2">
                {label}
            </label>
            <input
                id={id}
                name={name}
                type="date"
                value={formatDate(value)}
                onChange={(e) => {
                    onChange(parseDate(e.target.value))
                }}
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-black-300 focus:border"
                required
            />
        </div>
    )
}