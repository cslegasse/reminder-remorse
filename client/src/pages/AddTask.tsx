import { Category, Task, UserProps } from "../types/user";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddTaskButton, Container, RowFlex, StyledInput } from "../styles";
import { Edit } from "@mui/icons-material";

import { Button, Typography } from "@mui/material";

import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { CategorySelect, ColorPicker, CustomEmojiPicker } from "../components";

import toast from "react-hot-toast";
import { StyledHalf } from "../styles/addTask.styled";
import { Radio, RadioGroup, FormControlLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";

export const AddTask = ({ user, setUser }: UserProps) => {
  const friends = mockFriends; //REPLACE
  const [name, setName] = useState<string>("");
  const [emoji, setEmoji] = useState<string | undefined>();
  const [color, setColor] = useState<string>("#b624ff");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  const [incentiveMin, setIncentiveMin] = useState<number | "">("");
  const [incentiveMax, setIncentiveMax] = useState<number | "">("");

  const [chooseDestination, setChooseDestination] = useState<string>("");

  const [nameError, setNameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const navigate = useNavigate();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName.length > TASK_NAME_MAX_LENGTH) {
      setNameError(`Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`);
    } else {
      setNameError("");
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = event.target.value;
    setDescription(newDescription);
    if (newDescription.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(
        `Description should be less than or equal to ${DESCRIPTION_MAX_LENGTH} characters`
      );
    } else {
      setDescriptionError("");
    }
  };

  // const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setColor(event.target.value);
  // };

  const handleDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(event.target.value);
  };

  const handleIncentiveMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    Number(event.target.value) ?
      setIncentiveMin(Number(event.target.value)) : setIncentiveMin("");
  };

  const handleIncentiveMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    Number(event.target.value) ?
      setIncentiveMax(Number(event.target.value)) : setIncentiveMin("");
  };

  const handleSetChooseDestination = (event: SelectChangeEvent<unknown>) => {
    setChooseDestination(event.target.value as string);
  }


  const handleAddTask = () => {
    if (name !== "") {
      if (name.length > TASK_NAME_MAX_LENGTH || description.length > DESCRIPTION_MAX_LENGTH) {
        return; // Do not add the task if the name or description exceeds the maximum length
      }

      const newTask: Task = {
        id: new Date().getTime() + Math.floor(Math.random() * 1000),
        done: false,
        pinned: false,
        name,
        description: description !== "" ? description : undefined,
        emoji: emoji ? emoji : undefined,
        color,
        date: new Date(),
        deadline: deadline !== "" ? new Date(deadline) : undefined,
        category: selectedCategories ? selectedCategories : [],
      };

      setUser((prevUser) => ({
        ...prevUser,
        tasks: [...prevUser.tasks, newTask],
      }));

      navigate("/");
      toast.success(() => (
        <div>
          Added task - <b>{newTask.name}</b>
        </div>
      ));
    }
  };

  return (
    <>
      <h1>Add new task</h1>
      <Container>
        <CustomEmojiPicker user={user} setEmoji={setEmoji} color={color} />
        <StyledInput
          label="Task Name"
          name="name"
          placeholder="Enter task name"
          value={name}
          onChange={handleNameChange}
          focused
          error={nameError !== ""}
          helperText={nameError}
        />
        <StyledInput
          label="Task Description (optional)"
          name="name"
          placeholder="Enter task description"
          value={description}
          onChange={handleDescriptionChange}
          multiline
          rows={4}
          focused
          error={descriptionError !== ""}
          helperText={descriptionError}
        />
        <StyledInput
          label="Task Deadline (optional)"
          name="name"
          placeholder="Enter deadline date"
          type="datetime-local"
          value={deadline}
          onChange={handleDeadlineChange}
          focused
        />
        <RowFlex>
          <StyledHalf
            label="Incentive range: from"
            name="name"
            placeholder="Amount in dollars"
            value={incentiveMin}
            onChange={handleIncentiveMinChange}
            focused
            sx={{
              width: "180px"
            }}
          />
          <StyledHalf
            label="to"
            name="name"
            placeholder="Amount in dollars"
            value={incentiveMax}
            onChange={handleIncentiveMaxChange}
            focused
            sx={{
              width: "180px"
            }}
          />
        </RowFlex>
        <Typography
          sx={{
            margin: "12px 0 0 0 ",
          }}
        >
          Where do you want to send the money?</Typography>
        <RadioGroup
          row
          aria-labelledby="PaymentType"
          name="PaymentType"
          value="friend"
        >
          <FormControlLabel value="friend" control={<Radio />} label="Friend" />
          <FormControlLabel value="charity" control={<Radio />} label="Charity" disabled />
        </RadioGroup>
        {//TODO: implement charity payments
        }

        <Select
          id="selectPaymentDestination"
          value={chooseDestination}
          placeholder="Choose a friend"
          label="Choose a friend:"
          onChange={handleSetChooseDestination}
        >
          {friends.map((friend) => (
            <MenuItem value={friend.id}>{friend.fname} {friend.lname}</MenuItem>
          ))}
        </Select>

        {user.settings[0].enableCategories !== undefined && user.settings[0].enableCategories && (
          <>
            <br />
            <Typography>Category (optional)</Typography>

            <CategorySelect
              user={user}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              width="400px"
            />
            <Link to="/categories">
              <Button
                sx={{
                  margin: "8px 0 24px 0 ",
                  padding: "12px 24px",
                  borderRadius: "12px",
                }}
              // onClick={() => n("/categories")}
              >
                <Edit /> &nbsp; Modify Categories
              </Button>
            </Link>
          </>
        )}
        {
          // <Typography>Color</Typography>
          // <ColorPicker
          //   color={color}
          //   onColorChange={(color) => {
          //     setColor(color);
          //   }}
          // />
        }

        <AddTaskButton
          onClick={handleAddTask}
          disabled={
            name.length > TASK_NAME_MAX_LENGTH ||
            description.length > DESCRIPTION_MAX_LENGTH ||
            name === ""
          }
        >
          Create Task
        </AddTaskButton>
      </Container>
    </>
  );
};

const mockFriends = [
  {
    id: 1,
    fname: "John",
    lname: "Doe",
  },
  {
    id: 2,
    fname: "jane",
    lname: "woe",
  }
]