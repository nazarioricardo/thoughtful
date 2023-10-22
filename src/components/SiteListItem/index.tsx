import Chrome from "webextension-polyfill";
import { Delete, Http, OpenInNew } from "@mui/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
} from "@mui/joy";

type SiteListItemProps = {
  url: string;
  isBypassed: boolean;
  alternates: string[];
  isEditing: boolean;
};

function SiteListItem({ url, isBypassed, isEditing }: SiteListItemProps) {
  const onClick = () => {
    Chrome.tabs.update({
      url,
    });
  };
  return (
    <ListItem>
      <ListItemButton onClick={onClick}>
        <ListItemDecorator>
          <Http />
        </ListItemDecorator>
        <ListItemContent>{url}</ListItemContent>
        {isEditing ? <Delete /> : <OpenInNew />}
      </ListItemButton>
    </ListItem>
  );
}

export default SiteListItem;
