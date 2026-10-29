// Hand-drawn marks for the background wallpaper. Every path sits in a 48 × 48 box, is
// slightly uneven, and overshoots its end like the strokes in DoodleStroke. Strokes only:
// the wallpaper uses them as a mask, so a filled shape would show as a solid blot.
export const backdropShapes = {
  spiral:
    "M24 24 C 26 21, 30 23, 29 27 C 28 32, 21 33, 19 28 C 16 22, 22 16, 29 17 C 38 18, 41 28, 37 35 C 32 43, 20 44, 14 37 C 7 29, 11 16, 20 12",
  star: "M24 5 L28.5 18 L43 18.5 L32 27.5 L36.5 42 L24 33.5 L11.5 42 L16 27.5 L5 18.5 L19.5 18 L25 4",
  loop: "M4 38 C 14 32, 17 15, 28 17 C 36 18, 33 30, 25 28 C 16 26, 22 11, 44 8 M44 8 L36 6.5 M44 8 L40.5 15",
  zigzag: "M3 30 L10 18.5 L17 30.5 L24 18 L31 30 L38 18.5 L46 29",
  heart:
    "M24 40 C 10 30, 4 20, 10 13 C 16 7, 22 10, 24 16 C 26 10, 33 6, 39 12 C 45 19, 38 30, 22 41",
  flower: "M24 7 L25 41 M7 23 L42 25.5 M12 11 L37 37 M37 11 L11.5 37.5",
  cloud:
    "M11 34 C 4.5 34, 3.5 26, 9.5 24.5 C 8.5 16.5, 17.5 13, 21.5 18.5 C 23.5 10, 35.5 9, 37 18 C 44 17.5, 47 25.5, 41 30 C 43 35, 37.5 37.5, 33 35 L 7 35.5",
  blossom:
    "M24 22 C 17 12, 31 9.5, 25.5 21 C 34.5 14, 41 25, 27.5 25 C 36 32.5, 28 40.5, 25 28.5 C 21.5 40, 11.5 33.5, 22 26 C 9.5 26, 12 14.5, 23.5 21 M24.5 29 C 23 36, 26 41, 23.5 46.5",
  lightning: "M29 3.5 L14 26.5 L24.5 25.5 L18 45 L35.5 19 L24.5 19.5 L30.5 5",
  notes:
    "M18.5 37 C 18.5 41.5, 10 43, 9.5 39 C 9 35, 17 33.5, 18.5 37 M18.5 37.5 L18.8 10.5 M38.5 33 C 38.5 37.5, 30 39, 29.5 35 C 29 31, 37 29.5, 38.5 33 M38.5 33.5 L38.6 6 M17.5 10.8 L40 5.5 M18 15.5 L39 10.6",
  paw: "M24 27 C 31 27, 36.5 34, 34 39 C 32 43, 27 41, 24 41 C 21 41, 16 43, 14 39 C 12 34, 17 27, 25.5 27.5 M11 17 C 15.5 17, 15.5 27, 11 27 C 6.5 27, 6.5 17, 12 17.5 M19 8 C 23.5 8, 23.5 18, 19 18 C 14.5 18, 14.5 8, 20 8.5 M29 8 C 33.5 8, 33.5 18, 29 18 C 24.5 18, 24.5 8, 30 8.5 M37 17 C 41.5 17, 41.5 27, 37 27 C 32.5 27, 32.5 17, 38 17.5",
} as const

export type BackdropShape = keyof typeof backdropShapes

export const backdropShapeNames = Object.keys(backdropShapes) as BackdropShape[]
