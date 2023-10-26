import { ArrowRight } from "@mui/icons-material";
import { Button, FormControl, FormLabel, Input, Textarea } from "@mui/joy";
import { useState } from "react";

function Override() {
  const [text, setText] = useState<string>();
  const onSubmitForm = () => {};
  return (
    <form onSubmit={onSubmitForm} style={{ width: 600 }}>
      <FormControl>
        <FormLabel>Why?</FormLabel>
        <Textarea
          minRows={1}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
          }}
          name="reason"
          placeholder="Set your intention here..."
          variant="plain"
          required
        />
        <Button variant="solid" type="submit" endDecorator={<ArrowRight />}>
          Submit and Go
        </Button>
      </FormControl>
    </form>
  );
}

export default Override;
