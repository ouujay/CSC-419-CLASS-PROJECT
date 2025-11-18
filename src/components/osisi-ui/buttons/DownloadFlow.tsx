import React, { useState } from "react";
import { Panel, useReactFlow, getViewportForBounds } from "@xyflow/react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download, Loader } from "lucide-react";
import { tryCatch } from "@/utils/try-catch";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");

  a.setAttribute("download", "family Tree.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 960;
const imageHeight = 768;

function DownloadButton() {
  const pathname = usePathname();
  const lastPath = pathname.split("/").pop();
  const { getNodes, getNodesBounds, getZoom, fitView } = useReactFlow();
  const [isLoading, setIsLoading] = useState(false);

  const fitViewAndGetZoom = async (options = {}) => {
    await new Promise((resolve) => {
      fitView({
        duration: 300,
        ...options,
      });
      setTimeout(resolve, 500);
    });
    const zoomLevel = getZoom();
    return zoomLevel;
  };

  const onClick = async () => {
    console.log("started");
    setIsLoading(true);
    const minZoom = await fitViewAndGetZoom();
    console.log("started 1");
    const nodesBounds = getNodesBounds(getNodes());
    console.log("started 2");
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      minZoom,
      2,
      10
    );
    console.log("started 3");
    
    const viewportElement = document.querySelector(
      ".react-flow__viewport"
    ) as HTMLElement;
    
    console.log("started 4");
    if (!viewportElement) {
      console.error("Could not find .react-flow__viewport element");
      setIsLoading(false);
      return;
    }
    
    console.log("started 5");
    const { data: url, error } = await tryCatch(
      toPng(viewportElement, {
        backgroundColor: "#ffffff00",
        pixelRatio: 8,
        width: imageWidth,
        height: imageHeight,
        style: {
          width: imageWidth.toString(),
          height: imageHeight.toString(),
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      })
    );
    console.log("started 6");
    
    if (error) {
      toast.error(error.message);
      console.error(error);
      setIsLoading(false);
      return;
    }
    
    console.log("started 7");
    downloadImage(url);
    console.log("started 8");
    toast.success("Image downloaded successfully");
    setIsLoading(false);
  };

  if (lastPath !== "preview") {
    return null;
  }

  if (isLoading) {
    return (
      <Panel position="bottom-right">
        <Button className="" variant="outline" size="icon" onClick={onClick}>
          <Loader className="w-4 h-4 animate-spin" />
        </Button>
      </Panel>
    );
  }
  if (!isLoading) {
    return (
      <Panel position="bottom-right">
        <Button className="" variant="outline" size="icon" onClick={onClick}>
          <Download className="w-4 h-4" />
        </Button>
      </Panel>
    );
  }
}

export default DownloadButton;
