import { useCallback, useEffect, useState } from "react";
/**
 * A custom React hook to determine if the current device is a smaller device
 * based on the screen width.
 */
export const useResponsiveDisplay = (breakpoint = 768): boolean => {
  const [isSmallerDevice, setIsSmallerDevice] = useState<boolean>(false);

  const checkScreenSize = useCallback(() => {
    setIsSmallerDevice(window.innerWidth < breakpoint);
  }, [breakpoint]);

  useEffect(() => {
    checkScreenSize();
    const handleResize = () => checkScreenSize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint, checkScreenSize]);

  return isSmallerDevice;
};
