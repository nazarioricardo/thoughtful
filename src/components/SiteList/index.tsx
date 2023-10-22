import { Button, Grid, List } from "@mui/joy";
import SiteListItem from "../SiteListItem";
import { useState } from "react";
import { Edit } from "@mui/icons-material";

type SiteListProps = {
  sites: string[];
  storage: Storage;
};

function SiteList({ sites, storage }: SiteListProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Grid container justifyContent={"flex-end"}>
      <Grid xs={12}>
        <List>
          {sites.map((site) => (
            <SiteListItem
              key={site}
              url={site}
              isBypassed={storage[site].bypass}
              alternates={storage[site].alternates}
              isEditing={isEditing}
            />
          ))}
        </List>
      </Grid>
      <Grid xs={8} />
      <Grid xs={4}>
        <Button
          variant="soft"
          onClick={toggleEditing}
          startDecorator={<Edit />}
        >
          Edit
        </Button>
      </Grid>
    </Grid>
  );
}

export default SiteList;
