import Browser from "webextension-polyfill";
import { ArrowRight } from "@mui/icons-material";
import { Button, FormControl, FormLabel, Input } from "@mui/joy";
import { FormEvent, useState } from "react";
import { unblockWebsite } from "../../utils";

type OverrideProps = {
  url: string;
  hostname: string;
};

function Override({ url, hostname }: OverrideProps) {
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<Error | undefined>();
  const onSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message) {
      setError(new Error("Please input a valid reason."));
      return;
    }

    await unblockWebsite(url, message);
  };

  return (
    <form onSubmit={onSubmitForm} style={{ width: 600 }}>
      <FormControl>
        <FormLabel>Why?</FormLabel>
        <Input
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
          name="reason"
          placeholder="Set your intention here..."
          variant="soft"
          required
        />
        <Button variant="solid" type="submit" endDecorator={<ArrowRight />}>
          Submit and Go To {hostname}
        </Button>
      </FormControl>
    </form>
  );
}

export default Override;
