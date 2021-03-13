
/* 
const Modal = {
  open(){
      // Abrir modal
      // Adicionar a class active ao modal
      document
          .querySelector('.modal-overlay')
          .classList
          .add('active')

  },
  close(){
      // fechar o modal
      // remover a class active do modal
      document
          .querySelector('.modal-overlay')
          .classList
          .remove('active')
  }
} */

const Modal = {

  toggleOnOf() {
    //OPEN AND CLOSE modal-overlay
    //ADD CLASS IN THE active modal 
    document.querySelector('.modal-overlay')
      .classList.toggle('active')

  }
}


// Local Storage==========

const Storage = {
   get(){
    
    return JSON.parse(localStorage.getItem('dev.finance$:transaction')) || []

   },
   set(transactions){

    localStorage.setItem('dev.finance$:transaction',
    JSON.stringify(transactions))

   }
}

//transactions, Balance ======================

const Transaction = {

  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction)
    console.log(Transaction.all)
    App.reload() 
  },

  remove(index) {
    Transaction.all.splice(index,1)
    App.reload()

  },

  incomes() {

    let income = 0

    for (let elem of this.all) {
      if (elem.amount > 0) {
        income += elem.amount
      }
    }

    return income

  },

  expenses() {

    let expense = 0

    for (let elem of this.all) {


      if (elem.amount < 0) {

        expense += elem.amount
      }
    }

    return expense

  },

  total() {

    return Transaction.incomes() + Transaction.expenses()

  }

}

//DOM =========================

const DOM = {

  transactionContainer: document.querySelector('#data-table tbody'),

  addTransactions(transaction, index) {    

    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction,index)
    tr.dataset.index = index
    DOM.transactionContainer.appendChild(tr)
   
  },
  
  innerHTMLTransaction(transaction, index) {


    const CSSclass = transaction.amount > 0 ? 'income' : 'expense'
    const amount = Utils.formatCurrency(transaction.amount)

    const html = ` 

    <td class="description">${transaction.description}</td>
    <td class=${CSSclass}>${amount}</td>
    <td class="date">${transaction.date}</td>
    <td >
         <img onclick='Transaction.remove(${index})' src="./assets/minus.svg" alt="Remover transações">
    </td>

    `
    return html

  },

  updateBalance() {

    document.getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes())

    document.getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses())

    document.getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total())

  },

  clearTransaction() {
    DOM.transactionContainer.innerHTML = ""

  }

}


// Ultils =============================================

const Utils = {

  formatAmount(value) {

    value  = Number(value.replace(/\,\,/g, '')) * 100
    
    return value

  },

  formatDate(date){

    const splicedDate = date.split('-')
  
    return `${splicedDate[2]}/${splicedDate[1]}/${splicedDate[0]}`

    
  },

  formatCurrency(value) {

    const signal = Number(value) < 0 ? '-' : ' '

    value = String(value).replace(/\D/g, '')//RegEx, achando tudo que não é numero  

    value = Number(value) / 100

    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    return signal + value

  }

}

const Form = { 

  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),
  
  getValues() {

    return {
      description: this.description.value,
      amount: this.amount.value,
      date: this.date.value
      
    } 
  },
  // validar campos do formulario
  validateFields() {

    const { description, amount, date } = this.getValues() //descruction in object
   

    // verificar se os campos estao vazios
    if (description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === '') {
      throw new Error('Favor, preencha todos os campos')
    }
    //validar os campos 

  },

  formatValues(){
    
    let { description, amount, date } = this.getValues()
    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }

  },

  clearFields() {

    this.description.value = ''
    this.amount.value = ''
    this.date.value = ''

  },
  
  submit(event) {

    event.preventDefault()
    // Verificar se todas as informações foram preenchidas
  
    try {
      
      Form.validateFields()
      // Formatar os Dados para salvar 
      const transaction = Form.formatValues()
      //Salvar 
      Transaction.add(transaction)
      //Apagar os dados do formulario 
      Form.clearFields()
      // Fechar o modal
      Modal.toggleOnOf()
    } catch(error) {

      alert(error.message) 

    }

  }
}

const App = {  

  init() {

    // DOM.addTransactions(Transaction[0]), ou...usa-se um forEach
    Transaction.all.forEach((elem, index) => {
       DOM.addTransactions(elem, index)

    })

    Storage.set(Transaction.all)
    DOM.updateBalance()
  },
  // releitura das transactions
  reload() {
    DOM.clearTransaction()
    App.init()

  }

}

App.init()























