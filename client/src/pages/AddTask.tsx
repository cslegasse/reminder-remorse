import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Container as MuiContainer, Button, TextField, Typography } from "@mui/material";

import { CustomEmojiPicker } from "../components";

import toast from "react-hot-toast";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { ColorPalette } from "@/lib/theme";

// owner_id (int), name (string), desc (string), emoji (string), category (string), deadline (int), completed (bool), pinned (bool), habit_frequency (int)

export type TaskUpload = {
  owner_id: number;
  org_id?: number;
  friend_id?: number;
  name: string;
  desc?: string;
  emoji?: string;
  category?: string;
  deadline: number;
  habit_frequency?: number;
  incentive_min: number;
  incentive_max: number;
};

export const AddTask = () => {
  const friends = mockFriends; // TODO: REPLACE
  const charities = mockCharities; // TODO: REPLACE
  const categories = mockCategories; // TODO: REPLACE
  const navigate = useNavigate();
  const [taskUploadData, setTaskUploadData] = useState<TaskUpload>({
    owner_id: 0,
    org_id: undefined,
    friend_id: undefined,
    name: "",
    desc: undefined,
    emoji: undefined,
    category: undefined,
    deadline:
      Math.floor((new Date().getTime() - new Date().getTimezoneOffset() * 60000) / 1000) + 3600,
    habit_frequency: undefined,
    incentive_min: 1,
    incentive_max: 5,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  // After fetching friends, frineds would be populated. If no friends, can only donate to orgs
  const hasNoFriends = friends.length === 0;
  const [isSendingToFriend, setIsSendingToFried] = useState(!hasNoFriends);

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "deadline") {
      setTaskUploadData((prevData) => ({
        ...prevData,
        deadline: Math.floor(
          (new Date(e.target.value).getTime() -
            new Date(e.target.value).getTimezoneOffset() * 60000) /
            1000
        ),
      }));
      return;
    }
    setTaskUploadData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEmojiChange = (emoji: string | undefined) => {
    setTaskUploadData((prevData) => ({
      ...prevData,
      emoji: emoji,
    }));
  };

  const handleAddTask = () => {
    const newTask: TaskUpload = {
      ...taskUploadData,
    };
    setIsSubmitting(true);
    console.log(newTask);
    setIsSubmitting(false);
    navigate("/tasks");
    toast.success(() => (
      <div>
        Added task - <b>{newTask.name}</b>
      </div>
    ));
  };

  return (
    <MuiContainer maxWidth="md">
      <Typography variant="h4" textAlign="center">
        Add new task
      </Typography>
      <Container>
        <CustomEmojiPicker emoji={taskUploadData.emoji} setEmoji={handleEmojiChange} />
        <StyledInput
          label="Task Name"
          name="name"
          placeholder="Enter task name"
          value={taskUploadData.name}
          onChange={handleDataChange}
          focused
          required={true}
        />
        <StyledInput
          label="Task Description"
          name="desc"
          placeholder="Enter task description"
          value={taskUploadData.desc}
          onChange={handleDataChange}
          multiline
          rows={4}
          focused
        />
        <StyledInput
          label="Task Deadline"
          name="deadline"
          placeholder="Enter deadline date"
          type="datetime-local"
          inputProps={{
            min: new Date().toISOString().slice(0, -8),
          }}
          // unix timestamp to datetime-local
          value={new Date(taskUploadData.deadline * 1000).toISOString().slice(0, -8)}
          onChange={handleDataChange}
          focused
          required={true}
        />
        <RowFlex>
          <StyledHalf
            label="Incentive range: from"
            name="incentive_min"
            placeholder="Amount in dollars"
            value={taskUploadData.incentive_min}
            onChange={handleDataChange}
            focused
            type="number"
            inputProps={{
              min: 0,
              max: taskUploadData.incentive_max,
            }}
            sx={{
              width: "180px",
            }}
          />
          <StyledHalf
            label="to"
            name="name"
            placeholder="Amount in dollars"
            value={taskUploadData.incentive_max}
            onChange={handleDataChange}
            focused
            type="number"
            inputProps={{
              min: taskUploadData.incentive_min,
              max: 20,
            }}
            sx={{
              width: "180px",
            }}
          />
        </RowFlex>

        <Typography mt="12px">Where do you want to send the money?</Typography>
        <RadioGroup
          row
          aria-labelledby="PaymentType"
          name="PaymentType"
          value={isSendingToFriend}
          onChange={(e) => {
            setIsSendingToFried(e.target.value === "true");
          }}
        >
          <FormControlLabel
            disabled={hasNoFriends}
            value={true}
            control={<Radio />}
            label="Friend"
          />
          <FormControlLabel value={false} control={<Radio />} label="Charity" />
        </RadioGroup>

        {/* TODO: Fix styling for this */}
        {!hasNoFriends && isSendingToFriend ? (
          <Select
            sx={{
              width: "400px",
              borderRadius: "16px",
              color: "white",
              "::placeholder": {
                color: "white",
              },
              transition: "0.3s all",
            }}
            id="selectPaymentDestination"
            value={taskUploadData.friend_id?.toString()}
            onChange={(e: SelectChangeEvent) => {
              setTaskUploadData((prevData) => ({
                ...prevData,
                friend_id: parseInt(e.target.value as string),
              }));
            }}
            placeholder="Choose a friend"
            label="Choose a friend"
          >
            {friends.map((friend) => (
              <MenuItem key={friend.id} value={friend.id}>
                {friend.name}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Select
            sx={{
              width: "400px",
            }}
            id="selectPaymentDestination"
            value={taskUploadData.org_id?.toString()}
            onChange={(e: SelectChangeEvent) => {
              setTaskUploadData((prevData) => ({
                ...prevData,
                org_id: parseInt(e.target.value as string),
              }));
            }}
            placeholder="Choose a charity"
            label="Choose a charity"
          >
            {charities.map((charity) => (
              <MenuItem key={charity.id} value={charity.id}>
                {charity.name}
              </MenuItem>
            ))}
          </Select>
        )}

        <Select
          sx={{
            marginTop: 2,
            width: "400px",
          }}
          id="selectCategory"
          placeholder="Choose a category"
          label="Choose a category"
          value={taskUploadData.category?.toString()}
          onChange={(e: SelectChangeEvent) => {
            setTaskUploadData((prevData) => ({
              ...prevData,
              category: e.target.value as string,
            }));
          }}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>

        <AddTaskButton onClick={handleAddTask} disabled={isSubmitting}>
          Create Task
        </AddTaskButton>
      </Container>
    </MuiContainer>
  );
};

const StyledInput = styled(TextField)`
  margin: 12px;
  .MuiOutlinedInput-root {
    border-radius: 16px;
    transition: 0.3s all;
    width: 400px;
    color: white;
  }
`;

const StyledHalf = styled(TextField)`
  margin: 8px 24px 12px 12px;
  .MuiOutlinedInput-root {
    border-radius: 16px;
    transition: 0.3s all;
    width: 190px;
    color: white;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const AddTaskButton = styled(Button)`
  border: none;
  padding: 18px 48px;
  font-size: 24px;
  background: ${ColorPalette.purple};
  color: #ffffff;
  border-radius: 26px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s all;
  margin: 20px;
  width: 400px;
  text-transform: capitalize;
  &:hover {
    box-shadow: 0px 0px 24px 0px #7614ff;
    background: ${ColorPalette.purple};
  }
  &:disabled {
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.7;
    color: white;
  }
`;

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
`;

const mockFriends = [
  // {
  //   id: 1,
  //   name: "John",
  // },
  // {
  //   id: 2,
  //   name: "jane",
  // },
];

const mockCharities = [
  {
    id: 1,
    name: "charity1",
  },
  {
    id: 2,
    name: "charity2",
  },
];

const mockCategories = ["Work", "School", "Health", "Family"];
