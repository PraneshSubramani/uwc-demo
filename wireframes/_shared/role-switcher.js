/* ========================================================================
   Role Switcher Engine
   Topbar dropdown lets Akanksha switch "View as: <Role>" mid-demo.
   Elements with data-role-* attributes re-render to that role's visibility.
   ======================================================================== */
(function () {
  'use strict';

  // Public API
  window.RoleSwitcher = {
    init: init,
    setRole: setRole,
    getRole: function () { return document.body.dataset.currentRole || 'default'; }
  };

  function init(opts) {
    // opts = { roles: [{id, name, role, badge, scope}], defaultRoleId, scenarioCode }
    var roles = opts.roles || [];
    var defaultId = opts.defaultRoleId || (roles[0] && roles[0].id);
    var scenarioCode = opts.scenarioCode || '';
    var dropdown = document.getElementById('role-switcher');
    if (!dropdown) {
      console.warn('[RoleSwitcher] #role-switcher element not found');
      return;
    }

    // Build dropdown HTML
    dropdown.innerHTML =
      '<button type="button" class="rs-trigger" id="rs-trigger" aria-expanded="false">' +
        '<span class="rs-avatar" id="rs-avatar"></span>' +
        '<span class="rs-current">' +
          '<span class="rs-name" id="rs-current-name">—</span>' +
          '<span class="rs-role" id="rs-current-role">—</span>' +
        '</span>' +
        '<span class="rs-chev">▾</span>' +
      '</button>' +
      '<div class="rs-menu" id="rs-menu" hidden>' +
        '<div class="rs-menu-header">View as · Scenario ' + scenarioCode + '</div>' +
        roles.map(function (r) {
          return (
            '<button type="button" class="rs-option" data-role-id="' + r.id + '">' +
              '<span class="rs-avatar rs-avatar--' + (r.badge || 'default') + '">' + (r.initial || r.name[0]) + '</span>' +
              '<span class="rs-opt-text">' +
                '<span class="rs-opt-name">' + r.name + '</span>' +
                '<span class="rs-opt-role">' + r.role + '</span>' +
                (r.scope ? '<span class="rs-opt-scope">' + r.scope + '</span>' : '') +
              '</span>' +
              '<span class="rs-check">✓</span>' +
            '</button>'
          );
        }).join('') +
        '<div class="rs-menu-footer">Switching role re-renders the screen showing what that user can see.</div>' +
      '</div>';

    // Wire trigger
    var trigger = document.getElementById('rs-trigger');
    var menu = document.getElementById('rs-menu');
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !menu.hidden;
      menu.hidden = open;
      trigger.setAttribute('aria-expanded', String(!open));
    });
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        menu.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Wire each option
    Array.prototype.forEach.call(dropdown.querySelectorAll('.rs-option'), function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.roleId;
        var role = roles.find(function (r) { return r.id === id; });
        setRole(id, role, roles);
        menu.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    // Apply default
    var def = roles.find(function (r) { return r.id === defaultId; });
    setRole(defaultId, def, roles);

    // Store roles for later lookup
    window.RoleSwitcher._roles = roles;
  }

  function setRole(id, role, roles) {
    document.body.dataset.currentRole = id;

    // Update topbar UI
    var avatar = document.getElementById('rs-avatar');
    var cn = document.getElementById('rs-current-name');
    var cr = document.getElementById('rs-current-role');
    if (avatar && role) {
      avatar.className = 'rs-avatar rs-avatar--' + (role.badge || 'default');
      avatar.textContent = role.initial || role.name[0];
    }
    if (cn && role) cn.textContent = role.name;
    if (cr && role) cr.textContent = role.role + (role.scope ? ' · ' + role.scope : '');

    // Tick the active option
    Array.prototype.forEach.call(document.querySelectorAll('.rs-option'), function (btn) {
      btn.classList.toggle('active', btn.dataset.roleId === id);
    });

    // 1. data-role-show: visible only when current role is in the comma-list
    Array.prototype.forEach.call(document.querySelectorAll('[data-role-show]'), function (el) {
      var allowed = el.dataset.roleShow.split(',').map(function (s) { return s.trim(); });
      el.hidden = allowed.indexOf(id) === -1;
    });

    // 2. data-role-hide: hidden when current role is in the comma-list
    Array.prototype.forEach.call(document.querySelectorAll('[data-role-hide]'), function (el) {
      var blocked = el.dataset.roleHide.split(',').map(function (s) { return s.trim(); });
      el.hidden = blocked.indexOf(id) !== -1;
    });

    // 3. data-role-mask: replace value with •••••• when role is in the comma-list
    Array.prototype.forEach.call(document.querySelectorAll('[data-role-mask]'), function (el) {
      var maskFor = el.dataset.roleMask.split(',').map(function (s) { return s.trim(); });
      var shouldMask = maskFor.indexOf(id) !== -1;
      if (shouldMask) {
        if (!el.dataset.roleOriginal) el.dataset.roleOriginal = el.textContent;
        el.textContent = '••••••••';
        el.classList.add('masked');
      } else if (el.dataset.roleOriginal) {
        el.textContent = el.dataset.roleOriginal;
        el.classList.remove('masked');
      }
    });

    // 4. data-role-variant: swap text content based on role
    // Format: data-role-variant="role-a:Text A|role-b:Text B|default:Text default"
    Array.prototype.forEach.call(document.querySelectorAll('[data-role-variant]'), function (el) {
      var variants = {};
      el.dataset.roleVariant.split('|').forEach(function (pair) {
        var i = pair.indexOf(':');
        if (i > -1) variants[pair.slice(0, i).trim()] = pair.slice(i + 1);
      });
      if (variants[id]) {
        if (!el.dataset.roleVariantOriginal) el.dataset.roleVariantOriginal = el.textContent;
        el.textContent = variants[id];
      } else if (variants['default']) {
        el.textContent = variants['default'];
      } else if (el.dataset.roleVariantOriginal) {
        el.textContent = el.dataset.roleVariantOriginal;
      }
    });

    // 5. data-role-class: add/remove CSS class based on role
    // Format: data-role-class="role-a:cls-a,role-b:cls-b"
    Array.prototype.forEach.call(document.querySelectorAll('[data-role-class]'), function (el) {
      el.dataset.roleClass.split(',').forEach(function (pair) {
        var i = pair.indexOf(':');
        if (i > -1) {
          var role = pair.slice(0, i).trim();
          var cls = pair.slice(i + 1).trim();
          el.classList.toggle(cls, role === id);
        }
      });
    });

    // Fire a custom event so scenario-specific code can react
    document.dispatchEvent(new CustomEvent('roleChanged', { detail: { roleId: id, role: role } }));
  }

  // Inject minimal CSS for the switcher itself (so scenarios don't need to repeat it)
  var style = document.createElement('style');
  style.textContent =
    '#role-switcher{position:relative;font-family:var(--uwc-font-body,sans-serif)}' +
    '.rs-trigger{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:5px 10px 5px 5px;border-radius:8px;cursor:pointer;font-size:12.5px;min-width:200px;text-align:left}' +
    '.rs-trigger:hover{background:rgba(255,255,255,0.18)}' +
    '.rs-avatar{width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:11px;flex-shrink:0}' +
    '.rs-avatar--ios{background:#003087}.rs-avatar--nc{background:#1f9535}.rs-avatar--reviewer{background:#e85d0c}.rs-avatar--dp{background:#C8102E}.rs-avatar--school{background:#7c3aed}.rs-avatar--portal{background:#0ea5e9}.rs-avatar--marketing{background:#ec4899}.rs-avatar--guardian{background:#f59e0b}.rs-avatar--default{background:#6b7280}' +
    '.rs-current{display:flex;flex-direction:column;line-height:1.2;flex:1}.rs-name{font-weight:500;color:#fff;font-size:12px}.rs-role{font-size:10.5px;color:rgba(255,255,255,0.6)}' +
    '.rs-chev{color:rgba(255,255,255,0.6);font-size:10px;margin-left:2px}' +
    '.rs-menu{position:absolute;top:calc(100% + 6px);right:0;background:#fff;border:1px solid #e2e6ed;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.12);min-width:300px;z-index:100;overflow:hidden}' +
    '.rs-menu-header{padding:10px 14px;font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:#6b7280;background:#f7f8fa;font-weight:600}' +
    '.rs-menu-footer{padding:10px 14px;font-size:11px;color:#6b7280;border-top:1px solid #f0f2f5;background:#fafbfd;line-height:1.4}' +
    '.rs-option{display:flex;align-items:center;gap:10px;padding:10px 14px;width:100%;background:#fff;border:none;border-bottom:1px solid #f0f2f5;cursor:pointer;text-align:left}' +
    '.rs-option:hover{background:#f7f8fa}.rs-option.active{background:#E8EEF6}' +
    '.rs-opt-text{flex:1;display:flex;flex-direction:column;line-height:1.3}' +
    '.rs-opt-name{font-size:13px;font-weight:500;color:#0d1b3e}' +
    '.rs-opt-role{font-size:11.5px;color:#5a6480}' +
    '.rs-opt-scope{font-size:10.5px;color:#9aa3b8;font-style:italic}' +
    '.rs-check{color:#003087;font-weight:600;opacity:0;font-size:14px}' +
    '.rs-option.active .rs-check{opacity:1}' +
    '.field-masked,.masked{font-family:var(--uwc-font-mono,monospace);color:#9aa3b8;letter-spacing:1px}';
  document.head.appendChild(style);
})();
