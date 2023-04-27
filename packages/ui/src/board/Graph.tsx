import {G, Line, Path, Svg} from 'react-native-svg';

type GraphProps = {
  width: number,
  height: number,
  bottomPadding: number,
  leftPadding: number,
  data?: any
}

export function Graph({ width, height, data, bottomPadding, leftPadding }: GraphProps) {
  return (
    <Svg width={width} height={height} stroke="#6231ff">
      <G y={-bottomPadding}>
        <Line
          x1={leftPadding}
          y1={height}
          x2={width}
          y2={height}
          stroke={'#d7d7d7'}
          strokeWidth="1"
        />
        <Line
          x1={leftPadding}
          y1={height * 0.6}
          x2={width}
          y2={height * 0.6}
          stroke={'#d7d7d7'}
          strokeWidth="1"
        />
        <Line
          x1={leftPadding}
          y1={height * 0.2}
          x2={width}
          y2={height * 0.2}
          stroke={'#d7d7d7'}
          strokeWidth="1"
        />
        {/* <Path d={data.curve} strokeWidth="2" /> */}
      </G>
    </Svg>
  )
}