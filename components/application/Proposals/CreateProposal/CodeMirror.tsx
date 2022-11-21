import ReactCodeMirror from "react-codemirror";

if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
  require("codemirror/mode/javascript/javascript");
  require("codemirror-solidity");
}

type Props = {
  value: string;
  className?: string;
  setValue: (value: string) => void;
};

const CodeMirror = ({ value, setValue }: Props) => {
  return (
    <ReactCodeMirror
      value={value}
      onChange={setValue}
      options={{
        theme: "neat",
        tabSize: 4,
        indentUnit: 4,
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        indentWithTabs: true,
        mode: "text/x-solidity",
      }}
    />
  );
};

export default CodeMirror;
