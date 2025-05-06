import { FilterOptions } from "../../types/Graph";

interface FilterPanelProps {
  labels: string[];
  visibleSources: string[];
  onToggleSource: (source: string, enabled: boolean) => void;
  filterOptions: FilterOptions;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  labels,
  visibleSources,
  onToggleSource,
  filterOptions,
}) => {
  return (
    <>
      {filterOptions.showPlatforms ? (
        <div className="flex gap-2">
          {labels.map((label) => (
            <label
              key={label}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                className="checkbox checkbox-accent"
                checked={visibleSources.includes(label)}
                onChange={(e) => onToggleSource(label, e.target.checked)}
              />
              <span className="capitalize">{label}</span>
            </label>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default FilterPanel;
