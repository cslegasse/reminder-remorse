import {
    IconButton,
    Button,
    Paper,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchEndpoint } from "@/utils/fetch";
import { useState } from "react";

import { formatDate, formatInterval } from "../../utils/formatDate";

import { toast } from "react-hot-toast";

interface TaskCardProps {
    task: {
        "category": string;
        "completed": boolean;
        "completed_at": number;
        "created_at": number;
        "deadline": number;
        "desc": string;
        "emoji": string;
        "failed": boolean;
        "friend_id": string;
        "habit_frequency": number;
        "id": number;
        "incentive_max": number,
        "incentive_min": number,
        "name": string,
        "owner_id": number,
        "pinned": boolean,
        "charge": number
    },
    onUpdate: () => void
}

export const TaskCard = ({ task, onUpdate }: TaskCardProps) => {

    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleDeleteTask = () => {
        fetchEndpoint(`delete-reminder?id=${task.id}`, "GET").then(() => {
            toast.success("Task deleted.");
            onUpdate();
        }).catch(() => {
            toast.error("Error deleting task.");
        });
        setIsDeleting(false);
    }

    const handleCheckTask = () => {
        fetchEndpoint(`check-reminder?id=${task.id}`, "GET").then((data) => {
            if (data.status === 0)
                toast.success("Successfully completed " + task.name + "! You saved " + (task.incentive_max * .001).toFixed(4) + " ETH!");
            else
                toast.error("You aren't able to check off this task.");
            onUpdate();
        });
    }

    return (
        <Paper
            sx={{
                paddingLeft: 3,
                paddingTop: ((task.pinned || task.habit_frequency) ? 1 : 3),
                margin: "auto",
                flexGrow: 1,
                backgroundColor: '#200589',
                borderRadius: 5,
                marginBottom: 3,
                width: "80%",
            }}>
            {
                task.habit_frequency != 0 &&
                <Typography
                    variant='overline'
                    sx={{
                        color: '#',
                        borderRadius: 5,
                        margin: '0 0 0 0px'
                    }}
                    display="inline"
                >
                    Habit: {formatInterval(task.habit_frequency)}
                </Typography>
            }
            {

            }
            {task.pinned &&
                <Typography
                    variant='overline'
                    sx={{
                        color: '#',
                        borderRadius: 5,
                        margin: (task.habit_frequency != 0) ? '0' : '0 0 0 25px'
                    }}
                    display="inline"
                >
                    {task.habit_frequency != 0 && ", "}📌 PINNED
                </Typography>
            }

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >

                <Paper
                    sx={{
                        p: 2,
                        margin: "auto",
                        width: 125,
                        backgroundColor: '#ab20fd',
                        fontSize: "65px",
                    }}>
                    {task.completed ? '✅' : (task.emoji || '💸')}
                </Paper>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            flexGrow: 1,
                            marginLeft: 0
                        }}
                    >

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                                marginLeft: 2
                            }}
                        >
                            <>
                                <Typography
                                    variant='h6'
                                    sx={{
                                        color: '#ffffff',

                                    }}
                                    display="inline"
                                >
                                    {(task.completed ? task.emoji+' ' : '') + task.name}{task.category === '' ? '' : ', '}
                                    <Typography
                                        sx={{
                                            color: '#c2c2c2',

                                        }}
                                        display="inline"
                                    >
                                        <i>{task.category}</i>
                                    </Typography>
                                </Typography>
                            </>
                            <Typography
                                sx={{
                                    color: task.completed ? '#39FF14' : (task.failed ? '#FF3131' : '#FFFF33'),
                                    justifyContent: 'flex-end'
                                }}
                            >
                                {
                                    task.completed ?
                                        <>
                                            Finished {formatDate(task.completed_at)}
                                        </>

                                        :
                                        (task.failed ?
                                            <>
                                                Supposed to do by {formatDate(task.deadline)}
                                            </>
                                            :
                                            <>
                                                Do by {formatDate(task.deadline)}
                                            </>
                                        )
                                }
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                                marginLeft: 2,
                            }}
                        >
                            <Typography
                                variant='subtitle1'
                                align="right"
                                sx={{
                                    color: !(task.completed || task.failed) ? '#FFFF33' : '#c2c2c2',
                                }}
                            >
                                {
                                    task.completed ?
                                        <>
                                            {(task.incentive_max * .001).toFixed(4)} ETH saved.
                                        </>
                                        :
                                        (task.failed ?
                                            <> Lost {(task.charge * .001).toFixed(4)} ETH.</>
                                            :
                                            <>{(task.incentive_min * .001).toFixed(4)} ETH - {(task.incentive_max * .001).toFixed(4)} ETH AT STAKE</>
                                        )
                                }
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                p: 1
                            }}
                        >
                            <IconButton
                                id="checkbutton"
                                onClick={() => { handleCheckTask() }}
                                sx={{
                                    color: "white",
                                    marginBottom: 1
                                }}
                            >
                                {task.completed ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                            </IconButton>
                            <IconButton
                                id="deleteButton"
                                onClick={() => { setIsDeleting(true) }}
                                sx={{
                                    color: "white"
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>

                    </Box>
                    <Typography
                        sx={{
                            p: 2
                        }}
                    >
                        {task.desc}
                    </Typography>
                </Box>
            </Box>
            <Dialog
                id="deleteFriendDialog"
                open={isDeleting}
                onClose={() => { setIsDeleting(false) }}>
                <DialogTitle
                    sx={{
                        color: "black"
                    }}>
                    Remove {task.name}?
                </DialogTitle>
                <DialogContent
                    sx={{
                        color: "black"
                    }}>
                    <p>This action cannot be undone.</p>
                </DialogContent>
                <DialogActions
                    id="deleteFriendDialog">
                    <Button onClick={() => { setIsDeleting(false) }}>Cancel</Button>
                    <Button onClick={handleDeleteTask}>Remove</Button>
                </DialogActions>
            </Dialog>
        </Paper >
    );
}
/*

                {task.desc ? <><br />{task.desc}</> : <></>}
                <br />Do by {formatDate(task.deadline)}
                {task.habit_frequency > 0 ? <><br />Habit: {formatInterval(task.habit_frequency)}</> : <></>}

*/