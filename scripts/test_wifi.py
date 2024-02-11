import subprocess

def get_bssid():
    cmd = ['netsh', 'wlan', 'show', 'interfaces']
    output = subprocess.check_output(cmd, shell=True).decode('utf-8')
    # print(output)
    for line in output.split('\n'):
        if 'BSSID' in line:
            return line.split(':', 1)[1].strip()

bssid = get_bssid()
print("BSSID of the connected Wi-Fi network:", bssid)
# 