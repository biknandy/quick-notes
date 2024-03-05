import { Action, Alert, Color, Icon, Toast, confirmAlert, showToast } from "@raycast/api";
import { useAtom } from "jotai";
import { notesAtom } from "../services/atoms";
import { colors } from "../utils/utils";

const DeleteNoteAction = ({ title, createdAt }: { title?: string; createdAt?: Date }) => {
  const [notes, setNotes] = useAtom(notesAtom);
  const deleteNote = async () => {
    const alertOptions = {
      icon: { source: Icon.Trash, tintColor: Color.Red },
      title: "Are you sure?",
      message: "Deleting your note cannot be undone.",
      primaryAction: {
        title: "Confirm",
        style: Alert.ActionStyle.Destructive,
        onAction: () => {
          showToast({
            style: Toast.Style.Success,
            title: "Deleted Note",
          });
        },
      },
    };
    await confirmAlert(alertOptions);
    const updatedNotes = notes.filter((n) => n.createdAt !== createdAt);
    setNotes(updatedNotes);
  };

  if (!createdAt) return null;
  return (
    <Action
      title="Delete Note"
      icon={{
        source: Icon.Trash,
        tintColor: colors.find((c) => c.name === "red")?.tintColor,
      }}
      shortcut={{ modifiers: ["ctrl", "shift"], key: "x" }}
      onAction={deleteNote}
    />
  );
};

export default DeleteNoteAction;
