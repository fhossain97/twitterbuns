import { useState } from "react";
import { api as trpc } from "../utils/api";
import { object, string } from "zod";

const styles = {
  formStyle: `mb-4 flex w-full flex-col rounded-md border-2 p-4`,
  textArea: `shadow p-4 w-full rounded-md`,
  button: `bg-primary rounded-md px-4 py-2 text-white`,
  buttonDiv: `mt-4 flex justify-end`,
};

export const tweetSchema = object({
  text: string({ required_error: "Tweet text required" }).min(10).max(280),
});

export const CreateTweetForm = () => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const utils = trpc.useContext();

  const { mutateAsync } = trpc.tweet.create.useMutation({
    onSuccess: () => {
      setText("");
      utils.tweet.timeline.invalidate();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tweetSchema.parse({ text });
    } catch (e) {
      setError(e.message);
      return;
    }
    mutateAsync({ text });
  };

  return (
    <>
      {error && console.log(error)}
      <form onSubmit={handleSubmit} className={styles.formStyle}>
        <textarea
          className={styles.textArea}
          onChange={(e) => setText(e.target.value)}
        />
        <div className={styles.buttonDiv}>
          <button className={styles.button} type="submit">
            Tweet
          </button>
        </div>
      </form>
    </>
  );
};
