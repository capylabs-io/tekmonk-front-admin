"use client";
import { Worker } from "@react-pdf-viewer/core";
import { ToolbarSlot } from "@react-pdf-viewer/toolbar";

// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import React from "react";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";

// Import styles
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import dynamic from "next/dynamic";

const ViewerWithNoSSR = dynamic(
  () => import("@react-pdf-viewer/core").then((module) => module.Viewer),
  {
    ssr: false,
  }
);

type Props = {
  fileUrl: string;
  height?: number;
};

const DEFAULT_SCALE = 1;

export const PdfViewer = ({ fileUrl }: Props) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(props: ToolbarSlot) => {
          const {
            CurrentPageInput,
            Download,
            EnterFullScreen,
            GoToNextPage,
            GoToPreviousPage,
            NumberOfPages,
            Print,
            ShowSearchPopover,
            Zoom,
            ZoomIn,
            ZoomOut,
          } = props;
          return (
            <div className="flex items-center justify-between w-full">
              {/* <ShowSearchPopover /> */}
              <div className="flex items-center">
                <CurrentPageInput /> / <NumberOfPages />
              </div>

              <div className="flex items-center mt-2">
                <div style={{ padding: "0px 2px" }}>
                  <ZoomOut />
                </div>
                <div className="mb-2">
                  <Zoom />
                </div>
                <div style={{ padding: "0px 2px" }}>
                  <ZoomIn />
                </div>
              </div>

              <div className="flex items-center mt-2">
                <div style={{ padding: "0px 2px", marginLeft: "auto" }}>
                  <EnterFullScreen />
                </div>
                <div style={{ padding: "0px 2px" }}>
                  <Print />
                </div>
              </div>
            </div>
          );
        }}
      </Toolbar>
    ),
  });
  const pageNavigationPluginInstance = pageNavigationPlugin();
  return (
    <div
      className="gray-50"
      // style={{
      //   height: `${height}px`,
      // }}
    >
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
        <ViewerWithNoSSR
          plugins={[defaultLayoutPluginInstance, pageNavigationPluginInstance]}
          fileUrl={fileUrl}
          defaultScale={DEFAULT_SCALE}
        />
      </Worker>
    </div>
  );
};
