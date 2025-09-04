import { useContext } from "react";
import { Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { DataContext } from "../utils/context";

const ExcelUploader = () => {
  const { handleImport } = useContext(DataContext);

  const props = {
    beforeUpload: (file) => {
      message.loading("Parsing Excel...");
      handleImport(file);
      message.success("Import complete!");
      return false;
    },
    showUploadList: false,
  };

  return (
    <Upload {...props}>
      <Button type="primary" icon={<UploadOutlined />}>Import Excel</Button>
    </Upload>
  );
};

export default ExcelUploader;
