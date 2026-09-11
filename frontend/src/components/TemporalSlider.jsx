import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Play, Pause, RotateCcw } from 'lucide-react';

const TIMELINE_STOPS = [
  { date: '2026-01-15', label: 'Jan 15 (Initial Dimapur Intercepts)' },
  { date: '2026-01-31', label: 'Jan 31 (Logistics & Hawala Setup)' },
  { date: '2026-02-16', label: 'Feb 16 (Comms Surge & Port Infiltration)' },
  { date: '2026-02-28', label: 'Feb 28 (Layered Hawala Structuring)' },
  { date: '2026-03-15', label: 'Mar 15 (Burner SIMs & Patna Safehouse)' },
  { date: null, label: 'All Dates (Full Reconstructed Syndicate)' }
];

export default function TemporalSlider({ onDateRangeChange }) {
  const [currentIndex, setCurrentIndex] = useState(TIMELINE_STOPS.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const handleIndexChange = (idx) => {
    setCurrentIndex(idx);
    const selectedStop = TIMELINE_STOPS[idx];
    if (onDateRangeChange) {
      onDateRangeChange(null, selectedStop?.date);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < TIMELINE_STOPS.length - 1) {
            const nextIdx = prev + 1;
            if (onDateRangeChange) {
              onDateRangeChange(null, TIMELINE_STOPS[nextIdx]?.date);
            }
            return nextIdx;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1400);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, onDateRangeChange]);

  const handlePlayToggle = () => {
    if (!isPlaying) {
      if (currentIndex >= TIMELINE_STOPS.length - 1) {
        handleIndexChange(0);
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const progressPercent = (currentIndex / (TIMELINE_STOPS.length - 1)) * 100;

  return (
    <div className="h-14 border-t border-[var(--border-subtle)] glass-panel px-6 flex items-center justify-between z-10 shrink-0 select-none mono-font">
      {/* Controls */}
      <div className="flex items-center space-x-3 w-80 shrink-0">
        <button
          type="button"
          onClick={handlePlayToggle}
          className="p-1.5 rounded-md bg-[var(--neon-green)] hover:brightness-110 text-[var(--bg-subtle)] shadow-[0_0_12px_rgba(82,255,140,0.35)] transition-all duration-150 active:scale-95 cursor-pointer shrink-0 outline-none focus:outline-none"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        <div className="flex items-center space-x-2 text-xs overflow-hidden">
          <Calendar className="w-4 h-4 text-[var(--neon-green)] shrink-0" />
          <span className="text-[var(--text-muted)] shrink-0">Temporal Filter:</span>
          <span className="text-[var(--text-main)] font-bold truncate">
            {TIMELINE_STOPS[currentIndex]?.label}
          </span>
        </div>
      </div>

      {/* Centered Rounded Progress Bar with Stepper Circles */}
      <div className="flex-1 max-w-xl mx-6 flex items-center space-x-4">
        <div className="relative flex-1 flex items-center h-5">
          {/* Base Inset Track */}
          <div className="absolute inset-x-0 h-1.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-full overflow-hidden">
            {/* Smooth Fill Bar */}
            <div
              className="h-full bg-[var(--neon-green)] rounded-full shadow-[0_0_10px_var(--neon-green)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Stepped Circle Pips */}
          {TIMELINE_STOPS.map((stop, idx) => {
            const percentage = (idx / (TIMELINE_STOPS.length - 1)) * 100;
            const isPassed = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  handleIndexChange(idx);
                }}
                style={{ left: `${percentage}%` }}
                className={`absolute -translate-x-1/2 rounded-full transition-all duration-200 z-10 flex items-center justify-center cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none select-none ${
                  isCurrent
                    ? 'w-4 h-4 bg-[var(--neon-green)] border-2 border-[var(--bg-base)] shadow-[0_0_12px_rgba(82,255,140,0.45)] scale-110'
                    : isPassed
                    ? 'w-3.5 h-3.5 bg-[var(--neon-green)] border-2 border-[var(--bg-base)] hover:scale-125 shadow-sm shadow-[var(--neon-green)]/30'
                    : 'w-3.5 h-3.5 bg-[var(--bg-surface)] border-2 border-[var(--border-subtle)] hover:border-[var(--neon-green)] hover:scale-125'
                }`}
                title={`${stop.label} (Step ${idx + 1})`}
              >
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--bg-base)]" />
                )}
              </button>
            );
          })}

          {/* Interactive Range Input Overlay for Dragging */}
          <input
            type="range"
            min="0"
            max={TIMELINE_STOPS.length - 1}
            value={currentIndex}
            onChange={(e) => {
              setIsPlaying(false);
              handleIndexChange(parseInt(e.target.value));
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none"
          />
        </div>

        <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap glass-card px-2.5 py-1 rounded shrink-0">
          Step {currentIndex + 1}/{TIMELINE_STOPS.length}
        </span>
      </div>

      {/* Right Reset Action */}
      <div className="w-28 flex justify-end shrink-0">
        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            handleIndexChange(TIMELINE_STOPS.length - 1);
          }}
          className="text-[11px] text-[var(--text-muted)] hover:text-[var(--neon-green)] hover:border-[var(--neon-green)]/40 flex items-center space-x-1.5 glass-card px-2.5 py-1 rounded transition-all duration-150 active:scale-95 cursor-pointer outline-none focus:outline-none"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Show All</span>
        </button>
      </div>
    </div>
  );
}