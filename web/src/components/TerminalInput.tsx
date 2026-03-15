import React from "react";

interface TerminalInputProps {
  input: string;
  setInput: (v: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isInputVisible: boolean;
  isInputActive: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  overlayRef: React.RefObject<HTMLDivElement>;
  cursorPosition: number;
  setCursorPosition: (v: number) => void;
  syncScroll: () => void;
  isLiveMode: boolean;
  isTransmitMode: boolean;
  language: string | null;
  scrollToBottom: () => void;
}

export default function TerminalInput({
  input,
  setInput,
  handleSubmit,
  handleKeyDown,
  isInputVisible,
  isInputActive,
  inputRef,
  overlayRef,
  cursorPosition,
  setCursorPosition,
  syncScroll,
  isLiveMode,
  isTransmitMode,
  language,
  scrollToBottom,
}: TerminalInputProps) {
  if (!isInputVisible) return null;

  return (
    <div className="shrink-0 px-2 pb-1">
      <div className="border-t border-[var(--panel-border)] pt-1 flex items-center gap-2 relative" style={{ boxShadow: "0 -1px 8px var(--phosphor-dim)" }}>
        <span className="text-[var(--orange)] font-bold text-sm select-none ml-2">
          &gt;&gt;
        </span>

        <form
          onSubmit={handleSubmit}
          className={`flex-1 flex items-center relative transition-opacity duration-200 ${
            !isInputVisible ? "opacity-0 invisible" : "opacity-100 visible"
          } ${!isInputActive ? "pointer-events-none" : ""}`}
        >
          <div
            ref={overlayRef}
            className="absolute inset-y-0 left-0 right-0 pointer-events-none flex items-center whitespace-pre font-mono text-sm tracking-normal overflow-hidden mt-[1px]"
            aria-hidden="true"
            style={{
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }}
          >
            <span className="text-[var(--grey-text)]">
              {input.slice(0, cursorPosition)}
            </span>
            <span className="cursor-blink w-[0.4rem] h-[0.9rem] bg-[var(--orange)] shrink-0" />
            <span className="text-[var(--grey-text)]">
              {input.slice(cursorPosition)}
            </span>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setCursorPosition(e.target.selectionStart || 0);
              setTimeout(syncScroll, 0);
            }}
            onScroll={syncScroll}
            onKeyDown={(e) => {
              handleKeyDown(e);
              setTimeout(() => {
                if (inputRef.current) {
                  setCursorPosition(inputRef.current.selectionStart || 0);
                  syncScroll();
                }
              }, 0);
            }}
            onKeyUp={() => {
              if (inputRef.current) {
                setCursorPosition(inputRef.current.selectionStart || 0);
                syncScroll();
              }
            }}
            onMouseUp={() => {
              if (inputRef.current) {
                setCursorPosition(inputRef.current.selectionStart || 0);
                syncScroll();
              }
            }}
            onFocus={() => {
              scrollToBottom();
              setTimeout(syncScroll, 0);
            }}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={
              isLiveMode
                ? language === "ko"
                  ? "메시지 전송... (/leave 로 세션 종료)"
                  : "broadcast... (/leave to end session)"
                : isTransmitMode
                  ? language === "ko"
                    ? "방명록 메시지 입력... (명령어로 이동 가능)"
                    : "guestbook message... (type command to navigate)"
                  : language === "ko"
                    ? "명령어 입력 또는 버튼 클릭"
                    : "type a command or click a button"
            }
            aria-label="Terminal input"
            className="
                peer flex-1 bg-transparent border-none outline-none
                font-mono text-sm text-transparent
                placeholder:text-[var(--grey-border)]
                caret-transparent tracking-normal
              "
            style={{
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }}
          />
        </form>
      </div>
    </div>
  );
}
