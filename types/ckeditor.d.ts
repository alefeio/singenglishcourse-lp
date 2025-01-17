// global.d.ts
declare module '@ckeditor/ckeditor5-build-classic' {
    const ClassicEditor: any;
    export default ClassicEditor;
}


declare module '@ckeditor/ckeditor5-react' {
    import * as React from 'react';

    interface CKEditorProps {
        editor: any;
        data?: string;
        onReady?: (editor: any) => void;
        onChange?: (event: any, editor: any) => void;
        onBlur?: (event: any, editor: any) => void;
        onFocus?: (event: any, editor: any) => void;
        config?: any;
    }

    export class CKEditor extends React.Component<CKEditorProps> { }
}
