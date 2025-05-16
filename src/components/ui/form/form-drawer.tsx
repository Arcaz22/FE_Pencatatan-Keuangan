import * as React from 'react';
import { Button } from '../button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle
} from '../drawer';

type FormDrawerProps = {
  isDone: boolean;
  triggerButton: React.ReactElement | null;
  submitButton: React.ReactElement;
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export const FormDrawer = ({
  isDone,
  title,
  triggerButton,
  submitButton,
  children,
  isOpen,
  onOpenChange
}: FormDrawerProps) => {
  // Keep track if we're in controlled mode
  const isControlled = isOpen !== undefined && onOpenChange !== undefined;

  // Internal state for uncontrolled mode
  const [internalOpen, setInternalOpen] = React.useState(false);

  // Choose which state to use
  const drawerIsOpen = isControlled ? isOpen : internalOpen;

  // For debugging
  const previousIsDone = React.useRef(isDone);

  // Handle state changes
  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      console.log(`FormDrawer handleOpenChange: ${open}`);

      if (isControlled && onOpenChange) {
        onOpenChange(open);
      } else {
        setInternalOpen(open);
      }
    },
    [isControlled, onOpenChange]
  );

  // When isDone changes from false to true, close the drawer
  React.useEffect(() => {
    if (!previousIsDone.current && isDone && drawerIsOpen) {
      console.log('Form is done (changed from false to true), will close drawer soon');
      const timer = setTimeout(() => {
        handleOpenChange(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    previousIsDone.current = isDone;
  }, [isDone, drawerIsOpen, handleOpenChange]);

  // For debugging
  React.useEffect(() => {
    console.log(`FormDrawer isOpen state: ${drawerIsOpen}, isDone: ${isDone}`);
  }, [drawerIsOpen, isDone]);

  return (
    <Drawer open={drawerIsOpen} onOpenChange={handleOpenChange}>
      {triggerButton && (
        <DrawerTrigger
          asChild
          onClick={(e) => {
            // This helps prevent propagation issues
            e.stopPropagation();
            handleOpenChange(true);
          }}
        >
          {triggerButton}
        </DrawerTrigger>
      )}
      <DrawerContent className="flex max-w-[800px] flex-col justify-between sm:max-w-[540px]">
        <div className="flex flex-col">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">{children}</div>
        </div>
        <DrawerFooter className="flex justify-end gap-2">
          <DrawerClose asChild>
            <Button variant="outline" type="button">
              Batal
            </Button>
          </DrawerClose>
          {submitButton}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
