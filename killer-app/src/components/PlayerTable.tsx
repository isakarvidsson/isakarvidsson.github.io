import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export type Player = {
    name: string;
    number: number;
    lives: number;
    score: number;
    isKiller: boolean;
    eliminated: boolean;
};

type Props = {
    players: Player[];
    onHit: (idx: number) => void;
    onTakeLife: (idx: number) => void;
};

export default function PlayerTable({ players, onHit, onTakeLife }: Props) {
    return (
        <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Number</TableCell>
                        <TableCell>Lives</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {players.map((p, idx) => (
                        <TableRow key={idx} sx={{ background: p.eliminated ? '#f8d7da' : p.isKiller ? '#ffeeba' : '' }}>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.number}</TableCell>
                            <TableCell>{p.lives}</TableCell>
                            <TableCell>{p.score}</TableCell>
                            <TableCell>{p.eliminated ? 'Eliminated' : p.isKiller ? 'Killer' : 'Player'}</TableCell>
                            <TableCell align="center">
                                {!p.eliminated && (
                                    <>
                                        <IconButton color="primary" onClick={() => onHit(idx)} size="small">
                                            <AddIcon />
                                        </IconButton>
                                        {players.some((pl) => pl.isKiller && !pl.eliminated) && (
                                            <IconButton color="error" onClick={() => onTakeLife(idx)} size="small">
                                                <RemoveIcon />
                                            </IconButton>
                                        )}
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
