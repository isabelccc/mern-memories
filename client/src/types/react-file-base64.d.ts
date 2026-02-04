declare module 'react-file-base64' {
  interface FileBaseProps {
    type?: string;
    multiple?: boolean;
    onDone: (file: { base64: string; name?: string; size?: number; type?: string }) => void;
  }

  const FileBase: React.FC<FileBaseProps>;
  export default FileBase;
}
