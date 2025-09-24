import { Drawer, Box, Typography, Button, TextField, Select, MenuItem, Divider } from '@mui/material';
import { useState } from 'react';
import { Player } from './PlayerTable';

type Props = {
    open: boolean;
    onClose: () => void;
    onAddPlayer: (name: string, number: number) => void;
    availableNumbers: number[];
    onNewGame: () => void;
    onResetPlayers: () => void;
};

export default function SettingsDrawer({ open, onClose, onAddPlayer, availableNumbers, onNewGame, onResetPlayers }: Props) {
    const [name, setName] = useState('');
    const [number, setNumber] = useState<number | ''>('');

    const handleAdd = () => {
        if (!name || number === '') return;
        onAddPlayer(name, Number(number));
        setName('');
        setNumber('');
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 300, p: 2 }}>
                <Typography variant="h6" gutterBottom>Settings</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle1">Add New Player</Typography>
                <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth sx={{ mb: 2 }} />
                <Select
                    value={number}
                    onChange={e => setNumber(e.target.value as number)}
                    displayEmpty
                    fullWidth
                >
                    <MenuItem value="">Number</MenuItem>
                    {availableNumbers.map(n => (
                        <MenuItem key={n} value={n}>{n}</MenuItem>
                    ))}
                </Select>
                <Button variant="contained" onClick={handleAdd} sx={{ mt: 2, mb: 2 }} fullWidth>Add Player</Button>
                <Divider sx={{ mb: 2 }} />
                <Button variant="outlined" color="primary" onClick={onNewGame} fullWidth sx={{ mb: 1 }}>New Game (Keep Players)</Button>
                <Button variant="outlined" color="error" onClick={onResetPlayers} fullWidth>Reset All Players</Button>
            </Box>
        </Drawer>
    );
}
