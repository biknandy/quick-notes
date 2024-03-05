import { ActionPanel, Action, Icon } from "@raycast/api";
import CreateEditNoteForm from "./createEditNoteForm";
import CreateTag from "./createTag";
import DeleteNoteAction from "./deleteNoteAction";
import { colors } from "../utils/utils";

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
      <ActionPanel.Section>
        {!noNotes && (
          <>
            <Action.Push
              title="Edit Note"
              icon={{
                source: Icon.Pencil,
                tintColor: colors.find((c) => c.name === "sky")?.tintColor,
              }}
              target={
                <CreateEditNoteForm isDraft={isDraft} title={title} note={note} tags={tags} createdAt={createdAt} />
              }
            />
            <DeleteNoteAction title={title ?? ""} createdAt={createdAt} />
          </>
        )}
      </ActionPanel.Section>
      <ActionPanel.Section>
        <Action.Push
          title="New Note"
          icon={{
            source: Icon.BlankDocument,
            tintColor: colors.find((c) => c.name === "turquoise")?.tintColor,
          }}
          target={<CreateEditNoteForm isDraft={true} />}
          shortcut={{ modifiers: ["cmd"], key: "n" }}
        />
        <Action.Push
          title="New Tag"
          icon={{
            source: Icon.Bookmark,
            tintColor: colors.find((c) => c.name === "amber")?.tintColor,
          }}
          target={<CreateTag />}
          shortcut={{ modifiers: ["cmd"], key: "t" }}
        />
      </ActionPanel.Section>
    </ActionPanel>
  );
};

export default Actions;
