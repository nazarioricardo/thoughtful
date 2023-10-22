import SiteListItem from "../SiteListItem";

type SiteListProps = {
  sites: string[];
  storage: Storage;
};

function SiteList({ sites, storage }: SiteListProps) {
  return (
    <div>
      {sites.map((site) => (
        <SiteListItem
          key={site}
          url={site}
          isBypassed={storage[site].bypass}
          alternates={storage[site].alternates}
        />
      ))}
    </div>
  );
}

export default SiteList;
