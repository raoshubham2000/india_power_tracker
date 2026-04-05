/**
 * Fallback / fixture layout for boneyard capture. Matches chart area proportions
 * (title strip + y-axis + plot) so CLI snapshots produce useful bones.
 */
export default function ChartSkeleton() {
  return (
    <div className="chart-skeleton" aria-hidden>
      <div className="chart-skeleton-title" />
      <div className="chart-skeleton-body">
        <div className="chart-skeleton-yaxis" />
        <div className="chart-skeleton-plot">
          <div className="chart-skeleton-bars">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}
