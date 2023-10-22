import { Paper, Typography, Box } from "@mui/material";

import { formatDate, formatInterval } from "../../utils/formatDate";

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
        "charge": number,
    }
};

export const TaskCard = ({ task }: TaskCardProps) => {
    return (
        <Paper
            sx={{
                p: 3,
                paddingTop: ((task.pinned || task.habit_frequency) ? 1 : 3),
                margin: "auto",
                maxWidth: 800,
                flexGrow: 1,
                backgroundColor: '#200589',
                borderRadius: 5,
                marginBottom: 5
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
                    {task.emoji || '💸'}
                </Paper>
                <Box>

                </Box>
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
                                    {task.name}{task.category === '' ? '' : ', '}
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
                                            {(task.incentive_max * .001).toFixed(5)} ETH saved.
                                        </>
                                        :
                                        (task.failed ?
                                            <> Lost {(task.charge * .001).toFixed(5)} ETH.</>
                                            :
                                            <>{(task.incentive_min * .001).toFixed(5)} ETH &ndash; {(task.incentive_max * .001).toFixed(5)} ETH AT STAKE</>
                                        )
                                }
                            </Typography>
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

        </Paper >
    );
}
/*

                {task.desc ? <><br />{task.desc}</> : <></>}
                <br />Do by {formatDate(task.deadline)}
                {task.habit_frequency > 0 ? <><br />Habit: {formatInterval(task.habit_frequency)}</> : <></>}

*/