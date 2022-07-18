import React, { useRef, useEffect } from 'react';
import Editor  from "@monaco-editor/react";

let kinh_ngu = "kinh_ngu";

let keywords_bland = ["va", "nghi", "truong_hop", "lop", "tiep", "khac",
    "theo", "xuat", "khiem_dien", "sai", "cho", "tu_day", "ham", "neu",
    "nhap", "vo_gia", "hoac", "viet", "tra", "goc", "doi", "nay", "dung", "bien", "trong_khi", "mang"
]
let keywords_original = [ "và", "nghỉ", "trường_hợp", "lớp", "tiếp", "khác",
    "theo", "xuất", "khiếm_diện", "sai", "cho",
    "từ_đây", "hàm", "nếu",  "nhập", "vô_giá", "hoặc", "viết", "trả", "gốc",
    "đởi", "này", "đúng", "biến", "trông_khi"];

let keywords = [...keywords_bland, ...keywords_original]
let syntaxError = {
    message: "syntaxError",
    line: 4,
    column: 5,
    length: 5,
}
let newRegex = /[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ_]+[\w$]*/
let markers = [];//TODO add error syntax highlighting

const MainEditor = ({setSource, value}) => {

    const editorRef = useRef(null);

    const  handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor; 

        //add syntax highlighting for kinh ngu
        monaco.languages.register({id: kinh_ngu});
        monaco.languages.setMonarchTokensProvider(kinh_ngu, {
            keywords: keywords,
            tokenizer: {
                root: [
                    [newRegex, {
                        cases: {
                            "@keywords": "keyword",
                            "@default": "variable",
                        }
                    }],
                    [/".*?"/, "string"],
                    [/\//, "comment"],
                ]
            }
        });

        monaco.languages.registerCompletionItemProvider(kinh_ngu, {
            provideCompletionItems: (model, position) => {
              const suggestions = [  ...keywords.map(k => {
                    return {
                        label: k,
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: k,
                    }
                })];
                return { suggestions }
            }
        });

        //TODO need to go back and work on the error handling
        // if (editor){
        //     monaco.editor.setModelMarkers(editor.getModel(), 'test', [{
        //         startLineNumber: 2,
        //         startColumn: 1,
        //         endLineNumber: 2,
        //         endColumn: 1000,
        //         message: "a message",
        //         severity: monaco.Severity.Warning
        //     }]);
        // }
        

        //create a theme 
        monaco.editor.defineTheme('myTheme', {
            base: 'vs',
            inherit: true,
            rules: [
                { background: '#EDF9FA' , },
                { token: "keyword", foreground: "#0000FF", fontStyle: "bold"},
                { token: "comment", foreground: "#999999"},
                { token: "string", foreground: "#009966"},
                { token: "variable", foreground: "#006699"},
            ],
            colors: {
                'editor.foreground': '#000000',
                'editor.background': '#EDF9FA',
                'editorCursor.foreground': '#8B0000',
                'editor.lineHighlightBackground': '#0000FF20',
                'editorLineNumber.foreground': '#008800',
                'editor.selectionBackground': '#88000030',
                'editor.inactiveSelectionBackground': '#88000015'
            }
        });
        monaco.editor.setTheme('myTheme');

        //focus the editor
        editorRef.current.focus();
    }


    return (  
        <Editor
            theme="light"
            height="60vh"
            language="kinh_ngu"
            defaultValue="// ghi chú"
            onMount={handleEditorDidMount}
            onChange={ value => setSource(value)}
                //  onValidate={handleEditorValidation}
            value={value}
            ></Editor>
    )
   
}

export default MainEditor;