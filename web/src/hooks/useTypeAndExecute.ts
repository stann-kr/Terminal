import { useCallback } from "react";

export function useTypeAndExecute(
  setInput: (v: string) => void,
  setCursorPosition: (v: number) => void,
  scrollToBottom: () => void,
  handleCommand: (cmd: string) => Promise<void>,
  setIsAnimatingInput: (v: boolean) => void,
  isAnimatingRef: React.MutableRefObject<boolean>,
  setQuickCmdContext: React.Dispatch<React.SetStateAction<string | null>>,
  inputRef: React.RefObject<HTMLInputElement>,
) {
  const typeAndExecute = useCallback(
    async (
      cmd: string,
      opts?: { stageOnly?: boolean; nextContext?: string | null },
    ) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      setIsAnimatingInput(true);
      scrollToBottom();

      await new Promise((r) => setTimeout(r, 80));

      if (
        typeof window !== "undefined" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
      ) {
        inputRef.current?.focus();
      }
      setInput("");
      setCursorPosition(0);
      await new Promise((r) => setTimeout(r, 60));

      for (let i = 1; i <= cmd.length; i++) {
        setInput(cmd.slice(0, i));
        setCursorPosition(i);
        const delay = Math.floor(Math.random() * 20) + 22;
        await new Promise((r) => setTimeout(r, delay));
      }

      if (!opts?.stageOnly) {
        await new Promise((r) => setTimeout(r, 90));
        await handleCommand(cmd);
        setInput("");
        setCursorPosition(0);

        if (opts?.nextContext !== undefined) {
          await new Promise((r) => setTimeout(r, 80));
          setQuickCmdContext(opts.nextContext);
        }

        setIsAnimatingInput(false);
        isAnimatingRef.current = false;
      } else {
        setIsAnimatingInput(false);
        isAnimatingRef.current = false;
      }
    },
    [
      handleCommand,
      setInput,
      setCursorPosition,
      scrollToBottom,
      setIsAnimatingInput,
      isAnimatingRef,
      setQuickCmdContext,
      inputRef,
    ],
  );

  return { typeAndExecute };
}
