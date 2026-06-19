import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Timeweb deploy workflow', () => {
  it('mirrors dist over validated FTP or FTPS without SSH', () => {
    const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');

    for (const name of [
      'TIMEWEB_FTP_HOST',
      'TIMEWEB_FTP_PORT',
      'TIMEWEB_FTP_USER',
      'TIMEWEB_FTP_PASSWORD',
      'TIMEWEB_FTP_PROTOCOL',
      'TIMEWEB_FTP_REMOTE_PATH',
    ]) {
      expect(workflow).toContain(name);
    }

    expect(workflow).toContain('apt-get install -y lftp');
    expect(workflow).toContain('mirror --reverse --delete');
    expect(workflow).toContain('--parallel=1');
    expect(workflow).not.toContain('--parallel=4');
    expect(workflow).toContain('ftp|ftps');
    expect(workflow).toContain('"$TIMEWEB_FTP_REMOTE_PATH" == /home/*');
    expect(workflow).toContain('Use an FTP-virtual path such as /public_html');
    expect(workflow).not.toContain('TIMEWEB_SSH_KEY');
    expect(workflow).not.toContain('ssh-keyscan');
    expect(workflow).not.toContain('rsync ');
  });
});
