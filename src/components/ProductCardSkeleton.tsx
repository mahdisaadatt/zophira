export default function ProductCardSkeleton() {
  return (
    <div className="h-full animate-pulse">
      <div className="relative w-full h-full flex flex-col gradient-border backdrop-blur-xl bg-background/30 overflow-hidden rounded-xl animate-pulse">
        <div className="p-6">
          <div className="w-full h-64 mb-4 bg-muted rounded-lg" />
          <div className="h-6 w-3/4 bg-muted rounded mb-3" />
          <div className="h-4 w-1/2 bg-muted rounded mb-6" />
          <div className="h-5 w-2/3 bg-muted rounded mb-4" />
          <div className="h-10 w-full bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
