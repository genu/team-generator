export enum ShirtColorEnum {
  Black = 'Black',
  White = 'White',
  Red = 'Red',
  Green = 'Green',
  Blue = 'Blue',
  Yellow = 'Yellow',
  Cyan = 'Cyan',
  Magenta = 'Magenta',
  Gray = 'Gray',
}

export const useShirtColors = () => {
  interface ShirtColor {
    name: ShirtColorEnum
    foreground: string
    background: string
  }

  const colors: ShirtColor[] = [
    {
      name: ShirtColorEnum.Black,
      foreground: '#000000',
      background: '#FFFFFF',
    },
    {
      name: ShirtColorEnum.White,
      foreground: '#FFFFFF',
      background: '#000000',
    },
    {
      name: ShirtColorEnum.Red,
      foreground: '#FF0000',
      background: '#FFFFFF',
    },
    {
      name: ShirtColorEnum.Green,
      foreground: '#00FF00',
      background: '#FFFFFF',
    },
    {
      name: ShirtColorEnum.Blue,
      foreground: '#0000FF',
      background: '#FFFFFF',
    },
    {
      name: ShirtColorEnum.Yellow,
      foreground: '#FFFF00',
      background: '#FFFFFF',
    },
    {
      name: ShirtColorEnum.Cyan,
      foreground: '#00FFFF',
      background: '#FFFFFF',
    },
    {
      name: ShirtColorEnum.Magenta,
      foreground: '#FF00FF',
      background: '#FFFFFF',
    },
    {
      name: ShirtColorEnum.Gray,
      foreground: '#808080',
      background: '#FFFFFF',
    },
  ]

  return { colors }
}
