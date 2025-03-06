
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { DisconnectPopover } from './DisconnectPopover';

interface ModalFooterActionsProps {
  isConnected: boolean;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  handleDisconnect: () => void;
  onOpenChange: (open: boolean) => void;
  handleConnect: () => void;
  name: string;
  isConnectDisabled: boolean;
  isMobile: boolean;
}

export function ModalFooterActions({
  isConnected,
  isDeleteOpen,
  setIsDeleteOpen,
  handleDisconnect,
  onOpenChange,
  handleConnect,
  name,
  isConnectDisabled,
  isMobile
}: ModalFooterActionsProps) {
  return (
    <DialogFooter className={isMobile ? "flex-col" : "flex justify-between items-center"}>
      {isConnected ? (
        <>
          <DisconnectPopover
            name={name}
            isDeleteOpen={isDeleteOpen}
            setIsDeleteOpen={setIsDeleteOpen}
            handleDisconnect={handleDisconnect}
          />
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </>
      ) : (
        <>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConnect}
            disabled={isConnectDisabled}
          >
            Connect
          </Button>
        </>
      )}
    </DialogFooter>
  );
}
