"use client";
import { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Container, Box, Button, useMediaQuery, ThemeProvider, createTheme } from "@mui/material";
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
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
                <AppBar position="static" sx={{ bgcolor: theme.palette.primary.main }}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1, color: theme.palette.primary.contrastText }}>
                            Killer Dart Game
                        </Typography>
                        <IconButton color="inherit" edge="end" onClick={() => setDrawerOpen(true)}>
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="sm" sx={{ pt: isMobile ? 2 : 4, pb: 4 }}>
                    {winner ? (
                        <Box sx={{ bgcolor: theme.palette.success.light, p: 2, borderRadius: 2, mb: 2, textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ color: theme.palette.success.contrastText }}>Winner: {winner} 🎉</Typography>
                            <Button variant="contained" onClick={newGame} sx={{ mt: 2, bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>Start New Game</Button>
                        </Box>
                    ) : null}
                    <PlayerList players={players} onAdd={addScore} onSubtract={subtractScore} />
                </Container>
                <SettingsDrawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    onAddPlayer={addPlayer}
                    availableNumbers={getAvailableNumbers(players)}
                    onNewGame={newGame}
                    onResetPlayers={resetPlayers}
                />
            </Box>
        </ThemeProvider>
    );
}

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#E3292E', // Red
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#309F6A', // Green
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#000000', // Black
            paper: '#F9DFBC', // Cream
        },
        success: {
            main: '#309F6A', // Green
            contrastText: '#FFFFFF',
            light: '#F9DFBC', // Cream for winner
        },
        error: {
            main: '#E3292E', // Red
            contrastText: '#FFFFFF',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#F9DFBC',
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            'sans-serif'
        ].join(','),
    }
});
