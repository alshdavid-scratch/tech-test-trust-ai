import './home.scss'
import { h } from "preact";
import { useInject } from '../../contexts/app.tsx';
import { CategoryService } from '../../../platform/categories/category-service.ts';
import { IntentsService } from '../../../platform/intents/intents-service.ts';
import { useInput } from '../../hooks/forms.ts';

export function HomeView() {
  const categoriesService = useInject(CategoryService)
  const intentsService = useInject(IntentsService)
  const categoryInput = useInput({ 
    initialValue: '', 
    onEnter: (value) => {
      categoriesService.newCategory(value)
      categoryInput.reset()
    }
  })

  return <div class="view-home">
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
  </div>
}

