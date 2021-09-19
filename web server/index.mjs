import { data } from './data.js'

// Получение элементов по имени класса при обращении к DOM
const table = document.getElementById('table').getElementsByTagName('tbody')[0]
const pagination = document.getElementsByClassName('pagination')[0]
const trs = document.getElementsByTagName('tr')
const form = document.getElementsByClassName('form')[0]

// Получение элемента для сортировки колонки "First Name"
document.getElementById('first_sort').addEventListener('click', () =>
  // Вызов функции сортировки с передачей двух аргументов, 1 - название колонки, 2 - boolean значение
  sortedHandler('firstName', true)
)
// Получение элемента для сортировки колонки "Last Name"
document.getElementById('last_sort').addEventListener('click', () =>
  // Вызов функции сортировки с передачей двух аргументов, 1 - название колонки, 2 - boolean значение
  sortedHandler('lastName', true)
)
// Получение элемента для сортировки колонки "About"
document.getElementById('about_sort').addEventListener('click', () =>
  // Вызов функции сортировки с передачей двух аргументов, 1 - название колонки
  sortedHandler('about')
)
// Получение элемента для сортировки колонки "Eye color"
document.getElementById('eye_sort').addEventListener('click', () =>
  // Вызов функции сортировки с передачей двух аргументов, 1 - название колонки
  sortedHandler('eyeColor')
)
// Получение элемента button для обновления данных
document.getElementsByClassName('update')[0].onclick = (e) => {
  // Вызов функции обновления данных с передачей в нее аргумента event
  updateHandler(e)
}
// Получение элемента button для отмены обновления данных
document.getElementsByClassName('cancel')[0].onclick = () => {
  // Вызов функции для сброса значений формы для обновления данных
  cancelHandler()
}
document
  .getElementById('unvisible_first')
  .addEventListener('click', () => showHideColumn(1, 0, false))
document
  .getElementById('unvisible_second')
  .addEventListener('click', () => showHideColumn(3, 1, false))
document
  .getElementById('unvisible_third')
  .addEventListener('click', () => showHideColumn(5, 2, false))
document
  .getElementById('unvisible_fourth')
  .addEventListener('click', () => showHideColumn(7, 3, false))
document.getElementById('visible_all').onclick = () => {
  visibleAll()
}

// хранилище данных
const state = {
  data: data,
  filteredArray: [],
  sort: false,
  page: 1,
}

// Массив id-ов объектов data (10) для удаления строк
let arrayRows = []

// Функция получения данных согласно указанной странице
const getData = (page) => {
  // Данное условие необходимо для первой загрузки страницы
  if (page) {
    // Вызов функции удаления строк таблицы для создания новых
    deleteRows()

    // Массив содержащий часть данных от data согласно page
    const filteredData = data.slice(
      `${page - 1 === 0 ? 0 : page - 1 + '0'}`,
      `${page + '0'}`
    )

    // Цикл для добавления новых id в arrayRows
    for (const i in filteredData) {
      arrayRows.push(filteredData[i]['id'])
    }

    // Обновление значения state у filteredData
    state.filteredArray = filteredData
    // Вызов функции создания новых строк
    createRows()
    // Вызов функции для добавления слушителей событий по нажатию на строку
    rowEvent()
  } else {
    // При первом запуске программы используется дефолтное значение у page = 1
    page = 1

    let filteredData = data.slice(
      `${page - 1 === 0 ? 0 : page - 1 + '0'}`,
      `${page + '0'}`
    )

    for (let i in filteredData) {
      arrayRows.push(filteredData[i]['id'])
    }

    state.filteredArray = filteredData
  }
}

// Функция для создания строк в таблице
const createRows = () => {
  // С помощью метода map выполняется callback для каждого элемента
  state.filteredArray.forEach((user) => {
    // Создаем элмент tr (row)
    const row = document.createElement('tr')

    // Добавляем id для row
    row.id = user.id

    // mouseOnRow необходима для определения расположен ли курсор на row
    let mouseOnRow = false

    // Добавление слушателя события при наведение курсора на row
    row.addEventListener('mouseenter', (event) => {
      // Изменение значения mouseOnRow на true
      mouseOnRow = true
      /* 
        Добавляется задержка перед выполнением функции полного отображения данных строки
        чтобы не было резкого открытия строк и для удобного перемещения по таблице
      */
      setTimeout(() => {
        // Если курсор наведен на строку, то вызывается функция отображения данных строки
        if (mouseOnRow) {
          removeClassText(event.target.id)
        }
      }, 500)
    })
    // Добавление слушателя события если курсор покинул row
    row.addEventListener('mouseleave', (event) => {
      mouseOnRow = false
      // Вызов функции скрытия данных строки
      addClassText(event.target.id)
    })

    /*
      Условия для проверки была ли скрыта первая колонка
      Если да, то новые элементы будут скрыты, свойство display = 'none'
      Если нет, то новые элементы будут отображены, свойство display = 'table-cell'
      Для проверки вызывается функция chekcCreateRow в которую аргументом передается index столбца
      * Части кода с вызовом функции checkCreateRow() аналогичны коду с вызововом checkCreateRow(0)
    */
    if (checkCreateRow(0)) {
      // Создаем элемент td
      const td1 = document.createElement('td')
      // Добавляем свойство display
      td1.style.display = 'none'
      // Добавляем элементу текст из объекта user
      td1.appendChild(document.createTextNode(user.name.firstName))
      // Добавляем созданный элемент в row
      row.appendChild(td1)
    } else {
      // Аналогичный код
      const td1 = document.createElement('td')
      td1.style.display = 'table-cell'
      td1.appendChild(document.createTextNode(user.name.firstName))
      row.appendChild(td1)
    }

    if (checkCreateRow(1)) {
      const td2 = document.createElement('td')
      td2.style.display = 'none'
      td2.appendChild(document.createTextNode(user.name.lastName))
      row.appendChild(td2)
    } else {
      const td2 = document.createElement('td')
      td2.style.display = 'table-cell'
      td2.appendChild(document.createTextNode(user.name.lastName))
      row.appendChild(td2)
    }

    if (checkCreateRow(2)) {
      const td3 = document.createElement('td')
      const p = document.createElement('p')
      p.className = 'block-with-text'
      p.id = user.id + 'd'
      td3.style.display = 'none'
      p.appendChild(document.createTextNode(user.about))
      td3.appendChild(p)
      row.appendChild(td3)
    } else {
      const td3 = document.createElement('td')
      const p = document.createElement('p')
      p.className = 'block-with-text'
      p.id = user.id + 'd'
      td3.style.display = 'table-cell'
      p.appendChild(document.createTextNode(user.about))
      td3.appendChild(p)
      row.appendChild(td3)
    }

    if (checkCreateRow(3)) {
      const td4 = document.createElement('td')
      const p = document.createElement('p')
      p.className = 'status'
      // Функция selectColor используется для выбора цвета eye color по значению use.eyeColor
      p.style.background = selectColor(user.eyeColor)
      p.style.color = '#fff'
      p.id = user.id + 'e'
      td4.style.display = 'none'
      p.appendChild(document.createTextNode(user.eyeColor))
      td4.appendChild(p)
      row.appendChild(td4)
    } else {
      const td4 = document.createElement('td')
      const p = document.createElement('p')
      p.className = 'status'
      p.style.background = selectColor(user.eyeColor)
      p.style.color = selectColor(user.eyeColor)
      p.id = user.id + 'e'
      td4.style.display = 'table-cell'
      p.appendChild(document.createTextNode(user.eyeColor))
      td4.appendChild(p)
      row.appendChild(td4)
    }

    // Добавляем созданный элемент row в таблицу
    table.appendChild(row)
  })
}

// Функция для добавления слушателей событий нажатий на строку
const rowEvent = () => {
  // Итерирование строк для добавления слушателей событий
  for (let i = 0; i < table.rows.length; i++) {
    table.rows[i].onclick = function () {
      // Показать форму для редактирования
      form.style.display = 'flex'
      // С помощью this получаем id строки
      const idRow = this.id
      // Получаем элементы формы для обновления данных и с помощью innerHtml изменяем их значение
      document.getElementById('first_name').value = this.cells[0].innerHTML
      document.getElementById('second_name').value = this.cells[1].innerHTML
      document.getElementById('about').value = document.getElementById(
        this.id + 'd'
      ).textContent
      document.getElementById('eye').value = document.getElementById(
        this.id + 'e'
      ).textContent

      // Изменяем значение у button обновления данных на id строки
      document.getElementsByClassName('update')[0].value = idRow
    }
  }
}

// Функция создания постраничного вывода
const createPagination = () => {
  // Получение количества страниц
  const pages = Math.ceil(data.length / 10)

  // Создаем элементы для постраничного вывода(пв)
  for (let i = 1; i <= pages; i++) {
    // Создаем элемент для пв
    const div = document.createElement('div')
    // Добавляем класс для элемента и id
    div.className = 'pagination_item'
    div.id = i

    // Добавляем слушатель событий click для изменения данных в таблице
    div.addEventListener('click', () => {
      // Функция для получения данных, где передаем аргументом номер страницы
      getData(i)
      // Функция для отображения активной страницы, где передаем аргументом номер страницы
      setActivePage(i)
      // Отображение скрытых колонок
      visibleAll()
    })

    // Добавляем в элемент номер страницы
    div.appendChild(document.createTextNode(i))

    // Добавляем новый элемент пв в общий список
    pagination.appendChild(div)
  }
}

// Функция для удаления строк из таблицы
const deleteRows = () => {
  // Используем метод map и получаем элементы по id, а затем удаляем
  arrayRows.map((id) => {
    let row = document.getElementById(id)

    row.remove()
  })

  // Отчищаем массив id-ов
  arrayRows = []
}

// Функция обновления данных
const updateHandler = (event) => {
  // Значение id получение из event
  let id = event.target.value
  // Получение элемента для отображение сообщения при обнолвении данных
  const message = document.getElementById('message')

  /* 
    Условие проверки на пустоту поле в форме обновления данных
    Если false, то обновляем данные и отображаем сообщение об успехе
    Иначе очищаем значения формы и отображаем сообщение об ошибке
  */
  if (!checkUpdate()) {
    // Получаем значения элементов формы для обновления данных (ОД)
    let firstName = document.getElementById('first_name').value
    let lastName = document.getElementById('second_name').value
    let about = document.getElementById('about').value
    let eyeColor = document.getElementById('eye').value

    // ОД в хранилище у data с помощью метода map
    state.data.map((note, index) => {
      // Если id объекта данные, которого хотим обновить, совпадают с id объекта note, то обновляем
      if (note.id === id) {
        state.data[index] = {
          id: note.id,
          name: {
            firstName,
            lastName,
          },
          phone: note.phone,
          about,
          eyeColor,
        }
      }
    })
    // Аналогичное ОД для отфильтрованного массива из 10 объектов
    state.filteredArray.map((note, index) => {
      if (note.id === id) {
        state.filteredArray[index] = {
          id: note.id,
          name: {
            firstName,
            lastName,
          },
          phone: note.phone,
          about,
          eyeColor,
        }
      }
    })

    // Получение строки по id
    let row = document.getElementById(id)

    // Изменяем текущие значения полей в таблицы у выбранной строки
    row.cells[0].innerText = firstName
    row.cells[1].innerText = lastName
    document.getElementById(id + 'd').innerText = about
    document.getElementById(id + 'e').innerText = eyeColor
    document.getElementById(id + 'e').style.backgroundColor =
      selectColor(eyeColor)
    document.getElementById(id + 'e').style.color = selectColor(eyeColor)

    // Отображаем сообщение об успехе использую свойство display
    message.style.display = 'initial'
    message.style.backgroundColor = '#c1f005'
    message.innerText = 'Data updated'
    // Задержка функции скрытия формы с помощью свойства display
    setTimeout(() => {
      // Очищаем форму после изменения значений строки
      document.getElementById('first_name').value = ''
      document.getElementById('second_name').value = ''
      document.getElementById('about').value = ''
      document.getElementById('eye').value = ''

      message.style.display = 'none'
      form.style.display = 'none'
    }, 1000)
  } else {
    // Отображаем сообщение об ошибке использую свойство display
    message.style.display = 'initial'
    message.style.backgroundColor = '#f43a5f'
    message.innerText = 'Emty fiel'
    // Задержка функции скрытия формы с помощью свойства display
    setTimeout(() => {
      // Очищаем форму
      document.getElementById('first_name').value = ''
      document.getElementById('second_name').value = ''
      document.getElementById('about').value = ''
      document.getElementById('eye').value = ''

      message.style.display = 'none'
      form.style.display = 'none'
    }, 1000)
  }
}

// Функция отмены обновления данных, которая очищает форму
const cancelHandler = () => {
  document.getElementById('first_name').value = ''
  document.getElementById('second_name').value = ''
  document.getElementById('about').value = ''
  document.getElementById('eye').value = ''

  form.style.display = 'none'
}

// Функция отображения активной страницы
const setActivePage = (active = 1) => {
  // Получение элемента по текущему значение страницы
  const prePagItem = document.getElementById(state.page)
  // Удаляем у текущей страницы класс, отвечающий за выделение активной страницы
  prePagItem.classList.remove('pag_active')

  // Изменяем в хранилище номер текущей страницы
  state.page = active

  // Добавляем элементу новой активной страницы коасс для отображения
  const pagItem = document.getElementById(active)
  pagItem.classList.add('pag_active')
}

// Функция для сортировки массива объектов по определенным полям
const byField = (field, pol) => {
  /*
    Если name, то сортируются по полю First Name или Last Name
    Иначе сортируются по полю About или Eye color 
  */
  if (pol) {
    if (state.sort) {
      //Если первое значенеи выше второго, то повышаем позицию объекта в массива, иначе понижаем
      return (a, b) => (a['name'][field] > b['name'][field] ? 1 : -1)
    } else {
      //Если первое значенеи выше второго, то понижаем позицию объекта в массива, иначе повышаем
      return (a, b) => (b['name'][field] > a['name'][field] ? 1 : -1)
    }
  } else {
    if (state.sort) {
      return (a, b) => (a[field] > b[field] ? 1 : -1)
    } else {
      return (a, b) => (b[field] > a[field] ? 1 : -1)
    }
  }
}

// Функция сортировки строк в таблице по названиям колонок
const sortedHandler = (name, type) => {
  // Перед сортировкой удаляем старые строки
  deleteRows()
  // Имзеняем значение sort в хранилище для изменения типа сортировки
  state.sort = !state.sort

  // Отфильтрованный массив из 10 объектов
  let array = state.filteredArray

  // Функция сортировки 1 - аргумент название колонки, 2 - Сортировка по имени
  array.sort(byField(name, type))

  // Добавление новые id-ов в массив для удаления строк
  for (let i in array) {
    arrayRows.push(array[i]['id'])
  }
  // Изменения filteredArray в хранилище
  state.filteredArray = array

  // Создание строк и добавленя слушателей событий на них
  createRows()
  rowEvent()
}

// Функция выбора цвета
const selectColor = (color) => {
  // Возвращает значение цвета (hex)
  switch (color) {
    case 'blue':
      return '#8bc8f7'
    case 'red':
      return '#f43a5f'
    case 'green':
      return '#c1f005'
    case 'brown':
      return '#cd9575'
    default:
      return '#fff'
  }
}

// Функция проверки скрыта ли колонка
const checkCreateRow = (head) => {
  // Получаем элемент по значению колонки и вытаскиваем из него значение у display
  const visible_column = document.getElementsByTagName('th')[head].style.display

  // Если она скрыта, возращаем true, иначе false
  if (visible_column === 'none') {
    return true
  } else {
    return false
  }
}

// Функция проверки перед ОД
const checkUpdate = () => {
  // Значения в поля заполнения форм ОД
  const arrCheck = [
    document.getElementById('first_name').value,
    document.getElementById('second_name').value,
    document.getElementById('about').value,
    document.getElementById('eye').value,
  ]
  let result = false

  // Проверка всех полей
  for (const i of arrCheck) {
    // Если хоть какое нибудь пустое, то result будет true
    if (i === '') {
      result = true
    }
  }

  return result
}

// Функция для отображение скрытого текста в строке
const removeClassText = (id) => {
  // Получаем элемент со скрытым текстом
  const hideText = document.getElementById(id + 'd')

  // Удаляем класс, который скрывает текст и добавляем новый для показа
  hideText.classList.remove('block-with-text')
  hideText.classList.add('showText')
}

// Функция для скрытия текст в строке
const addClassText = (id) => {
  // Получаем элемент с полным текстом
  const hideText = document.getElementById(id + 'd')

  // Добавляем класс для его сокрытия
  hideText.classList.add('block-with-text')
}

// Функция скрытия колонок
const showHideColumn = (column, elem, visible) => {
  // Если visible, то показываем колонку, иначе нет
  let display = visible ? 'table-cell' : 'none'

  // Циклом проходим по каждому элементу выбранной колонке
  for (let i = 0; i < trs.length; i++) {
    if (i === 0) {
      // Скрываем или отображаем заголовок колонки
      document.getElementsByTagName('tr')[i].childNodes[column].style.display =
        display
    } else {
      // Скрываем или отображаем ячейки колонки
      document.getElementsByTagName('tr')[i].childNodes[elem].style.display =
        display
    }
  }

  // Если все колонки были скрыты, то отображаем все
  if (checkVisbile()) {
    visibleAll()
  }
}

// Функция показа всех скрытых колонок
const visibleAll = () => {
  showHideColumn(1, 0, true)
  showHideColumn(3, 1, true)
  showHideColumn(5, 2, true)
  showHideColumn(7, 3, true)
}

// Функция проверки на скрытие все колонок
const checkVisbile = () => {
  const visible_column1 = document.getElementsByTagName('th')[0].style.display
  const visible_column2 = document.getElementsByTagName('th')[1].style.display
  const visible_column3 = document.getElementsByTagName('th')[2].style.display
  const visible_column4 = document.getElementsByTagName('th')[3].style.display

  if (
    visible_column1 === 'none' &&
    visible_column2 === 'none' &&
    visible_column3 === 'none' &&
    visible_column4 === 'none'
  ) {
    return true
  } else {
    return false
  }
}

// Получаем данные (default = (1 - 10))
getData()
// Создаем строки в таблице
createRows()
// Добавляем слушатели событий для строк
rowEvent()
// Создаем элементы постраничного вывода
createPagination()
// Отображаем активную страницы (default = 1)
setActivePage()
