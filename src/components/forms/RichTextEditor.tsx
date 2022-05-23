import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

const modules = {
  toolbar: [
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ]
};

const formats = [
  'font',
  'size',
  'bold', 'italic', 'underline',
  'list', 'bullet',
  'align',
  'color', 'background'
];


export const RichTextEditor = ({ value, setTemplate }: any) => {

  function handleTemplateContentChange(content: any, delta: any, source: any, editor: any) {
    setTemplate(editor.getHTML());
  }

  return (
    <ReactQuill theme="snow" modules={modules} style={{ height: "300px" }}
      formats={formats}
      onChange={handleTemplateContentChange}
      value={value ?? ''} />
  )
}