import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const HalfPieChart = () => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Create root element
    let root = am5.Root.new(containerRef.current);

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Create chart
    let chart = root.container.children.push(am5percent.PieChart.new(root, {
      startAngle: 180,
      endAngle: 360,
      layout: root.verticalLayout,
      innerRadius: am5.percent(50)
    }));

    // Create series
    let series = chart.series.push(am5percent.PieSeries.new(root, {
      startAngle: 180,
      endAngle: 360,
      valueField: "value",
      categoryField: "category",
      alignLabels: false // Убрать подписи
    }));

    series.states.create("hidden", {
      startAngle: 180,
      endAngle: 180
    });

    series.slices.template.setAll({
      cornerRadius: 5
    });

    series.ticks.template.setAll({
      forceHidden: true // Убрать метки на срезах
    });

    series.labels.template.setAll({
      visible: false // Убрать подписи сверху
    });

    // Set data
    series.data.setAll([
      { value: 70, category: "Посещений по хим. разделу" },
      { value: 30, category: "Посещений по орг. разделу" }
    ]);

    series.appear(1000, 100);

    chartRef.current = root;

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "300px", height: "200px" }}></div>
  );
};

export default HalfPieChart;
