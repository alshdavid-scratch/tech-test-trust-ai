import './home.scss'
import { h } from "preact";
import { useInject } from '../../contexts/app.tsx';
import { CategoryService } from '../../../platform/categories/category-service.ts';
import { BarChart } from '../../components/bar-chart/bar-chart.tsx';
import { PanelHeader } from '../../components/panel/panel.tsx';

export function HomeView() {
  const categoriesService = useInject(CategoryService)

  const categoryIntents = categoriesService.getCategorySummary()

  return <div class="view-home">
    <PanelHeader>
      <div>Overview</div>
    </PanelHeader>

    <BarChart 
      title="Number of hits per category" 
      xLabel="Hits" 
      yLabel="Category" 
      rawData={Object.fromEntries(categoryIntents)} />
  </div>
}
