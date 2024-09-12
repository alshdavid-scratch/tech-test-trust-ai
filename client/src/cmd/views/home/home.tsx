import './home.scss'
import { h } from "preact";
import { useInject } from '../../contexts/app.tsx';
import { CategoryService } from '../../../platform/categories/category-service.ts';
import { IntentsService } from '../../../platform/intents/intents-service.ts';
import { useState } from 'preact/hooks';
import { PieChart } from '../../components/pie-chart/pie-chart.tsx';

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
      <div class="panel-header tags-header">
        <div>Category: {selectedCategory}</div>
        <button onClick={() => categoriesService.removeCategory(selectedCategory)}>Delete</button>
      </div>

      <div class="summary">
        <PieChart rawData={{foo: 10}} style={{ height: '400px'}} />
      </div>

      <div class="panel-list">
        <div class="panel-header panel-add-header">
            <div>Included Intents</div>
        </div>


        {!intentsListForCategory.length && <div class="no-items">No Items</div>}
        {intentsListForCategory.map(intent => (
          <div 
            class="list-item"
            >{intent}
            <button onClick={() => categoriesService.removeIntent(selectedCategory, intent)}>X</button>
          </div>))}
      </div>

      {
        selectedCategory !== 'all' && (
        <div class="panel-add">
          <div class="panel-header panel-add-header">
            <div>Add Intents</div>
          </div>
          <div class="panel-add-list">
            {intentsToAdd.map(intent => (
              <div 
                class="list-item"
                onClick={() => categoriesService.addIntent(selectedCategory, intent)}
                >{intent}</div>
              ))}
          </div>
        </div>)
      }
    </div>     
  </div>
}


const classNames = (input: Record<string, boolean>): string => {
  let className = ''
  for (const [item, enabled] of Object.entries(input)) {
    if (!enabled) continue
    className += ` ${item}`
  }
  return className
}

/*

const categoryInput = useInput({ 
    initialValue: '', 
    onEnter: (value) => {
      categoriesService.newCategory(value)
      categoryInput.reset()
    }
  })


    <div class="raw-intents">
      {intentsService.getIntents().map(intent => <div>{intent}</div>)}
    </div>
    <div class="categories">
      <div>
        <input type="text" {...categoryInput} />
        <button onClick={() => categoryInput.triggerEnter()}>Add</button>
      </div>
      {categoriesService.entries().map(([name, tags]) => <div>
        <div>
          <button onClick={() => categoriesService.removeCategory(name)}>X</button>
          <span>{name}</span>
        </div>
        <div>
          <input list={name} type="text" />
          <datalist id={name}>
            {intentsService.getIntents().map(intent => <option value={intent}>{intent}</option>)}
          </datalist>
        </div>
        <div>
          {intentsService.getIntentsForTags(...tags)}
        </div>
      </div>)}
    </div>
*/