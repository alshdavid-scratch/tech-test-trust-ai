import './home.scss'
import { h } from "preact";
import { useInject } from '../../contexts/app.tsx';
import { CategoryService } from '../../../platform/categories/category-service.ts';
import { IntentsService } from '../../../platform/intents/intents-service.ts';
import { useState } from 'preact/hooks';
import { PieChart } from '../../components/pie-chart/pie-chart.tsx';
import { classNames } from '../../../platform/elements/class-names.ts';
import { Panel, PanelHeader, PanelList, PanelListItem, PanelSection } from '../../components/panel/panel.tsx';

export function HomeView() {
  const categoriesService = useInject(CategoryService)
  const intentsService = useInject(IntentsService)
  const [selectedCategory, setSelectedCategory] = useState<string>('foo')

  function addCategory() {
    const value = prompt('What is the name of the category')
    if (!value) {
      return
    }
    categoriesService.newCategory(value)
  }

  const allIntents = intentsService.getIntents()
  const allIntentsList = Array.from(allIntents.keys())
  
  const intentsForCategory = selectedCategory !== 'all' 
    ? categoriesService.getIntents(selectedCategory) 
    : allIntents

  if (!intentsForCategory) {
    setSelectedCategory('all')
    return null
  }
  const intentsListForCategory = Array.from(intentsForCategory.keys())
  const intentsToAdd = allIntentsList.filter(v => !intentsListForCategory.includes(v))

  return <div class="view-home">
    <div class="categories">
      <div className="heading">Intents</div>

      <div 
        class={classNames({ 'item': true, 'selected': selectedCategory === 'all'})} 
        onClick={() => setSelectedCategory('all')}
        >All <span>[{allIntents.size}]</span></div>

      <div className="heading">Custom Categories <button onClick={addCategory}>+</button></div>

      {categoriesService.entries().map(([name]) => (
        <div 
          class={classNames({ 'item': true, 'selected': selectedCategory === name})}
          onClick={() => setSelectedCategory(name)}
          >{name} <span>[{categoriesService.getIntents(name)?.size}]</span></div>
      ))}

      <div className="heading">Automatic Categories</div>
      
    </div>
    <div class="tags">
      <PanelHeader>
        <div>Category: {selectedCategory}</div>
        <button onClick={() => categoriesService.removeCategory(selectedCategory)}>Delete</button>
      </PanelHeader>

      <PanelSection class="summary">
        <PieChart rawData={Object.fromEntries(intentsForCategory)} style={{ height: '400px'}} />
      </PanelSection>

      <Panel class="panel-included-intents">
        <PanelHeader>
          Included Intents
        </PanelHeader>

        <PanelList>
          {intentsListForCategory.map(intent => (
            <PanelListItem>
              {intent}
              <button onClick={() => categoriesService.removeIntent(selectedCategory, intent)}>X</button>
            </PanelListItem>))}
        </PanelList>
      </Panel>

      {selectedCategory !== 'all' && (
        <Panel class="panel-add-intents">
          <PanelHeader>
            Add Intents
          </PanelHeader>

          <PanelList>
            {intentsToAdd.map(intent => (
              <PanelListItem 
                onClick={() => categoriesService.addIntent(selectedCategory, intent)}>
                {intent}
              </PanelListItem>
            ))}
          </PanelList>
        </Panel>
      )}
    </div>     
  </div>
}
