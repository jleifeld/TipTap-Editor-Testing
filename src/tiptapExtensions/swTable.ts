import ExtensionTable, { type TableOptions } from '@tiptap/extension-table'

interface SwTableOptions extends TableOptions {
  resizableRowHeight: boolean;
}

const SwTable = ExtensionTable.extend<SwTableOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      resizableRowHeight: false,
    }
  },
  addProseMirrorPlugins() {
      return [
        ...this.parent?.() || [],
      ]
  },
});

export default SwTable;