// src/config/carOptions.js

// Per-car material registry.
// paintMaterials: exact material names that receive the paint color.
// rimMaterials:   exact material names that receive the rim metalness/roughness.
// scale/position: tune these per-model if a car loads at the wrong size or height.
export const CARS = [
  {
    id: 'gt2rs',
    label: 'Porsche 911 GT2 RS',
    file: '/models/gt2rs.glb',
    scale: 1,
    position: [0, -0.5, 0],
    paintMaterials: ['Paint', 'paint1Mtl', 'paint1Mtl.001', 'paint1Mtl.003'],
    rimMaterials:   ['Rims.FL', 'Rims.FL.001', 'Rims.FL.002', 'Rims.FL.003'],
  },
  {
    id: 'rx7-fc',
    label: "1989 Mazda RX-7 FC3S",
    file: '/models/1989_mazda_savanna_rx-7_infini_iii_fc3s.glb',
    scale: null,
    position: null,
    paintMaterials: ['FCMAT_Mazda_RX_7_Carpaint_075'],
    rimMaterials:   ['FCMAT_Tire_Hub_091'],
  },
  {
    id: 'bmw-m3-e36',
    label: '1993 BMW M3 E36',
    file: '/models/1993_bmw_m3_coupe_e36.glb',
    scale: null,
    position: null,
    paintMaterials: ['carpainbt'],
    rimMaterials:   ['rims'],
  },
  {
    id: 'rx7-fd',
    label: '1993 Mazda RX-7 FD',
    file: '/models/1993_mazda_rx-7.glb',
    scale: null,
    position: null,
    paintMaterials: ['Mazda_1Mazda_RX7TNR0_1993PaintTNR_Material1'],
    rimMaterials:   ['wheels_TNRRims_92A18NbTNR_Rim92A_Material1'],
  },
  {
    id: 'viper-gts',
    label: '1996 Dodge Viper GTS',
    file: '/models/1996_dodge_viper_gts.glb',
    scale: null,
    position: null,
    paintMaterials: ['dDodge_ViperGTS_1996Paint_Material1'],
    rimMaterials:   ['dDodge_ViperGTS_1996_Wheel1A_3D_3DWheel1A_Material1'],
  },
  {
    id: 'skyline-r33',
    label: '1997 Nissan Skyline GT-R R33',
    file: '/models/1997_nissan_skyline_gt-r_v-spec_r33.glb',
    scale: null,
    position: null,
    paintMaterials: ['r33Vehicle_Exterior_mm_ext1', 'r33Vehicle_Exterior_mm_cab1'],
    rimMaterials:   ['r33Vehicle_Exterior_mm_wheel1'],
  },
  {
    id: 'bmw-m3-e46-gtr',
    label: '2005 BMW M3 E46 GTR',
    file: '/models/2005_bmw_m3_e46_gtr_-_nfs_most_wanted.glb',
    scale: null,
    position: null,
    paintMaterials: ['mMAT_Carpaint_Blue1'],
    rimMaterials:   [],
  },
  {
    id: 'subaru-sti-2006',
    label: '2006 Subaru Impreza WRX STI',
    file: '/models/2006_subaru_impreza_wrx_sti.glb',
    scale: null,
    position: null,
    paintMaterials: ['Sub_2M_CarPaint_Max1', 'Sub_2M_CarPaintNormal_Max1'],
    rimMaterials:   ['Sub_2M_Rim_Main_Max1', 'Sub_2M_Rim_NoTint_Max1'],
  },
  {
    id: 'bmw-m3-e92',
    label: '2010 BMW M3 E92',
    file: '/models/2010_bmw_m3_e92.glb',
    scale: null,
    position: null,
    paintMaterials: ['BMWM_CarPaint_Max1', 'BMWM_CarPaintNormal_Max1'],
    rimMaterials:   ['BMWM_Rim_NoTint_Max1', 'BMWM_Rim_Secondary_Max1'],
  },
  {
    id: 'subaru-sti-2018',
    label: '2018 Subaru Impreza WRX STI',
    file: '/models/2018_subaru_impreza_wrx_sti.glb',
    scale: null,
    position: null,
    paintMaterials: ['Paint'],
    rimMaterials:   ['TNR_Rim89A_DiffuseAOSO'],
  },
  {
    id: 'subaru-wrx-2022',
    label: '2022 Subaru WRX',
    file: '/models/2022_subaru_impreza_wrx.glb',
    scale: null,
    position: null,
    paintMaterials: ['M_2022_Subaru_Impreza_WRX_Solar_Orange_Pearl'],
    rimMaterials:   ['M_2022_Subaru_Impreza_WRX_rim', 'M_2022_Subaru_Impreza_WRX_rim_chrome'],
  },
  {
    id: 'audi-rs3',
    label: 'Audi RS3 Sportback',
    file: '/models/audi_rs3_sportback.glb',
    scale: null,
    position: null,
    paintMaterials: ['ARMAT_RS3_2018_Base_014'],
    rimMaterials:   ['AAudi_RS3SedanRewardRecycled_2023_Wheel1A_3D_3DWheel1A_Material1'],
  },
  {
    id: 'bmw-m3-f80',
    label: 'BMW M3 F80',
    file: '/models/bmw_m3_f80.glb',
    scale: null,
    position: null,
    paintMaterials: ['body'],
    rimMaterials:   [],
  },
  {
    id: 'corvette-c7',
    label: 'Chevrolet Corvette C7',
    file: '/models/chevrolet_corvette_c7.glb',
    scale: null,
    position: null,
    paintMaterials: ['Car_Paint', 'Car_Paint_2'],
    rimMaterials:   [],
  },
  {
    id: 'bmw-m3-e30',
    label: 'BMW M3 E30',
    file: '/models/free_bmw_m3_e30.glb',
    scale: null,
    position: null,
    paintMaterials: ['BMW_E30_M3_PAINT'],
    rimMaterials:   ['BMW_E30_M3_RIM'],
  },
]

export const PAINT_OPTIONS = [
  // Whites & near-whites
  { id: 'pure-white',         label: 'Pure White',              color: '#F4F4F0' },
  { id: 'carrara-white',      label: 'Carrara White',           color: '#ECEAE5' },
  { id: 'crystal-silver',     label: 'Crystal Silver',          color: '#D5D7D9' },
  // Silvers & grays
  { id: 'ice-grey',           label: 'Ice Grey Metallic',       color: '#C4C6C8' },
  { id: 'rhodium-silver',     label: 'Rhodium Silver',          color: '#ABABAB' },
  { id: 'gt-silver',          label: 'GT Silver Metallic',      color: '#A3ACB3' },
  { id: 'chalk',              label: 'Chalk',                   color: '#A5A4AC' },
  { id: 'agate-grey',         label: 'Agate Grey Metallic',     color: '#68686A' },
  { id: 'quartzite-grey',     label: 'Quartzite Grey',          color: '#787A7C' },
  { id: 'slate-grey',         label: 'Slate Grey Metallic',     color: '#4A4C50' },
  { id: 'dark-grey',          label: 'Dark Grey',               color: '#363638' },
  { id: 'carbon-black',       label: 'Carbon Black Metallic',   color: '#1C2226' },
  { id: 'jet-black',          label: 'Jet Black',               color: '#111416' },
  // Greens
  { id: 'mint-green',         label: 'Mint Green Metallic',     color: '#8CBDA0' },
  { id: 'python-green',       label: 'Python Green',            color: '#1FF497' },
  { id: 'acid-green',         label: 'Acid Green',              color: '#CBE800' },
  { id: 'malachite-green',    label: 'Malachite Green',         color: '#2A6E4E' },
  { id: 'racing-green',       label: 'Racing Green',            color: '#1B3D2A' },
  { id: 'brewster-green',     label: 'Brewster Green',          color: '#2D4A2A' },
  { id: 'aventurine-green',   label: 'Aventurine Green Metallic', color: '#605E51' },
  { id: 'olive-green',        label: 'Olive Green Metallic',    color: '#6B7040' },
  // Blues
  { id: 'arctic-blue',        label: 'Arctic Blue',             color: '#9ABCD4' },
  { id: 'miami-blue',         label: 'Miami Blue',              color: '#00B5C8' },
  { id: 'steel-blue',         label: 'Steel Blue Metallic',     color: '#3A5A7A' },
  { id: 'pure-blue',          label: 'Pure Blue',               color: '#1247A0' },
  { id: 'cobalt-blue',        label: 'Cobalt Blue Metallic',    color: '#1A3A8B' },
  { id: 'sapphire-blue',      label: 'Sapphire Blue Metallic',  color: '#141A3D' },
  { id: 'gentian-blue',       label: 'Gentian Blue Metallic',   color: '#09203F' },
  { id: 'night-blue',         label: 'Night Blue Metallic',     color: '#0A0F20' },
  // Purples
  { id: 'violet-blue',        label: 'Violet Blue Metallic',    color: '#3A208A' },
  { id: 'amethyst',           label: 'Amethyst Metallic',       color: '#6A3080' },
  // Reds & oranges
  { id: 'signal-orange',      label: 'Signal Orange',           color: '#E85010' },
  { id: 'lava-orange',        label: 'Lava Orange',             color: '#FF2600' },
  { id: 'papaya',             label: 'Papaya Metallic',         color: '#D45410' },
  { id: 'blood-orange',       label: 'Blood Orange',            color: '#C84410' },
  { id: 'guards-red',         label: 'Guards Red',              color: '#FA2223' },
  { id: 'carmine-red',        label: 'Carmine Red',             color: '#9D0620' },
  { id: 'rubystone-red',      label: 'Rubystone Red',           color: '#8B1A2A' },
  { id: 'amaranth-red',       label: 'Amaranth Red',            color: '#9B2040' },
  { id: 'burgundy',           label: 'Burgundy Red',            color: '#4A0E14' },
  // Yellows & golds
  { id: 'speed-yellow',       label: 'Speed Yellow',            color: '#EFDE23' },
  { id: 'racing-yellow',      label: 'Racing Yellow',           color: '#F8CD02' },
  { id: 'signal-yellow',      label: 'Signal Yellow',           color: '#EDD53A' },
  { id: 'saffron-yellow',     label: 'Saffron Yellow',          color: '#C89B2A' },
  // Warm browns
  { id: 'cognac',             label: 'Cognac Metallic',         color: '#7A4020' },
  { id: 'copper',             label: 'Copper Metallic',         color: '#A05A30' },
]

export const FINISH_OPTIONS = [
  { id: 'gloss',          label: 'Gloss',          roughness: 0.05, metalness: 0.0  },
  { id: 'semi-gloss',     label: 'Semi-Gloss',     roughness: 0.2,  metalness: 0.05 },
  { id: 'metallic',       label: 'Metallic',       roughness: 0.15, metalness: 0.75 },
  { id: 'satin',          label: 'Satin',          roughness: 0.5,  metalness: 0.05 },
  { id: 'satin-metallic', label: 'Satin Metallic', roughness: 0.4,  metalness: 0.5  },
  { id: 'matte',          label: 'Matte',          roughness: 0.95, metalness: 0.0  },
]

export const RIM_OPTIONS = [
  { id: 'stock',         label: 'Standard' },
  { id: 'cup2',          label: 'Polished' },
  { id: 'turbo-twist',   label: 'Brushed' },
  { id: 'carrera',       label: 'Satin' },
  { id: 'matte-black',   label: 'Matte' },
  { id: 'chrome',        label: 'Chrome' },
]

export const RIM_COLOR_OPTIONS = [
  { id: 'silver',     label: 'Silver',       color: '#C8C8C8' },
  { id: 'gunmetal',   label: 'Gunmetal',     color: '#3D3D3F' },
  { id: 'gloss-black',label: 'Gloss Black',  color: '#111214' },
  { id: 'carbon',     label: 'Carbon',       color: '#1A1A1C' },
  { id: 'gold',       label: 'Gold',         color: '#C9A93C' },
  { id: 'bronze',     label: 'Bronze',       color: '#8B5E3C' },
  { id: 'rose-gold',  label: 'Rose Gold',    color: '#B76E79' },
  { id: 'platinum',   label: 'Platinum',     color: '#E0E0DE' },
  { id: 'titanium',   label: 'Titanium',     color: '#878681' },
  { id: 'candy-red',  label: 'Candy Red',    color: '#C01020' },
  { id: 'cobalt',     label: 'Cobalt Blue',  color: '#1A3A8B' },
  { id: 'white',      label: 'White',        color: '#E8E8E6' },
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
  { id: 'rain',     label: 'Snow' },
  { id: 'sunset',   label: 'Sunset' },
]

export const CAMERA_OPTIONS = [
  { id: 'front-34',  label: 'Front 3/4',    position: [12, 5, 12],   target: [0, 0.5, 0] },
  { id: 'rear-34',   label: 'Rear 3/4',     position: [-12, 5, -12], target: [0, 0.5, 0] },
  { id: 'side',      label: 'Side Profile', position: [16, 3, 0],    target: [0, 0.5, 0] },
  { id: 'front',     label: 'Front On',     position: [0, 3, 14],    target: [0, 0.5, 0] },
  { id: 'rear',      label: 'Rear On',      position: [0, 3, -14],   target: [0, 0.5, 0] },
  { id: 'top',       label: 'Top Down',     position: [0, 16, 0],    target: [0, 0, 0] },
]

export const ALL_CATEGORIES = [
  { key: 'paint',       label: 'PAINT',       options: PAINT_OPTIONS },
  { key: 'finish',      label: 'FINISH',      options: FINISH_OPTIONS },
  { key: 'rims',        label: 'RIM FINISH',  options: RIM_OPTIONS },
  { key: 'rimColor',    label: 'RIM COLOR',   options: RIM_COLOR_OPTIONS },
  { key: 'bodyKit',     label: 'BODY KIT',    options: BODY_KIT_OPTIONS },
  { key: 'environment', label: 'ENVIRONMENT', options: ENVIRONMENT_OPTIONS },
  { key: 'weather',     label: 'WEATHER',     options: WEATHER_OPTIONS },
  { key: 'camera',      label: 'CAMERA',      options: CAMERA_OPTIONS },
]
