import { Box, IconButton, Typography, Stack } from '@mui/joy';
import { Trophy, User, Skull, Plus, Minus, Target } from 'lucide-react';

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

import React, { useState } from 'react';

type Props = {
    players: Player[];
    onAdd: (idx: number) => void;
    onSubtract: (idx: number) => void;
    onChangeNumber?: (idx: number, newNumber: number) => void;
    onChangeName?: (idx: number, newName: string) => void;
    onRemovePlayer?: (idx: number) => void;
};

export default function PlayerList({ players, onAdd, onSubtract, onChangeNumber, onChangeName, onRemovePlayer }: Props) {
    const sortedPlayers = [...players].sort((a, b) => b.number - a.number);
    const [editNumberIdx, setEditNumberIdx] = useState<number | null>(null);
    const [editNameIdx, setEditNameIdx] = useState<number | null>(null);
    const [tempNumber, setTempNumber] = useState<string>('');
    const [tempName, setTempName] = useState<string>('');

    return (
        <Stack spacing={2} sx={{ width: '100%', alignItems: 'center', mt: 2 }}>
            {sortedPlayers.map((p, idx) => {
                // Find the original index in the unsorted array for callbacks
                const origIdx = players.findIndex(pl => pl === p);
                return (
                    <Box
                        key={idx}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'stretch',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: 400,
                            borderRadius: 8,
                            backgroundColor: getPlayerBg(p, idx),
                            color: getPlayerTextColor(p),
                            py: 0,
                            px: 0,
                            boxShadow: 'md',
                            minHeight: 80,
                        }}
                    >
                        {/* Subtract button - left edge, full height */}
                        <IconButton
                            variant="soft"
                            color="neutral"
                            onClick={() => onSubtract(origIdx)}
                            disabled={p.eliminated || p.score <= 0}
                            sx={{ color: getPlayerTextColor(p), borderRadius: '8px 0 0 8px', height: '100%', minWidth: 56, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Minus size={28} />
                        </IconButton>
                        {/* Center section: name, number, score */}
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 1 }}>
                            {/* Editable name */}
                            {editNameIdx === idx ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={e => setTempName(e.target.value)}
                                        style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', borderRadius: 4, border: '1px solid #ccc', padding: '2px 8px' }}
                                    />
                                    <IconButton size="sm" onClick={() => {
                                        if (onChangeName) onChangeName(origIdx, tempName);
                                        setEditNameIdx(null);
                                    }}><Plus size={18} /></IconButton>
                                    <IconButton size="sm" color="danger" onClick={() => {
                                        if (onRemovePlayer) onRemovePlayer(origIdx);
                                        setEditNameIdx(null);
                                    }}><Skull size={18} /></IconButton>
                                </Box>
                            ) : (
                                <Typography
                                    level="title-md"
                                    sx={{ fontWeight: 'bold', textAlign: 'center', cursor: 'pointer' }}
                                    onClick={() => {
                                        setEditNameIdx(idx);
                                        setTempName(p.name);
                                    }}
                                >{p.name}</Typography>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
                                <Target color="#E3292E" size={20} style={{ marginRight: 4, cursor: 'pointer' }}
                                    onClick={() => {
                                        setEditNumberIdx(idx);
                                        setTempNumber(String(p.number));
                                    }}
                                />
                                {editNumberIdx === idx ? (
                                    <input
                                        type="number"
                                        value={tempNumber}
                                        onChange={e => setTempNumber(e.target.value)}
                                        style={{ fontSize: 16, fontWeight: 'bold', width: 48, textAlign: 'center', borderRadius: 4, border: '1px solid #ccc', marginRight: 8 }}
                                        onBlur={() => {
                                            if (onChangeNumber && tempNumber !== '') onChangeNumber(origIdx, Number(tempNumber));
                                            setEditNumberIdx(null);
                                        }}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                if (onChangeNumber && tempNumber !== '') onChangeNumber(origIdx, Number(tempNumber));
                                                setEditNumberIdx(null);
                                            }
                                        }}
                                    />
                                ) : (
                                    <Typography level="body-md" sx={{ fontWeight: 'bold', mr: 2, cursor: 'pointer' }}
                                        onClick={() => {
                                            setEditNumberIdx(idx);
                                            setTempNumber(String(p.number));
                                        }}
                                    >{p.number}</Typography>
                                )}
                                {/* Score with status icon */}
                                {p.isKiller ? (
                                    <Trophy color="#E3292E" size={20} style={{ marginRight: 4 }} />
                                ) : p.eliminated ? (
                                    <Skull color="#757575" size={20} style={{ marginRight: 4 }} />
                                ) : (
                                    <User color="#309F6A" size={20} style={{ marginRight: 4 }} />
                                )}
                                <Typography level="body-md" sx={{ fontWeight: 'bold', minWidth: 24, textAlign: 'center' }}>{p.score}</Typography>
                            </Box>
                        </Box>
                        {/* Add button - right edge, full height */}
                        <IconButton
                            variant="soft"
                            color="neutral"
                            onClick={() => onAdd(origIdx)}
                            disabled={p.eliminated || p.score >= 5}
                            sx={{ color: getPlayerTextColor(p), borderRadius: '0 8px 8px 0', height: '100%', minWidth: 56, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Plus size={28} />
                        </IconButton>
                    </Box>
                );
            })}
        </Stack>
    );
}
