export const inRange = (x = 0, min = 1, max = 10) => ((x - min) * (x - max) <= 0)
export const getRandNumber = (min = 0, max = 51) => Math.floor(Math.random() * (max - min + 1)) + min
