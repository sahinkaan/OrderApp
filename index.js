import { menuArray } from './data.js'
const paymentForm = document.getElementById('payment-form')
let isPaymentStarted = false

paymentForm.addEventListener('submit',function(e){
    e.preventDefault()

    const paymentFormData = new FormData(paymentForm)
    console.log(paymentFormData.get('name'))
    document.getElementById('order-details').innerHTML = `<p>Thanks, ${paymentFormData.get('name')}! Your order is on its way!<p>`
        
    resetView()
})

function resetView(){
    isPaymentStarted = false

    document.body.style.backgroundColor = 'white'
    for(let element of document.getElementsByClassName('btn-add')){
                element.style.backgroundColor = '#white'
            }
    document.getElementById('payment-modal').style.display='none'
    
    menuArray.forEach(function(menuItem){
        menuItem.orderCount = 0;
    })
    render()
    
    document.getElementById('input-name').value = ''
    document.getElementById('input-card-number').value = ''
    document.getElementById('input-cvv').value = ''
    document.getElementById('order-details').classList.remove('hidden')
}

document.addEventListener('click',function(e){
    if(!isPaymentStarted){
        if(e.target.dataset.add){
            document.getElementById('order-details').innerHTML = ``
            handleAddButton(e.target.dataset.add)
        }
        else if(e.target.dataset.remove){
            handleRemoveButton(e.target.dataset.remove)
        }
        else if(e.target.id === "complete-order-but"){
            document.getElementById('payment-modal').style.display='inline'
            document.body.style.backgroundColor = '#BBBBBB'
            for(let element of document.getElementsByClassName('btn-add')){
                element.style.backgroundColor = '#8B8B8B'
                element.classList.add('non-clickable')
            }
            document.getElementById('complete-order-but').classList.add('non-clickable')
            document.getElementById('complete-order-but').style.backgroundColor = '#8B8B8B'
            isPaymentStarted = true
        }
    }
    else if(e.target.id === "button-payment-close"){
        resetView()
        document.getElementById('order-details').classList.add('hidden')
    }
    
})

function handleAddButton(menuItemID){
    menuArray.filter(function(menuItem){
        return menuItem.id == menuItemID
    })[0].orderCount++
    render()
    document.getElementById('order-details').classList.add('hidden')
}

function handleRemoveButton(menuItemID){
    menuArray.filter(function(menuItem){
        return menuItem.id == menuItemID
    })[0].orderCount=0
    render()
}

function getMenuItemsHTML(){
    let html = ''   
    let orderHtml = ''
    let totalOrderCount = 0
    let totalPrice = 0
    let checkoutClass = 'hidden'
    
    menuArray.forEach(function(item){
        totalOrderCount += item.orderCount
        let totalItemPrice = 0
        
        if (item.orderCount > 0){
            checkoutClass = ''
            totalItemPrice = item.orderCount * item.price
            orderHtml +=`
            <div class="order-list-item flex">
                <p>${item.name}</p>
                <p> x ${item.orderCount}</p>
                <span class="align-right">
                    $${totalItemPrice}
                    <i class="fa-solid fa-trash" data-remove=${item.id}></i>
                </span>
            </div>`
        }
        totalPrice += totalItemPrice
    })

    menuArray.forEach(function(menuItem){
        html += `
        <div class='menu-item'>
            <h1 class='menu-item-img'>${menuItem.emoji}</h1>
            <div class='menu-item-text'>
                <p class="item-title">${menuItem.name}</p>
                <p class="item-description">${menuItem.ingredients}</p>
                <p class="item-price">$${menuItem.price}</p>
            </div>
            <button class='btn-add' id='btn-add' data-add=${menuItem.id}>+</button>   
        </div>
        `
    })
    html += `
    <div class=${checkoutClass} id='checkout-section'>
        <div class="order-section">
            <h4 class="center-text">Your Order</h4>
            ${orderHtml}
        </div>
        <div class="total-price-section flex">
            <p>Total price :</p>
            <p id="price" class="align-right">$${totalPrice}</p>
        </div>
        <button class="button complete-order-but" id="complete-order-but">Complete Order</button>
    </div>
    `

    return html
}

function render(){
    document.getElementById('menu').innerHTML = getMenuItemsHTML()
}

render()