(function () {
  function initV2SecurityQuickTools() {
    var path = window.location.pathname || '';
    if (path.indexOf('/security/firewall') === -1) return;
    if (document.getElementById('securityQuickToolsV2')) return;

    var wrap = document.createElement('div');
    wrap.id = 'securityQuickToolsV2';
    wrap.style.cssText = 'position:fixed;right:16px;bottom:20px;z-index:999999;background:#1f232a;border:1px solid #3a3f49;border-radius:8px;padding:10px;box-shadow:0 6px 16px rgba(0,0,0,.35);max-width:290px;color:#fff;';
    wrap.innerHTML = '<div style="font-weight:bold;margin-bottom:8px;">Security Quick Tools</div>' +
      '<button class="btn btn-default btn-xs" data-cmd="ssh" style="margin:0 6px 6px 0;">SSH Log</button>' +
      '<button class="btn btn-default btn-xs" data-cmd="sys" style="margin:0 6px 6px 0;">System Log</button>' +
      '<button class="btn btn-default btn-xs" data-cmd="path" style="margin:0 6px 6px 0;">Open /var/log</button>' +
      '<button class="btn btn-success btn-xs" data-cmd="f2b-status" style="margin:0 6px 6px 0;">Fail2Ban Status</button>' +
      '<button class="btn btn-success btn-xs" data-cmd="f2b-install" style="margin:0 6px 6px 0;">Install/Enable</button>' +
      '<button class="btn btn-warning btn-xs" data-cmd="f2b-disable" style="margin:0 6px 6px 0;">Disable</button>';
    document.body.appendChild(wrap);

    function openCmd(title, shell) {
      if (typeof bt_tools === 'undefined' || !bt_tools.command_line_output || typeof layer === 'undefined') {
        alert('Command panel is not ready yet. Please refresh and try again.');
        return;
      }
      var cid = 'security_quick_v2_' + Date.now();
      layer.open({
        type: 1,
        title: title,
        area: ['900px', '560px'],
        content: '<div style="padding:12px;"><pre id="' + cid + '" class="command_output_pre" style="height:470px;background:#111;color:#eee;padding:10px;overflow:auto;"></pre></div>',
        success: function () {
          bt_tools.command_line_output({ el: '#' + cid, shell: shell, time: 120000 });
        }
      });
    }

    wrap.addEventListener('click', function (e) {
      var cmd = e.target.getAttribute('data-cmd');
      if (!cmd) return;
      if (cmd === 'path') return (typeof openPath === 'function' ? openPath('/var/log') : alert('/var/log'));
      if (cmd === 'ssh') return openCmd('SSH Log', "if [ -f /var/log/auth.log ]; then tail -n 200 /var/log/auth.log; elif [ -f /var/log/secure ]; then tail -n 200 /var/log/secure; else journalctl -u ssh -u sshd -n 200 --no-pager 2>/dev/null || echo 'SSH log not found'; fi");
      if (cmd === 'sys') return openCmd('System Log', "if [ -f /var/log/syslog ]; then tail -n 200 /var/log/syslog; elif [ -f /var/log/messages ]; then tail -n 200 /var/log/messages; else journalctl -n 200 --no-pager 2>/dev/null || echo 'System log not found'; fi");
      if (cmd === 'f2b-status') return openCmd('Fail2Ban Status', "if command -v fail2ban-client >/dev/null 2>&1; then fail2ban-client status; systemctl status fail2ban --no-pager -l | head -n 80; else echo 'Fail2Ban is not installed'; fi");
      if (cmd === 'f2b-install') return openCmd('Install/Enable Fail2Ban', "if ! command -v fail2ban-client >/dev/null 2>&1; then if command -v apt-get >/dev/null 2>&1; then apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y fail2ban; elif command -v yum >/dev/null 2>&1; then yum install -y fail2ban || dnf install -y fail2ban; else echo 'No supported package manager found'; fi; fi; systemctl enable fail2ban --now 2>/dev/null || service fail2ban start; fail2ban-client status");
      if (cmd === 'f2b-disable') return openCmd('Disable Fail2Ban', "systemctl disable --now fail2ban 2>/dev/null || service fail2ban stop; if command -v fail2ban-client >/dev/null 2>&1; then fail2ban-client status || true; else echo 'Fail2Ban is not installed'; fi");
    });
  }

  setTimeout(initV2SecurityQuickTools, 1500);
})();
