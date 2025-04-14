export enum Position {
  GK = 'GK',
  LB = 'LB',
  CB1 = 'CB1',
  CB2 = 'CB2',
  RB = 'RB',
  LM = 'LM',
  CM1 = 'CM1',
  CM2 = 'CM2',
  RM = 'RM',
  ST1 = 'ST1',
  ST2 = 'ST2'
}

export const POSITION_NAMES: Record<Position, string> = {
  [Position.GK]: 'Вратарь',
  [Position.LB]: 'Левый защитник',
  [Position.CB1]: 'Центральный защитник',
  [Position.CB2]: 'Центральный защитник',
  [Position.RB]: 'Правый защитник',
  [Position.LM]: 'Левый полузащитник',
  [Position.CM1]: 'Центральный полузащитник',
  [Position.CM2]: 'Центральный полузащитник',
  [Position.RM]: 'Правый полузащитник',
  [Position.ST1]: 'Нападающий',
  [Position.ST2]: 'Нападающий'
};

export const POSITION_GROUPS = {
  GOALKEEPERS: [Position.GK],
  DEFENDERS: [Position.LB, Position.CB1, Position.CB2, Position.RB],
  MIDFIELDERS: [Position.LM, Position.CM1, Position.CM2, Position.RM],
  FORWARDS: [Position.ST1, Position.ST2]
}; 