"use client";
import { useState } from "react";
import { useMediaQuery } from "@mui/material";
import { CssVarsProvider, Box, Typography, Button, IconButton } from '@mui/joy';
import MenuIcon from '@mui/icons-material/Menu';
import PlayerList, { Player } from "./PlayerList";
import SettingsDrawer from "./SettingsDrawer";

function getAvailableNumbers(players: Player[]) {
    const used = new Set(players.map((p) => p.number));
    return Array.from({ length: 20 }, (_, i) => i + 1).filter((n) => !used.has(n));
}

export default function KillerApp() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [winner, setWinner] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');


    function addPlayer(name: string, number: number) {
        setPlayers((prev) => [
            ...prev,
            {
                name,
                number,
                score: 0,
                isKiller: false,
                eliminated: false,
            },
        ]);
    }

    function addScore(idx: number) {
        setPlayers((prev) => {
            const updated = prev.map((p, i) => {
                if (i !== idx || p.eliminated || p.score >= 5) return p;
                const newScore = p.score + 1;
                let becameKiller = false;
                if (!p.isKiller && newScore >= 5) {
                    becameKiller = true;
                }
                return {
                    ...p,
                    score: newScore,
                    isKiller: p.isKiller || becameKiller,
                };
            });
            // If someone becomes killer, eliminate all with score 0
            const killersNow = updated.filter((p) => p.isKiller);
            const newKiller = killersNow.length > prev.filter((p) => p.isKiller).length;
            if (newKiller) {
                for (const p of updated) {
                    if (p.score === 0 && !p.eliminated) {
                        p.eliminated = true;
                    }
                }
            }
            const alive = updated.filter((p) => !p.eliminated);
            if (alive.length === 1) {
                setWinner(alive[0].name);
            }
            return [...updated];
        });
    }

    function subtractScore(idx: number) {
        setPlayers((prev) => {
            const updated = prev.map((p, i) => {
                if (i !== idx || p.eliminated || p.score <= 0) return p;
                const newScore = p.score - 1;
                // If a killer drops below 5, lose killer status
                return {
                    ...p,
                    score: newScore,
                    isKiller: newScore >= 5,
                };
            });
            return [...updated];
        });
    }


    function newGame() {
        setPlayers((prev) => prev.map(p => ({ ...p, score: 0, isKiller: false, eliminated: false })));
        setWinner(null);
    }

    function resetPlayers() {
        setPlayers([]);
        setWinner(null);
    }

    return (
        <CssVarsProvider>
            <Box sx={{ bgcolor: '#000', minHeight: '100vh' }}>
                {/* Header */}
                <Box sx={{ position: 'relative', pt: 4, pb: 2 }}>
                    <Typography level="h1" sx={{ color: '#E3292E', fontWeight: 'bold', letterSpacing: 2, fontFamily: 'Montserrat, Quicksand, Poppins, sans-serif', textAlign: 'center' }}>
                        Killer
                    </Typography>
                    <IconButton
                        color="primary"
                        size="md"
                        sx={{ position: 'absolute', top: 0, right: 0, m: 2, zIndex: 10 }}
                        onClick={() => setDrawerOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Box sx={{ maxWidth: 600, mx: 'auto', pt: isMobile ? 2 : 4, pb: 4 }}>
                    {winner ? (
                        <Box sx={{ bgcolor: '#F9DFBC', p: 2, borderRadius: 2, mb: 2, textAlign: 'center' }}>
                            <Typography level="h3" sx={{ color: '#309F6A' }}>Winner: {winner} 🎉</Typography>
                            <Button color="primary" variant="solid" onClick={newGame} sx={{ mt: 2 }}>Start New Game</Button>
                        </Box>
                    ) : null}
                    <PlayerList players={players} onAdd={addScore} onSubtract={subtractScore} />
                </Box>
                <SettingsDrawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    onAddPlayer={addPlayer}
                    availableNumbers={getAvailableNumbers(players)}
                    onNewGame={newGame}
                    onResetPlayers={resetPlayers}
                />
            </Box>
        </CssVarsProvider>
    );
}


