import { useState } from "react";
import styled from "@emotion/styled";
import { Avatar, Badge, Button, Tooltip } from "@mui/material";
import { AddReaction, Edit, RemoveCircleOutline } from "@mui/icons-material";
import EmojiPicker, { Emoji, EmojiClickData, SuggestionMode } from "emoji-picker-react";
import { ColorPalette } from "@/styles";

interface EmojiPickerProps {
  emoji?: string;
  setEmoji: (emoji: string | undefined) => void;
}

export const CustomEmojiPicker = ({ emoji, setEmoji }: EmojiPickerProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevState) => !prevState);
  };

  const handleEmojiClick = (e: EmojiClickData) => {
    toggleEmojiPicker();
    setEmoji(e.unified);
    console.log(e);
  };

  const handleRemoveEmoji = () => {
    toggleEmojiPicker();
    setEmoji(undefined);
  };

  const renderAvatarContent = () => {
    if (emoji) {
      return (
        <div>
          <Emoji size={48} unified={emoji} />
        </div>
      );
    } else {
      return (
        <AddReaction
          sx={{
            fontSize: "48px",
            color: ColorPalette.fontLight,
            transition: ".3s all",
          }}
        />
      );
    }
  };

  return (
    <>
      <EmojiContainer>
        <Tooltip
          title={
            showEmojiPicker ? "Close Emoji Picker" : emoji ? "Change Emoji" : "Choose an Emoji"
          }
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Avatar
                sx={{
                  background: "#9c9c9c81",
                  backdropFilter: "blur(6px)",
                  cursor: "pointer",
                }}
                onClick={toggleEmojiPicker}
              >
                <Edit />
              </Avatar>
            }
          >
            <Avatar
              onClick={toggleEmojiPicker}
              sx={{
                width: "96px",
                height: "96px",
                background: ColorPalette.purple,
                transition: ".3s all",
                cursor: "pointer",
              }}
            >
              {renderAvatarContent()}
            </Avatar>
          </Badge>
        </Tooltip>
      </EmojiContainer>
      {showEmojiPicker && (
        <>
          <EmojiPickerContainer>
            <EmojiPicker
              width="350px"
              height="500px"
              suggestedEmojisMode={SuggestionMode.RECENT}
              autoFocusSearch={false}
              lazyLoadEmojis
              onEmojiClick={handleEmojiClick}
              searchPlaceHolder="Search emoji"
              previewConfig={{
                defaultEmoji: "1f4dd",
                defaultCaption: "Choose the perfect emoji for your task",
              }}
            />
          </EmojiPickerContainer>
          {emoji && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={handleRemoveEmoji}
                sx={{ p: "8px 20px", borderRadius: "14px" }}
              >
                <RemoveCircleOutline /> &nbsp; Remove Emoji
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

const EmojiContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 14px;
`;

const EmojiPickerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px;
`;
