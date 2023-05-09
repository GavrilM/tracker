import { BoardLayouts } from "app/hooks/types/Dashboard"

export const CELL_WIDTH = 243

export const genInitalLayout = (rowLen, ids: Array<string>, cellLayouts: BoardLayouts | null) => {
  if(!rowLen)
    return []
  if(cellLayouts && cellLayouts[rowLen])
    return cellLayouts[rowLen]

  const init = genMatrix(ids, rowLen)
  init.push(init[0].map(() => ''))
  return init
}

export const genMatrix = (strs, rowLen) => {
  const mat: string[][] = []
  strs.forEach((s,i) => {
    if(i % rowLen === 0) 
      mat.push([s])
    else
      mat.at(-1)?.push(s)
  })
  return mat
}