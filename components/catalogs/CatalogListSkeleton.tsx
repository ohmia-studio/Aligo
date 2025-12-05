export default function CatalogListSkeleton() {
  return (
    <div className="bg-container-foreground shadow-shadow-color rounded-lg p-6 shadow-md">
      <h2 className="text-foreground mb-4 text-xl font-semibold">
        Subidos (Cargando...)
      </h2>
      <div className="mb-4">
        <div className="bg-foreground/70 h-7 w-48 animate-pulse rounded"></div>
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border-foreground/70 flex items-center justify-between rounded-lg border p-3"
          >
            <div className="min-w-0 flex-1">
              <div className="bg-foreground/70 mb-2 h-4 w-3/4 animate-pulse rounded"></div>
              <div className="bg-foreground/70 h-3 w-1/2 animate-pulse rounded"></div>
            </div>

            <div className="ml-4 flex items-center space-x-2">
              <div className="bg-foreground/70 h-5 w-5 animate-pulse rounded"></div>
              <div className="bg-foreground/70 h-5 w-5 animate-pulse rounded"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="bg-foreground/70 h-4 w-24 animate-pulse rounded"></div>
      </div>
    </div>
  );
}
