"use client";

import { Slider } from "@/components/ui/slider";

interface ServingConverterProps {
  originalServings: number;
  targetServings: number;
  onServingsChange: (servings: number) => void;
}

export function ServingConverter({
  originalServings,
  targetServings,
  onServingsChange,
}: ServingConverterProps) {
  const maxServings = Math.max(originalServings * 4, 12);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-stone-500 whitespace-nowrap dark:text-stone-400">
        Servings
      </span>
      <Slider
        value={[targetServings]}
        onValueChange={([v]) => onServingsChange(v)}
        min={1}
        max={maxServings}
        step={1}
        className="w-32"
      />
      <span className="text-sm font-semibold text-orange-600 whitespace-nowrap dark:text-orange-400">
        {targetServings} servings
      </span>
    </div>
  );
}
