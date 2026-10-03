// The docked sidebar's collapsed state lives on <html data-sidebar="collapsed"> so CSS can react to it before React
// hydrates (no flash). SIDEBAR_INIT_SCRIPT restores it from localStorage in <head>; setSidebarCollapsed updates both.
const KEY = "docmind.sidebar";

export const SIDEBAR_INIT_SCRIPT = `try{if(localStorage.getItem("${KEY}")==="collapsed")document.documentElement.dataset.sidebar="collapsed"}catch(e){}`;

/**
 * `remember: false` collapses or expands for this visit only (the saved choice is untouched), so a screen can make room for
 * itself, like the chat does, without overriding what the user picked.
 */
export function setSidebarCollapsed(collapsed: boolean, remember = true) {
  document.documentElement.dataset.sidebar = collapsed
    ? "collapsed"
    : "expanded";
  if (!remember) return;
  try {
    localStorage.setItem(KEY, collapsed ? "collapsed" : "expanded");
  } catch {
    // Storage blocked: the sidebar still toggles for this visit.
  }
}
