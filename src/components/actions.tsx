import { ActionPanel, Action } from "@raycast/api";
import CreateEditNoteForm from "./createEditNoteForm";
import CreateTag from "./createTag";
import { useEffect } from "react";

const Actions = ({
  noNotes,
  isDraft = false,
  title,
  note,
  tags,
  createdAt,
}: {
  noNotes: boolean;
  isDraft?: boolean;
  title?: string;
  note?: string;
  tags?: string[];
  createdAt?: Date;
}) => {
  return (
    <ActionPanel>
      {!noNotes && (
        <Action.Push
          title="Edit Note"
          target={
            <CreateEditNoteForm draftMode={isDraft} title={title} note={note} tags={tags} createdAt={createdAt} />
          }
        />
      )}
      <Action.Push title="New Note" target={<CreateEditNoteForm />} shortcut={{ modifiers: ["cmd"], key: "n" }} />
      <Action.Push title="New Tag" target={<CreateTag />} shortcut={{ modifiers: ["cmd"], key: "t" }} />
    </ActionPanel>
  );
};

export default Actions;
