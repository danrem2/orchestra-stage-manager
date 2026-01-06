import type { RosterEntry } from './config';

// --- 1. DATA STRUCTURES ---

export interface SeatLocation {
  desk: number;
  pos: 'Left' | 'Right'; 
}


export class Player {
  id: number;
  name: string;
  defaultSeat: SeatLocation;
  allowedSeats: SeatLocation[] = [];
  isGuest: boolean;

  constructor(id: number, name: string, defaultSeat: SeatLocation, isGuest: boolean = false) {
    this.id = id;
    this.name = name;
    this.defaultSeat = defaultSeat;
    this.allowedSeats = [defaultSeat]; // By default, allow the default seat
    this.isGuest = isGuest;  // by default false
  }

  addAllowedSeat(desk: number, pos: 'Left' | 'Right') {
    const exists = this.allowedSeats.some(      // Check first if exists already
      s => s.desk === desk && s.pos === pos
    );
    if (!exists) {
      this.allowedSeats.push({ desk, pos });
    }
  }
}


export class Seat {
  deskNumber: number;
  position: 'Left' | 'Right';
  player: Player | null = null;

  constructor(deskNumber: number, position: 'Left' | 'Right') {
    this.deskNumber = deskNumber;
    this.position = position;
  }
  
  get priorityScore(): number {
    let score = this.deskNumber;
    if (this.position === 'Right') {
      score += 0.5;
    }
    return score;
  }
}


// Saved state structure 
export interface SavedState {
  roster: {
    id: number;
    name: string;
    defaultSeat: SeatLocation;
    isGuest: boolean;
    allowedSeats: SeatLocation[];
  }[];
  
  seatMap: { 
    desk: number; 
    pos: string; 
    playerId: number; 
  }[];
}

// --- 2. ORCHESTRA CLASS ---

export class Orchestra {
  seats: Seat[] = [];
  players: Player[] = [];

  constructor(numDesks: number) {
    for (let i = 1; i <= numDesks; i++) {
      this.seats.push(new Seat(i, 'Left'));
      this.seats.push(new Seat(i, 'Right'));
    }
    // Sort by priority score
    this.seats.sort((a, b) => a.priorityScore - b.priorityScore);
  }


  toJSON(): SavedState {
    'convert orchestra state to JSON (for sending to the cloud)'
    const roster = this.players.map(p => ({
      id: p.id,
      name: p.name,
      defaultSeat: p.defaultSeat,
      isGuest: p.isGuest,
      allowedSeats: p.allowedSeats
    }));

    const seatMap = this.seats
      .filter(s => s.player !== null)
      .map(s => ({
        desk: s.deskNumber,
        pos: s.position,
        playerId: s.player!.id
      }));

    return { roster, seatMap };
  }


  static fromJSON(data: SavedState, defaultNumDesks: number): Orchestra {
    'restore orchestra state from JSON data'
    // determine required number of desks 
    const maxSavedDesk = data.seatMap.reduce((max, s) => Math.max(max, s.desk), 0);
    const numDesks = Math.max(defaultNumDesks, maxSavedDesk);

    const orch = new Orchestra(numDesks);   // initialize orchestra

    // Recreate players
    orch.players = data.roster.map(pData => {
      const p = new Player(pData.id, pData.name, pData.defaultSeat, pData.isGuest);
      pData.allowedSeats.forEach(s => p.addAllowedSeat(s.desk, s.pos));   // restore their specific allowed seats
      return p;
    });

    // Reassign players to seats
    data.seatMap.forEach(savedSeat => {

      // find seat and player objects
      const seatObj = orch.seats.find(s => 
        s.deskNumber === savedSeat.desk && s.position === savedSeat.pos
      );
      const playerObj = orch.players.find(p => p.id === savedSeat.playerId);

      // assign player to seat
      if (seatObj && playerObj) {
        seatObj.player = playerObj;
      }
    });

    return orch;
  }


  addPlayer(player: Player) {
    this.players.push(player);
    // this.assignPlayers();
  }

  clearStage() {
    this.seats.forEach(seat => (seat.player = null));
  }

  assignPlayers(currentStage: Player[] | null = null) {
    // Clear seats first
    this.seats.forEach(seat => (seat.player = null));

    const playersToAssign = currentStage || this.players;

    // Sort players by default seat preference (similar to seat sorting)
    const sortedPlayers = [...playersToAssign].sort((a, b) => {
    const seatA = a.defaultSeat.desk * 10 + (a.defaultSeat.pos === 'Right' ? 1 : 0);
    const seatB = b.defaultSeat.desk * 10 + (b.defaultSeat.pos === 'Right' ? 1 : 0);
    return seatA - seatB;
    });

    // Assign to default seats
    for (const player of sortedPlayers) {

      // Find the specific seat object
      const targetSeat = this.seats.find(
        s => s.player === null &&
             s.deskNumber === player.defaultSeat.desk &&
             s.position === player.defaultSeat.pos
      );

      if (targetSeat) {
        targetSeat.player = player;
      }
    }
  }

  static fromConfig(numDesks: number, roster: RosterEntry[]): Orchestra {
    'loads an orchestra from config data'
    const orch = new Orchestra(numDesks);

    roster.forEach(entry => {
      // Create player from roster entry, including allowed seats  
      const defaultSeat: SeatLocation = { desk: entry.defaultDesk, pos: entry.defaultPos };
      const player = new Player(entry.id, entry.name, defaultSeat);
      if (entry.allowedSeats && Array.isArray(entry.allowedSeats)) {
        entry.allowedSeats.forEach(seat =>
            player.addAllowedSeat(seat.desk, seat.pos)
        );
    }
     // Add player to orchestra
      orch.addPlayer(player);
    });

    // Initial assignment
    orch.assignPlayers();
    return orch;
  }

  removePlayer(playerIds: number[]): Player[] { 
    const removedPlayers: Player[] = [];
    for (const seat of this.seats) {
      for (const id of playerIds) {
        if (seat.player && seat.player.id === id) {
          removedPlayers.push(seat.player);
          seat.player = null;
          
        }
      }
    }
    return removedPlayers;
  }


  repackStage(onWarning?: (msg: string) => void) { 
    // Get current players on stage
    const currentPlayers = this.seats
                            .map(seat => seat.player)
                            .filter((p): p is Player => p !== null);

    // Clear all seats
    this.seats.forEach(seat => (seat.player = null));
    
    let playerIdx = 0;
    while (playerIdx < currentPlayers.length) {

      const currPlayer = currentPlayers[playerIdx];
      let placed = false;

      for (const seat of this.seats) {
        if (seat.player !== null) {
            continue; // Seat already occupied
        }

        // Check if currPlayer can sit here
        const isAllowed = currPlayer.allowedSeats.some(
          s => s.desk === seat.deskNumber && s.pos === seat.position
        );

      // place the player if allowed
      if (isAllowed) {
        seat.player = currPlayer;
        placed = true;
        break; 
      }
    }

    // warn if not placed 
    if (!placed) {
        if (onWarning) {
            onWarning(`Could not find a seat for player ${currPlayer.name} during repack.`);
        }
    }

    playerIdx++;  // Move to next player
  }
}


  rotateSelected(playerIDs: number[], onWarning?: (msg: string) => void) {
    if (playerIDs.length < 2) return;

    // Filter seats according to playerIDs
    const targetSeats = this.seats.filter(
      s => s.player && playerIDs.includes(s.player.id)
    );

    // Sort seats by priority score
    targetSeats.sort((a, b) => a.priorityScore - b.priorityScore);

    if (targetSeats.length < 2) return; // Need at least 2 seats to rotate

    // Check if all players can sit in all target seats
    const players = targetSeats.map(s => s.player!);
    const allAllowed = players.every(player =>
      targetSeats.every(seat =>
        player.allowedSeats.some(
          allowed => allowed.desk === seat.deskNumber && allowed.pos === seat.position
        )
      )
    );
    if (!allAllowed) {
        if (onWarning) {
            onWarning('Rotation not allowed');
        }
      return;
    }

    // Separate left and right seats
    const lefts = targetSeats.filter(s => s.position === 'Left');
    const rights = targetSeats.filter(s => s.position === 'Right');

    // Sort lefts ascending, rights descending
    lefts.sort((a, b) => a.deskNumber - b.deskNumber);
    rights.sort((a, b) => b.deskNumber - a.deskNumber);

    const sortedSeats = [...lefts, ...rights];   // Combined sorted seats
    const playersToRotate = sortedSeats.map(s => s.player!);   // get players

    // Shift players
    const lastPlayer = playersToRotate.pop()!; // Remove last player
    playersToRotate.unshift(lastPlayer); // Add last player to front

    // Reassign players to seats
    sortedSeats.forEach((seat, idx) => {
      seat.player = playersToRotate[idx];
    });
  }



  // --- GUEST methods ---

  getEmptySeats(): SeatLocation[] {   

    // Get current empty seats
    const currEmptySeats = this.seats.filter(seat => seat.player === null).map(seat => ({
      desk: seat.deskNumber,
      pos: seat.position
    }));

    // check if the last desk is fully occupied
    const maxDesk = this.seats.reduce((max, s) => Math.max(max, s.deskNumber), 0);
    const lastDeskSeats = this.seats.filter(s => s.deskNumber === maxDesk);

    // If last desk is full, add a new desk's seats as empty
    if (lastDeskSeats.every(s => s.player !== null)) {
        const nextDesk = maxDesk + 1;
        currEmptySeats.push({ desk: nextDesk, pos: 'Left' });
        currEmptySeats.push({ desk: nextDesk, pos: 'Right' });
    }

    return currEmptySeats;
  }


  addGuest(
    name: string, 
    seatLoc: SeatLocation, 
    customAllowed?: SeatLocation[]
    ): Player {
        // Generate unique ID for guest
        const maxId = this.players.reduce((max, p) => Math.max(max, p.id), 0);
        const guestId = maxId + 1;
        
        // Create guest player
        const guestPlayer = new Player(guestId, name, seatLoc, true);

        // Add guests additional allowed seats if provided
        if (customAllowed) {
            customAllowed.forEach(s => {
                guestPlayer.addAllowedSeat(s.desk, s.pos);
            });
        }

        // Add to roster
        this.players.push(guestPlayer);

        // find if any desk seats are missing (new desk case)
        const emptySeats = this.getEmptySeats();
        emptySeats.forEach(seatLoc => {
            if (!this.seats.some(s => s.deskNumber === seatLoc.desk && s.position === seatLoc.pos)) {
            // Add new Seat object for the new desk
            this.seats.push(new Seat(seatLoc.desk, seatLoc.pos));
            }
        });

        // Try to seat the guest in the requested seat if it's empty
        let targetSeat = this.seats.find(
            s => s.deskNumber === seatLoc.desk && s.position === seatLoc.pos && s.player === null
        );

        // If not, try any empty seat that is allowed
        if (!targetSeat) {
            targetSeat = this.seats.find(
            s => s.player === null && guestPlayer.allowedSeats.some(
                allowed => allowed.desk === s.deskNumber && allowed.pos === s.position
            )
            );
        }

        // Seat the guest if possible
        if (targetSeat) {
            targetSeat.player = guestPlayer;
        } else {
            console.log(`Guest ${name} created but could not sit`);
        }

        // Sort seats again just in case new desk was added
        this.seats.sort((a, b) => a.priorityScore - b.priorityScore);

        return guestPlayer;
  }
  

  deleteGuest(playerId: number) {
    // Remove from Stage (if seated)
    this.seats.forEach(seat => {
      if (seat.player && seat.player.id === playerId) {
        seat.player = null;
      }
    });

    // Remove from Roster
    this.players = this.players.filter(p => p.id !== playerId);
  }
}