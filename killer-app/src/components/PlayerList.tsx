import { Box, IconButton, Typography, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export type Player = {
    name: string;
    number: number;
    score: number;
    isKiller: boolean;
    eliminated: boolean;
};


const cream = '#F9DFBC';
const gray = '#B0B0B0';
const green = '#309F6A';
const dead = '#757575';

function getPlayerBg(player: Player, idx: number) {
    if (player.isKiller) return green;
    if (player.eliminated) return dead;
    return idx % 2 === 0 ? cream : gray;
}

function getPlayerTextColor(player: Player) {
    if (player.isKiller || player.eliminated) return '#fff';
    return '#000';
}

type Props = {
    players: Player[];
    onAdd: (idx: number) => void;
    onSubtract: (idx: number) => void;
};

export default function PlayerList({ players, onAdd, onSubtract }: Props) {
    return (
        <Stack spacing={2} sx={{ width: '100%', alignItems: 'center', mt: 2 }}>
            {players.map((p, idx) => (
                <Box
                    key={idx}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        maxWidth: 400,
                        borderRadius: 2,
                        bgcolor: getPlayerBg(p, idx),
                        color: getPlayerTextColor(p),
                        py: 2,
                        px: 1,
                        boxShadow: 2,
                    }}
                >
                    <IconButton
                        onClick={() => onSubtract(idx)}
                        disabled={p.eliminated || p.score <= 0}
                        sx={{ color: getPlayerTextColor(p) }}
                    >
                        <RemoveIcon />
                    </IconButton>
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{p.name}</Typography>
                        <Typography variant="body2">Score: {p.score} {p.isKiller ? '(Killer)' : p.eliminated ? '(Dead)' : ''}</Typography>
                    </Box>
                    <IconButton
                        onClick={() => onAdd(idx)}
                        disabled={p.eliminated || p.score >= 5}
                        sx={{ color: getPlayerTextColor(p) }}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>
            ))}
        </Stack>
    );
}
