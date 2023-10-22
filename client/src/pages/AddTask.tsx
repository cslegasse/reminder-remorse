import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEndpoint } from "@/utils/fetch";
import { Friend } from "@/pages/Friends";

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
  friend_id?: number|string;
  name: string;
  desc?: string;
  emoji?: string;
  category?: string;
  deadline: number;
  habit_frequency?: number;
  incentive_min: number;
  incentive_max: number;
};

type Charity = {
  id: number;
  name: string;
}

export const AddTask = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);
  const categories = mockCategories; // TODO: REPLACE
  const navigate = useNavigate();
  const [taskUploadData, setTaskUploadData] = useState<TaskUpload>({
    owner_id: 0,
    org_id: 0,
    friend_id: '1',
    name: "",
    desc: "",
    emoji: undefined,
    category: "None",
    deadline:
      Math.floor((new Date().getTime() + new Date().getTimezoneOffset() * 60000) / 1000) + 3600,
    habit_frequency: 1,
    incentive_min: 1,
    incentive_max: 5,
  });

  useEffect(() => {
    fetchEndpoint("friends?id=0", "GET")
      .then((data) => {
        console.log(data);
        setFriends(data);
      })
      .catch((err) => {
        console.log(err);
      });
    fetchEndpoint("charities", "GET")
      .then((data) => {
        setCharities(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  // After fetching friends, frineds would be populated. If no friends, can only donate to orgs
  const hasNoFriends = friends.length === 0;
  const [isSendingToFriend, setIsSendingToFried] = useState(!hasNoFriends);
  const [isHabit, setIsHabit] = useState(false);
  const [friendId, setFriendId] = useState('1');

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
    newTask.deadline -= new Date(newTask.deadline*1000).getTimezoneOffset() * 60;
    setIsSubmitting(true);
    console.log(newTask);
    if (!isHabit) {
      newTask.habit_frequency = 0;
    }
    if (newTask.category === 'None') {
      newTask.category = '';
    }
    fetchEndpoint('create-reminder', 'POST', newTask as object)
    .then(() => {
      setIsSubmitting(false);
      navigate("/tasks");
      toast.success(() => (
        <div>
          Added task - <b>{newTask.name}</b>
        </div>
      ));
    }).catch((err) => {
      toast.error(() => (
        <div>
          Error {err} adding task - <b>{newTask.name}</b>
        </div>
      ));
    });
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
        <RadioGroup
        row
        aria-labelledby="HabitType"
        name="HabitType"
        value={isHabit}
        onChange={(e) => {
          setIsHabit(e.target.value === "true");
        }}
        >
          <FormControlLabel
            value={false}
            control={<Radio />}
            label="Task"
          />
          <FormControlLabel
            value={true}
            control={<Radio />}
            label="Habit"
          />
        </RadioGroup>
        {isHabit && <StyledInput
        label="Habit Frequency"
        name="habit_frequency"
        placeholder="Enter frequency in days"
        value={taskUploadData.habit_frequency}
        onChange={handleDataChange}
        focused
        sx={{
          color: 'white'
        }}
        >
          </StyledInput>}

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
            value={!hasNoFriends}
            control={<Radio />}
            label="Friend"
            sx={{
              svg: {
                select: {
                  color: 'white'
                }
              }
            }}
          />
          <FormControlLabel value={hasNoFriends} control={<Radio />} label="Charity"/>
        </RadioGroup>

        {/* TODO: Fix styling for this */}
        {!hasNoFriends && isSendingToFriend ? (
          <StyledSelect
            sx={{
              width: "400px",
              transition: "0.3s all",
              svg: {
                color: "white",
              }
            }}
            label="Choose a friend"
            id="selectPaymentDestination"
            value={friendId.toString() ?? ""}
            defaultValue={""}
            onChange={(e: SelectChangeEvent<unknown>) => {
              console.log(e.target.value);
              setFriendId(e.target.value as string);
              setTaskUploadData((prevData) => ({
                ...prevData,
                friend_id: parseInt(e.target.value as string),
              }));
            }}
            placeholder="Choose a friend"
          >
            {friends.map((friend) => (
              <MenuItem
                key={friend.id}
                value={friend.id}
                sx={{
                  color: "black"
                }}
              >
                {friend.fname}
              </MenuItem>
            ))}
          </StyledSelect>
        ) : (
          <StyledSelect
            sx={{
              width: "400px",
              svg: {
                color: 'white',
              }
            }}
            label="Choose a charity"
            id="selectPaymentDestination"
            value={taskUploadData.org_id?.toString() ?? ""}
            defaultValue={""}
            onChange={(e: SelectChangeEvent<unknown>) => {
              setTaskUploadData((prevData) => ({
                ...prevData,
                org_id: parseInt(e.target.value as string),
              }));
              console.log(taskUploadData);
            }}
            placeholder="Choose a charity"
          >
            {charities.map((charity) => (
              <MenuItem
                key={charity.id}
                value={charity.id}
                sx={{
                  color: "black"
                }}
              >
                {charity.name}
              </MenuItem>
            ))}
          </StyledSelect>
        )}

        <StyledSelect
          sx={{
            marginTop: 2,
            width: "400px",
            svg: {
              color: "white",
            }
          }}
          id="selectCategory"
          placeholder="Choose a category"
          value={taskUploadData.category?.toString() ?? ""}
          defaultValue={""}
          onChange={(e: SelectChangeEvent<unknown>) => {
            setTaskUploadData((prevData) => ({
              ...prevData,
              category: e.target.value as string
            }));
          }}
          displayEmpty
        >
          {categories.map((category) => (
            <MenuItem
              key={category}
              value={category}
              sx={{
                color: "black"
              }}
            >
              {category}
            </MenuItem>
          ))}
        </StyledSelect>

        <AddTaskButton onClick={handleAddTask} disabled={isSubmitting}>
          Create Task
        </AddTaskButton>
      </Container>
    </MuiContainer>
  );
};

const StyledSelect = styled(Select)`
  margin: 12px 0;
  border-radius: 16px;
  transition: 0.3s all;
  color: white;
  /* border: 3px solid ${ColorPalette.purple}; */
  & * {
    border-color: ${ColorPalette.purple};
  }
`;

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

const mockCategories = ["None", "Work", "School", "Health", "Family"];
