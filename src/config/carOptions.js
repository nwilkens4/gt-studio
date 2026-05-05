// src/config/carOptions.js

export const PAINT_OPTIONS = [
  { id: 'gt-silver',    label: 'GT Silver',      color: '#C0C0C0' },
  { id: 'shark-blue',   label: 'Shark Blue',      color: '#1B3A6B' },
  { id: 'guards-red',   label: 'Guards Red',      color: '#CC0000' },
  { id: 'racing-yellow',label: 'Racing Yellow',   color: '#F5C400' },
  { id: 'midnight',     label: 'Midnight Black',  color: '#0A0A0A' },
  { id: 'alpine-white', label: 'Alpine White',    color: '#F8F8F8' },
  { id: 'chalk',        label: 'Chalk',           color: '#D4CFC8' },
  { id: 'miami-blue',   label: 'Miami Blue',      color: '#0099CC' },
]

export const RIM_OPTIONS = [
  { id: 'stock',         label: 'Stock GT2 RS' },
  { id: 'cup2',          label: 'Cup 2 Spoke' },
  { id: 'turbo-twist',   label: 'Turbo Twist' },
  { id: 'carrera',       label: 'Carrera Classic' },
  { id: 'matte-black',   label: 'Matte Black Sport' },
  { id: 'chrome',        label: 'Chrome Sport' },
]

export const BODY_KIT_OPTIONS = [
  { id: 'stock',   label: 'Stock' },
  { id: 'street',  label: 'GT Street Pack' },
  { id: 'aero',    label: 'Aero GT Pack' },
  { id: 'track',   label: 'Track Edition' },
]

export const DECAL_OPTIONS = [
  { id: 'none',    label: 'None' },
  { id: 'stripes', label: 'Racing Stripes' },
  { id: 'gt',      label: 'GT Livery' },
  { id: 'number',  label: 'Number Plate' },
  { id: 'carbon',  label: 'Carbon Hood' },
]

export const ENVIRONMENT_OPTIONS = [
  { id: 'none',      label: 'Pure Black',    preset: null },
  { id: 'showroom',  label: 'Showroom',      preset: 'studio' },
  { id: 'mountain',  label: 'Mountain Road', preset: 'forest' },
  { id: 'track',     label: 'Race Track',    preset: 'dawn' },
  { id: 'city',      label: 'Night City',    preset: 'night' },
]

export const WEATHER_OPTIONS = [
  { id: 'clear',    label: 'Clear' },
  { id: 'golden',   label: 'Golden Hour' },
  { id: 'overcast', label: 'Overcast' },
  { id: 'rain',     label: 'Rain' },
  { id: 'sunset',   label: 'Sunset' },
]

export const CAMERA_OPTIONS = [
  { id: 'front-34',  label: 'Front 3/4',    position: [3, 1.2, 3],   target: [0, 0.5, 0] },
  { id: 'rear-34',   label: 'Rear 3/4',     position: [-3, 1.2, -3], target: [0, 0.5, 0] },
  { id: 'side',      label: 'Side Profile', position: [5, 0.8, 0],   target: [0, 0.5, 0] },
  { id: 'front',     label: 'Front On',     position: [0, 1, 4],     target: [0, 0.5, 0] },
  { id: 'rear',      label: 'Rear On',      position: [0, 1, -4],    target: [0, 0.5, 0] },
  { id: 'top',       label: 'Top Down',     position: [0, 5, 0],     target: [0, 0, 0] },
]

export const ALL_CATEGORIES = [
  { key: 'paint',       label: 'PAINT',       options: PAINT_OPTIONS },
  { key: 'rims',        label: 'RIMS',        options: RIM_OPTIONS },
  { key: 'bodyKit',     label: 'BODY KIT',    options: BODY_KIT_OPTIONS },
  { key: 'decals',      label: 'DECALS',      options: DECAL_OPTIONS },
  { key: 'environment', label: 'ENVIRONMENT', options: ENVIRONMENT_OPTIONS },
  { key: 'weather',     label: 'WEATHER',     options: WEATHER_OPTIONS },
  { key: 'camera',      label: 'CAMERA',      options: CAMERA_OPTIONS },
]
