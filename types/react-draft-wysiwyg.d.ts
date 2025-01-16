// react-draft-wysiwyg.d.ts
declare module 'react-draft-wysiwyg' {
    import * as React from 'react';
    
    export interface EditorProps {
      editorState: any;
      onEditorStateChange: (state: any) => void;
      toolbar?: any;
      toolbarClassName?: string;
      editorClassName?: string;
      editorStyle?: React.CSSProperties;
      placeholder?: string;
    }
  
    export class Editor extends React.Component<EditorProps> {}
  }
  