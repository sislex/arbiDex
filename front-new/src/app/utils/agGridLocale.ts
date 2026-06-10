/** AG Grid locale overrides for Russian UI (filter/menu/tool panels). */
export const agGridLocaleRu: Record<string, string> = {
  // Generic
  loadingOoo: 'Загрузка...',
  loadingError: 'Ошибка загрузки',
  noRowsToShow: 'Нет данных',
  enabled: 'Включено',

  // Set filter
  selectAll: '(Выбрать все)',
  selectAllSearchResults: '(Выбрать все результаты поиска)',
  searchOoo: 'Поиск...',
  blanks: '(Пусто)',
  noMatches: 'Нет совпадений',

  // Number/text/date filter
  filterOoo: 'Фильтр...',
  equals: 'Равно',
  notEqual: 'Не равно',
  blank: 'Пусто',
  notBlank: 'Не пусто',
  empty: 'Выберите',
  lessThan: 'Меньше',
  greaterThan: 'Больше',
  lessThanOrEqual: 'Меньше или равно',
  greaterThanOrEqual: 'Больше или равно',
  inRange: 'В диапазоне',
  inRangeStart: 'От',
  inRangeEnd: 'До',
  contains: 'Содержит',
  notContains: 'Не содержит',
  startsWith: 'Начинается с',
  endsWith: 'Заканчивается на',
  dateFormatOoo: 'гггг-мм-дд',
  andCondition: 'И',
  orCondition: 'ИЛИ',

  // Filter buttons
  applyFilter: 'Применить',
  resetFilter: 'Сбросить',
  clearFilter: 'Очистить',
  cancelFilter: 'Отмена',

  // Filter categories
  textFilter: 'Текстовый фильтр',
  numberFilter: 'Числовой фильтр',
  dateFilter: 'Фильтр по дате',
  setFilter: 'Фильтр по значениям',

  // Menu / sorting
  columns: 'Столбцы',
  filters: 'Фильтры',
  sortAscending: 'Сортировать по возрастанию',
  sortDescending: 'Сортировать по убыванию',
  sortUnSort: 'Очистить сортировку',

  // Column menu
  pinColumn: 'Закрепить столбец',
  pinLeft: 'Слева',
  pinRight: 'Справа',
  noPin: 'Не закреплять',
  valueAggregation: 'Агрегация',
  autosizeThisColumn: 'Подогнать ширину столбца',
  autosizeAllColumns: 'Подогнать ширину всех столбцов',
  groupBy: 'Группировать по',
  ungroupBy: 'Разгруппировать',
  resetColumns: 'Сбросить столбцы',

  // Tool panels
  pivotMode: 'Режим сводной таблицы',
  groups: 'Группы строк',
  rowGroupColumnsEmptyMessage: 'Перетащите сюда для группировки',
  values: 'Значения',
  valueColumnsEmptyMessage: 'Перетащите сюда для агрегации',
  pivots: 'Метки столбцов',
  pivotColumnsEmptyMessage: 'Перетащите сюда для сводной таблицы',

  // Misc
  copy: 'Копировать',
  ctrlC: 'Ctrl+C',
  paste: 'Вставить',
  ctrlV: 'Ctrl+V',
};

export function getAgGridLocaleText(
  key: string,
  defaultValue: string,
  variableValues?: string[],
): string {
  const translated = agGridLocaleRu[key];
  if (translated == null) {
    return defaultValue;
  }

  if (!variableValues?.length) {
    return translated;
  }

  let result = translated;
  for (const value of variableValues) {
    result = result.replace('${variable}', value);
  }
  return result;
}
