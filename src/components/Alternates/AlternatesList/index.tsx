import { Box, Divider, Grid, IconButton, Stack } from "@mui/joy";
import AlternateItem from "../AlternateItem";
import { Cancel, Check, Edit, Girl } from "@mui/icons-material";
import { useState } from "react";

type AlternatesListProps = {
  alternates: string[];
};

function AlternatesList({ alternates }: AlternatesListProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const togglEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Stack sx={{ minWidth: 330 }} alignItems={"center"}>
      <Grid
        container
        sx={{ width: "100%", maxHeight: 36 }}
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <Grid>
          <IconButton
            disabled={!isEditing}
            color="primary"
            sx={{ borderRadius: 0 }}
          >
            {isEditing && <Check />}
          </IconButton>
        </Grid>
        <Grid>
          <IconButton onClick={togglEdit} sx={{ borderRadius: 0 }}>
            {isEditing ? <Cancel /> : <Edit />}
          </IconButton>
        </Grid>
      </Grid>
      {alternates.map((alternate: string) => (
        <>
          <AlternateItem
            key={alternate}
            alternate={alternate}
            isEditing={isEditing}
          />
          <Divider sx={{ opacity: isEditing ? 1 : 0 }} />
        </>
      ))}
    </Stack>
  );
}

export default AlternatesList;
