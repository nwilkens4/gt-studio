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
    scale: 1,
    position: [0, -0.5, 0],
    paintMaterials: ['FCMAT_Mazda_RX_7_Carpaint_075'],
    rimMaterials:   ['FCMAT_Tire_Hub_091'],
  },
  {
    id: 'bmw-m3-e36',
    label: '1993 BMW M3 E36',
    file: '/models/1993_bmw_m3_coupe_e36.glb',
    scale: 1,
    position: [0, -0.5, 0],
    paintMaterials: ['carpainbt'],
    rimMaterials:   ['rims'],
  },
  {
    id: 'rx7-fd',
    label: '1993 Mazda RX-7 FD',
    file: '/models/1993_mazda_rx-7.glb',
    scale: 1,
    position: [0, -0.5, 0],
    paintMaterials: ['Mazda_1Mazda_RX7TNR0_1993PaintTNR_Material1'],
    rimMaterials:   ['wheels_TNRRims_92A18NbTNR_Rim92A_Material1'],
  },
  {
    id: 'viper-gts',
    label: '1996 Dodge Viper GTS',
    file: '/models/1996_dodge_viper_gts.glb',
    scale: 1,
    position: [0, -0.5, 0],
    paintMaterials: ['dDodge_ViperGTS_1996Paint_Material1'],
    rimMaterials:   ['dDodge_ViperGTS_1996_Wheel1A_3D_3DWheel1A_Material1'],
  },
  {
    id: 'skyline-r33',
    label: '1997 Nissan Skyline GT-R R33',
    file: '/models/1997_nissan_skyline_gt-r_v-spec_r33.glb',
    scale: 1,
    position: [0, -0.5, 0],
    paintMaterials: ['r33Vehicle_Exterior_mm_ext1', 'r33Vehicle_Exterior_mm_cab1'],
    rimMaterials:   ['r33Vehicle_Exterior_mm_wheel1'],
  },
  {
    id: 'bmw-m3-e46-gtr',
    label: '2005 BMW M3 E46 GTR',
    file: '/models/2005_bmw_m3_e46_gtr_-_nfs_most_wanted.glb',
    scale: 1,
    position: [0, -0.5, 0],
    paintMaterials: ['mMAT_Carpaint_Blue1'],
    rimMaterials:   [],
  },
  {
    id: 'subaru-sti-2006',
    label: '2006 Subaru Impreza WRX STI',
    file: '/models/2006_subaru_impreza_wrx_sti.glb',
    scale: 1,
    position: [0, -0.5, 0],
    paintMaterials: ['Sub_2M_CarPaint_Max1', 'Sub_2M_CarPaintNormal_Max1'],
    rimMaterials:   ['Sub_2M_Rim_Main_Max1', 'Sub_2M_Rim_NoTint_Max1'],
  },
  {
    id: 'bmw-m3-e92',
    label: '2010 BMW M3 E92',
    file: '/models/2010_bmw_m3_e92.glb',
    scale: 1,
    position: [0, -0.5, 0],
    paintMaterials: ['BMWM_CarPaint_Max1', 'BMWM_CarPaintNormal_Max1'],
    rimMaterials:   ['BMWM_Rim_NoTint_Max1', 'BMWM_Rim_Secondary_Max1'],
  },
  {
    id: 'subaru-sti-2018',
    label: '2018 Subaru Impreza WRX STI',
    file: '/models/2018_subaru_impreza_wrx_sti.glb',
    scale: 1,
    position: [0, -0.5, 0],
    paintMaterials: ['Paint'],
    rimMaterials:   ['TNR_Rim89A_DiffuseAOSO'],
  },
  {
    id: 'subaru-wrx-2022',
    label: '2022 Subaru WRX',
    file: '/models/2022_subaru_impreza_wrx.glb',
    scale: 1,
    position: [0, -0.5, 0],
    paintMaterials: ['M_2022_Subaru_Impreza_WRX_Solar_Orange_Pearl'],
    rimMaterials:   ['M_2022_Subaru_Impreza_WRX_rim', 'M_2022_Subaru_Impreza_WRX_rim_chrome'],
  },
  {
    id: 'audi-rs3',
    label: 'Audi RS3 Sportback',
    file: '/models/audi_rs3_sportback.glb',
    scale: 1,
    position: [0, -0.5, 0],
    paintMaterials: ['ARMAT_RS3_2018_Base_014'],
    rimMaterials:   ['AAudi_RS3SedanRewardRecycled_2023_Wheel1A_3D_3DWheel1A_Material1'],
  },
  {
    id: 'bmw-m3-f80',
    label: 'BMW M3 F80',
    file: '/models/bmw_m3_f80.glb',
    scale: 1,
    position: [0, -0.5, 0],
    paintMaterials: ['body'],
    rimMaterials:   [],
  },
  {
    id: 'corvette-c7',
    label: 'Chevrolet Corvette C7',
    file: '/models/chevrolet_corvette_c7.glb',
    scale: 1,
    position: [0, -0.5, 0],
    paintMaterials: ['Car_Paint', 'Car_Paint_2'],
    rimMaterials:   [],
  },
  {
    id: 'bmw-m3-e30',
    label: 'BMW M3 E30',
    file: '/models/free_bmw_m3_e30.glb',
    scale: 1,
    position: [0, -0.5, 0],
    paintMaterials: ['BMW_E30_M3_PAINT'],
    rimMaterials:   ['BMW_E30_M3_RIM'],
  },
]

export const PAINT_OPTIONS = [
  { id: 'gt-silver',          label: 'GT Silver Metallic',      color: '#A3ACB3' },
  { id: 'guards-red',         label: 'Guards Red',              color: '#FA2223' },
  { id: 'miami-blue',         label: 'Miami Blue',              color: '#00B5C8' },
  { id: 'racing-yellow',      label: 'Racing Yellow',           color: '#F8CD02' },
  { id: 'chalk',              label: 'Chalk',                   color: '#A5A4AC' },
  { id: 'gentian-blue',       label: 'Gentian Blue Metallic',   color: '#09203F' },
  { id: 'lava-orange',        label: 'Lava Orange',             color: '#FF2600' },
  { id: 'python-green',       label: 'Python Green',            color: '#1FF497' },
  { id: 'carmine-red',        label: 'Carmine Red',             color: '#9D0620' },
  { id: 'carbon-black',       label: 'Carbon Black Metallic',   color: '#1C2226' },
  { id: 'acid-green',         label: 'Acid Green',              color: '#CBE800' },
  { id: 'aventurine-green',   label: 'Aventurine Green Metallic', color: '#605E51' },
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
  { id: 'front-34',  label: 'Front 3/4',    position: [12, 5, 12],   target: [0, 0.5, 0] },
  { id: 'rear-34',   label: 'Rear 3/4',     position: [-12, 5, -12], target: [0, 0.5, 0] },
  { id: 'side',      label: 'Side Profile', position: [16, 3, 0],    target: [0, 0.5, 0] },
  { id: 'front',     label: 'Front On',     position: [0, 3, 14],    target: [0, 0.5, 0] },
  { id: 'rear',      label: 'Rear On',      position: [0, 3, -14],   target: [0, 0.5, 0] },
  { id: 'top',       label: 'Top Down',     position: [0, 16, 0],    target: [0, 0, 0] },
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
