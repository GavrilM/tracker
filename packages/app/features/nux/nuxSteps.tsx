import { XStack } from "@my/ui"
import { StyleSheet } from "react-native"

export const NuxSteps = [
  {
    title: 'Welcome to Lifelog!',
    description: 'This is your dashboard, which shows an overview of everything you\'re tracking.',
    x: 0,
    y: 0,
    Mask: function() {
      return (
        <XStack style={styles.overlay} height='100%' width='100%'/>
      )
    }
  },
  {
    title: 'These are Cells.',
    description: `Every Cell shows a graph or a summary number for a Metric that you\'re tracking.\n
     Metrics are whatever you want to track, anything from calories to number of compliments.`,
    x: 0,
    y: 100,
    Mask: function() {
      return (
        <>
          <XStack style={styles.overlay} height={100} width='100%'/>
          <XStack style={styles.overlay} top={100} height={`calc(100% - 100px)`} width={60}/>
          <XStack style={styles.overlay} top={360} left={60} height={`calc(100% - 360px)`} width={500}/>
          <XStack style={styles.overlay} top={100} left={560} height={`calc(100% - 100px)`} width={`calc(100% - 560px)`}/>
        </>
      )
    }
  },
  {
    title: 'Collecting data is easy peasy.',
    description: 'You can collect a single data point from the dashboard, or easily enter all your data at once. We recommend establishing a daily habit of collecting data.',
    x: 0,
    y: 100,
    Mask: function() {
      return (
        <>
          <XStack style={styles.overlay} height={290} width={`calc(100% - 190px)`}/>
          <XStack style={styles.overlay} top={100} height={`calc(100% - 100px)`} width={60}/>
          <XStack style={styles.overlay} top={360} left={60} height={`calc(100% - 360px)`} width={500}/>
          <XStack style={styles.overlay} top={80} left={550} height={`calc(100% - 80px)`} width={`calc(100% - 550px)`}/>
        </>
      )
    }
  },
  {
    title: 'Make this dashboard yours.',
    description: 'You can move Cells around and color-categorize them.',
    x: 0,
    y: -100,
    Mask: function() {
      return (
        <>
          <XStack style={styles.overlay} height={80} width={`calc(100% - 390px)`}/>
          <XStack style={styles.overlay} height={80} right={0} width={310}/>
          <XStack style={styles.overlay} top={80} height={`calc(100% - 80px)`} width={'100%'}/>
        </>
      )
    }
  },
  {
    title: 'Get started with your first Metric.',
    description: 'What do you want to measure? Mood? Productivity? A daily streak? As long as you can put a number on it, the sky\'s the limit.',
    x: 0,
    y: -100,
    Mask: function() {
      return (
        <>
          <XStack style={styles.overlay} height={80} width={`calc(100% - 310px)`}/>
          <XStack style={styles.overlay} height={80} right={0} width={190}/>
          <XStack style={styles.overlay} top={80} height={`calc(100% - 80px)`} width={'100%'}/>
        </>
      )
    }
  }
]

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    backgroundColor: 'black',
    opacity: .75,
    zIndex: 500
  }
})
