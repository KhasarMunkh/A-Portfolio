import { FaPalette } from "react-icons/fa";
import { PiPaletteBold } from "react-icons/pi";

// --- Palettes ---
export const paletteNames = ['latte', 'frappe', 'macchiato', 'mocha'] as const;
export type PaletteName = (typeof paletteNames)[number];

export default function ThemePicker() {

  const isSelected = false; // Placeholder for selected state logic

  return (
    <div className="border-surface0 bg-base rounded-xl border p-4 shadow-lg sm:col-span-2 xl:col-span-1">
      <h3 className="text-text mb-4 flex items-center gap-2">
        <PiPaletteBold className="text-accent size-4"/>
        Theme
      </h3>
      <div className="ring-surface0 relative flex flex-wrap items-center justify-center gap-1 rounded-md p-1 ring-1 md:justify-start">
        {paletteNames.map((name) => (
          <button key={name} className={`flex-1 cursor-pointer rounded-[5px] px-2 py-1 text-center text-xs font-medium transition-all duration-300 ${isSelected ? 'bg-base text-text ring-accent/70 shadow-sm ring-1 ring-inset' : 'text-subtext1 hover:text-subtext0'}`}>{name.charAt(0).toUpperCase() + name.slice(1)}</button>
        ))}
      </div>
    </div>
  );
}




// prettier-ignore {
{/* <h3 class="text-text mb-4 flex items-center gap-2 text-sm font-semibold"> */}
{/* 	<IconPalette size={16} class="text-accent" /> */}
{/* 	Theme */}
{/* </h3> */}
{/* <div */}
{/* 	class="ring-surface0 relative mb-4 flex flex-wrap items-center justify-center gap-1 rounded-md p-1 ring-1 md:justify-start" */}
{/* > */}
{/* 	{#each paletteNames as name, i} */}
{/* 		{@const isSelected = $Palette === name} */}
{/* 		<button */}
{/* 			onclick={() => ($Palette = name)} */}
{/* 			class={`flex-1 cursor-pointer rounded-[5px] px-2 py-1 text-center text-xs font-medium transition-all duration-300 ${isSelected ? 'bg-base text-text ring-accent/70 shadow-sm ring-1 ring-inset' : 'text-subtext1 hover:text-subtext0'}`} */}
{/* 		> */}
{/* 			{name.charAt(0).toUpperCase() + name.slice(1)} */}
{/* 		</button> */}
{/* 	{/each} */}
{/* </div> */}
// }
//
