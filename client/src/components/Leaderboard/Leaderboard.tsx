import {
    Header,
} from "../../styles";
import { LeaderboardContainer } from "../../styles/tasks.styled";
import { Box, Typography } from "@mui/material";
import { fetchEndpoint } from "../../utils/fetch";
import { useState, useEffect } from "react";
import { Friend } from "../../pages/Friends";

/**
 * Component to display a list of tasks.
 */

export const Leaderboard = (): JSX.Element => {
    //handle API to get friends data
    const [leaderboardData, setLeaderboardData] = useState<Friend[]>([]);
    useEffect(() => {
        fetchEndpoint("leaderboard?id=0", "GET")
            .then((data) => {
                setLeaderboardData(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <LeaderboardContainer>
                <Header
                >
                    Leaderboard
                </Header>
                {leaderboardData.length > 0 ? (
                    leaderboardData.map((friend) => (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                margin: "0",
                                flexDirection: "row",
                            }}
                        >
                            <Typography
                                sx={{
                                    margin: "0 4px 6px",
                                }}
                            >
                                {friend.fname}
                            </Typography>
                            <Typography
                                sx={{
                                    margin: "0 2px 6px",
                                }}
                            >
                                {friend.lname}
                            </Typography>
                            <Typography
                                sx={{
                                    margin: "0 4px 6px",
                                    flexGrow: 1,
                                }}
                            >
                                {friend.taskCompleted.toString()}/{friend.habitsKept.toString()}
                            </Typography>

                        </Box>
                    ))
                ) : (
                    <div>
                        <p>No friends found. Consider adding some friends!</p>
                    </div>
                )
                }
            </LeaderboardContainer >
        </>
    );
};

const mockData = [
    {
        id: 1,
        fname: "John",
        lname: "Doe",
        Avatar: null,
        taskCompleted: 100,
        habitsKept: 1,
    },
    {
        id: 2,
        fname: "Jane",
        lname: "Doe",
        Avatar: null,
        taskCompleted: 25,
        habitsKept: 3
    }
]
