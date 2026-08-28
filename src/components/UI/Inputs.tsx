import React from "react";

export const InputField = ({
  label,
  error,
  helperText,
  disabled = false,
  ...props
}: {
  label: string;
  error?: string;
  helperText?: string;
  name?: string;
  type?: string;
  value?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>

    <input
      {...props}
      disabled={disabled}
      className={`w-full rounded-lg border px-3 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${error ? "border-red-500" : "border-gray-300"}
        ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
      `}
    />

    {helperText && (
      <p className="text-xs text-blue-600/90 font-medium flex items-center gap-1 mt-1 bg-blue-50/60 px-2.5 py-1 rounded-md border border-blue-100/80">
        <span className="text-blue-600 font-semibold">📍 Reflected on:</span> {helperText}
      </p>
    )}

    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export const TextareaField = ({
  label,
  error,
  helperText,
  disabled = false,
  ...props
}: {
  label: string;
  error?: string;
  helperText?: string;
  name?: string;
  value?: string;
  rows?: number;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>

    <textarea
      {...props}
      disabled={disabled}
      className={`w-full rounded-lg border px-3 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${error ? "border-red-500" : "border-gray-300"}
        ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
      `}
    />

    {helperText && (
      <p className="text-xs text-blue-600/90 font-medium flex items-center gap-1 mt-1 bg-blue-50/60 px-2.5 py-1 rounded-md border border-blue-100/80">
        <span className="text-blue-600 font-semibold">📍 Reflected on:</span> {helperText}
      </p>
    )}

    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export const FileField = ({
  label,
  error,
  helperText,
  preview,
  onChange,
}: {
  label: string;
  error?: string;
  helperText?: string;
  preview?: string | null;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>

    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="block w-full text-sm
        file:mr-4 file:rounded-md file:border-0
        file:bg-blue-600 file:px-4 file:py-2
        file:text-white hover:file:bg-blue-700"
    />
    {preview && (
      <div className="flex items-center gap-4">
        <img
          src={preview}
          alt="Logo preview"
          className="h-16 w-16 rounded-lg border object-contain bg-gray-50"
        />
        <span className="text-xs text-gray-500">Preview</span>
      </div>
    )}

    {helperText && (
      <p className="text-xs text-blue-600/90 font-medium flex items-center gap-1 mt-1 bg-blue-50/60 px-2.5 py-1 rounded-md border border-blue-100/80">
        <span className="text-blue-600 font-semibold">📍 Reflected on:</span> {helperText}
      </p>
    )}

    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);



interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  name?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  options: SelectOption[];
  error?: string;
  disabled?: boolean;
}

export const SelectField = ({
  label,
  options,
  error,
  disabled = false,
  ...props
}: SelectFieldProps) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        {...props}
        disabled={disabled}
        className={`
          w-full rounded-lg border px-3 py-2 text-sm
          bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? "border-red-500" : "border-gray-300"}
          ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
        `}
      >
        <option value="">Select {label}</option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
