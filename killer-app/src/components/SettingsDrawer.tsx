"use client";
import Drawer from '@mui/joy/Drawer';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Divider from '@mui/joy/Divider';
import Input from '@mui/joy/Input';
import { useState } from 'react';


type Props = {
    open: boolean;
    onClose: () => void;
    onAddPlayer: (name: string, number: number) => void;
    availableNumbers: number[];
    onNewGame: () => void;
    onResetPlayers: () => void;
};


export default function SettingsDrawer({ open, onClose, onAddPlayer, availableNumbers, onNewGame, onResetPlayers }: Props) {
    const famousPlayers = [
        { name: 'Isak', nickname: 'Iceman' },
        { name: 'Fredrik', nickname: 'Fredelicious' },
        { name: 'Gustav', nickname: 'Gurra G' },
        { name: 'Ludwig', nickname: 'L. Jannerdart' },
        { name: 'Emil', nickname: 'Eagle Eye Emil' },
    ];

    const [name, setName] = useState('');
    const [number, setNumber] = useState<number | null>(null);
    const [selectedFamous, setSelectedFamous] = useState('');

    const handleFamousChange = (_e: React.SyntheticEvent | null, value: string | null) => {
        setSelectedFamous(value || '');
        if (value) {
            const fp = famousPlayers.find(fp => fp.name === value);
            if (fp) {
                setName(fp.nickname);
            }
        } else {
            setName('');
        }
    };

    const handleAdd = () => {
        if (!name || number === null) return;
        onAddPlayer(name, Number(number));
        setName('');
        setNumber(null);
        setSelectedFamous('');
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 300, p: 2, bgcolor: '#000', color: '#fff', fontFamily: 'Montserrat, Quicksand, Poppins, sans-serif' }}>
                <Typography level="h4" sx={{ mb: 1 }}>Settings</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography level="title-md">Add New Player</Typography>
                <Select
                    value={selectedFamous}
                    onChange={handleFamousChange}
                    sx={{ mb: 2 }}
                    placeholder="Famous players"
                >
                    <Option value="">Famous players</Option>
                    {famousPlayers.map(fp => (
                        <Option key={fp.name} value={fp.name}>{fp.name} - {fp.nickname}</Option>
                    ))}
                </Select>
                <Input placeholder="Name" value={name} onChange={(_e) => { setName((_e.target as HTMLInputElement).value); setSelectedFamous(''); }} fullWidth sx={{ mb: 2 }} />
                <Select
                    value={number}
                    onChange={(_e, value) => setNumber(value as number)}
                    placeholder="Number"
                >
                    <Option value={null}>Number</Option>
                    {availableNumbers.map(n => (
                        <Option key={n} value={n}>{n}</Option>
                    ))}
                </Select>
                <Button color="primary" variant="solid" onClick={handleAdd} sx={{ mt: 2, mb: 2 }} fullWidth>Add Player</Button>
                <Divider sx={{ mb: 2 }} />
                <Button color="primary" variant="outlined" onClick={onNewGame} fullWidth sx={{ mb: 1 }}>New Game (Keep Players)</Button>
                <Button color="danger" variant="outlined" onClick={onResetPlayers} fullWidth>Reset All Players</Button>
            </Box>
        </Drawer>
    );
}
