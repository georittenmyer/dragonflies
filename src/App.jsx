import { useState, useEffect, useCallback } from "react";

const TEAM_NAME = "Dragonflies";
const SEASON = "Fall 2025";

const GAMES = [
  { id: 1, date: "Sep 7", day: "Sun", time: "1:45 PM", location: "Jefferson" },
  { id: 2, date: "Sep 14", day: "Sun", time: "11:15 AM", location: "Interbay" },
  { id: 3, date: "Sep 28", day: "Sun", time: "12:15 PM", location: "Green Lake" },
  { id: 4, date: "Oct 5", day: "Sun", time: "8:45 AM", location: "James Baldwin" },
  { id: 5, date: "Oct 12", day: "Sun", time: "12:15 PM", location: "Magnolia North" },
  { id: 6, date: "Oct 19", day: "Sun", time: "10:45 AM", location: "Magnolia North" },
  { id: 7, date: "Oct 26", day: "Sun", time: "12:45 PM", location: "Interbay" },
  { id: 8, date: "Nov 2", day: "Sun", time: "10:45 AM", location: "Parkwood" },
  { id: 9, date: "Nov 9", day: "Sun", time: "8:45 AM", location: "James Baldwin" },
];

const INITIAL_PLAYERS = [
  { id: 1, name: "Geo", role: "coach" },
  { id: 2, name: "Greg", role: "coach" },
  { id: 15, name: "Cedar B", role: "player" },
  { id: 12, name: "Nathaniel D", role: "player" },
  { id: 13, name: "Zachary D", role: "player" },
  { id: 16, name: "Niko P", role: "player" },
  { id: 5, name: "Luke G", role: "player" },
  { id: 8, name: "Emmett H", role: "player" },
  { id: 7, name: "Emmett J", role: "player" },
  { id: 14, name: "Paxton M", role: "player" },
  { id: 4, name: "Oscar P", role: "player" },
  { id: 10, name: "Ryatt R", role: "player" },
  { id: 17, name: "Jonah T", role: "player" },
  { id: 9, name: "Aari V", role: "player" },
];

const INITIAL_AVAILABILITY = {
  "1-1": "available", "1-2": "available", "1-3": "available", "1-4": "available", "1-5": "available", "1-6": "available",
  "2-1": "available", "2-2": "available", "2-3": "available", "2-4": "available", "2-5": "available", "2-6": "available", "2-7": "available", "2-8": "available", "2-9": "available",
  "7-1": "available", "7-2": "available", "7-3": "available", "7-4": "available", "7-5": "available", "7-6": "available", "7-7": "available", "7-8": "available", "7-9": "available",
  "8-2": "available", "8-3": "available", "8-4": "available", "8-5": "available", "8-6": "available", "8-7": "available", "8-8": "available", "8-9": "available",
  "9-1": "available", "9-2": "available", "9-3": "available", "9-4": "available", "9-5": "available", "9-6": "available", "9-7": "available", "9-8": "available", "9-9": "available",
  "12-1": "available", "12-2": "available", "12-3": "available", "12-4": "available", "12-5": "available", "12-6": "available", "12-7": "available", "12-8": "available", "12-9": "available",
  "15-1": "available", "15-2": "unavailable", "15-3": "available", "15-4": "available", "15-5": "available", "15-6": "available", "15-7": "available", "15-8": "available", "15-9": "available",
};

const STORAGE_KEY = "dragonflies-availability-v1";
const SNACKS_KEY = "dragonflies-snacks-v1";

function loadAvailability() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_AVAILABILITY;
  } catch {
    return INITIAL_AVAILABILITY;
  }
}

function saveAvailability(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function loadSnacks() {
  try {
    const saved = localStorage.getItem(SNACKS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveSnacks(data) {
  try {
    localStorage.setItem(SNACKS_KEY, JSON.stringify(data));
  } catch {}
}

function CheckIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function XIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
}
function QuestionIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/><text x="6" y="9" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="600">?</text></svg>;
}
function PinIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1C3.8 1 2 2.8 2 5c0 2.7 4 6 4 6s4-3.3 4-6c0-2.2-1.8-4-4-4z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6" cy="5" r="1.2" stroke="currentColor" strokeWidth="1"/></svg>;
}

function StatusBadge({ status, small }) {
  const s = small ? { fontSize: "11px", padding: "1px 6px", gap: "3px" } : { fontSize: "12px", padding: "2px 8px", gap: "4px" };
  const config = {
    available:   { bg: "#dcfce7", color: "#166534", border: "#bbf7d0", icon: <CheckIcon />,    label: small ? "In" : "Available" },
    unavailable: { bg: "#fee2e2", color: "#991b1b", border: "#fecaca", icon: <XIcon />,        label: small ? "Out" : "Not available" },
    undecided:   { bg: "#fef3c7", color: "#92400e", border: "#fde68a", icon: <QuestionIcon />,  label: small ? "?" : "Undecided" },
  };
  const c = config[status] || config.undecided;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: s.gap,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: "999px", padding: s.padding, fontSize: s.fontSize,
      fontWeight: 500, lineHeight: 1, whiteSpace: "nowrap",
    }}>
      {c.icon}{c.label}
    </span>
  );
}

function PlayerSelector({ players, selectedId, onSelect }) {
  const [open, setOpen] = useState(false);
  const selected = players.find(p => p.id === selectedId);

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px",
        background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)",
        borderRadius: "var(--border-radius-lg)", cursor: "pointer", fontSize: "14px",
        fontWeight: 500, color: "var(--color-text-primary)", fontFamily: "var(--font-sans)",
        minWidth: "180px", justifyContent: "space-between",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: "28px", height: "28px", borderRadius: "50%",
            background: selected?.role === "coach" ? "#dbeafe" : "#e0e7ff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 600,
            color: selected?.role === "coach" ? "#1e40af" : "#4338ca",
          }}>
            {selected?.name?.split(" ").map(n => n[0]).join("") || "?"}
          </span>
          {selected?.name || "Select player"}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
          <path d="M3 5L6 8L9 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
            background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-lg)", padding: "4px", zIndex: 100,
            minWidth: "220px", maxHeight: "320px", overflowY: "auto",
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          }}>
            {players.map(p => (
              <button key={p.id} onClick={() => { onSelect(p.id); setOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px",
                width: "100%", border: "none",
                background: p.id === selectedId ? "var(--color-background-secondary)" : "transparent",
                borderRadius: "6px", cursor: "pointer", fontSize: "13px",
                color: "var(--color-text-primary)", fontFamily: "var(--font-sans)", textAlign: "left",
              }}>
                <span style={{
                  width: "24px", height: "24px", borderRadius: "50%",
                  background: p.role === "coach" ? "#dbeafe" : "#e0e7ff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: 600,
                  color: p.role === "coach" ? "#1e40af" : "#4338ca", flexShrink: 0,
                }}>
                  {p.name.split(" ").map(n => n[0]).join("")}
                </span>
                <span>{p.name}</span>
                {p.role === "coach" && (
                  <span style={{ fontSize: "10px", background: "#dbeafe", color: "#1e40af", padding: "1px 6px", borderRadius: "999px", marginLeft: "auto" }}>Coach</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [availability, setAvailability] = useState(loadAvailability);
  const [snacks, setSnacks] = useState(loadSnacks);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [view, setView] = useState("schedule");

  useEffect(() => { saveAvailability(availability); }, [availability]);
  useEffect(() => { saveSnacks(snacks); }, [snacks]);

  const setStatus = (playerId, gameId, status) => {
    setAvailability(prev => ({ ...prev, [`${playerId}-${gameId}`]: status }));
  };

  const getStatus = (playerId, gameId) => availability[`${playerId}-${gameId}`] || "undecided";

  const getGameCounts = (gameId) => {
    let available = 0, unavailable = 0, undecided = 0;
    INITIAL_PLAYERS.forEach(p => {
      const s = getStatus(p.id, gameId);
      if (s === "available") available++;
      else if (s === "unavailable") unavailable++;
      else undecided++;
    });
    return { available, unavailable, undecided };
  };

  const setSnack = (gameId, name) => setSnacks(prev => ({ ...prev, [gameId]: name }));

  return (
    <div style={{ fontFamily: "var(--font-sans)", maxWidth: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "var(--border-radius-md)",
            background: "linear-gradient(135deg, #059669, #10b981)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
              <path d="M7 12.5L10 9L13 12.5L17 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="16" r="1.5" fill="white"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 500, margin: 0, color: "var(--color-text-primary)" }}>{TEAM_NAME}</h1>
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: 0 }}>{SEASON} schedule</p>
          </div>
        </div>
        <PlayerSelector players={INITIAL_PLAYERS} selectedId={currentPlayer} onSelect={setCurrentPlayer} />
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "2px", marginBottom: "20px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "3px" }}>
        {[{ id: "schedule", label: "Schedule" }, { id: "roster", label: "Roster" }].map(tab => (
          <button key={tab.id} onClick={() => setView(tab.id)} style={{
            flex: 1, padding: "8px 12px", border: "none", borderRadius: "6px",
            fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)",
            background: view === tab.id ? "var(--color-background-primary)" : "transparent",
            color: view === tab.id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
            boxShadow: view === tab.id ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
            transition: "all 0.15s",
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Schedule view */}
      {view === "schedule" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {GAMES.map(game => {
            const counts = getGameCounts(game.id);
            const myStatus = currentPlayer ? getStatus(currentPlayer, game.id) : null;
            return (
              <div key={game.id} style={{
                background: "var(--color-background-primary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--border-radius-lg)", padding: "14px 16px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                      <span style={{ fontSize: "15px", fontWeight: 500, color: "var(--color-text-primary)" }}>{game.day}, {game.date}</span>
                      <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>{game.time}</span>
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <PinIcon />
                      {game.location}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                      <span style={{ color: "#166534", fontWeight: 500 }}>{counts.available}</span> in
                      {counts.unavailable > 0 && <>{" · "}<span style={{ color: "#991b1b", fontWeight: 500 }}>{counts.unavailable}</span> out</>}
                      {counts.undecided > 0 && <>{" · "}<span style={{ color: "#92400e", fontWeight: 500 }}>{counts.undecided}</span> ?</>}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>🍊 Snack:</span>
                  <select
                    value={snacks[game.id] || ""}
                    onChange={e => setSnack(game.id, e.target.value)}
                    style={{
                      fontSize: "12px", color: snacks[game.id] ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                      background: "transparent", border: "0.5px solid var(--color-border-tertiary)",
                      borderRadius: "6px", padding: "2px 6px", cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    <option value="">— pick someone —</option>
                    {INITIAL_PLAYERS.filter(p => p.role === "player").map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {currentPlayer && (
                  <div style={{
                    marginTop: "10px", paddingTop: "10px",
                    borderTop: "0.5px solid var(--color-border-tertiary)",
                    display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap",
                  }}>
                    <span style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginRight: "4px" }}>My status:</span>
                    {["available", "unavailable", "undecided"].map(status => (
                      <button key={status} onClick={() => setStatus(currentPlayer, game.id, status)} style={{
                        padding: "4px 10px", borderRadius: "999px", fontSize: "12px",
                        fontWeight: 500, border: "1.5px solid", cursor: "pointer",
                        fontFamily: "var(--font-sans)", transition: "all 0.12s",
                        background: myStatus === status
                          ? status === "available" ? "#dcfce7" : status === "unavailable" ? "#fee2e2" : "#fef3c7"
                          : "transparent",
                        borderColor: myStatus === status
                          ? status === "available" ? "#86efac" : status === "unavailable" ? "#fca5a5" : "#fcd34d"
                          : "var(--color-border-tertiary)",
                        color: myStatus === status
                          ? status === "available" ? "#166534" : status === "unavailable" ? "#991b1b" : "#92400e"
                          : "var(--color-text-secondary)",
                      }}>
                        {status === "available" ? "Available" : status === "unavailable" ? "Not available" : "Undecided"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {!currentPlayer && (
            <div style={{
              textAlign: "center", padding: "16px", fontSize: "13px",
              color: "var(--color-text-secondary)", background: "var(--color-background-secondary)",
              borderRadius: "var(--border-radius-md)",
            }}>
              Select your name above to mark your availability
            </div>
          )}
        </div>
      )}

      {/* Roster view */}
      {view === "roster" && (
        <div style={{
          overflowX: "auto", borderRadius: "var(--border-radius-lg)",
          border: "0.5px solid var(--color-border-tertiary)",
        }}>
          <div style={{ minWidth: "640px" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "140px repeat(9, 1fr)",
              background: "var(--color-background-secondary)", padding: "8px 0",
              fontSize: "11px", fontWeight: 500, color: "var(--color-text-secondary)", textAlign: "center",
            }}>
              <span style={{ textAlign: "left", paddingLeft: "12px" }}>Player</span>
              {GAMES.map(g => <span key={g.id} style={{ lineHeight: "1.2" }}>{g.date.split(" ")[0]}<br/>{g.date.split(" ")[1]}</span>)}
            </div>
            {INITIAL_PLAYERS.map(player => (
              <div key={player.id} style={{
                display: "grid", gridTemplateColumns: "140px repeat(9, 1fr)",
                background: "var(--color-background-primary)", padding: "6px 0",
                alignItems: "center", fontSize: "12px",
                borderTop: "0.5px solid var(--color-border-tertiary)",
              }}>
                <span style={{
                  paddingLeft: "12px", fontWeight: 500, color: "var(--color-text-primary)",
                  fontSize: "12px", display: "flex", alignItems: "center", gap: "4px",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {player.name}
                  {player.role === "coach" && (
                    <span style={{ fontSize: "9px", background: "#dbeafe", color: "#1e40af", padding: "1px 4px", borderRadius: "999px", flexShrink: 0 }}>C</span>
                  )}
                </span>
                {GAMES.map(g => (
                  <span key={g.id} style={{ display: "flex", justifyContent: "center" }}>
                    <StatusBadge status={getStatus(player.id, g.id)} small />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
