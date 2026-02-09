import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = ['times-new-roman', 'roboto', 'poppins'];
ReactQuill.Quill.register(Font, true);

const modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': ['', 'times-new-roman', 'roboto', 'poppins'] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline'],
    [{ 'color': ['#000000', '#535353', '#6678db'] }],
    [{ list: 'ordered' }, { list: 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
    ['clean']
  ],
};

export default modules;