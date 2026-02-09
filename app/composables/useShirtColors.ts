export enum ShirtColorEnum {
  Black = "Black",
  White = "White",
  Red = "Red",
  Green = "Green",
  Blue = "Blue",
  Yellow = "Yellow",
  Cyan = "Cyan",
  Magenta = "Magenta",
  Gray = "Gray",
}

export interface ShirtColor {
  name: ShirtColorEnum
  foreground: string
  background: string
  border?: string
}

export const useShirtColors = () => {
  const colors: ShirtColor[] = [
    {
      name: ShirtColorEnum.Black,
      foreground: "#1a1a1a",
      background: "#FFFFFF",
    },
    {
      name: ShirtColorEnum.White,
      foreground: "#FFFFFF",
      background: "#333333",
      border: "#CCCCCC",
    },
    {
      name: ShirtColorEnum.Red,
      foreground: "#DC2626",
      background: "#FFFFFF",
    },
    {
      name: ShirtColorEnum.Green,
      foreground: "#16A34A",
      background: "#FFFFFF",
    },
    {
      name: ShirtColorEnum.Blue,
      foreground: "#2563EB",
      background: "#FFFFFF",
    },
    {
      name: ShirtColorEnum.Yellow,
      foreground: "#EAB308",
      background: "#422006",
    },
    {
      name: ShirtColorEnum.Cyan,
      foreground: "#06B6D4",
      background: "#FFFFFF",
    },
    {
      name: ShirtColorEnum.Magenta,
      foreground: "#D946EF",
      background: "#FFFFFF",
    },
    {
      name: ShirtColorEnum.Gray,
      foreground: "#6B7280",
      background: "#FFFFFF",
    },
  ]

  return { colors }
}
