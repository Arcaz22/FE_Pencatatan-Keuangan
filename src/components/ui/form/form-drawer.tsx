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
  const isControlled = isOpen !== undefined && onOpenChange !== undefined;

  const [internalOpen, setInternalOpen] = React.useState(false);

  const drawerIsOpen = isControlled ? isOpen : internalOpen;

  const previousIsDone = React.useRef(isDone);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (isControlled && onOpenChange) {
        onOpenChange(open);
      } else {
        setInternalOpen(open);
      }
    },
    [isControlled, onOpenChange]
  );

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

  React.useEffect(() => {}, [drawerIsOpen, isDone]);

  return (
    <Drawer open={drawerIsOpen} onOpenChange={handleOpenChange}>
      {triggerButton && (
        <DrawerTrigger
          asChild
          onClick={(e) => {
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
