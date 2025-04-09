import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  ruler: {
    position: 'absolute',
    height: 1,
    width: '100%',
    backgroundColor: '#cccccc',
  },
  verticalRuler: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: '#cccccc',
  },
  marker: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'red',
  },
  label: {
    position: 'absolute',
    fontSize: 8,
    color: '#000000',
  },
});

interface PDFCoordinateHelperProps {
  width: number;
  height: number;
  step: number;
}

const PDFCoordinateHelper: React.FC<PDFCoordinateHelperProps> = ({ width, height, step = 100 }) => {
  // Tạo các đường thước ngang
  const horizontalRulers = [];
  for (let y = 0; y <= height; y += step) {
    horizontalRulers.push(
      <View key={`h-${y}`} style={[styles.ruler, { top: y }]} />,
      <Text key={`h-label-${y}`} style={[styles.label, { top: y, left: 5 }]}>
        {y}
      </Text>
    );
  }

  // Tạo các đường thước dọc
  const verticalRulers = [];
  for (let x = 0; x <= width; x += step) {
    verticalRulers.push(
      <View key={`v-${x}`} style={[styles.verticalRuler, { left: x }]} />,
      <Text key={`v-label-${x}`} style={[styles.label, { left: x, top: 5 }]}>
        {x}
      </Text>
    );
  }

  return (
    <Document>
      <Page size={[width, height]} style={styles.page}>
        {horizontalRulers}
        {verticalRulers}
      </Page>
    </Document>
  );
};

export default PDFCoordinateHelper; 