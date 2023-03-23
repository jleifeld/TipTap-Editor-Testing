<template>
  <div class="sw-text-editor">
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-2'
import ExtensionUnderline from '@tiptap/extension-underline'
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
  } {
    return {
      // @ts-expect-error - will be defined in mount
      editor: null,
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
        ExtensionUnderline
      ],
      onUpdate: () => {
        // HTML
        this.$emit('input', this.editor.getHTML())
      },
    })
  },

  beforeDestroy() {
    this.editor.destroy()
  }
})
</script>

<style>
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
}

.sw-text-editor__content:focus-within {
  /* outline: 1px solid var(--color-shopware-brand-200); */
}

.ProseMirror.ProseMirror-focused {
  outline: none;
}
</style>