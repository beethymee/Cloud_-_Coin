import React from 'react';
import { X, Check, Palette, Sparkles, Sun, Moon, Clock, User, Compass } from 'lucide-react';
import { THEMES, ThemeId, UserPreferences } from '../types/theme';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#0E1614] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ backgroundColor: 'var(--theme-surface-solid, #0E1614)' }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Theme & Appearance</h3>
              <p className="text-xs text-slate-400">Personalize your welcoming atmosphere & visuals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* User Display Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Welcoming Recipient Name</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={preferences.userName}
                onChange={(e) => onUpdatePreferences({ userName: e.target.value })}
                placeholder="Enter your name (e.g., Catherine)"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-medium">
                Shown on Welcome Hero
              </span>
            </div>
          </div>

          {/* Theme Selection Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Choose Atmospheric Theme</span>
              </label>
              <span className="text-[11px] text-emerald-400 font-medium">
                {THEMES.find((t) => t.id === preferences.theme)?.name}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {THEMES.map((th) => {
                const isSelected = preferences.theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => onUpdatePreferences({ theme: th.id })}
                    className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/40'
                        : 'border-white/10 hover:border-white/20 bg-black/25 hover:bg-black/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Swatch Circle Trio */}
                      <div className="flex -space-x-2 shrink-0">
                        <div
                          className="w-7 h-7 rounded-full border border-black/40 shadow-sm"
                          style={{ backgroundColor: th.previewColors.bg }}
                        />
                        <div
                          className="w-7 h-7 rounded-full border border-black/40 shadow-sm"
                          style={{ backgroundColor: th.previewColors.surface }}
                        />
                        <div
                          className="w-7 h-7 rounded-full border border-black/40 shadow-sm flex items-center justify-center text-[10px] font-bold text-black"
                          style={{ backgroundColor: th.previewColors.accent }}
                        >
                          ✦
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{th.name}</span>
                          {th.id === 'forest' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                              Original Aesthetic
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{th.tagline}</p>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                          : 'border-white/20 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Preferences */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Time & Scenery Animation</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* 12h vs 24h */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Time Clock</div>
                  <div className="text-[11px] text-slate-400">12-hour AM/PM</div>
                </div>
                <button
                  onClick={() =>
                    onUpdatePreferences({
                      timeFormat: preferences.timeFormat === '12h' ? '24h' : '12h',
                    })
                  }
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition cursor-pointer"
                >
                  {preferences.timeFormat.toUpperCase()}
                </button>
              </div>

              {/* Scenery Dynamics */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Scenery Motion</div>
                  <div className="text-[11px] text-slate-400">Soaring birds & sun pulse</div>
                </div>
                <button
                  onClick={() =>
                    onUpdatePreferences({
                      showSceneryAnimation: !preferences.showSceneryAnimation,
                    })
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    preferences.showSceneryAnimation
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {preferences.showSceneryAnimation ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/20 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Settings automatically stored locally
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
};
