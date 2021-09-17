import { data } from './data.js'

// Получение элементов по имени класса при обращении к DOM
const table = document.getElementById('table').getElementsByTagName('tbody')[0]
const pagination = document.getElementsByClassName('pagination')[0]
const trs = document.getElementsByTagName('tr')

// хранилище
const state = {
  data: data,
  filteredArray: [],
  sort: false,
  page: 1,
}

// Массив id-ов объектов data (10)
let arrayRows = []

document
  .getElementById('first_sort')
  .addEventListener('click', () => sortedHandler('firstName', true))
document
  .getElementById('last_sort')
  .addEventListener('click', () => sortedHandler('lastName', true))
document
  .getElementById('about_sort')
  .addEventListener('click', () => sortedHandler('about'))
document
  .getElementById('eye_sort')
  .addEventListener('click', () => sortedHandler('eyeColor'))

document.getElementsByClassName('update')[0].onclick = (e) => {
  updateHandler(e)
}
document.getElementsByClassName('cancel')[0].onclick = () => {
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
  showHideColumn(1, 0, true)
  showHideColumn(3, 1, true)
  showHideColumn(5, 2, true)
  showHideColumn(7, 3, true)
}

// ПРИ ИЗМЕНЕНИЕ ДАННЫХ ИЗМЕНЯТЬ STATE

const getData = (page) => {
  // Функция отвечающая за получения данных согласно указанной странице
  // Данное условие необходимо для первой загрузки страницы
  if (page) {
    // Перед тем, как сформировать новый массив данных, удаляются предыдущие строки в таблице
    deleteRows()

    // Сортирует массив данных по страницам
    let filteredData = data.slice(
      `${page - 1 === 0 ? 0 : page - 1 + '0'}`,
      `${page + '0'}`
    )

    // Заполняет массив из id объектов данных, который необходим для удалений строк в таблице
    for (let i in filteredData) {
      arrayRows.push(filteredData[i]['id'])
    }

    // Обновляем значение по ключу у state
    state.filteredArray = filteredData

    // Вызываем функцию для создания строк в таблице
    createRows()
    rowEvent()
  } else {
    // Блок для первого запуска, все тоже самое, но без удаления строк в таблице

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
  // С помощью метод map используем функции для каждого элемент
  state.filteredArray.forEach((user) => {
    // Обращаемся в DOM и создаем элементы для добавления на страницу
    const row = document.createElement('tr')
    row.id = user.id

    let mouseOnRow = false

    row.addEventListener('mouseenter', (event) => {
      mouseOnRow = true
      setTimeout(() => {
        if (mouseOnRow) {
          removeClassText(event.target.id)
        }
      }, 500)
    })
    row.addEventListener('mouseleave', (event) => {
      mouseOnRow = false

      addClassText(event.target.id)
    })

    if (checkCreateRow(0)) {
      const td1 = document.createElement('td')
      td1.style.display = 'none'
      td1.appendChild(document.createTextNode(user.name.firstName))
      row.appendChild(td1)
    } else {
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
      p.style.color = '#fff'
      p.id = user.id + 'e'
      td4.style.display = 'table-cell'
      p.appendChild(document.createTextNode(user.eyeColor))
      td4.appendChild(p)
      row.appendChild(td4)
    }

    // В созданные элементы добавляем текст, который вытаскиваем из объекта user

    // td3.appendChild(div)

    // Формируем единый элемент

    // row.appendChild(td2)
    // row.appendChild(td3)

    // Добавляем в таблицу
    table.appendChild(row)
  })
}

const rowEvent = () => {
  let idRows = document.getElementById('table'),
    idRow

  for (let i = 0; i < idRows.rows.length; i++) {
    if (i !== 0) {
      idRows.rows[i].onclick = function () {
        idRow = this.id
        document.getElementById('first_name').value = this.cells[0].innerHTML
        document.getElementById('second_name').value = this.cells[1].innerHTML
        document.getElementById('about').value = document.getElementById(
          this.id + 'd'
        ).textContent
        document.getElementById('eye').value = document.getElementById(
          this.id + 'e'
        ).textContent

        document.getElementsByClassName('update')[0].value = idRow
      }
    }
  }
}

// Функция создания элементов для постраничного вывода
const createPagination = () => {
  const pages = data.length / 10

  for (let i = 1; i <= pages; i++) {
    const div = document.createElement('div')
    div.className = 'pagination_item'
    div.id = i

    // Добавляем слушатель click для изменения данных в таблице
    div.addEventListener('click', () => {
      getData(i)
      setActivePage(i)
    })

    div.appendChild(document.createTextNode(i))

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

const updateHandler = (event) => {
  let id = event.target.value
  const message = document.getElementById('message')

  if (!checkUpdate()) {
    let firstName = document.getElementById('first_name').value
    let lastName = document.getElementById('second_name').value
    let about = document.getElementById('about').value
    let eyeColor = document.getElementById('eye').value

    state.data.map((note, index) => {
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

    let row = document.getElementById(id)

    row.cells[0].innerText = firstName
    row.cells[1].innerText = lastName
    document.getElementById(id + 'd').innerText = about

    document.getElementById(id + 'e').innerText = eyeColor
    document.getElementById(id + 'e').style.backgroundColor =
      selectColor(eyeColor)

    // block-with-text

    document.getElementById('first_name').value = ''
    document.getElementById('second_name').value = ''
    document.getElementById('about').value = ''
    document.getElementById('eye').value = ''

    message.style.display = 'initial'
    message.style.backgroundColor = '#c1f005'
    message.innerText = 'Data updated'
    setTimeout(() => {
      message.style.display = 'none'
    }, 1500)
  } else {
    document.getElementById('first_name').value = ''
    document.getElementById('second_name').value = ''
    document.getElementById('about').value = ''
    document.getElementById('eye').value = ''

    message.style.display = 'initial'
    message.style.backgroundColor = '#f43a5f'
    message.innerText = 'No row selected'
    setTimeout(() => {
      message.style.display = 'none'
    }, 1500)
  }
}

const cancelHandler = () => {
  document.getElementById('first_name').value = ''
  document.getElementById('second_name').value = ''
  document.getElementById('about').value = ''
  document.getElementById('eye').value = ''
}

const setActivePage = (active = 1) => {
  const prePagItem = document.getElementById(state.page)
  prePagItem.classList.remove('pag_active')

  state.page = active

  const pagItem = document.getElementById(active)
  pagItem.classList.add('pag_active')
}

const byField = (field, name) => {
  if (name) {
    if (state.sort) {
      return (a, b) => (a['name'][field] > b['name'][field] ? 1 : -1)
    } else {
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

const sortedHandler = (name, type) => {
  deleteRows()
  state.sort = !state.sort

  let array = state.filteredArray

  array.sort(byField(name, type))

  for (let i in array) {
    arrayRows.push(array[i]['id'])
  }

  state.filteredArray = array

  createRows()
  rowEvent()
}

const selectColor = (color) => {
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

const checkCreateRow = (head) => {
  const visible_column = document.getElementsByTagName('th')[head].style.display

  if (visible_column === 'none') {
    return true
  } else {
    return false
  }
}

const checkUpdate = () => {
  const arrCheck = [
    document.getElementById('first_name').value,
    document.getElementById('second_name').value,
    document.getElementById('about').value,
    document.getElementById('eye').value,
  ]
  let result = false

  for (const i of arrCheck) {
    if (i === '') {
      result = true
    }
  }

  return result
}

const removeClassText = (id) => {
  const hideText = document.getElementById(id + 'd')

  hideText.classList.remove('block-with-text')
  hideText.classList.add('showText')
}

const addClassText = (id) => {
  const hideText = document.getElementById(id + 'd')

  hideText.classList.add('block-with-text')
}

const showHideColumn = (column, elem, visible) => {
  let display = visible ? 'table-cell' : 'none'

  for (let i = 0; i < trs.length; i++) {
    if (i === 0) {
      document.getElementsByTagName('tr')[i].childNodes[column].style.display =
        display
    } else {
      document.getElementsByTagName('tr')[i].childNodes[elem].style.display =
        display
    }
  }
}

getData()
createRows()
rowEvent()
createPagination()
setActivePage()
