// Hand-drawn marks for the background wallpaper. Every path sits in a 48 × 48 box, is
// slightly uneven, and overshoots its end like the strokes in DoodleStroke.
export const backdropShapes = {
  spiral:
    "M24 24 C 26 21, 30 23, 29 27 C 28 32, 21 33, 19 28 C 16 22, 22 16, 29 17 C 38 18, 41 28, 37 35 C 32 43, 20 44, 14 37 C 7 29, 11 16, 20 12",
  star: "M24 5 L28.5 18 L43 18.5 L32 27.5 L36.5 42 L24 33.5 L11.5 42 L16 27.5 L5 18.5 L19.5 18 L25 4",
  loop: "M4 38 C 14 32, 17 15, 28 17 C 36 18, 33 30, 25 28 C 16 26, 22 11, 44 8 M44 8 L36 6.5 M44 8 L40.5 15",
  zigzag: "M3 30 L10 18.5 L17 30.5 L24 18 L31 30 L38 18.5 L46 29",
  heart:
    "M24 40 C 10 30, 4 20, 10 13 C 16 7, 22 10, 24 16 C 26 10, 33 6, 39 12 C 45 19, 38 30, 22 41",
  flower: "M24 7 L25 41 M7 23 L42 25.5 M12 11 L37 37 M37 11 L11.5 37.5",
} as const
