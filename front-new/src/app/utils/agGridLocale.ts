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
  addCurrentSelectionToFilter: 'Добавить выбранное в фильтр',
  searchOoo: 'Поиск...',
  typeToSearchOoo: 'Введите для поиска...',
  blanks: '(Пусто)',
  noMatches: 'Нет совпадений',

  // Text / number / date filter
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
  before: 'До',
  after: 'После',
  dateFormatOoo: 'гггг-мм-дд',
  andCondition: 'И',
  orCondition: 'ИЛИ',

  // Filter buttons
  applyFilter: 'Применить',
  resetFilter: 'Сбросить',
  clearFilter: 'Очистить',
  cancelFilter: 'Отмена',

  // Filter titles
  textFilter: 'Текстовый фильтр',
  numberFilter: 'Числовой фильтр',
  bigintFilter: 'Фильтр BigInt',
  dateFilter: 'Фильтр по дате',
  setFilter: 'Фильтр по значениям',
  agTextColumnFilterDisplayName: 'Текстовый фильтр',
  agNumberColumnFilterDisplayName: 'Числовой фильтр',
  agDateColumnFilterDisplayName: 'Фильтр по дате',
  agSetColumnFilterDisplayName: 'Фильтр по значениям',

  // Filter summaries
  filterSummaryInactive: 'все',
  filterSummaryContains: 'содержит',
  filterSummaryNotContains: 'не содержит',
  filterSummaryTextEquals: 'равно',
  filterSummaryTextNotEqual: 'не равно',
  filterSummaryStartsWith: 'начинается с',
  filterSummaryEndsWith: 'заканчивается на',
  filterSummaryBlank: 'пусто',
  filterSummaryNotBlank: 'не пусто',
  filterSummaryEquals: '=',
  filterSummaryNotEqual: '≠',
  filterSummaryGreaterThan: '>',
  filterSummaryGreaterThanOrEqual: '≥',
  filterSummaryLessThan: '<',
  filterSummaryLessThanOrEqual: '≤',
  filterSummaryInRange: 'в диапазоне',
  filterSummaryInRangeValues: '(${variable}, ${variable})',
  filterSummaryTextQuote: '"${variable}"',

  // Date presets
  yesterday: 'Вчера',
  today: 'Сегодня',
  tomorrow: 'Завтра',
  last7Days: 'Последние 7 дней',
  lastWeek: 'Прошлая неделя',
  thisWeek: 'Эта неделя',
  nextWeek: 'Следующая неделя',
  last30Days: 'Последние 30 дней',
  lastMonth: 'Прошлый месяц',
  thisMonth: 'Этот месяц',
  nextMonth: 'Следующий месяц',
  last90Days: 'Последние 90 дней',
  lastQuarter: 'Прошлый квартал',
  thisQuarter: 'Этот квартал',
  nextQuarter: 'Следующий квартал',
  lastYear: 'Прошлый год',
  thisYear: 'Этот год',
  yearToDate: 'С начала года',
  nextYear: 'Следующий год',
  last6Months: 'Последние 6 месяцев',
  last12Months: 'Последние 12 месяцев',
  last24Months: 'Последние 24 месяца',

  // Aria / filter popup
  ariaLabelColumnFilter: 'Фильтр столбца',
  ariaLabelColumnMenu: 'Меню столбца',
  ariaFilterMenuOpen: 'Открыть меню фильтра',
  ariaFilterList: 'Список фильтра',
  ariaFilterInput: 'Поле фильтра',
  ariaFilterValue: 'Значение фильтра',
  ariaFilterFromValue: 'Значение «от»',
  ariaFilterToValue: 'Значение «до»',
  ariaFilterActive: 'Фильтр активен',
  ariaColumnFiltered: 'Столбец отфильтрован',
  ariaFilterColumn: 'Нажмите CTRL+ENTER для открытия фильтра',
  ariaFilteringOperator: 'Оператор фильтрации',
  ariaLabelSelectField: 'Выбор поля',

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
