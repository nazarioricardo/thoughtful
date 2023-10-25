import { Box, Divider, Grid, IconButton, Link, Sheet } from "@mui/joy";
import { getHostName } from "../../../constants";
import { Delete } from "@mui/icons-material";

type AlternateItemProps = {
  alternate: string;
  isEditing: boolean;
};

function AlternateItem({ alternate, isEditing }: AlternateItemProps) {
  return (
    <Sheet
      sx={{
        width: "100%",
        height: 36,
      }}
      variant={isEditing ? "soft" : "plain"}
    >
      <Grid
        container
        sx={{
          width: "100%",
          height: 36,
        }}
        flexDirection={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        position={"relative"}
      >
        <Grid>
          <Link href={alternate} level="title-lg" disabled={isEditing}>
            {getHostName(alternate)}
          </Link>
        </Grid>
        {isEditing && (
          <Grid position={"absolute"} right={0}>
            <IconButton sx={{ borderRadius: 0 }}>
              <Delete />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </Sheet>
  );
}

export default AlternateItem;
