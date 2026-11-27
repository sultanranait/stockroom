export const controlClass =
  'block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-xs placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none aria-[invalid=true]:border-red-500';

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

// Label and error message around a control; the control should set
// aria-describedby={`${id}-error`} when there is an error
export default function Field({ id, label, error, children }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
