import React from "react";

const FontPreloader: React.FC = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Lato:wght@400;700&family=Open+Sans:wght@400;700&family=Pacifico&family=Roboto:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          position: "absolute",
          visibility: "hidden",
          height: 0,
          width: 0,
          overflow: "hidden",
        }}
      >
        {/* Preload các font để đảm bảo sẵn sàng khi người dùng chọn */}
        <span style={{ fontFamily: "Roboto" }}>.</span>
        <span style={{ fontFamily: "Arial" }}>.</span>
        <span style={{ fontFamily: "Times New Roman" }}>.</span>
        <span style={{ fontFamily: "Georgia" }}>.</span>
        <span style={{ fontFamily: "Verdana" }}>.</span>
        <span style={{ fontFamily: "Open Sans" }}>.</span>
        <span style={{ fontFamily: "Lato" }}>.</span>
        <span style={{ fontFamily: "Dancing Script" }}>.</span>
        <span style={{ fontFamily: "Pacifico" }}>.</span>
      </div>
    </>
  );
};

export default FontPreloader;
