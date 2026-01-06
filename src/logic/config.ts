
export interface RosterEntry {
  id: number;
  name: string;
  defaultDesk: number;
  defaultPos: 'Left' | 'Right';
  allowedSeats?: { desk: number; pos: 'Left' | 'Right' }[];
}

export const DEFAULT_NUM_DESKS = 7;

const ALL_SEATS: { desk: number; pos: 'Left' | 'Right' }[] = [];
for (let i = 1; i <= DEFAULT_NUM_DESKS; i++) {
  ALL_SEATS.push({ desk: i, pos: 'Left' });
  ALL_SEATS.push({ desk: i, pos: 'Right' });
}

const VIOLIN_3_ALLOWED = [
  { desk: 1, pos: 'Left' as const },
  { desk: 2, pos: 'Left' as const },
  { desk: 3, pos: 'Left' as const }
];


const VIOLIN_6_ALLOWED = [
  { desk: 3, pos: 'Left' as const },
  { desk: 3, pos: 'Right' as const },
  { desk: 4, pos: 'Left' as const },
  { desk: 4, pos: 'Right' as const }
];

export const DEFAULT_ROSTER: RosterEntry[] = [
  { id: 1, name: "Violin 1 (CM)", defaultDesk: 1, defaultPos: "Left", allowedSeats: [{ desk: 1, pos: 'Left' }] },
  { id: 2, name: "Violin 2 (CM)", defaultDesk: 1, defaultPos: "Right", allowedSeats: ALL_SEATS },
  { id: 3, name: "Violin 3",      defaultDesk: 2, defaultPos: "Left", allowedSeats: VIOLIN_3_ALLOWED },
  { id: 4, name: "Violin 4",      defaultDesk: 2, defaultPos: "Right", allowedSeats: ALL_SEATS },
  { id: 5, name: "Violin 5",      defaultDesk: 3, defaultPos: "Left", allowedSeats: ALL_SEATS },
  { id: 6, name: "Violin 6",      defaultDesk: 3, defaultPos: "Right", allowedSeats: VIOLIN_6_ALLOWED },
  { id: 7, name: "Violin 7",      defaultDesk: 4, defaultPos: "Left" , allowedSeats: ALL_SEATS },
  { id: 8, name: "Violin 8",      defaultDesk: 4, defaultPos: "Right", allowedSeats: ALL_SEATS },
  { id: 9, name: "Violin 9",      defaultDesk: 5, defaultPos: "Left", allowedSeats: ALL_SEATS },
  { id: 10, name: "Violin 10",    defaultDesk: 5, defaultPos: "Right", allowedSeats: ALL_SEATS },
  { id: 11, name: "Violin 11",    defaultDesk: 6, defaultPos: "Left", allowedSeats: ALL_SEATS },
  { id: 12, name: "Violin 12",    defaultDesk: 6, defaultPos: "Right", allowedSeats: ALL_SEATS },
  { id: 13, name: "Violin 13",    defaultDesk: 7, defaultPos: "Left", allowedSeats: ALL_SEATS },
];