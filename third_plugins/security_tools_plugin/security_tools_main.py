# coding: utf-8
import os
import public


class security_tools_main:
    def __init__(self):
        self.plugin_path = '/www/server/panel/plugin/security_tools'

    def index(self, get):
        html_path = os.path.join(self.plugin_path, 'index.html')
        if not os.path.exists(html_path):
            return '<div style="padding:20px;">Security Tools plugin is not installed correctly.</div>'
        return public.readFile(html_path)

    def _run(self, shell):
        result = public.ExecShell(shell)
        return {
            'status': True,
            'msg': result[0] if isinstance(result, (list, tuple)) else str(result)
        }

    def ssh_log(self, get):
        cmd = "if [ -f /var/log/auth.log ]; then tail -n 200 /var/log/auth.log; elif [ -f /var/log/secure ]; then tail -n 200 /var/log/secure; else journalctl -u ssh -u sshd -n 200 --no-pager 2>/dev/null || echo 'SSH log not found'; fi"
        return self._run(cmd)

    def system_log(self, get):
        cmd = "if [ -f /var/log/syslog ]; then tail -n 200 /var/log/syslog; elif [ -f /var/log/messages ]; then tail -n 200 /var/log/messages; else journalctl -n 200 --no-pager 2>/dev/null || echo 'System log not found'; fi"
        return self._run(cmd)

    def fail2ban_status(self, get):
        cmd = "if command -v fail2ban-client >/dev/null 2>&1; then fail2ban-client status; systemctl status fail2ban --no-pager -l | head -n 80; else echo 'Fail2Ban is not installed'; fi"
        return self._run(cmd)

    def fail2ban_install(self, get):
        cmd = "if ! command -v fail2ban-client >/dev/null 2>&1; then if command -v apt-get >/dev/null 2>&1; then apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y fail2ban; elif command -v yum >/dev/null 2>&1; then yum install -y fail2ban || dnf install -y fail2ban; else echo 'No supported package manager found'; fi; fi; systemctl enable fail2ban --now 2>/dev/null || service fail2ban start; fail2ban-client status"
        return self._run(cmd)

    def fail2ban_disable(self, get):
        cmd = "systemctl disable --now fail2ban 2>/dev/null || service fail2ban stop; if command -v fail2ban-client >/dev/null 2>&1; then fail2ban-client status || true; else echo 'Fail2Ban is not installed'; fi"
        return self._run(cmd)

    def open_var_log(self, get):
        return {'status': True, 'msg': '/var/log'}
