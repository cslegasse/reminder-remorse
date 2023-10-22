import { Paper, Typography } from "@mui/material";

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

export const MissedTaskCard = ({ task }: TaskCardProps) => {
    return (
        <Paper
            sx={{
                p: 3,
                paddingTop: (3),
                margin: "5px",
                width: 190,
                minHeight: 250,
                flexGrow: 1,
                backgroundColor: '#200589',
                borderRadius: 5,
                marginBottom: 5
            }}>

            <Paper
                sx={{
                    p: 2,
                    margin: "auto",
                    width: 125,
                    backgroundColor: '#ab20fd',
                    fontSize: "65px",
                }}>
                {(task.emoji || '❌')}
            </Paper>
            <Typography
                sx={{
                    p: 2
                }}>
                {task.name}
            </Typography>
        </Paper>
    )
}