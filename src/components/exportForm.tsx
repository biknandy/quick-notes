import { Form, ActionPanel, Action, Icon, popToRoot, showToast, useNavigation, Toast } from "@raycast/api";
import { colors, exportNotes } from "../utils/utils";
import fs from "fs";
import { useAtom } from "jotai";
import { notesAtom } from "../services/atoms";

const ExportForm = () => {
  const [notes, _] = useAtom(notesAtom);
  const { pop } = useNavigation();

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title={"Export Notes"}
            icon={{
              source: Icon.Download,
              tintColor: colors.find((c) => c.name === "green")?.tintColor,
            }}
            onSubmit={async (values: { folders: string[] }) => {
              if (notes.length === 0) {
                showToast({ title: "No Notes to Export", message: "⌘ + N for new note", style: Toast.Style.Failure });
                pop();
                return;
              }
              const folder = values.folders[0];
              if (!fs.existsSync(folder) || !fs.lstatSync(folder).isDirectory()) {
                return false;
              }
              await exportNotes(folder, notes);
              showToast({ title: "Notes Exported" });
              popToRoot();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.FilePicker
        id="folders"
        title="Choose Export Folder"
        allowMultipleSelection={false}
        canChooseDirectories
        canChooseFiles={false}
        info="Choose a file to export all your notes"
      />
    </Form>
  );
};

export default ExportForm;
