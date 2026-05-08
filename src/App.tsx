import { useState } from 'react';
import { Orchestra, Player, type SeatLocation } from './logic/orchestra';
import { DEFAULT_ROSTER, DEFAULT_NUM_DESKS } from './logic/config';
import { Stage } from './components/Stage';
import { GuestForm } from './components/GuestForm';
import { Controls } from './components/Controls';
import { db } from './firebase';
import { SaveLoad } from './components/SaveLoad'; 
import { api } from './api';
import { SnapshotModal } from './components/Snapshot';
import { CameraButton } from './components/CameraButton';
import html2canvas from 'html2canvas'; 
import './assets/stage.css'; 
import { SaveButton } from './components/SaveButton';

function App() {

  // --- STATE VARIABLES ---

  // ORCHESTRA STATE (initialized from default config)
  const [orch, setOrch] = useState(() => 
    Orchestra.fromConfig(DEFAULT_NUM_DESKS, DEFAULT_ROSTER)
  );

  // SELECTION STATE
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);

  // REMOVED PLAYERS STATE
  const [removedPlayers, setRemovedPlayers] = useState<Player[]>([]);

  // GUEST FORM STATE
  const [isGuestFormOpen, setIsGuestFormOpen] = useState(false);

  // manual re-rendering when orchestra changes (for optimization)
  const [, setVersion] = useState(0);
  const refreshOrchestra = () => setVersion(v => v + 1);

  // WARNING STATE
  const [warning, setWarning] = useState<string | null>(null);

  // CLOUD MESSAGE STATE
  const [cloudMessage, setCloudMessage] = useState<string | null>(null);

  // ACTIVE STAGE NAME STATE
  const [currentStageName, setCurrentStageName] = useState("Default");

  // LOADING STATE (for network requests)
  const [isLoading, setIsLoading] = useState(false);

  // SNAPSHOT IMAGE STATE
  const [snapshotImage, setSnapshotImage] = useState<string | null>(null);


  // --- HANDLERS ---

  // Handle clicking a chair
  const toggleSelection = (playerId: number) => {
    setWarning(null); // clear previous warnings
    setCloudMessage(null);
    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId); // Remove
      } else {
        return [...prev, playerId]; // Add
      }
    });
  };


  // Handle Removal Logic 
  const handleRemoved = () => {
    setWarning(null); // clear previous warnings
    setCloudMessage(null);
    if (selectedPlayers.length === 0) return;
    const justRemoved = orch.removePlayer(selectedPlayers);  // remove from orchestra and get removed players
    setRemovedPlayers(prev => [...prev, ...justRemoved]);   // Update removed players list
    setSelectedPlayers([]); // Clear selection
    refreshOrchestra();
  };


  // Handle Restore Logic
  const handleRestore = (playerToRestore: Player) => {
    setWarning(null); // clear previous warnings
    setCloudMessage(null);
    orch.addPlayer(playerToRestore);

    const seat = orch.seats.find(    
      // find the seat matching the player's default seat
      s => s.deskNumber === playerToRestore.defaultSeat.desk &&
          s.position === playerToRestore.defaultSeat.pos
    );

    // If restoring a guest, ensure their seat is empty
    if (playerToRestore.isGuest) {
      if (seat && seat.player) {
        setWarning(`Cannot seat guest. ${seat.player.name} is already sitting there.`);
        return; 
      }
    }

    // If seat is occupied by a guest, remove that guest
    let displacedGuest: Player | null = null; 
    if (seat) {
      if (seat.player && seat.player.isGuest) {
        displacedGuest = seat.player;  // store displaced guest
        seat.player = null;          // remove guest from seat
      }
    }

    // Update removed players list
    setRemovedPlayers(prev => {
      // Remove the player being restored
      const updatedList = prev.filter(p => p.id !== playerToRestore.id);
      
      // If we kicked a guest, add them to the list
      if (displacedGuest) {
        updatedList.push(displacedGuest);
      }
      
      return updatedList;
    });

    // assign the player to their default seat
    if (seat) {
      if (seat.player === null) {
        seat.player = playerToRestore; // Seat is free, assign player
      } else {
        // Seat occupied (by non-guest), need to reassign
        orch.assignPlayers(); 
        orch.repackStage(setWarning); 
      }
    }

    refreshOrchestra();
  };


  // Handle Rotation Logic
  const handleRotate = () => {
    setWarning(null); // clear previous warnings
    setCloudMessage(null);
    if (selectedPlayers.length < 2) return;
    orch.rotateSelected(selectedPlayers, setWarning);
    refreshOrchestra();
  };


  // Handle Fill-In Logic
  const handleFillIn = () => {
    setWarning(null); // clear previous warnings
    orch.repackStage();
    refreshOrchestra();
  };


  // Handle Reset Logic (based on currentStageName)
  const handleReset = () => {
    setWarning(null); // clear previous warnings
    setCloudMessage(null);
    if (currentStageName === "Default") {
      const newOrch = Orchestra.fromConfig(DEFAULT_NUM_DESKS, DEFAULT_ROSTER);  // fresh orchestra, later add lastState preservation
      setOrch(newOrch);
      setSelectedPlayers([]);
      setRemovedPlayers([]);
      refreshOrchestra();
      return;
    }
    handleLoadCloud(currentStageName);
  };


  const handleSnapshot = async () => {
    setWarning(null); // clear previous warnings
    setCloudMessage(null);

    const stageElement = document.querySelector('.stage-wrapper') as HTMLElement;  // get the stage DOM element (check if correct)
    if (!stageElement) {
      setWarning("Stage element not found for snapshot.");
      return;
    }

    // use html2canvas to capture the stage element
    try {
      const canvas = await html2canvas(stageElement, {
        scale: 2, // increase resolution
        backgroundColor: null, // transparent background
        logging: false,
        useCORS: true // handle cross-origin images
      });

      const image = canvas.toDataURL('image/png'); // get image as data URL

      setSnapshotImage(image); // store image in state to show in modal
  } catch (err) {
      console.error("Snapshot error:", err);
      setWarning("Failed to capture snapshot.");
    }
  };


  /// --- CLOUD SAVE/LOAD HANDLERS ---

  // Handle Save to Cloud
  const handleSaveCloud = async (stageName: string) => {
    setIsLoading(true);
    setCloudMessage(null);
    setWarning(null);
    try {
      const data = orch.toJSON();  // convert orchestra state to JSON

      await api.saveStage(stageName, data);  // save to cloud
      setCloudMessage(`Stage "${stageName}" saved successfully!`);
      setCurrentStageName(stageName);  // update current stage name
    } catch (err) {
      console.error(err);  // log error
      setCloudMessage("Failed to save stage.");  // show error to user
    } finally {
      setIsLoading(false);  // reset loading state
    }
  };


  // Handle Load from Cloud
  const handleLoadCloud = async (stageName: string) => {
    setIsLoading(true);
    setCloudMessage(null);
    setWarning(null);
    try {
      const data = await api.loadStage(stageName);  // load from cloud
      
      if (!data) {
        setCloudMessage(`No stage found with the name "${stageName}".`);
        return;
      }

      // create orchestra from loaded data
      const newOrch = Orchestra.fromJSON(data, DEFAULT_NUM_DESKS);  

      // filter seated and removed players
      const seatedPlayerIds = new Set(
        newOrch.seats
          .filter(s => s.player)
          .map(s => s.player!.id)
      );

      const unseatedPlayers = newOrch.players.filter(p => !seatedPlayerIds.has(p.id));

      // Update states
      setOrch(newOrch);
      setRemovedPlayers(unseatedPlayers);
      setSelectedPlayers([]); 
      setCurrentStageName(stageName);  
      setCloudMessage(`Loaded stage "${stageName}"`);
      refreshOrchestra();

    } catch (err) {
      console.error(err);  // log error
      setCloudMessage("Failed to load stage.");  // show error to user
    } finally {
      setIsLoading(false);  // reset loading state
    }
  };


  // Handle Quick Save
  const handleQuickSave = () => {
    setWarning(null); // clear previous warnings
    setCloudMessage(null);
    if (currentStageName === "Default") {
        setWarning("Cannot overwrite Default! Please save as a new name.");
        return;
    }
    handleSaveCloud(currentStageName);  // save under current stage name
  };



  // --- GUEST HANDLERS ---

  // Handle Adding a Guest
  const handleAddGuest = (name: string, seat: SeatLocation) => {
    setWarning(null); // clear previous warnings
    setCloudMessage(null);
    const newGuest = orch.addGuest(name, seat);   // add guest to orchestra

    const isOnStage = orch.seats.some(s => s.player?.id === newGuest.id);  // check if guest is seated
    if (!isOnStage) {
      // If not seated, add to removed players list
      setRemovedPlayers(prev => [...prev, newGuest]);
    }

    setIsGuestFormOpen(false);   // close the guest form
    refreshOrchestra();
  }


  // Handle Deleting a Guest
  const handleDeleteGuest = (id: number) => {
    setWarning(null); // clear previous warnings
    setCloudMessage(null);

    // Remove guest from orchestra and removed players list
    orch.deleteGuest(id);
    setRemovedPlayers(prev => prev.filter(p => p.id !== id));

     // if guest was selected, deselect them
    if (selectedPlayers.includes(id)) { 
        setSelectedPlayers(prev => prev.filter(pid => pid !== id));
    }

    refreshOrchestra();
  }


  // filter list for control panel
  const removedRegulars = removedPlayers.filter(p => !p.isGuest);
  const removedGuests = removedPlayers.filter(p => p.isGuest);

  console.log("Firebase DB Connected:", db);

  return (
    <div className="app-layout">

      
      {/* 1. LEFT SIDEBAR */}

      <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      <Controls 
        selectedCount={selectedPlayers.length}
        onClearSelection={() => { setWarning(null); setSelectedPlayers([]); }}
        removedPlayersList={removedRegulars}
        removedGuestsList={removedGuests}
        onRotate={handleRotate}
        onRemove={handleRemoved}
        onReset={handleReset}
        onFillIn={handleFillIn}
        onRestore={handleRestore}
        warning={warning}
        onOpenGuestForm={() => setIsGuestFormOpen(true)}
        onDeleteGuest={handleDeleteGuest}
      />
      </div>

      {/* 2. MAIN STAGE AREA */}
      <div className="main-stage-area">

        <div className="stage-internal-header">
                <h2>{currentStageName}</h2>
                <SaveButton onClick={handleQuickSave} />
                <CameraButton onClick={handleSnapshot} />
            </div>

        <Stage 
          orchestra={orch}
          selectedPlayers={selectedPlayers}
          toggleSelection={toggleSelection}
        />
      </div>

      {/* 3. RIGHT SIDEBAR */}
      <div className="right-sidebar">
        <h3>Save / Load Stage</h3>
            <SaveLoad 
              onSave={handleSaveCloud} 
              onLoad={handleLoadCloud} 
              isLoading={isLoading}
              message={cloudMessage}
            />
        </div>

      {/* 4. GUEST FORM MODAL */}
      {isGuestFormOpen && (
        <GuestForm 
            emptySeats={orch.getEmptySeats()}
            onSave={handleAddGuest}
            onCancel={() => setIsGuestFormOpen(false)}
        />
      )}

      {/* 5. SNAPSHOT MODAL */}
      {snapshotImage && (
        <SnapshotModal 
           imageSrc={snapshotImage}
           stageName={currentStageName}
           onClose={() => setSnapshotImage(null)} // Clear memory on close
        />
      )}

    </div>
  );
}

export default App;