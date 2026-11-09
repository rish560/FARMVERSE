export const LoadingState = ({ label = 'Loading data...' }) => (
  <div className="flex min-h-48 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  </div>
);
