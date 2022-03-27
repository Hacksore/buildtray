import { useState } from "react";
import { useMutation } from "react-query";
import { subscribeToRepo } from "../api/user";
import { queryClient } from "../main";

export default function RegisterForm() {
  const [value, setValue] = useState("hacksore/test");
  const addRepo: any = useMutation(data => subscribeToRepo(data));

  return (
    <>
      <input value={value} onChange={e => setValue(e.target.value)} placeholder="Enter a user/repo" />
      <button
        onClick={() => {
          const [entity, repo] = value.split("/");
          addRepo.mutate({
            entity,
            repo
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("repos");
            },
          });
        }}
      >
        Add repo
      </button>
    </>
  );
}
