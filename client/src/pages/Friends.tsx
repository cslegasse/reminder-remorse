import {
  Avatar, Button, Typography, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, List, ListItem, ListItemAvatar, ListItemText,
  TextField
} from "@mui/material";
import { fetchEndpoint } from "@/utils/fetch";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { FriendContainer } from "@/styles";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { userFromDb } from "@/types/userFromDb";
import { renderToStaticMarkup } from "react-dom/server";
import toast from "react-hot-toast"
interface Friend {
  id: number;
  fname: string;
  lname: string;
  Avatar: string | undefined;
  taskCompleted: number;
  habitsKept: number;
}

export const Friends = () => {
  //hook fetches excessively, so it might be a good idea to 
  //use something else if we'd want to use this in production
  const [currentUserData, setCurrentUserData] = useState<null | any>(null);
  const [friends, setFriends] = useState<Friend[]>(mockData);
  const [currentUserSelected, setCurrentUserSelected] = useState<undefined | Friend>(undefined);

  const [isSelectingUser, setIsSelectingUser] = useState<boolean>(false);
  const [isAddingFriend, setIsAddingFriend] = useState<boolean>(false);
  const [addFriendId, setAddFriendId] = useState<string>("");

  useEffect(() => {
    fetchEndpoint("leaderboard?id=0", "GET").then((data) => {
      data = data.sort((a: Friend, b: Friend) => {
        if (a.fname > b.fname) {
          return 1;
        } else if (a.fname < b.fname) {
          return -1;
        } else {
          return 0;
        }
      });
      setFriends(data);
    })
  })


  const currentUserSnapshot = useCurrentUser();

  useEffect(() => {
    const fetchUser = async () => {
      setCurrentUserData(await currentUserSnapshot);
    }
    fetchUser();
  }, [currentUserSnapshot])

  // console.log(currentUserData);


  useEffect(() => {
    const fetchUser = async () => {
      setCurrentUserData(await currentUserSnapshot);
    }
    fetchUser();
  }, [currentUserSnapshot])

  // console.log(currentUserData);

  const handleUserSelect = (friend: Friend) => {
    setCurrentUserSelected(friend);
    setIsSelectingUser(true);
  }
  const handleClose = () => {
    setIsSelectingUser(false);
  }

  const handleCloseAddFriend = () => {
    setIsAddingFriend(false);
  }

  const handleChangeNewFriendId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddFriendId(e.target.value);
  }

  // const [addFriendState, setAddFriendState] = useState<any>(undefined);

  const handleAddNewFriend = () => {
    fetchEndpoint(`add-friend?id=0&friend_id=${addFriendId}`, "GET")
    .then((data) => {
      // setAddFriendState(data);
      toast.success("Friend added!");
    });
    setIsSelectingUser(false);
  };

  const handleRemoveFriend = () => {
    fetchEndpoint(`remove-friend?id=0&friend_id=${currentUserSelected?.id}`, "GET")
    .then((data) => {
      toast("Friend removed.")
    });
    setIsSelectingUser(false);
  }

  return (
    <>
      <h1>Friends</h1>
      <Button
        variant="outlined"
        onClick={() => { setIsAddingFriend(true) }}
        startIcon={
          <PersonAddAlt1Icon
            sx={{
              color: "white"
            }} />}
      >

        Add a new friend
      </Button>
      <List>
        {friends.map((friend) => (
          <FriendContainer
            backgroundColor={"#2d26a6"}
            clr="#ffffff"
            glow={false}
            done={false}
          >

            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => { handleUserSelect(friend) }}
                >
                  <DeleteIcon />
                </IconButton>
              }>
              <ListItemAvatar>
                <Avatar alt="avatar" src={friend.Avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={friend.fname + " " + friend.lname}
                secondary={
                  <Typography
                    sx={{
                      color: "#fa5757",
                      fontStyle: "italic"
                    }}>
                    This friend has {friend.taskCompleted.toString()} tasks completed and{' '}
                    {friend.habitsKept.toString()} habits kept.
                  </Typography>}
              />
            </ListItem>
          </FriendContainer>
        ))}
      </List >
      <Dialog
        id="deleteFriendDialog"
        open={isSelectingUser}
        onClose={handleClose}>
        <DialogTitle
          sx={{
            color: "black"
          }}>
          Remove {currentUserSelected?.fname} {currentUserSelected?.lname} as a friend?
        </DialogTitle>
        <DialogContent
          sx={{
            color: "black"
          }}>
          <p>Current tasks that have this friend accountable will still be kept as is.</p>
        </DialogContent>
        <DialogActions
          id="deleteFriendDialog">
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleRemoveFriend}>Remove</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        id="AddFriendDialog"
        open={isAddingFriend}
        onClose={handleCloseAddFriend}>
        <DialogTitle
          sx={{
            color: "black"
          }}>
          Add a friend with userID
        </DialogTitle>
        <DialogContent
          sx={{
            color: "black"
          }}>
          <p>Your ID is: <i> {currentUserData?.id}</i></p>
          Enter a friend's ID to add them as a friend:
          <TextField
            label="Friend ID"
            value={addFriendId}
            onChange={handleChangeNewFriendId}
            sx={{
              input: {
                color: "black"
              }
            }}
          />
        </DialogContent>
        <DialogActions
          id="deleteFriendDialog">
          <Button onClick={handleCloseAddFriend}>Cancel</Button>
          <Button onClick={handleAddNewFriend}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


const mockData: Friend[] = [
  {
    id: 1,
    fname: "John",
    lname: "Doe",
    Avatar: undefined,
    taskCompleted: 100,
    habitsKept: 1,
  },
  {
    id: 2,
    fname: "Jane",
    lname: "Doe",
    Avatar: undefined,
    taskCompleted: 25,
    habitsKept: 3
  }
]
