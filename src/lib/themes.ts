export interface ThemePreset {
  id: string
  name: string
  primary: string
  secondary: string
  background: string
  surface: string
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'neon-pink-blue',
    name: 'Neon Pink/Blue',
    primary: '#FF69B4',
    secondary: '#89CFF0',
    background: '#141414',
    surface: '#0A0A0A',
  },
  {
    id: 'cyberpunk-yellow-purple',
    name: 'Cyberpunk Yellow/Purple',
    primary: '#FACC15',
    secondary: '#A855F7',
    background: '#0F0F1A',
    surface: '#070710',
  },
  {
    id: 'hacker-green',
    name: 'Hacker Green/Black',
    primary: '#22C55E',
    secondary: '#10B981',
    background: '#0A0F0A',
    surface: '#050805',
  },
  {
    id: 'minimalist-mono',
    name: 'Minimalist Mono',
    primary: '#A0A0A0',
    secondary: '#D4D4D4',
    background: '#1A1A1A',
    surface: '#111111',
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    primary: '#F97316',
    secondary: '#FB923C',
    background: '#1A0F0A',
    surface: '#0F0805',
  },
]

export function applyTheme(presetId: string) {
  const preset = THEME_PRESETS.find(p => p.id === presetId) || THEME_PRESETS[0]
  const root = document.documentElement.style

  root.setProperty('--neon-primary', preset.primary)
  root.setProperty('--neon-secondary', preset.secondary)
  root.setProperty('--app-bg', preset.background)
  root.setProperty('--app-surface', preset.surface)

  // Also update the Tailwind/shadcn CSS vars that reference these
  root.setProperty('--primary', preset.primary)
  root.setProperty('--ring', preset.primary)
  root.setProperty('--chart-1', preset.primary)
  root.setProperty('--chart-2', preset.secondary)
  root.setProperty('--background', preset.background)
  root.setProperty('--card', preset.surface)
  root.setProperty('--popover', preset.surface)
  root.setProperty('--sidebar', preset.surface)
  root.setProperty('--sidebar-primary', preset.primary)
  root.setProperty('--sidebar-ring', preset.primary)
  root.setProperty('--scrollbar-thumb', preset.primary)
}

export function setGlow(enabled: boolean) {
  if (enabled) {
    document.documentElement.classList.remove('no-glow')
  } else {
    document.documentElement.classList.add('no-glow')
  }
}
