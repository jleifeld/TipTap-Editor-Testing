<template>
  <div class="sw-text-editor" v-if="editor">
    <div class="sw-text-editor__toolbar">
      <div class="sw-text-editor__toolbar-buttons">
        <button
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="() => editor.chain().focus().toggleBold().run()"
        >
          <sw-icon name="regular-bold-xs" />
        </button>
        
        <button
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="() => editor.chain().focus().toggleItalic().run()"
        >
          <sw-icon name="regular-italic-xs" />
        </button>

        <button
          :class="{ 'is-active': editor.isActive('underline') }"
          @click="() => editor.chain().focus().toggleUnderline().run()"
        >
          <sw-icon name="regular-underline-xs" />
        </button>

        <button
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="() => editor.chain().focus().toggleStrike().run()"
        >
          <sw-icon name="regular-strikethrough-xs" />
        </button>

        <button
          :class="{
            'is-active': editor.isActive('link'),
            'is-disabled': editor.state.selection.empty
          }"
          @click="() => editor.commands.toggleLink({ href: 'https://shopware.com' })"
        >
          <sw-icon name="regular-link-xs" />
        </button>
      </div>

      <div class="sw-text-editor__toolbar-buttons">
        <button
          :class="{ 'is-disabled': !editor.can().undo() }"
          @click="() => editor.commands.undo()"
        >
          <sw-icon name="regular-undo-xs" />
        </button>

        <button
          :class="{ 'is-disabled': !editor.can().redo() }"
          @click="() => editor.commands.redo()"
        >
          <sw-icon name="regular-redo-xs" />
        </button>
      </div>
    </div>

    <editor-content
      class="sw-text-editor__content"
      :editor="editor"
    />

    <div class="sw-text-editor__toolbar sw-text-editor__toolbar-bottom">
      <div class="sw-text-editor__toolbar-buttons"></div>
      <div class="sw-text-editor__toolbar-buttons">
        <p>{{ editor.getText().length }} characters</p>
      </div>
    </div>

    <!-- TODO: just for testing -->
    <div>
      Rows:
      <input type="number" v-model="rowNumber">
      Columns:
      <input type="number" v-model="columnNumber">
      #
      <button @click="addTable">Add table</button>

      <template v-if="editor.isActive('table')">
        <br>
        <button @click="editor.chain().focus().deleteTable().run()">
          deleteTable
        </button>
        <button @click="editor.chain().focus().addColumnBefore().run()">
          addColumnBefore
        </button>
        <button @click="editor.chain().focus().addColumnAfter().run()">
          addColumnAfter
        </button>
        <button @click="editor.chain().focus().deleteColumn().run()">
          deleteColumn
        </button>
        <button @click="editor.chain().focus().addRowBefore().run()">
          addRowBefore
        </button>
        <button @click="editor.chain().focus().addRowAfter().run()">
          addRowAfter
        </button>
        <button @click="editor.chain().focus().deleteRow().run()">
          deleteRow
        </button>
        <button @click="editor.chain().focus().mergeCells().run()">
          mergeCells
        </button>
        <button @click="editor.chain().focus().splitCell().run()">
          splitCell
        </button>
        <button @click="editor.chain().focus().mergeOrSplit().run()">
          mergeOrSplit
        </button>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-2'
import ExtensionUnderline from '@tiptap/extension-underline'
import ExtensionLink from '@tiptap/extension-link'
import ExtensionTable from '@tiptap/extension-table'
import ExtensionTableRow from '@tiptap/extension-table-row'
import ExtensionTableHeader from '@tiptap/extension-table-header'
import ExtensionTableCell from '@tiptap/extension-table-cell'
import StarterKit from '@tiptap/starter-kit'
import { SwIcon } from '@shopware-ag/meteor-component-library';

export default Vue.extend({
  components: {
    EditorContent,
    SwIcon
  },

  props: {
    value: {
      type: String,
      default: '',
    },
  },

  data(): {
    editor: Editor,
    rowNumber: number,
    columnNumber: number,
  } {
    return {
      // @ts-expect-error - will be defined in mount
      editor: null,
      rowNumber: 0,
      columnNumber: 0,
    }
  },

  watch: {
    value(value, oldValue) {
      // HTML
      const isSame = this.editor.getHTML() === value

      if (isSame) {
        return
      }

      this.editor.commands.setContent(value, false)
    },
  },

  mounted() {
    this.editor = new Editor({
      content: this.value,
      extensions: [
        StarterKit,
        ExtensionUnderline,
        ExtensionLink,
        ExtensionTable.configure({
          resizable: true,
        }),
        ExtensionTableRow,
        ExtensionTableHeader,
        ExtensionTableCell,
      ],
      onUpdate: () => {
        // HTML
        this.$emit('input', this.editor.getHTML())
      },
    })
  },

  beforeDestroy() {
    this.editor.destroy()
  },

  methods: {
    addTable() {
      this.editor.commands.insertTable({
        rows: this.rowNumber,
        cols: this.columnNumber,
      })
    }
  }
})
</script>

<style lang="scss">
.sw-text-editor {
  text-align: start;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-default);
}

.sw-text-editor__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 8px;
  color: var(--color-darkgray-300);
  background-color: var(--color-gray-100);
  border-bottom: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-default) var(--border-radius-default) 0 0;
}

.sw-text-editor__toolbar-bottom {
  border-bottom: none;
  border-top: 1px solid var(--color-gray-300);
  border-radius: 0 0 var(--border-radius-default) var(--border-radius-default);
}

.sw-text-editor__toolbar p {
  padding: 0 8px;
}

.sw-text-editor__toolbar-buttons {
  display: flex;
}

.sw-text-editor__toolbar button {
  display: flex;
  justify-content: center;
  width: 32px;
  color: var(--color-gray-800);
  border: none;
  background-color: transparent;
  transition: 0.15s color ease;
}

.sw-text-editor__toolbar button:hover {
  cursor: pointer;
  color: var(--color-shopware-brand-500);
}

.sw-text-editor__toolbar button.is-active {
  color: var(--color-shopware-brand-500);
}

.sw-text-editor__toolbar button.is-disabled {
  cursor: default;
  color: var(--color-gray-400);
}

.sw-text-editor__content {
  padding: 16px;
  height: 260px;
  overflow: scroll;
}

.sw-text-editor__content table,
.sw-text-editor__content th,
.sw-text-editor__content td {
  border: 1px solid var(--color-gray-300);
  min-width: 16px;
}

.sw-text-editor__content {
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0; right: 0; top: 0; bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }

    p {
      margin: 0;
    }
  }

  .resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }
}

.ProseMirror.ProseMirror-focused {
  outline: none;
}
</style>