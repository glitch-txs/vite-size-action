import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const PNPM_LOCK_FILE = 'pnpm-lock.yaml'
const YARN_LOCK_FILE = 'yarn.lock'
const BUN_LOCK_FILE = 'bun.lockb'

export function getPackageManager(cwd = process.cwd()){
  if(existsSync(resolve(cwd, YARN_LOCK_FILE))) return 'yarn'
  if(existsSync(resolve(cwd, PNPM_LOCK_FILE))) return 'pnpm'
  if(existsSync(resolve(cwd, BUN_LOCK_FILE))) return 'bun'
  return 'npm'
}