// The docked sidebar's collapsed state lives on <html data-sidebar="collapsed"> so CSS can react to it before React
// hydrates (no flash). SIDEBAR_INIT_SCRIPT restores it from localStorage in <head>; setSidebarCollapsed updates both.
const KEY = "docmind.sidebar";

export const SIDEBAR_INIT_SCRIPT = `try{if(localStorage.getItem("${KEY}")==="collapsed")document.documentElement.dataset.sidebar="collapsed"}catch(e){}`;

export function setSidebarCollapsed(collapsed: boolean) {
  document.documentElement.dataset.sidebar = collapsed ? "collapsed" : "expanded";
  try {
    localStorage.setItem(KEY, collapsed ? "collapsed" : "expanded");
  } catch {
    // Storage blocked: the sidebar still toggles for this visit.
  }
}
