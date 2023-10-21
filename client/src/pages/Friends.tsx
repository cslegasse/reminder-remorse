import {
  Avatar, Button, Typography, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, List, ListItem, ListItemAvatar, ListItemText
} from "@mui/material";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { FriendContainer } from "@/styles";

interface Friend {
  id: number;
  fname: string;
  lname: string;
  Avatar: string | undefined;
  taskCompleted: number;
  habitsKept: number;
}
//The app currently have user types set up differently. 
//From what we've discussed I'm assuming we're goingn with hsomething smimilar to thtis; 
//if we decided to go with something similar to this we can change the type instide he types folder

export const Friends = () => {
  const friends = mockData; //REPLACE
  const [currentUserSelected, setCurrentUserSelected] = useState<undefined | Friend>(undefined);

  //this is for smooth animation; 
  //basing the dialog open/close on the currentUserSelected state will make the user disappear too quickly when we exit the window.
  const [isSelectingUser, setIsSelectingUser] = useState<boolean>(false);

  const handleUserSelect = (friend: Friend) => {
    setCurrentUserSelected(friend);
    setIsSelectingUser(true);
  }
  const handleClose = () => {
    setIsSelectingUser(false);
  }

  const handleAddNewFriend = () => {
    return;
  };

  const handleRemoveFriend = () => {
    setIsSelectingUser(false);
  } //TODO: remove friend here with api call

  return (
    <>
      <h1>Friends</h1>
      <Button
        variant="outlined"
        onClick={handleAddNewFriend}
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
                    This friend has {friend.taskCompleted.toString()} tasks completed.
                  </Typography>}
              />
            </ListItem>
          </FriendContainer>
        ))}
      </List >
      <Dialog
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
          <p>Current tasks that has this friend accountable will still be kept. Money will instead be going towards charity.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleRemoveFriend}>Remove</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


const mockData = [
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
