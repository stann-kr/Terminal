import {
  help as helpFallback,
  commands as commandsFallback,
  about as aboutFallback,
  lineup as lineupFallback,
  voyage as voyageFallback,
  gate as gateFallback,
  event as eventFallback,
  link as linkFallback,
  ping as pingFallback,
  weather as weatherFallback,
  matrix as matrixFallback,
  history as historyFallback,
  historyAdmin as historyAdminFallback,
} from "./static";
import {
  bootSequence,
  wakeSequence,
  welcomeMessage,
  resumeMessage,
} from "./boot";
import {
  status,
  dateTime,
  swearWord,
  whoami,
  whoisStann,
  whoisMarcus,
  whoisNusnoom,
  whoisUnknown,
  sudoStann,
  sudoError,
  echoError,
  echoOutput,
  commandNotFound,
  commandSuggestion,
  settingsApply,
  settingsHelp,
  settingsLangChanged,
  settingsLangInvalid,
  settingsThemeChanged,
  settingsThemeInvalid,
  settingsReset,
  settingsUnknown,
  nameSet,
  nameCurrent,
  nameCleared,
  nameEmpty,
  nameInvalid,
  systems,
} from "./user";
import {
  liveHeader,
  liveOffline,
  liveNoName,
  liveExit,
  liveTooFast,
  liveError,
} from "./live";
import {
  adminDenied,
  adminHelp,
  adminLiveOpened,
  adminLiveScheduled,
  adminLiveClosed,
  adminLiveNotFound,
  adminLiveDeleted,
  adminLiveCleared,
  adminSessionStatus,
  adminError,
  adminLoginSuccess,
  adminLoginFail,
  adminLogoutSuccess,
  adminAnnSent,
  adminAnnCleared,
  announcementBanner,
  adminEventList,
  adminEventActivated,
  adminEventCloned,
  adminTextList,
  adminCacheReloaded,
} from "./admin";
import { transmit } from "./transmit";
import { textService } from "../services/text-service";

export const COMMAND_TEXTS = {
  // ── DB getter (로딩 성공 시 DB 값 우선, 실패 시 폴백) ──
  get help() {
    return textService.getText("help") ?? helpFallback;
  },
  get commands() {
    return textService.getText("commands") ?? commandsFallback;
  },
  get about() {
    return textService.getText("about") ?? aboutFallback;
  },
  get lineup() {
    return textService.getText("lineup") ?? lineupFallback;
  },
  get voyage() {
    return textService.getText("voyage") ?? voyageFallback;
  },
  get gate() {
    return textService.getText("gate") ?? gateFallback;
  },
  get event() {
    return textService.getText("event") ?? eventFallback;
  },
  get link() {
    return textService.getText("link") ?? linkFallback;
  },
  get ping() {
    return textService.getText("ping") ?? pingFallback;
  },
  get weather() {
    return textService.getText("weather") ?? weatherFallback;
  },
  get matrix() {
    return textService.getText("matrix") ?? matrixFallback;
  },
  get history() {
    return textService.getText("history") ?? historyFallback;
  },
  get historyAdmin() {
    return textService.getText("historyAdmin") ?? historyAdminFallback;
  },
  get bootSequence() {
    return textService.getBootSequence() ?? bootSequence;
  },
  get wakeSequence() {
    return textService.getWakeSequence() ?? wakeSequence;
  },
  get welcomeMessage() {
    return textService.getText("welcome") ?? welcomeMessage;
  },
  get resumeMessage() {
    return textService.getText("resume") ?? resumeMessage;
  },

  // ── 코드 유지 (함수형 / 런타임 인자 필요) ──
  status,
  dateTime,
  swearWord,
  whoami,
  whoisStann,
  whoisMarcus,
  whoisNusnoom,
  whoisUnknown,
  sudoStann,
  sudoError,
  echoError,
  echoOutput,
  commandNotFound,
  commandSuggestion,
  settingsApply,
  settingsHelp,
  settingsLangChanged,
  settingsLangInvalid,
  settingsThemeChanged,
  settingsThemeInvalid,
  settingsReset,
  settingsUnknown,
  nameSet,
  nameCurrent,
  nameCleared,
  nameEmpty,
  nameInvalid,
  systems,
  liveHeader,
  liveOffline,
  liveNoName,
  liveExit,
  liveTooFast,
  liveError,
  adminDenied,
  adminHelp,
  adminLiveOpened,
  adminLiveScheduled,
  adminLiveClosed,
  adminLiveNotFound,
  adminLiveDeleted,
  adminLiveCleared,
  adminSessionStatus,
  adminError,
  adminLoginSuccess,
  adminLoginFail,
  adminLogoutSuccess,
  adminAnnSent,
  adminAnnCleared,
  announcementBanner,
  adminEventList,
  adminEventActivated,
  adminEventCloned,
  adminTextList,
  adminCacheReloaded,
  transmit,
};
