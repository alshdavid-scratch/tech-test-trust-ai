import './pie-chart.scss'
import { h } from "preact";

// @ts-expect-error
import {GoogleCharts} from 'google-charts';


export type PieChartProps = h.JSX.HTMLAttributes<HTMLDivElement> & {
  rawData: Record<string, number>
}

export function PieChart({rawData, ...props}: PieChartProps) {


  function onElement(el: HTMLDivElement | null) {
    if (!el) return

    function drawChart() {
      const d: Array<[string, number]> = []
      
      const max = Math.max(...Object.values(rawData));
      
      for (const [key, value] of Object.entries(rawData)) {
        d.push([key, 100/ max * value])
      }

      const data = GoogleCharts.api.visualization.arrayToDataTable([
          ['Chart thing', 'Chart amount'],
          ...d
      ]);
      const pie_1_chart = new GoogleCharts.api.visualization.PieChart(el);
      pie_1_chart.draw(data);
    }

    GoogleCharts.load(drawChart);
  }

  return <div {...props} ref={onElement} class="component-pie-chart"></div>
}
