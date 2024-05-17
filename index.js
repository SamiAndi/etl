const ed1 = codeMirror(document.querySelector('.ed1'));
const ed2 = codeMirror(document.querySelector('.ed2'));
const ed3 = codeMirror(document.querySelector('.ed3'), true);

ed1.setValue(`{
  "name": "Sami",
  "lastname": "Andi"
}`);

ed2.setValue(`{
  "fullname": data.name + " " + data.lastname
}`);

function onInput() {
    const E = ed1.getValue();
    const T = ed2.getValue();
    try {
        const L = (new Function(`const data = ${E}; return ${T}`))();
        ed3.setValue(JSON.stringify(L, null, 2));
    } catch (err) {
        ed3.setValue(err.message);
    }
}

function codeMirror(editorContainer, readonly) {
    const { basicSetup } = CM["codemirror"];
    const { EditorView, lineNumbers } = CM["@codemirror/view"];
    const { EditorState } = CM["@codemirror/state"];
    const { javascript } = CM["@codemirror/lang-javascript"];
    const { oneDark } = CM["@codemirror/theme-one-dark"];
    const { autocompletion } = CM["@codemirror/autocomplete"];
    const { bracketMatching } = CM["@codemirror/language"];

    const editor = new EditorView({
        state: EditorState.create({
            doc: '',
            extensions: [
                basicSetup,
                lineNumbers(),
                javascript(),
                oneDark,
                autocompletion(),
                bracketMatching(),
                EditorView.editable.of(!readonly)
            ]
        }),
        parent: editorContainer,

        dispatch: (transaction) => {
            editor.update([transaction]);
            if (!readonly) onInput();
        }
    });
    editor.dom.style.height = '100%';
    editor.getValue = () => editor.state.doc.toString();
    editor.setValue = (string) => editor.dispatch({
        changes: {
            from: 0,
            to: editor.state.doc.length,
            insert: string
        }
    });

    return editor;
}