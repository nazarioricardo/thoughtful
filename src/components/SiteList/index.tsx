import { Button, Grid, List, Stack } from "@mui/joy";
import SiteListItem from "../SiteListItem";
import { useState } from "react";
import { Cancel, Check, Edit } from "@mui/icons-material";

type SiteListProps = {
  sites: string[];
  storage: Storage;
  onDelete: (sites: string[]) => void;
};

function SiteList({ sites, storage, onDelete }: SiteListProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [forDeletion, setForDeletion] = useState<string[]>([]);

  const toggleEditing = () => {
    setForDeletion([]);
    setIsEditing(!isEditing);
  };

  const markToDelete = (url: string) => {
    if (forDeletion.includes(url)) {
      const filtered = forDeletion.filter((s) => s !== url);
      setForDeletion(filtered);
      return;
    }

    setForDeletion([...forDeletion, url]);
  };

  const onConfirmDeletion = () => {
    onDelete(forDeletion);
    setIsEditing(false);
  };

  console.log(forDeletion);

  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="stretch">
      <List>
        {sites.map((site) => (
          <SiteListItem
            key={site}
            url={site}
            markToDelete={markToDelete}
            isBypassed={storage[site].bypass}
            alternates={storage[site].alternates}
            isEditing={isEditing}
            isDeleting={forDeletion.includes(site)}
          />
        ))}
      </List>

      <Grid
        container
        flexDirection={"row"}
        justifyContent={"space-between"}
        sx={{ paddingTop: 2 }}
      >
        <Grid>
          {isEditing && (
            <Button
              color="danger"
              variant="soft"
              onClick={onConfirmDeletion}
              startDecorator={<Check />}
            >
              Confirm
            </Button>
          )}
        </Grid>
        <Grid>
          <Button
            variant="soft"
            onClick={toggleEditing}
            startDecorator={isEditing ? <Cancel /> : <Edit />}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default SiteList;
