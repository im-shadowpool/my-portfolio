"use client";

import { useEffect, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { onSoundChange, setSoundOn, sound, soundOn } from "@/lib/sound";

/** Mutes or unmutes the site's sound effects; the choice is remembered. */
export default function SoundToggle() {
  // Unknown until mounted, since the preference lives in the browser.
  const [on, setOn] = useState<boolean | null>(null);

  useEffect(() => {
    setOn(soundOn());
    return onSoundChange(setOn);
  }, []);

  const label = on === false ? "Turn sound on" : "Mute sound";

  return (
    <button
      type="button"
      onClick={() => {
        const next = !soundOn();
        setSoundOn(next);
        if (next) sound.tick();
      }}
      aria-label={label}
      aria-pressed={on === false}
      title={`${label} (M)`}
      aria-keyshortcuts="m"
      className="flex h-6 w-6 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-ink/[0.06] hover:text-ink active:scale-95"
    >
      {on === false ? (
        <FiVolumeX className="h-[0.8rem] w-[0.8rem]" aria-hidden="true" />
      ) : (
        <FiVolume2 className="h-[0.8rem] w-[0.8rem]" aria-hidden="true" />
      )}
    </button>
  );
}
