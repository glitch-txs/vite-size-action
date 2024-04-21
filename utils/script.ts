import { exec } from "@actions/exec"
import { getPackageManager } from "./packageManager.js"

type SizeValue = (string | number)[][]

export async function exec_vite_size({ branch }: { branch?: string } = {}){
  let stdout_output: string[] = []

  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        stdout_output.push(data.toString())
      }
    }
  }

  const package_manager = getPackageManager()

  if (branch) {
    try {
      await exec(`git fetch origin ${branch} --depth=1`);
    } catch (error) {
      console.log("Fetch failed", (error as Error).message);
    }

    await exec(`git checkout -f ${branch}`)
    await exec(`${package_manager} install`)
  }

  const status = await exec(`${package_manager} run size`, [], options)
  
  if(status > 0) return { status, size_values: undefined }

  const total_size = ['Total Size', 0, 0]
  const filtered_output = JSON.parse(stdout_output[stdout_output.length - 1] as string)

  const size_values: SizeValue = [['Name', 'Size (kb)', 'Gzip (kb)']]

  for(let i = 0; i < filtered_output.length; i++){
    (total_size[1] as number) += Number(filtered_output[i].size);
    (total_size[2] as number) += Number(filtered_output[i].gzip);

    size_values.push([
      filtered_output[i].name.toString(),
      Number(filtered_output[i].size),
      Number(filtered_output[i].gzip)
    ])
  }
  size_values.push(total_size)

  return {
    status,
    size_values
  }
}

export function calcDiff({ current, base }: { current?: SizeValue, base?: SizeValue }){
  
  if(!current || !base) return {
    diff_size_values: undefined
  }

  const current_size = Number(current[current.length - 1]?.[1])
  const current_gzip = Number(current[current.length - 1]?.[2])
  const base_size = Number(base[base.length - 1]?.[1])
  const base_gzip = Number(current[current.length - 1]?.[2])

  let size: string | number = Math.abs(current_size - base_size)
  let gzip: string | number = Math.abs(current_gzip - base_gzip)

  if(current_size > base_size){
    size = '🔺+' + size
  }

  if(current_gzip > base_gzip){
    gzip = '🔺+' + gzip
  }
  
  return {
    diff_size_values: [
      ['', 'Size (kb)', 'Gzip (kb)'],
      ['Total Diff.', size, gzip]
    ]
  }
}