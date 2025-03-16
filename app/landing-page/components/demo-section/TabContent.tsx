import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { TabsContent } from "@/components/ui/tabs";
import VisualizeTab from "./VisualizeTab";
import AnalyzeTab from "./AnalyzeTab";
import ShareTab from "./ShareTab";

interface TabContentProps {
  activeTab: string;
  currentImageIndex: number;
  demoImages: Array<{ src: string; alt: string }>;
  sampleJson: any;
  onPrevImage: () => void;
  onNextImage: () => void;
  onOpenPopup: () => void;
}

export default function TabContent({
  activeTab,
  currentImageIndex,
  demoImages,
  sampleJson,
  onPrevImage,
  onNextImage,
  onOpenPopup,
}: TabContentProps) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm p-4 sm:p-6 md:p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="visualize" className="mt-0">
            <VisualizeTab
              currentImageIndex={currentImageIndex}
              demoImages={demoImages}
              onPrevImage={onPrevImage}
              onNextImage={onNextImage}
              onOpenPopup={onOpenPopup}
            />
          </TabsContent>

          <TabsContent value="analyze" className="mt-0">
            <AnalyzeTab sampleJson={sampleJson} />
          </TabsContent>

          <TabsContent value="share" className="mt-0">
            <ShareTab />
          </TabsContent>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
