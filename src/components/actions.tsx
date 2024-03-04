import { ActionPanel, Action } from "@raycast/api";
import CreateEditNoteForm from "./createEditNoteForm";
import CreateTag from "./createTag";
import { useEffect, useState } from "react";

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
          target={<CreateEditNoteForm isDraft={isDraft} title={title} note={note} tags={tags} createdAt={createdAt} />}
        />
      )}
      <Action.Push
        title="New Note"
        target={<CreateEditNoteForm isDraft={true} />}
        shortcut={{ modifiers: ["cmd"], key: "n" }}
      />
      <Action.Push title="New Tag" target={<CreateTag />} shortcut={{ modifiers: ["cmd"], key: "t" }} />
    </ActionPanel>
  );
};

export default Actions;
