import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Crown, Check } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName?: string;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  onUpgrade,
  featureName,
}: UpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#1e1e1e] border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="h-5 w-5 text-yellow-400" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {featureName 
              ? `The "${featureName}" feature is available exclusively for premium users.` 
              : "This feature is available exclusively for premium users."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <h3 className="font-medium mb-2 text-white">Premium benefits include:</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Import JSON from images with OCR technology</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Export visualizations as PNG, JPG, and SVG</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Visualize larger and more complex JSON structures</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Save and manage visualizations in the cloud</span>
            </li>
          </ul>
        </div>

        <DialogFooter className="flex sm:justify-between gap-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
          <Button 
            onClick={onUpgrade} 
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}