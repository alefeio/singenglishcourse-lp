import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Link from '@ckeditor/ckeditor5-link/src/link';
import Image from '@ckeditor/ckeditor5-image/src/image';
import Table from '@ckeditor/ckeditor5-table/src/table';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';

export default class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.builtinPlugins = [
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Heading,
    List,
    Link,
    Image,
    Table,
    FontColor,
    FontSize,
    // Adicione outros plugins necessários aqui
];

ClassicEditor.defaultConfig = {
    toolbar: {
        items: [
            'heading', '|', 'bold', 'italic', '|',
            'link', 'bulletedList', 'numberedList', '|',
            'imageUpload', 'blockQuote', '|',
            'undo', 'redo', '|', 'fontSize', 'fontColor', '|',
            'insertTable'
        ],
    },
    language: 'pt-br',
    // Configurações adicionais conforme necessário
};
