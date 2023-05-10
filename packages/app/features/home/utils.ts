import { BoardLayouts } from "app/hooks/types/Dashboard"

export const CELL_WIDTH = 243

export const genInitalLayout = (rowLen, ids: Array<string>, cellLayouts: BoardLayouts | null) => {
  if(!rowLen)
    return []

  let layout
  if(cellLayouts && cellLayouts[rowLen]) {
    console.log(ids)
    const idSet = new Set(ids)
    layout = cellLayouts[rowLen]
    layout.forEach((row, r) => row.forEach(
      (id, c) => idSet.has(id) ? idSet.delete(id) : layout[r][c] = ''))
    layout.push(...genMatrix(new Array(...idSet), rowLen))
  } else {
    layout = genMatrix(ids, rowLen)
  }

  layout.push(layout[0].map(() => ''))
  return layout
}

export const genMatrix = (strs, rowLen) => {
  const mat: string[][] = []
  strs.forEach((s,i) => {
    if(i % rowLen === 0) 
      mat.push([s])
    else
      mat.at(-1)?.push(s)
  })
  //@ts-ignore
  while(mat[0] && mat.at(-1)?.length < rowLen)
    mat.at(-1)?.push('')
  return mat
}